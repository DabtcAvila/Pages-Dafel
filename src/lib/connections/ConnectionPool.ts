/**
 * Connection Pool Manager
 * Manages connection pooling for database connectors
 * @module lib/connections/ConnectionPool
 */

import { EventEmitter } from 'events';
import { ConnectionConfig, ConnectionError, ConnectionErrorType, PoolConfig } from './types';
import { IDataSourceConnector } from './interfaces/IDataSourceConnector';
import { Logger } from '../monitoring/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import PQueue from 'p-queue';

/**
 * Pool statistics
 */
export interface PoolStats {
  size: number;
  available: number;
  pending: number;
  borrowed: number;
  created: number;
  destroyed: number;
  failed: number;
}

/**
 * Connection wrapper for pooling
 */
interface PooledConnection {
  connector: IDataSourceConnector;
  createdAt: Date;
  lastUsedAt: Date;
  useCount: number;
  isHealthy: boolean;
  isBorrowed: boolean;
}

/**
 * Enterprise Connection Pool
 * Implements connection pooling with health checks, timeouts, and auto-scaling
 */
export class ConnectionPool extends EventEmitter {
  private readonly config: PoolConfig;
  private readonly connectionConfig: ConnectionConfig;
  private readonly connections: Map<string, PooledConnection>;
  private readonly pendingQueue: PQueue;
  private readonly logger: Logger;
  private readonly metrics: MetricsCollector;
  private readonly createConnector: () => Promise<IDataSourceConnector>;
  
  private stats: PoolStats;
  private isClosing: boolean = false;
  private healthCheckInterval?: NodeJS.Timeout;
  private reapInterval?: NodeJS.Timeout;
  private scaleInterval?: NodeJS.Timeout;

  constructor(
    config: PoolConfig,
    connectionConfig: ConnectionConfig,
    createConnector: () => Promise<IDataSourceConnector>
  ) {
    super();
    
    this.config = this.validateAndNormalizeConfig(config);
    this.connectionConfig = connectionConfig;
    this.createConnector = createConnector;
    this.connections = new Map();
    
    this.pendingQueue = new PQueue({
      concurrency: this.config.max,
      timeout: this.config.acquireTimeout,
      throwOnTimeout: true,
    });

    this.logger = Logger.getInstance();
    this.metrics = MetricsCollector.getInstance();

    this.stats = {
      size: 0,
      available: 0,
      pending: 0,
      borrowed: 0,
      created: 0,
      destroyed: 0,
      failed: 0,
    };

    this.initialize();
  }

  /**
   * Validate and normalize pool configuration
   */
  private validateAndNormalizeConfig(config: PoolConfig): PoolConfig {
    if (config.min < 0) {
      throw new Error('Minimum pool size must be >= 0');
    }
    if (config.max < 1) {
      throw new Error('Maximum pool size must be >= 1');
    }
    if (config.min > config.max) {
      throw new Error('Minimum pool size cannot exceed maximum');
    }

    return {
      min: config.min,
      max: config.max,
      acquireTimeout: config.acquireTimeout ?? 30000,
      createTimeout: config.createTimeout ?? 30000,
      destroyTimeout: config.destroyTimeout ?? 5000,
      idleTimeout: config.idleTimeout ?? 30000,
      reapInterval: config.reapInterval ?? 1000,
      createRetryInterval: config.createRetryInterval ?? 200,
      propagateCreateError: config.propagateCreateError ?? true,
    };
  }

