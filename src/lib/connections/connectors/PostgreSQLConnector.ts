/**
 * PostgreSQL Connector
 * Enterprise-grade PostgreSQL database connector
 * @module lib/connections/connectors/PostgreSQLConnector
 */

import { Pool, PoolConfig, QueryResult as PgQueryResult, PoolClient } from 'pg';
import { Readable } from 'stream';
import QueryStream from 'pg-query-stream';
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
 * PostgreSQL-specific configuration
 */
interface PostgreSQLConfig extends PoolConfig {
  statementTimeout?: number;
  queryTimeout?: number;
  connectionTimeoutMillis?: number;
  idleTimeoutMillis?: number;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Enterprise PostgreSQL Connector
 */
export class PostgreSQLConnector extends EventEmitter implements ISQLConnector {
  public readonly id: string;
  public readonly type = 'POSTGRESQL';
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
   * Connect to PostgreSQL database
   */
  public async connect(): Promise<void> {
    if (this.pool) {
      this.logger.warn('Already connected to PostgreSQL', { connectionId: this.id });
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
      
      this.logger.info('Connecting to PostgreSQL', {
        connectionId: this.id,
        host: this.config.host,
        database: this.config.database,
      });

      this.pool = new Pool(poolConfig);

      // Setup pool event handlers
      this.setupPoolEventHandlers();

      // Test connection
      await this.testConnection();

      this.metadata.connectedAt = new Date();
      this.metadata.isHealthy = true;
      this.currentDatabase = this.config.database;

      const duration = Date.now() - startTime;
      this.metrics.recordConnectionCreation('postgresql', true, duration);

      this.logger.info('Connected to PostgreSQL successfully', {
        connectionId: this.id,
        duration,
      });

      this.emit('connected', { connectionId: this.id });

    } catch (error) {
      const duration = Date.now() - startTime;
      this.metrics.recordConnectionCreation('postgresql', false, duration);

      const connectionError = this.handleError(error);
      this.logger.error('Failed to connect to PostgreSQL', {
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
   * Disconnect from PostgreSQL
   */
  public async disconnect(): Promise<void> {
    if (!this.pool) {
      return;
    }

    try {
      this.logger.info('Disconnecting from PostgreSQL', { connectionId: this.id });

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
      this.preparedStatements.clear();

      this.metrics.recordConnectionClose('postgresql');
      this.logger.info('Disconnected from PostgreSQL', { connectionId: this.id });
      this.emit('disconnected', { connectionId: this.id });

    } catch (error) {
      const connectionError = this.handleError(error);
      this.logger.error('Error disconnecting from PostgreSQL', {
        connectionId: this.id,
        error: connectionError.message,
      });
      throw connectionError;
    }
  }

  /**
   * Test the connection
   */
  public async testConnection(): Promise<ConnectionTestResult> {
    const startTime = Date.now();

    try {
      if (!this.pool) {
        throw new ConnectionError(
          'No connection pool available',
          ConnectionErrorType.CONNECTION_REFUSED
        );
      }

      const client = await this.pool.connect();
      
      try {
        // Get server version and other info
        const versionResult = await client.query('SELECT version()');
        const currentDbResult = await client.query('SELECT current_database()');
        const currentUserResult = await client.query('SELECT current_user');
        const timezoneResult = await client.query('SHOW timezone');

        const responseTime = Date.now() - startTime;

        const serverInfo = {
          version: versionResult.rows[0].version,
          database: currentDbResult.rows[0].current_database,
          user: currentUserResult.rows[0].current_user,
          timezone: timezoneResult.rows[0].TimeZone,
        };

        return {
          success: true,
          message: 'Connection successful',
          responseTime,
          serverInfo,
        };

      } finally {
        client.release();
      }

    } catch (error) {
      const responseTime = Date.now() - startTime;
      const connectionError = this.handleError(error);

      return {
        success: false,
        message: connectionError.message,
        responseTime,
      };
    }
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.pool !== undefined && this.metadata.isHealthy;
  }

  /**
   * Health check
   */
  public async healthCheck(): Promise<boolean> {
    if (!this.pool) {
      return false;
    }

    try {
      const client = await this.pool.connect();
      try {
        await client.query('SELECT 1');
        this.metadata.isHealthy = true;
        return true;
      } finally {
        client.release();
      }
    } catch (error) {
      this.metadata.isHealthy = false;
      this.metadata.lastError = error instanceof Error ? error.message : 'Health check failed';
      return false;
    }
  }

  /**
   * Reconnect to the database
   */
  public async reconnect(retries: number = 3): Promise<void> {
    await this.disconnect();
    
    await pRetry(
      async () => {
        await this.connect();
      },
      {
        retries,
        minTimeout: this.config.retryDelay || 1000,
        onFailedAttempt: (error) => {
          this.logger.warn('Reconnection attempt failed', {
            connectionId: this.id,
            attempt: error.attemptNumber,
            error: error.message,
          });
        },
      }
    );
  }

  /**
   * Execute a query
   */
  public async query<T = any>(query: string, params?: any[]): Promise<QueryResult<T>> {
    if (!this.pool) {
      throw new ConnectionError(
        'Not connected to database',
        ConnectionErrorType.CONNECTION_REFUSED
      );
    }

    const queryId = this.generateQueryId();
    const startTime = Date.now();
    this.activeQueries.add(queryId);

    this.emit('query_start', { queryId, query });
    this.metrics.recordActiveQuery('postgresql', true);

    try {
      const result = await this.pool.query<T>(query, params);
      
      const duration = Date.now() - startTime;
      this.updateMetrics(true, duration);

      const queryResult: QueryResult<T> = {
        success: true,
        data: result.rows as T,
        metadata: {
          rowCount: result.rowCount || 0,
          executionTime: duration,
          affectedRows: result.rowCount,
        },
      };

      this.emit('query_end', { queryId, duration, rowCount: result.rowCount });
      this.metrics.recordQueryExecution('postgresql', 'query', true, duration);

      return queryResult;

    } catch (error) {
      const duration = Date.now() - startTime;
      this.updateMetrics(false, duration);

      const connectionError = this.handleError(error);
      
      this.emit('query_end', { queryId, duration, error: connectionError.message });
      this.metrics.recordQueryExecution('postgresql', 'query', false, duration);
      this.metrics.recordQueryError('postgresql', 'query', connectionError.type);

      return {
        success: false,
        error: connectionError.message,
      };

    } finally {
      this.activeQueries.delete(queryId);
      this.metrics.recordActiveQuery('postgresql', false);
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
        ConnectionErrorType.CONNECTION_REFUSED
      );
    }

    const client = await this.pool.connect();
    const results: QueryResult<T>[] = [];

    try {
      await client.query('BEGIN');

      for (const { query, params } of queries) {
        try {
          const result = await client.query<T>(query, params);
          results.push({
            success: true,
            data: result.rows as T,
            metadata: {
              rowCount: result.rowCount || 0,
              affectedRows: result.rowCount,
            },
          });
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        }
      }

      await client.query('COMMIT');
      return results;

    } catch (error) {
      const connectionError = this.handleError(error);
      throw connectionError;
    } finally {
      client.release();
    }
  }

  /**
   * Stream query results
   */
  public stream(query: string, options?: StreamOptions): Readable {
    if (!this.pool) {
      throw new ConnectionError(
        'Not connected to database',
        ConnectionErrorType.CONNECTION_REFUSED
      );
    }

    const queryStream = new QueryStream(query, [], {
      highWaterMark: options?.highWaterMark || 100,
    });

    // We need to handle this differently since pg-query-stream needs a client
    const stream = new Readable({
      objectMode: options?.objectMode ?? true,
      read() {},
    });

    this.pool.connect((err, client, done) => {
      if (err) {
        stream.destroy(err);
        return;
      }

      const pgStream = client.query(queryStream);
      
      pgStream.on('data', (chunk) => {
        if (!stream.push(chunk)) {
          pgStream.pause();
        }
      });

      stream.on('resume', () => {
        pgStream.resume();
      });

      pgStream.on('end', () => {
        done();
        stream.push(null);
      });

      pgStream.on('error', (error) => {
        done();
        stream.destroy(error);
      });
    });

    return stream;
  }

  /**
   * Get database schema
   */
  public async getSchema(schemaName: string = 'public'): Promise<SchemaInfo> {
    if (!this.pool) {
      throw new ConnectionError(
        'Not connected to database',
        ConnectionErrorType.CONNECTION_REFUSED
      );
    }

    const tables: TableInfo[] = [];

    // Get all tables
    const tablesQuery = `
      SELECT 
        table_name,
        table_schema
      FROM information_schema.tables
      WHERE table_schema = $1
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    const tablesResult = await this.query<any>(tablesQuery, [schemaName]);

    if (tablesResult.success && tablesResult.data) {
      for (const table of tablesResult.data) {
        // Get columns for each table
        const columnsQuery = `
          SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default,
            character_maximum_length,
            numeric_precision,
            numeric_scale
          FROM information_schema.columns
          WHERE table_schema = $1
            AND table_name = $2
          ORDER BY ordinal_position
        `;

        const columnsResult = await this.query<any>(columnsQuery, [
          schemaName,
          table.table_name,
        ]);

        const columns: ColumnInfo[] = columnsResult.data?.map((col: any) => ({
          name: col.column_name,
          type: col.data_type,
          nullable: col.is_nullable === 'YES',
          defaultValue: col.column_default,
        })) || [];

        // Get primary keys
        const pkQuery = `
          SELECT column_name
          FROM information_schema.key_column_usage
          WHERE table_schema = $1
            AND table_name = $2
            AND constraint_name = (
              SELECT constraint_name
              FROM information_schema.table_constraints
              WHERE table_schema = $1
                AND table_name = $2
                AND constraint_type = 'PRIMARY KEY'
            )
        `;

        const pkResult = await this.query<any>(pkQuery, [schemaName, table.table_name]);
        const primaryKey = pkResult.data?.map((pk: any) => pk.column_name) || [];

        tables.push({
          name: table.table_name,
          schema: schemaName,
          columns,
          primaryKey,
        });
      }
    }

    return { tables };
  }

  /**
   * Validate query
   */
  public async validateQuery(query: string): Promise<{ valid: boolean; errors?: string[] }> {
    if (!this.pool) {
      return {
        valid: false,
        errors: ['Not connected to database'],
      };
    }

    try {
      // Use EXPLAIN to validate query without executing
      const explainQuery = `EXPLAIN ${query}`;
      await this.query(explainQuery);
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        errors: [error instanceof Error ? error.message : 'Query validation failed'],
      };
    }
  }

  /**
   * Get metrics
   */
  public getMetrics(): ConnectionMetrics {
    return this.metrics.getMetrics();
  }

  /**
   * Clear cache
   */
  public async clearCache(): Promise<void> {
    this.preparedStatements.clear();
    if (this.pool) {
      // PostgreSQL doesn't have a direct cache clear, but we can reset connections
      await this.pool.query('DISCARD ALL');
    }
  }

  /**
   * Prepare a statement
   */
  public async prepare<T = any>(statement: string, params?: any[]): Promise<QueryResult<T>> {
    if (!this.pool) {
      throw new ConnectionError(
        'Not connected to database',
        ConnectionErrorType.CONNECTION_REFUSED
      );
    }

    const statementName = `stmt_${Date.now()}`;
    
    try {
      // Prepare the statement
      await this.pool.query({
        text: `PREPARE ${statementName} AS ${statement}`,
        values: [],
      });

      // Execute the prepared statement
      const result = await this.pool.query<T>({
        text: `EXECUTE ${statementName}`,
        values: params || [],
      });

      // Deallocate the statement
      await this.pool.query(`DEALLOCATE ${statementName}`);

      return {
        success: true,
        data: result.rows as T,
        metadata: {
          rowCount: result.rowCount || 0,
          affectedRows: result.rowCount,
        },
      };

    } catch (error) {
      const connectionError = this.handleError(error);
      return {
        success: false,
        error: connectionError.message,
      };
    }
  }

  /**
   * Begin transaction
   */
  public async beginTransaction(): Promise<void> {
    await this.query('BEGIN');
  }

  /**
   * Commit transaction
   */
  public async commit(): Promise<void> {
    await this.query('COMMIT');
  }

  /**
   * Rollback transaction
   */
  public async rollback(): Promise<void> {
    await this.query('ROLLBACK');
  }

  /**
   * Get current database
   */
  public async getCurrentDatabase(): Promise<string> {
    const result = await this.query<{ current_database: string }>('SELECT current_database()');
    return result.data?.[0]?.current_database || '';
  }

  /**
   * Use database
   */
  public async useDatabase(database: string): Promise<void> {
    // PostgreSQL doesn't support USE statement, need to reconnect
    await this.disconnect();
    this.config.database = database;
    await this.connect();
  }

  /**
   * Escape value
   */
  public escape(value: any): string {
    if (value === null || value === undefined) {
      return 'NULL';
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    if (typeof value === 'boolean') {
      return value ? 'TRUE' : 'FALSE';
    }
    if (value instanceof Date) {
      return `'${value.toISOString()}'`;
    }
    // Escape single quotes
    return `'${value.toString().replace(/'/g, "''")}'`;
  }

  /**
   * Escape identifier
   */
  public escapeIdentifier(identifier: string): string {
    return `"${identifier.replace(/"/g, '""')}"`;
  }

  /**
   * Build pool configuration
   */
  private buildPoolConfig(): PostgreSQLConfig {
    return {
      host: this.config.host,
      port: this.config.port || 5432,
      database: this.config.database,
      user: this.config.username,
      password: this.config.password,
      ssl: this.config.ssl ? { rejectUnauthorized: false } : false,
      
      // Pool settings
      max: this.config.poolSize || 10,
      min: 2,
      idleTimeoutMillis: this.config.configuration?.idleTimeout || 30000,
      connectionTimeoutMillis: this.config.connectionTimeout || 30000,
      
      // Query settings
      statement_timeout: this.config.queryTimeout || 60000,
      query_timeout: this.config.queryTimeout || 60000,
    };
  }

  /**
   * Setup pool event handlers
   */
  private setupPoolEventHandlers(): void {
    if (!this.pool) return;

    this.pool.on('error', (error) => {
      this.logger.error('Pool error', {
        connectionId: this.id,
        error: error.message,
      });
      this.emit('error', error);
    });

    this.pool.on('connect', () => {
      this.logger.debug('New client connected to pool', { connectionId: this.id });
    });

    this.pool.on('acquire', () => {
      this.logger.debug('Client acquired from pool', { connectionId: this.id });
    });

    this.pool.on('remove', () => {
      this.logger.debug('Client removed from pool', { connectionId: this.id });
    });
  }

  /**
   * Wait for active queries
   */
  private async waitForActiveQueries(timeout: number = 30000): Promise<void> {
    const startTime = Date.now();
    
    while (this.activeQueries.size > 0) {
      if (Date.now() - startTime > timeout) {
        throw new ConnectionError(
          'Timeout waiting for active queries',
          ConnectionErrorType.QUERY_TIMEOUT
        );
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Generate query ID
   */
  private generateQueryId(): string {
    return `query-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update metrics
   */
  private updateMetrics(success: boolean, duration: number): void {
    this.metadata.lastActivity = new Date();
    this.metadata.totalQueries = (this.metadata.totalQueries || 0) + 1;
    
    if (!success) {
      this.metadata.failedQueries = (this.metadata.failedQueries || 0) + 1;
    }

    // Update average response time
    const currentAvg = this.metadata.avgResponseTime || 0;
    const totalQueries = this.metadata.totalQueries || 1;
    this.metadata.avgResponseTime = (currentAvg * (totalQueries - 1) + duration) / totalQueries;
  }

  /**
   * Handle errors
   */
  private handleError(error: any): ConnectionError {
    let errorType = ConnectionErrorType.UNKNOWN;
    let code = 'UNKNOWN';

    if (error.code) {
      switch (error.code) {
        case '28P01':
        case '28000':
          errorType = ConnectionErrorType.AUTHENTICATION_FAILED;
          code = 'AUTH_FAILED';
          break;
        case 'ECONNREFUSED':
          errorType = ConnectionErrorType.CONNECTION_REFUSED;
          code = 'CONN_REFUSED';
          break;
        case 'ETIMEDOUT':
        case 'ECONNRESET':
          errorType = ConnectionErrorType.CONNECTION_TIMEOUT;
          code = 'CONN_TIMEOUT';
          break;
        case '42601': // Syntax error
        case '42P01': // Undefined table
          errorType = ConnectionErrorType.INVALID_CONFIGURATION;
          code = 'QUERY_ERROR';
          break;
      }
    }

    return new ConnectionError(
      error.message || 'Unknown PostgreSQL error',
      errorType,
      code,
      { originalError: error }
    );
  }
}