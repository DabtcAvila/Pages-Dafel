/**
 * Enterprise Connection Manager
 * Singleton pattern for managing all data source connections
 * @module lib/connections/ConnectionManager
 */

import { EventEmitter } from 'events';
import { ConnectionConfig, ConnectionMetadata, ConnectionEvent, ConnectionError, ConnectionErrorType, ConnectionMetrics } from './types';
import { IDataSourceConnector } from './interfaces/IDataSourceConnector';
import { ConnectionFactory } from './ConnectionFactory';
import { Logger } from '../monitoring/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { ConnectionPool } from './ConnectionPool';
import pRetry from 'p-retry';

/**
 * Connection Manager Configuration
 */
export interface ConnectionManagerConfig {
  maxConnections?: number;
  connectionTimeout?: number;
  healthCheckInterval?: number;
  metricsInterval?: number;
  enableAutoReconnect?: boolean;
  reconnectMaxRetries?: number;
  reconnectDelay?: number;
}

/**
 * Enterprise-grade Connection Manager
 * Manages lifecycle, pooling, health checks, and metrics for all connections
 */
export class ConnectionManager extends EventEmitter {
  private static instance: ConnectionManager;
  private connections: Map<string, IDataSourceConnector>;
  private pools: Map<string, ConnectionPool>;
  private metadata: Map<string, ConnectionMetadata>;
  private healthCheckIntervals: Map<string, NodeJS.Timeout>;
  private metricsInterval?: NodeJS.Timeout;
  private config: ConnectionManagerConfig;
  private logger: Logger;
  private metricsCollector: MetricsCollector;
  private isShuttingDown: boolean = false;

