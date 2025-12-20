/**
 * Base Connector
 * Abstract base class for all data source connectors
 * @module lib/connections/connectors/BaseConnector
 */

import { EventEmitter } from 'events';
import { Readable } from 'stream';
import {
  ConnectionConfig,
  ConnectionMetadata,
  ConnectionTestResult,
  QueryResult,
  SchemaInfo,
  StreamOptions,
  ConnectionMetrics,
  ConnectionError,
  ConnectionErrorType,
} from '../types';
import { IDataSourceConnector } from '../interfaces/IDataSourceConnector';
import { Logger } from '../../monitoring/Logger';
import { MetricsCollector } from '../../monitoring/MetricsCollector';

/**
 * Base implementation for all connectors
 */
export abstract class BaseConnector extends EventEmitter implements IDataSourceConnector {
  public readonly id: string;
  public abstract readonly type: string;
  public readonly config: ConnectionConfig;
  public metadata: ConnectionMetadata;

  protected logger: Logger;
  protected metrics: MetricsCollector;
  protected isConnecting: boolean = false;

  constructor(config: ConnectionConfig) {
    super();
    this.id = config.id;
    this.config = config;
    this.logger = Logger.getInstance();
    this.metrics = MetricsCollector.getInstance();

    this.metadata = {
      isHealthy: false,
      totalQueries: 0,
      failedQueries: 0,
      avgResponseTime: 0,
    };
  }

  /**
   * Default connection test implementation
   */
  public async testConnection(): Promise<ConnectionTestResult> {
    try {
      const isConnected = await this.isConnected();
      if (!isConnected) {
        await this.connect();
      }

      return {
        success: true,
        message: 'Connection successful',
        responseTime: 100,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Connection failed',
        responseTime: 0,
      };
    }
  }

  /**
   * Default health check implementation
   */
  public async healthCheck(): Promise<boolean> {
    try {
      return await this.isConnected();
    } catch {
      return false;
    }
  }

  /**
   * Default reconnect implementation
   */
  public async reconnect(retries: number = 3): Promise<void> {
    await this.disconnect();
    let lastError: Error | null = null;

    for (let i = 0; i < retries; i++) {
      try {
        await this.connect();
        return;
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(`Reconnect attempt ${i + 1} failed`, {
          connectionId: this.id,
          error: lastError.message,
        });
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }

    throw lastError || new Error('Reconnection failed');
  }

  /**
   * Default stream implementation
   */
  public stream(query: string | object, options?: StreamOptions): Readable {
    const stream = new Readable({
      objectMode: options?.objectMode ?? true,
      read() {},
    });

    // Default implementation returns empty stream
    stream.push(null);
    return stream;
  }

  /**
   * Default schema implementation
   */
  public async getSchema(schemaName?: string): Promise<SchemaInfo> {
    return {
      tables: [],
    };
  }

  /**
   * Default query validation
   */
  public async validateQuery(query: string | object): Promise<{ valid: boolean; errors?: string[] }> {
    return { valid: true };
  }

  /**
   * Get metrics
   */
  public getMetrics(): ConnectionMetrics {
    return this.metrics.getMetrics();
  }

  /**
   * Clear cache (default no-op)
   */
  public async clearCache(): Promise<void> {
    // Default implementation does nothing
  }

  /**
   * Update metadata
   */
  protected updateMetadata(success: boolean, duration?: number): void {
    this.metadata.lastActivity = new Date();
    this.metadata.totalQueries = (this.metadata.totalQueries || 0) + 1;
    
    if (!success) {
      this.metadata.failedQueries = (this.metadata.failedQueries || 0) + 1;
    }

    if (duration) {
      const currentAvg = this.metadata.avgResponseTime || 0;
      const totalQueries = this.metadata.totalQueries || 1;
      this.metadata.avgResponseTime = (currentAvg * (totalQueries - 1) + duration) / totalQueries;
    }
  }

  // Abstract methods that must be implemented by subclasses
  public abstract connect(): Promise<void>;
  public abstract disconnect(): Promise<void>;
  public abstract isConnected(): boolean;
  public abstract query<T = any>(query: string | object, params?: any[]): Promise<QueryResult<T>>;
  public abstract transaction<T = any>(queries: Array<{ query: string | object; params?: any[] }>): Promise<QueryResult<T>[]>;
}