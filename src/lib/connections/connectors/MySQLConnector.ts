/**
 * MySQL Connector
 * Enterprise-grade MySQL database connector
 * @module lib/connections/connectors/MySQLConnector
 */

import mysql, { Pool, PoolOptions, RowDataPacket, OkPacket, ResultSetHeader, FieldPacket, PoolConnection } from 'mysql2/promise';
import { EventEmitter } from 'events';
import pRetry from 'p-retry';
import {
  ConnectionConfig,
  ConnectionMetadata,
  ConnectionTestResult,
  QueryResult,
  SchemaInfo,
  TableInfo,
  ColumnInfo,
  ConnectionError,
  ConnectionErrorType,
  StreamOptions,
  ConnectionMetrics,
} from '../types';
import { ISQLConnector } from '../interfaces/IDataSourceConnector';
import { Logger } from '../../monitoring/Logger';
import { MetricsCollector } from '../../monitoring/MetricsCollector';

/**
 * MySQL-specific configuration
 */
interface MySQLConfig extends PoolOptions {
  connectTimeout?: number;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  enableKeepAlive?: boolean;
  keepAliveInitialDelay?: number;
}

/**
 * Enterprise MySQL Connector
 */
export class MySQLConnector extends EventEmitter implements ISQLConnector {
  public readonly id: string;
  public readonly type = 'MYSQL';
  public readonly config: ConnectionConfig;
  public metadata: ConnectionMetadata;