  /**
   * Initialize the pool
   */
  private async initialize(): Promise<void> {
    try {
      // Create minimum connections
      await this.ensureMinimum();

      // Start health check interval
      this.startHealthChecks();

      // Start reaper for idle connections
      this.startReaper();

      // Start auto-scaling
      this.startAutoScaling();

      this.emit('initialized', this.getStats());
      this.logger.info('Connection pool initialized', {
        poolId: this.connectionConfig.id,
        min: this.config.min,
        max: this.config.max,
      });

    } catch (error) {
      this.logger.error('Failed to initialize pool', {
        poolId: this.connectionConfig.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Acquire a connection from the pool
   */
  public async acquire(): Promise<IDataSourceConnector> {
    if (this.isClosing) {
      throw new ConnectionError(
        'Pool is closing',
        ConnectionErrorType.POOL_EXHAUSTED,
        'POOL_CLOSING'
      );
    }

    const startTime = Date.now();
    this.stats.pending++;
    this.emit('acquire:start');

    try {
      // Try to get an available connection
      let connection = this.getAvailableConnection();

      // If no available connection, create a new one if possible
      if (!connection && this.stats.size < this.config.max) {
        connection = await this.createConnection();
      }

      // If still no connection, wait for one
      if (!connection) {
        connection = await this.waitForConnection();
      }

      if (!connection) {
        throw new ConnectionError(
          'Failed to acquire connection from pool',
          ConnectionErrorType.POOL_EXHAUSTED,
          'ACQUIRE_FAILED'
        );
      }

      // Mark as borrowed
      connection.isBorrowed = true;
      connection.lastUsedAt = new Date();
      connection.useCount++;

      this.stats.pending--;
      this.stats.borrowed++;
      this.stats.available--;

      const duration = Date.now() - startTime;
      this.metrics.recordPoolAcquisition(this.connectionConfig.type, true, duration);
      this.emit('acquire:success', { duration });

      return connection.connector;

    } catch (error) {
      this.stats.pending--;
      this.stats.failed++;
      
      const duration = Date.now() - startTime;
      this.metrics.recordPoolAcquisition(this.connectionConfig.type, false, duration);
      this.emit('acquire:error', { error, duration });

      throw error;
    }
  }

  /**
   * Release a connection back to the pool
   */
  public async release(connector: IDataSourceConnector): Promise<void> {
    const connection = this.findConnection(connector);
    if (!connection) {
      this.logger.warn('Attempted to release unknown connection');
      return;
    }

    try {
      // Check if connection is still healthy
      const isHealthy = await this.checkConnectionHealth(connection);

      if (isHealthy && !this.isClosing) {
        // Return to pool
        connection.isBorrowed = false;
        connection.lastUsedAt = new Date();
        this.stats.borrowed--;
        this.stats.available++;
        this.emit('release:success');
      } else {
        // Destroy unhealthy connection
        await this.destroyConnection(connection);
      }

    } catch (error) {
      this.logger.error('Error releasing connection', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      // Destroy connection on error
      await this.destroyConnection(connection);
    }
  }

  /**
   * Drain the pool (close all connections)
   */
  public async drain(): Promise<void> {
    this.isClosing = true;
    this.emit('drain:start');

    try {
      // Stop intervals
      this.stopHealthChecks();
      this.stopReaper();
      this.stopAutoScaling();

      // Wait for pending acquisitions
      await this.pendingQueue.onEmpty();

      // Close all connections
      const promises: Promise<void>[] = [];
      for (const connection of this.connections.values()) {
        promises.push(this.destroyConnection(connection));
      }
      await Promise.all(promises);

      this.emit('drain:complete');
      this.logger.info('Connection pool drained', {
        poolId: this.connectionConfig.id,
      });

    } catch (error) {
      this.logger.error('Error draining pool', {
        poolId: this.connectionConfig.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get pool statistics
   */
  public getStats(): PoolStats {
    return { ...this.stats };
  }

  /**
   * Get an available connection from the pool
   */
  private getAvailableConnection(): PooledConnection | null {
    for (const connection of this.connections.values()) {
      if (!connection.isBorrowed && connection.isHealthy) {
        return connection;
      }
    }
    return null;
  }

  /**
   * Wait for a connection to become available
   */
  private async waitForConnection(): Promise<PooledConnection | null> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new ConnectionError(
          'Timeout waiting for connection',
          ConnectionErrorType.CONNECTION_TIMEOUT,
          'ACQUIRE_TIMEOUT'
        ));
      }, this.config.acquireTimeout!);

      const checkInterval = setInterval(() => {
        const connection = this.getAvailableConnection();
        if (connection) {
          clearTimeout(timeout);
          clearInterval(checkInterval);
          resolve(connection);
        }
      }, 100);
    });
  }

  /**
   * Create a new connection
   */
  private async createConnection(): Promise<PooledConnection> {
    const startTime = Date.now();

    try {
      const connector = await this.createConnector();
      
      const connection: PooledConnection = {
        connector,
        createdAt: new Date(),
        lastUsedAt: new Date(),
        useCount: 0,
        isHealthy: true,
        isBorrowed: false,
      };

      const connectionId = `${this.connectionConfig.id}-${Date.now()}-${Math.random()}`;
      this.connections.set(connectionId, connection);
      
      this.stats.size++;
      this.stats.available++;
      this.stats.created++;

      const duration = Date.now() - startTime;
      this.emit('connection:created', { duration });

      return connection;

    } catch (error) {
      this.stats.failed++;
      this.logger.error('Failed to create connection', {
        poolId: this.connectionConfig.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Destroy a connection
   */
  private async destroyConnection(connection: PooledConnection): Promise<void> {
    try {
      // Find and remove from map
      let connectionId: string | null = null;
      for (const [id, conn] of this.connections.entries()) {
        if (conn === connection) {
          connectionId = id;
          break;
        }
      }

      if (connectionId) {
        this.connections.delete(connectionId);
        
        if (connection.isBorrowed) {
          this.stats.borrowed--;
        } else {
          this.stats.available--;
        }
        this.stats.size--;
        this.stats.destroyed++;
      }

      // Disconnect the actual connector
      await connection.connector.disconnect();
      
      this.emit('connection:destroyed');

    } catch (error) {
      this.logger.error('Error destroying connection', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Check connection health
   */
  private async checkConnectionHealth(connection: PooledConnection): Promise<boolean> {
    try {
      const isHealthy = await connection.connector.healthCheck();
      connection.isHealthy = isHealthy;
      return isHealthy;
    } catch (error) {
      connection.isHealthy = false;
      return false;
    }
  }

  /**
   * Find connection wrapper by connector
   */
  private findConnection(connector: IDataSourceConnector): PooledConnection | null {
    for (const connection of this.connections.values()) {
      if (connection.connector === connector) {
        return connection;
      }
    }
    return null;
  }

  /**
   * Ensure minimum connections exist
   */
  private async ensureMinimum(): Promise<void> {
    const promises: Promise<PooledConnection>[] = [];
    const needed = this.config.min - this.stats.size;

    for (let i = 0; i < needed; i++) {
      promises.push(this.createConnection());
    }

    await Promise.all(promises);
  }

  /**
   * Start health check interval
   */
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(async () => {
      for (const connection of this.connections.values()) {
        if (!connection.isBorrowed) {
          await this.checkConnectionHealth(connection);
        }
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Stop health checks
   */
  private stopHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }

  /**
   * Start reaper for idle connections
   */
  private startReaper(): void {
    this.reapInterval = setInterval(async () => {
      const now = Date.now();
      const toDestroy: PooledConnection[] = [];

      for (const connection of this.connections.values()) {
        if (
          !connection.isBorrowed &&
          this.stats.size > this.config.min &&
          now - connection.lastUsedAt.getTime() > this.config.idleTimeout!
        ) {
          toDestroy.push(connection);
        }
      }

      for (const connection of toDestroy) {
        await this.destroyConnection(connection);
      }
    }, this.config.reapInterval!);
  }

  /**
   * Stop reaper
   */
  private stopReaper(): void {
    if (this.reapInterval) {
      clearInterval(this.reapInterval);
    }
  }

  /**
   * Start auto-scaling
   */
  private startAutoScaling(): void {
    this.scaleInterval = setInterval(async () => {
      // Scale up if needed
      if (this.stats.pending > 0 && this.stats.size < this.config.max) {
        const needed = Math.min(
          this.stats.pending,
          this.config.max - this.stats.size
        );
        for (let i = 0; i < needed; i++) {
          try {
            await this.createConnection();
          } catch (error) {
            // Log but don't throw
            this.logger.warn('Auto-scaling failed to create connection', {
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      }

      // Scale down if over minimum and have idle connections
      if (this.stats.size > this.config.min && this.stats.available > this.config.min) {
        const toRemove = Math.min(
          this.stats.available - this.config.min,
          this.stats.size - this.config.min
        );
        
        let removed = 0;
        for (const connection of this.connections.values()) {
          if (removed >= toRemove) break;
          if (!connection.isBorrowed) {
            await this.destroyConnection(connection);
            removed++;
          }
        }
      }
    }, 5000); // Check every 5 seconds
  }

  /**
   * Stop auto-scaling
   */
  private stopAutoScaling(): void {
    if (this.scaleInterval) {
      clearInterval(this.scaleInterval);
    }
  }
}