  /**
   * Private constructor for singleton pattern
   */
  private constructor(config?: ConnectionManagerConfig) {
    super();
    this.connections = new Map();
    this.pools = new Map();
    this.metadata = new Map();
    this.healthCheckIntervals = new Map();
    
    this.config = {
      maxConnections: config?.maxConnections || 100,
      connectionTimeout: config?.connectionTimeout || 30000,
      healthCheckInterval: config?.healthCheckInterval || 60000,
      metricsInterval: config?.metricsInterval || 30000,
      enableAutoReconnect: config?.enableAutoReconnect ?? true,
      reconnectMaxRetries: config?.reconnectMaxRetries || 3,
      reconnectDelay: config?.reconnectDelay || 1000,
    };

    this.logger = Logger.getInstance();
    this.metricsCollector = MetricsCollector.getInstance();

    this.setupEventHandlers();
    this.startMetricsCollection();

    // Graceful shutdown handlers
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: ConnectionManagerConfig): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager(config);
    }
    return ConnectionManager.instance;
  }

  /**
   * Create and register a new connection
   */
  public async createConnection(config: ConnectionConfig): Promise<IDataSourceConnector> {
    const startTime = Date.now();
    const correlationId = this.generateCorrelationId();

    try {
      this.logger.info('Creating new connection', { 
        connectionId: config.id, 
        type: config.type,
        correlationId 
      });

      // Check connection limit
      if (this.connections.size >= this.config.maxConnections!) {
        throw new ConnectionError(
          'Maximum connection limit reached',
          ConnectionErrorType.POOL_EXHAUSTED,
          'MAX_CONNECTIONS',
          { limit: this.config.maxConnections, current: this.connections.size }
        );
      }

      // Create connector using factory
      const connector = await ConnectionFactory.create(config);

      // Establish connection with retry logic
      await pRetry(
        async () => {
          await connector.connect();
        },
        {
          retries: this.config.reconnectMaxRetries!,
          minTimeout: this.config.reconnectDelay!,
          onFailedAttempt: (error) => {
            this.logger.warn(`Connection attempt failed`, {
              connectionId: config.id,
              attempt: error.attemptNumber,
              error: error.message,
              correlationId
            });
          }
        }
      );

      // Register connection
      this.connections.set(config.id, connector);

      // Initialize metadata
      const metadata: ConnectionMetadata = {
        connectedAt: new Date(),
        lastActivity: new Date(),
        totalQueries: 0,
        failedQueries: 0,
        avgResponseTime: 0,
        isHealthy: true,
      };
      this.metadata.set(config.id, metadata);

      // Setup connection event handlers
      this.setupConnectionEventHandlers(connector);

      // Start health checks
      this.startHealthCheck(config.id);

      // Emit connection created event
      this.emit(ConnectionEvent.CONNECTED, { connectionId: config.id, type: config.type });

      // Record metrics
      const duration = Date.now() - startTime;
      this.metricsCollector.recordConnectionCreation(config.type, true, duration);

      this.logger.info('Connection created successfully', {
        connectionId: config.id,
        duration,
        correlationId
      });

      return connector;

    } catch (error) {
      const duration = Date.now() - startTime;
      this.metricsCollector.recordConnectionCreation(config.type, false, duration);

      this.logger.error('Failed to create connection', {
        connectionId: config.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        correlationId
      });

      throw error;
    }
  }

  /**
   * Get an existing connection
   */
  public getConnection(connectionId: string): IDataSourceConnector | undefined {
    return this.connections.get(connectionId);
  }

  /**
   * Get connection from pool
   */
  public async getPooledConnection(connectionId: string): Promise<IDataSourceConnector> {
    const pool = this.pools.get(connectionId);
    if (!pool) {
      throw new ConnectionError(
        `No pool found for connection ${connectionId}`,
        ConnectionErrorType.INVALID_CONFIGURATION,
        'POOL_NOT_FOUND'
      );
    }
    return pool.acquire();
  }

  /**
   * Release connection back to pool
   */
  public async releasePooledConnection(connectionId: string, connector: IDataSourceConnector): Promise<void> {
    const pool = this.pools.get(connectionId);
    if (pool) {
      await pool.release(connector);
    }
  }

  /**
   * Close and remove a connection
   */
  public async closeConnection(connectionId: string): Promise<void> {
    const connector = this.connections.get(connectionId);
    if (!connector) {
      this.logger.warn(`Connection not found for closing`, { connectionId });
      return;
    }

    try {
      // Stop health checks
      this.stopHealthCheck(connectionId);

      // Close the connection
      await connector.disconnect();

      // Remove from registry
      this.connections.delete(connectionId);
      this.metadata.delete(connectionId);

      // Close pool if exists
      const pool = this.pools.get(connectionId);
      if (pool) {
        await pool.drain();
        this.pools.delete(connectionId);
      }

      this.emit(ConnectionEvent.DISCONNECTED, { connectionId });
      this.logger.info('Connection closed', { connectionId });

    } catch (error) {
      this.logger.error('Error closing connection', {
        connectionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Close all connections
   */
  public async closeAll(): Promise<void> {
    const promises: Promise<void>[] = [];
    for (const connectionId of this.connections.keys()) {
      promises.push(this.closeConnection(connectionId));
    }
    await Promise.all(promises);
  }

  /**
   * Get all active connections
   */
  public getAllConnections(): Map<string, IDataSourceConnector> {
    return new Map(this.connections);
  }

  /**
   * Get connection metadata
   */
  public getConnectionMetadata(connectionId: string): ConnectionMetadata | undefined {
    return this.metadata.get(connectionId);
  }

  /**
   * Get overall metrics
   */
  public getMetrics(): ConnectionMetrics {
    return this.metricsCollector.getMetrics();
  }

  /**
   * Perform health check on a specific connection
   */
  public async healthCheck(connectionId: string): Promise<boolean> {
    const connector = this.connections.get(connectionId);
    if (!connector) {
      return false;
    }

    try {
      const isHealthy = await connector.healthCheck();
      const metadata = this.metadata.get(connectionId);
      if (metadata) {
        metadata.isHealthy = isHealthy;
        metadata.lastActivity = new Date();
      }

      if (!isHealthy && this.config.enableAutoReconnect) {
        this.logger.warn('Connection unhealthy, attempting reconnect', { connectionId });
        await this.reconnect(connectionId);
      }

      return isHealthy;
    } catch (error) {
      this.logger.error('Health check failed', {
        connectionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  /**
   * Reconnect a connection
   */
  private async reconnect(connectionId: string): Promise<void> {
    const connector = this.connections.get(connectionId);
    if (!connector) {
      return;
    }

    this.emit(ConnectionEvent.RECONNECTING, { connectionId });

    try {
      await connector.reconnect(this.config.reconnectMaxRetries);
      const metadata = this.metadata.get(connectionId);
      if (metadata) {
        metadata.isHealthy = true;
        metadata.connectedAt = new Date();
      }
      this.emit(ConnectionEvent.CONNECTED, { connectionId });
    } catch (error) {
      this.logger.error('Reconnection failed', {
        connectionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Setup event handlers for the manager
   */
  private setupEventHandlers(): void {
    this.on(ConnectionEvent.ERROR, (data) => {
      this.logger.error('Connection error', data);
      this.metricsCollector.recordError(data.type || 'unknown');
    });

    this.on(ConnectionEvent.QUERY_START, (data) => {
      const metadata = this.metadata.get(data.connectionId);
      if (metadata) {
        metadata.lastActivity = new Date();
      }
    });

    this.on(ConnectionEvent.QUERY_END, (data) => {
      const metadata = this.metadata.get(data.connectionId);
      if (metadata) {
        metadata.totalQueries = (metadata.totalQueries || 0) + 1;
        if (data.error) {
          metadata.failedQueries = (metadata.failedQueries || 0) + 1;
        }
        if (data.duration) {
          const currentAvg = metadata.avgResponseTime || 0;
          const totalQueries = metadata.totalQueries || 1;
          metadata.avgResponseTime = (currentAvg * (totalQueries - 1) + data.duration) / totalQueries;
        }
      }
    });
  }

  /**
   * Setup event handlers for a specific connection
   */
  private setupConnectionEventHandlers(connector: IDataSourceConnector): void {
    connector.on('error', (error) => {
      this.emit(ConnectionEvent.ERROR, {
        connectionId: connector.id,
        error: error.message,
        type: connector.type
      });
    });

    connector.on('query_start', (data) => {
      this.emit(ConnectionEvent.QUERY_START, {
        connectionId: connector.id,
        ...data
      });
    });

    connector.on('query_end', (data) => {
      this.emit(ConnectionEvent.QUERY_END, {
        connectionId: connector.id,
        ...data
      });
    });
  }

  /**
   * Start health check interval for a connection
   */
  private startHealthCheck(connectionId: string): void {
    const interval = setInterval(async () => {
      await this.healthCheck(connectionId);
    }, this.config.healthCheckInterval!);

    this.healthCheckIntervals.set(connectionId, interval);
  }

  /**
   * Stop health check interval for a connection
   */
  private stopHealthCheck(connectionId: string): void {
    const interval = this.healthCheckIntervals.get(connectionId);
    if (interval) {
      clearInterval(interval);
      this.healthCheckIntervals.delete(connectionId);
    }
  }

  /**
   * Start metrics collection
   */
  private startMetricsCollection(): void {
    this.metricsInterval = setInterval(() => {
      const metrics = {
        activeConnections: this.connections.size,
        totalPools: this.pools.size,
        healthyConnections: Array.from(this.metadata.values()).filter(m => m.isHealthy).length,
      };
      this.metricsCollector.recordSnapshot(metrics);
    }, this.config.metricsInterval!);
  }

  /**
   * Stop metrics collection
   */
  private stopMetricsCollection(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
  }

  /**
   * Generate correlation ID for tracing
   */
  private generateCorrelationId(): string {
    return `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Graceful shutdown
   */
  public async shutdown(): Promise<void> {
    if (this.isShuttingDown) {
      return;
    }

    this.isShuttingDown = true;
    this.logger.info('Connection Manager shutting down...');

    try {
      // Stop health checks
      for (const interval of this.healthCheckIntervals.values()) {
        clearInterval(interval);
      }

      // Stop metrics collection
      this.stopMetricsCollection();

      // Close all connections
      await this.closeAll();

      this.logger.info('Connection Manager shutdown complete');
    } catch (error) {
      this.logger.error('Error during shutdown', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}