  private pool?: Pool;
  private logger: Logger;
  private metrics: MetricsCollector;
  private activeQueries: Set<string> = new Set();
  private preparedStatements: Map<string, string> = new Map();
  private currentDatabase?: string;
  private isConnecting: boolean = false;

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
   * Connect to MySQL database
   */
  public async connect(): Promise<void> {
    if (this.pool) {
      this.logger.warn('Already connected to MySQL', { connectionId: this.id });
      return;
    }

    if (this.isConnecting) {
      this.logger.warn('Connection already in progress', { connectionId: this.id });
      return;
    }

    this.isConnecting = true;
    const startTime = Date.now();

    try {
      const poolConfig = this.buildPoolConfig();
      
      this.logger.info('Connecting to MySQL', {
        connectionId: this.id,
        host: this.config.host,
        database: this.config.database,
      });

      this.pool = mysql.createPool(poolConfig);

      // Test connection
      await this.testConnection();

      this.metadata.connectedAt = new Date();
      this.metadata.isHealthy = true;
      this.currentDatabase = this.config.database;

      const duration = Date.now() - startTime;
      this.metrics.recordConnectionCreation('mysql', true, duration);

      this.logger.info('Connected to MySQL successfully', {
        connectionId: this.id,
        duration,
      });

      this.emit('connected', { connectionId: this.id });

    } catch (error) {
      const duration = Date.now() - startTime;
      this.metrics.recordConnectionCreation('mysql', false, duration);

      const connectionError = this.handleError(error);
      this.logger.error('Failed to connect to MySQL', {
        connectionId: this.id,
        error: connectionError.message,
        duration,
      });

      throw connectionError;
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Disconnect from MySQL
   */
  public async disconnect(): Promise<void> {
    if (!this.pool) {
      return;
    }

    try {
      this.logger.info('Disconnecting from MySQL', { connectionId: this.id });

      // Wait for active queries to complete
      if (this.activeQueries.size > 0) {
        this.logger.warn('Waiting for active queries to complete', {
          connectionId: this.id,
          activeQueries: this.activeQueries.size,
        });

        await this.waitForActiveQueries();
      }

      await this.pool.end();
      this.pool = undefined;
      this.metadata.isHealthy = false;
      this.metadata.disconnectedAt = new Date();

      this.logger.info('Disconnected from MySQL', { connectionId: this.id });
      this.emit('disconnected', { connectionId: this.id });

    } catch (error) {
      const connectionError = this.handleError(error);
      this.logger.error('Error during disconnect', {
        connectionId: this.id,
        error: connectionError.message,
      });
      throw connectionError;
    }
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return !!this.pool && this.metadata.isHealthy;
  }

  /**
   * Test database connection
   */
  public async testConnection(): Promise<ConnectionTestResult> {
    const startTime = Date.now();
    const queryId = `test_${Date.now()}`;

    try {
      this.activeQueries.add(queryId);

      if (!this.pool) {
        throw new Error('Connection pool not initialized');
      }

      const connection = await this.pool.getConnection();
      
      try {
        // Test basic connectivity
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT 1 as result');
        
        // Get server information
        const [[versionRow]] = await connection.execute<RowDataPacket[]>('SELECT VERSION() as version');
        const [[userRow]] = await connection.execute<RowDataPacket[]>('SELECT USER() as user');
        const [[dbRow]] = await connection.execute<RowDataPacket[]>('SELECT DATABASE() as db');
        
        const responseTime = Date.now() - startTime;
        
        this.metadata.isHealthy = true;
        this.metadata.lastHealthCheck = new Date();
        
        this.metrics.recordQueryExecution('mysql', 'test', true, responseTime);

        return {
          success: true,
          responseTime,
          serverInfo: {
            version: versionRow?.version || 'Unknown',
            database: dbRow?.db || this.config.database,
            user: userRow?.user?.split('@')[0] || 'Unknown',
            host: this.config.host || 'localhost',
            port: this.config.port || 3306,
          },
        };
      } finally {
        connection.release();
      }

    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.metrics.recordQueryExecution('mysql', 'test', false, responseTime);
      
      const connectionError = this.handleError(error);
      this.metadata.isHealthy = false;
      
      return {
        success: false,
        responseTime,
        error: connectionError.message,
      };
    } finally {
      this.activeQueries.delete(queryId);
    }
  }

  /**
   * Execute a query
   */
  public async query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>> {
    const startTime = Date.now();
    const queryId = `query_${Date.now()}_${Math.random()}`;

    if (!this.pool) {
      throw new ConnectionError(
        'Not connected to database',
        ConnectionErrorType.NOT_CONNECTED
      );
    }

    try {
      this.activeQueries.add(queryId);

      this.logger.debug('Executing query', {
        connectionId: this.id,
        queryId,
        sql: sql.substring(0, 100),
      });

      const [rows, fields] = await this.pool.execute<any>(sql, params);
      
      const responseTime = Date.now() - startTime;
      this.updateMetrics(true, responseTime);
      this.metrics.recordQueryExecution('mysql', 'query', true, responseTime);

      // Handle different result types
      let data: T;
      if (Array.isArray(rows)) {
        data = rows as T;
      } else if (rows.affectedRows !== undefined) {
        // INSERT, UPDATE, DELETE results
        data = {
          affectedRows: rows.affectedRows,
          insertId: rows.insertId,
          changedRows: rows.changedRows,
        } as any as T;
      } else {
        data = rows as T;
      }

      return {
        success: true,
        data,
        rowCount: Array.isArray(rows) ? rows.length : rows.affectedRows || 0,
        fields: fields?.map(f => ({ name: f.name, type: f.type })),
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.updateMetrics(false, responseTime);
      this.metrics.recordQueryExecution('mysql', 'query', false, responseTime);

      const connectionError = this.handleError(error);
      this.logger.error('Query failed', {
        connectionId: this.id,
        queryId,
        error: connectionError.message,
      });

      return {
        success: false,
        error: connectionError.message,
      };
    } finally {
      this.activeQueries.delete(queryId);
    }
  }

  /**
   * Execute multiple queries in a transaction
   */
  public async transaction<T = any>(
    queries: Array<{ query: string; params?: any[] }>
  ): Promise<QueryResult<T>[]> {
    if (!this.pool) {
      throw new ConnectionError(
        'Not connected to database',
        ConnectionErrorType.NOT_CONNECTED
      );
    }

    const connection = await this.pool.getConnection();
    const results: QueryResult<T>[] = [];
    const startTime = Date.now();
    const transactionId = `tx_${Date.now()}`;

    try {
      this.activeQueries.add(transactionId);

      await connection.beginTransaction();

      this.logger.debug('Starting transaction', {
        connectionId: this.id,
        transactionId,
        queryCount: queries.length,
      });

      for (const { query, params } of queries) {
        try {
          const [rows] = await connection.execute(query, params);
          results.push({
            success: true,
            data: rows as T,
            rowCount: Array.isArray(rows) ? rows.length : (rows as any).affectedRows || 0,
          });
        } catch (error) {
          const connectionError = this.handleError(error);
          results.push({
            success: false,
            error: connectionError.message,
          });
          throw error; // This will trigger rollback
        }
      }

      await connection.commit();

      const duration = Date.now() - startTime;
      this.metrics.recordQueryExecution('mysql', 'transaction', true, duration);

      this.logger.debug('Transaction committed', {
        connectionId: this.id,
        transactionId,
        duration,
      });

      return results;

    } catch (error) {
      await connection.rollback();
      
      const duration = Date.now() - startTime;
      this.metrics.recordQueryExecution('mysql', 'transaction', false, duration);

      const connectionError = this.handleError(error);
      this.logger.error('Transaction rolled back', {
        connectionId: this.id,
        transactionId,
        error: connectionError.message,
      });

      throw connectionError;
    } finally {
      connection.release();
      this.activeQueries.delete(transactionId);
    }
  }

  /**
   * Get database schema information
   */
  public async getSchema(): Promise<SchemaInfo> {
    if (!this.pool) {
      throw new ConnectionError(
        'Not connected to database',
        ConnectionErrorType.NOT_CONNECTED
      );
    }

    try {
      const tables = await this.getTables();
      const tableInfoPromises = tables.map(table => this.getTableInfo(table));
      const tablesInfo = await Promise.all(tableInfoPromises);

      return {
        database: this.currentDatabase || this.config.database || '',
        tables: tablesInfo,
        version: await this.getDatabaseVersion(),
      };
    } catch (error) {
      const connectionError = this.handleError(error);
      this.logger.error('Failed to get schema', {
        connectionId: this.id,
        error: connectionError.message,
      });
      throw connectionError;
    }
  }

  /**
   * Stream query results
   */
  public async stream<T = any>(
    query: string,
    params?: any[],
    options?: StreamOptions
  ): Promise<AsyncIterable<T>> {
    if (!this.pool) {
      throw new ConnectionError(
        'Not connected to database',
        ConnectionErrorType.NOT_CONNECTED
      );
    }

    const connection = await this.pool.getConnection();
    const queryStream = connection.query(query, params).stream();

    // Create async iterable
    const asyncIterable: AsyncIterable<T> = {
      [Symbol.asyncIterator](): AsyncIterator<T> {
        return {
          async next(): Promise<IteratorResult<T>> {
            return new Promise((resolve, reject) => {
              const chunk = queryStream.read();
              if (chunk === null) {
                queryStream.once('readable', () => {
                  const nextChunk = queryStream.read();
                  if (nextChunk === null) {
                    connection.release();
                    resolve({ done: true, value: undefined });
                  } else {
                    resolve({ done: false, value: nextChunk as T });
                  }
                });
                queryStream.once('end', () => {
                  connection.release();
                  resolve({ done: true, value: undefined });
                });
                queryStream.once('error', (error) => {
                  connection.release();
                  reject(error);
                });
              } else {
                resolve({ done: false, value: chunk as T });
              }
            });
          }
        };
      }
    };

    return asyncIterable;
  }

  /**
   * Get current metrics
   */
  public getMetrics(): ConnectionMetrics {
    return {
      totalQueries: this.metadata.totalQueries || 0,
      failedQueries: this.metadata.failedQueries || 0,
      avgResponseTime: this.metadata.avgResponseTime || 0,
      uptime: this.metadata.connectedAt 
        ? Date.now() - this.metadata.connectedAt.getTime() 
        : 0,
      activeConnections: this.activeQueries.size,
    };
  }

  /**
   * Build pool configuration
   */
  private buildPoolConfig(): MySQLConfig {
    const config: MySQLConfig = {
      host: this.config.host || 'localhost',
      port: this.config.port || 3306,
      user: this.config.username,
      password: this.config.password,
      database: this.config.database,
      
      // Pool configuration
      connectionLimit: (this.config.configuration?.poolConfig?.max as number) || 10,
      queueLimit: 0,
      waitForConnections: true,
      
      // Timeouts
      connectTimeout: (this.config.configuration?.connectionTimeoutMillis as number) || 30000,
      timeout: (this.config.configuration?.queryTimeout as number) || 60000,
      
      // SSL
      ssl: this.config.ssl ? {
        rejectUnauthorized: true
      } : undefined,
      
      // Additional options
      multipleStatements: false, // Security: prevent SQL injection
      namedPlaceholders: false,
      charset: 'utf8mb4',
      timezone: 'Z',
    };

    return config;
  }

  /**
   * Get list of tables
   */
  private async getTables(): Promise<string[]> {
    const result = await this.query<RowDataPacket[]>(
      'SHOW TABLES'
    );

    if (result.success && result.data) {
      const dbName = this.currentDatabase || this.config.database || '';
      const tableKey = `Tables_in_${dbName}`;
      return result.data.map((row: any) => row[tableKey] || row[Object.keys(row)[0]]);
    }

    return [];
  }

  /**
   * Get table information
   */
  private async getTableInfo(tableName: string): Promise<TableInfo> {
    try {
      // Get columns
      const columnsResult = await this.query<RowDataPacket[]>(
        `SHOW COLUMNS FROM \`${tableName}\``
      );

      const columns: ColumnInfo[] = columnsResult.data?.map((col: any) => ({
        name: col.Field,
        type: col.Type,
        nullable: col.Null === 'YES',
        key: col.Key,
        default: col.Default,
        extra: col.Extra,
      })) || [];

      // Get row count
      const countResult = await this.query<RowDataPacket[]>(
        `SELECT COUNT(*) as count FROM \`${tableName}\``
      );
      const rowCount = countResult.data?.[0]?.count || 0;

      // Get indexes
      const indexResult = await this.query<RowDataPacket[]>(
        `SHOW INDEX FROM \`${tableName}\``
      );

      const indexes = indexResult.data?.reduce((acc: any, idx: any) => {
        const indexName = idx.Key_name;
        if (!acc[indexName]) {
          acc[indexName] = {
            name: indexName,
            columns: [],
            unique: !idx.Non_unique,
            type: idx.Index_type,
          };
        }
        acc[indexName].columns.push(idx.Column_name);
        return acc;
      }, {});

      return {
        name: tableName,
        columns,
        rowCount,
        indexes: indexes ? Object.values(indexes) : [],
      };
    } catch (error) {
      this.logger.error('Failed to get table info', {
        connectionId: this.id,
        table: tableName,
        error,
      });

      return {
        name: tableName,
        columns: [],
        rowCount: 0,
      };
    }
  }

  /**
   * Get database version
   */
  private async getDatabaseVersion(): Promise<string> {
    try {
      const result = await this.query<RowDataPacket[]>('SELECT VERSION() as version');
      return result.data?.[0]?.version || 'Unknown';
    } catch {
      return 'Unknown';
    }
  }

  /**
   * Handle errors
   */
  private handleError(error: any): ConnectionError {
    let errorType = ConnectionErrorType.UNKNOWN;
    let message = error.message || 'Unknown error';

    if (error.code === 'ECONNREFUSED') {
      errorType = ConnectionErrorType.CONNECTION_REFUSED;
      message = `Cannot connect to MySQL server at ${this.config.host}:${this.config.port || 3306}`;
    } else if (error.code === 'ENOTFOUND') {
      errorType = ConnectionErrorType.HOST_NOT_FOUND;
      message = `Host '${this.config.host}' not found`;
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      errorType = ConnectionErrorType.AUTHENTICATION_FAILED;
      message = 'Authentication failed. Please check your username and password.';
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      errorType = ConnectionErrorType.DATABASE_NOT_FOUND;
      message = `Database '${this.config.database}' does not exist`;
    } else if (error.code === 'ETIMEDOUT' || error.code === 'PROTOCOL_CONNECTION_LOST') {
      errorType = ConnectionErrorType.TIMEOUT;
      message = 'Connection timeout';
    } else if (error.code === 'ER_CON_COUNT_ERROR') {
      errorType = ConnectionErrorType.POOL_EXHAUSTED;
      message = 'Too many connections';
    }

    return new ConnectionError(message, errorType, error);
  }

  /**
   * Update connection metrics
   */
  private updateMetrics(success: boolean, responseTime: number): void {
    this.metadata.totalQueries = (this.metadata.totalQueries || 0) + 1;
    
    if (!success) {
      this.metadata.failedQueries = (this.metadata.failedQueries || 0) + 1;
    }

    // Update average response time
    const total = this.metadata.totalQueries || 1;
    const currentAvg = this.metadata.avgResponseTime || 0;
    this.metadata.avgResponseTime = ((currentAvg * (total - 1)) + responseTime) / total;
  }

  /**
   * Wait for active queries to complete
   */
  private async waitForActiveQueries(timeout: number = 30000): Promise<void> {
    const startTime = Date.now();
    
    while (this.activeQueries.size > 0) {
      if (Date.now() - startTime > timeout) {
        this.logger.warn('Timeout waiting for active queries', {
          connectionId: this.id,
          remainingQueries: this.activeQueries.size,
        });
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}