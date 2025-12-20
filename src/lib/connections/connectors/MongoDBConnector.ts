/**
 * MongoDB Connector
 * Enterprise-grade MongoDB NoSQL database connector
 * @module lib/connections/connectors/MongoDBConnector
 */

import { MongoClient, Db, Collection, MongoClientOptions, ClientSession, Document, FindOptions, AggregateOptions } from 'mongodb';
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
import { INoSQLConnector } from '../interfaces/IDataSourceConnector';
import { Logger } from '../../monitoring/Logger';
import { MetricsCollector } from '../../monitoring/MetricsCollector';

/**
 * MongoDB-specific configuration
 */
interface MongoDBConfig extends MongoClientOptions {
  retryWrites?: boolean;
  retryReads?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  connectionString?: string;
}

/**
 * MongoDB Query Options
 */
interface MongoQueryOptions {
  collection: string;
  operation: 'find' | 'findOne' | 'insert' | 'insertMany' | 'update' | 'updateMany' | 'delete' | 'deleteMany' | 'aggregate' | 'count';
  filter?: Document;
  document?: Document | Document[];
  update?: Document;
  options?: FindOptions | AggregateOptions;
  pipeline?: Document[];
}

/**
 * Enterprise MongoDB Connector
 */
export class MongoDBConnector extends EventEmitter implements INoSQLConnector {
  public readonly id: string;
  public readonly type = 'MONGODB';
  public readonly config: ConnectionConfig;
  public metadata: ConnectionMetadata;

  private client?: MongoClient;
  private database?: Db;
  private logger: Logger;
  private metrics: MetricsCollector;
  private activeQueries: Set<string> = new Set();
  private currentDatabase?: string;
  private isConnecting: boolean = false;
  private sessions: Map<string, ClientSession> = new Map();

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
   * Connect to MongoDB
   */
  public async connect(): Promise<void> {
    if (this.client && this.client.topology?.isConnected()) {
      this.logger.warn('Already connected to MongoDB', { connectionId: this.id });
      return;
    }

    if (this.isConnecting) {
      this.logger.warn('Connection already in progress', { connectionId: this.id });
      return;
    }

    this.isConnecting = true;
    const startTime = Date.now();

    try {
      const connectionString = this.buildConnectionString();
      const options = this.buildClientOptions();
      
      this.logger.info('Connecting to MongoDB', {
        connectionId: this.id,
        host: this.config.host,
        database: this.config.database,
      });

      this.client = new MongoClient(connectionString, options);
      await this.client.connect();

      // Select database
      this.database = this.client.db(this.config.database);
      this.currentDatabase = this.config.database;

      // Test connection
      await this.testConnection();

      this.metadata.connectedAt = new Date();
      this.metadata.isHealthy = true;

      const duration = Date.now() - startTime;
      this.metrics.recordConnectionCreation('mongodb', true, duration);

      this.logger.info('Connected to MongoDB successfully', {
        connectionId: this.id,
        duration,
      });

      // Setup event handlers
      this.setupEventHandlers();
      this.emit('connected', { connectionId: this.id });

    } catch (error) {
      const duration = Date.now() - startTime;
      this.metrics.recordConnectionCreation('mongodb', false, duration);

      const connectionError = this.handleError(error);
      this.logger.error('Failed to connect to MongoDB', {
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
   * Disconnect from MongoDB
   */
  public async disconnect(): Promise<void> {
    if (!this.client) {
      return;
    }

    try {
      this.logger.info('Disconnecting from MongoDB', { connectionId: this.id });

      // Close all sessions
      for (const [id, session] of this.sessions) {
        try {
          await session.endSession();
        } catch (error) {
          this.logger.warn('Error ending session', { sessionId: id, error });
        }
      }
      this.sessions.clear();

      // Wait for active queries
      if (this.activeQueries.size > 0) {
        this.logger.warn('Waiting for active queries to complete', {
          connectionId: this.id,
          activeQueries: this.activeQueries.size,
        });
        await this.waitForActiveQueries();
      }

      await this.client.close();
      this.client = undefined;
      this.database = undefined;
      this.metadata.isHealthy = false;
      this.metadata.disconnectedAt = new Date();

      this.logger.info('Disconnected from MongoDB', { connectionId: this.id });
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
    return !!this.client && this.client.topology?.isConnected() && this.metadata.isHealthy;
  }

  /**
   * Test database connection
   */
  public async testConnection(): Promise<ConnectionTestResult> {
    const startTime = Date.now();
    const queryId = `test_${Date.now()}`;

    try {
      this.activeQueries.add(queryId);

      if (!this.client || !this.database) {
        throw new Error('Client or database not initialized');
      }

      // Ping the server
      await this.database.admin().ping();

      // Get server information
      const serverInfo = await this.database.admin().serverInfo();
      const serverStatus = await this.database.admin().serverStatus();
      const buildInfo = await this.database.admin().buildInfo();

      const responseTime = Date.now() - startTime;
      
      this.metadata.isHealthy = true;
      this.metadata.lastHealthCheck = new Date();
      
      this.metrics.recordQueryExecution('mongodb', 'test', true, responseTime);

      return {
        success: true,
        responseTime,
        serverInfo: {
          version: buildInfo.version || 'Unknown',
          database: this.currentDatabase || 'Unknown',
          host: serverStatus.host || this.config.host || 'Unknown',
          port: this.config.port || 27017,
          replicaSet: serverStatus.repl?.setName,
          connections: serverStatus.connections?.current,
        },
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.metrics.recordQueryExecution('mongodb', 'test', false, responseTime);
      
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
   * Execute a MongoDB query
   */
  public async query<T = any>(queryOptions: MongoQueryOptions, params?: any[]): Promise<QueryResult<T>> {
    const startTime = Date.now();
    const queryId = `query_${Date.now()}_${Math.random()}`;

    if (!this.database) {
      throw new ConnectionError(
        'Not connected to database',
        ConnectionErrorType.NOT_CONNECTED
      );
    }

    try {
      this.activeQueries.add(queryId);

      const collection = this.database.collection(queryOptions.collection);
      let result: any;
      let rowCount = 0;

      this.logger.debug('Executing MongoDB operation', {
        connectionId: this.id,
        queryId,
        collection: queryOptions.collection,
        operation: queryOptions.operation,
      });

      switch (queryOptions.operation) {
        case 'find':
          result = await collection.find(queryOptions.filter || {}, queryOptions.options).toArray();
          rowCount = result.length;
          break;

        case 'findOne':
          result = await collection.findOne(queryOptions.filter || {}, queryOptions.options);
          rowCount = result ? 1 : 0;
          break;

        case 'insert':
        case 'insertMany':
          if (Array.isArray(queryOptions.document)) {
            const insertResult = await collection.insertMany(queryOptions.document);
            result = {
              acknowledged: insertResult.acknowledged,
              insertedCount: insertResult.insertedCount,
              insertedIds: insertResult.insertedIds,
            };
            rowCount = insertResult.insertedCount;
          } else if (queryOptions.document) {
            const insertResult = await collection.insertOne(queryOptions.document);
            result = {
              acknowledged: insertResult.acknowledged,
              insertedId: insertResult.insertedId,
            };
            rowCount = insertResult.acknowledged ? 1 : 0;
          }
          break;

        case 'update':
        case 'updateMany':
          const updateResult = queryOptions.operation === 'update'
            ? await collection.updateOne(queryOptions.filter || {}, queryOptions.update || {})
            : await collection.updateMany(queryOptions.filter || {}, queryOptions.update || {});
          
          result = {
            acknowledged: updateResult.acknowledged,
            matchedCount: updateResult.matchedCount,
            modifiedCount: updateResult.modifiedCount,
            upsertedId: updateResult.upsertedId,
          };
          rowCount = updateResult.modifiedCount;
          break;

        case 'delete':
        case 'deleteMany':
          const deleteResult = queryOptions.operation === 'delete'
            ? await collection.deleteOne(queryOptions.filter || {})
            : await collection.deleteMany(queryOptions.filter || {});
          
          result = {
            acknowledged: deleteResult.acknowledged,
            deletedCount: deleteResult.deletedCount,
          };
          rowCount = deleteResult.deletedCount;
          break;

        case 'aggregate':
          result = await collection.aggregate(queryOptions.pipeline || [], queryOptions.options).toArray();
          rowCount = result.length;
          break;

        case 'count':
          result = await collection.countDocuments(queryOptions.filter || {});
          rowCount = result;
          break;

        default:
          throw new Error(`Unsupported operation: ${queryOptions.operation}`);
      }

      const responseTime = Date.now() - startTime;
      this.updateMetrics(true, responseTime);
      this.metrics.recordQueryExecution('mongodb', queryOptions.operation, true, responseTime);

      return {
        success: true,
        data: result as T,
        rowCount,
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.updateMetrics(false, responseTime);
      this.metrics.recordQueryExecution('mongodb', queryOptions.operation || 'unknown', false, responseTime);

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
   * Execute multiple operations in a transaction
   */
  public async transaction<T = any>(
    operations: Array<{ operation: MongoQueryOptions; params?: any[] }>
  ): Promise<QueryResult<T>[]> {
    if (!this.client || !this.database) {
      throw new ConnectionError(
        'Not connected to database',
        ConnectionErrorType.NOT_CONNECTED
      );
    }

    const session = this.client.startSession();
    const sessionId = `session_${Date.now()}`;
    this.sessions.set(sessionId, session);

    const results: QueryResult<T>[] = [];
    const startTime = Date.now();
    const transactionId = `tx_${Date.now()}`;

    try {
      this.activeQueries.add(transactionId);

      await session.withTransaction(async () => {
        this.logger.debug('Starting MongoDB transaction', {
          connectionId: this.id,
          transactionId,
          operationCount: operations.length,
        });

        for (const { operation } of operations) {
          const result = await this.query<T>(operation);
          results.push(result);
          
          if (!result.success) {
            throw new Error(`Operation failed: ${result.error}`);
          }
        }
      });

      const duration = Date.now() - startTime;
      this.metrics.recordQueryExecution('mongodb', 'transaction', true, duration);

      this.logger.debug('Transaction committed', {
        connectionId: this.id,
        transactionId,
        duration,
      });

      return results;

    } catch (error) {
      const duration = Date.now() - startTime;
      this.metrics.recordQueryExecution('mongodb', 'transaction', false, duration);

      const connectionError = this.handleError(error);
      this.logger.error('Transaction aborted', {
        connectionId: this.id,
        transactionId,
        error: connectionError.message,
      });

      throw connectionError;
    } finally {
      await session.endSession();
      this.sessions.delete(sessionId);
      this.activeQueries.delete(transactionId);
    }
  }

  /**
   * Get database schema information
   */
  public async getSchema(): Promise<SchemaInfo> {
    if (!this.database) {
      throw new ConnectionError(
        'Not connected to database',
        ConnectionErrorType.NOT_CONNECTED
      );
    }

    try {
      // Get all collections
      const collections = await this.database.listCollections().toArray();
      
      const tableInfoPromises = collections.map(async (collection) => {
        const collectionName = collection.name;
        const stats = await this.database!.collection(collectionName).stats();
        
        // Sample documents to infer schema
        const sampleDocs = await this.database!
          .collection(collectionName)
          .find({})
          .limit(10)
          .toArray();
        
        const fields = this.inferSchema(sampleDocs);
        
        return {
          name: collectionName,
          columns: fields,
          rowCount: stats.count || 0,
          size: stats.size || 0,
          indexes: stats.indexSizes ? Object.keys(stats.indexSizes) : [],
        };
      });

      const tablesInfo = await Promise.all(tableInfoPromises);
      const buildInfo = await this.database.admin().buildInfo();

      return {
        database: this.currentDatabase || '',
        tables: tablesInfo,
        version: buildInfo.version || 'Unknown',
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
    collection: string,
    filter: Document = {},
    options?: StreamOptions
  ): Promise<AsyncIterable<T>> {
    if (!this.database) {
      throw new ConnectionError(
        'Not connected to database',
        ConnectionErrorType.NOT_CONNECTED
      );
    }

    const cursor = this.database.collection(collection).find(filter);
    
    if (options?.batchSize) {
      cursor.batchSize(options.batchSize);
    }

    // Create async iterable
    const asyncIterable: AsyncIterable<T> = {
      [Symbol.asyncIterator](): AsyncIterator<T> {
        return {
          async next(): Promise<IteratorResult<T>> {
            const hasNext = await cursor.hasNext();
            if (hasNext) {
              const doc = await cursor.next();
              return { done: false, value: doc as T };
            } else {
              await cursor.close();
              return { done: true, value: undefined };
            }
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
   * Build connection string
   */
  private buildConnectionString(): string {
    if (this.config.configuration?.connectionString) {
      return this.config.configuration.connectionString as string;
    }

    const {
      host = 'localhost',
      port = 27017,
      username,
      password,
      database,
      ssl,
    } = this.config;

    let connectionString = 'mongodb://';
    
    if (username && password) {
      connectionString += `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`;
    }

    connectionString += `${host}:${port}`;

    if (database) {
      connectionString += `/${database}`;
    }

    const params: string[] = [];
    if (ssl) {
      params.push('ssl=true');
    }
    if (this.config.configuration?.replicaSet) {
      params.push(`replicaSet=${this.config.configuration.replicaSet}`);
    }

    if (params.length > 0) {
      connectionString += `?${params.join('&')}`;
    }

    return connectionString;
  }

  /**
   * Build client options
   */
  private buildClientOptions(): MongoDBConfig {
    const options: MongoDBConfig = {
      maxPoolSize: (this.config.configuration?.poolConfig?.max as number) || 10,
      minPoolSize: (this.config.configuration?.poolConfig?.min as number) || 2,
      serverSelectionTimeoutMS: (this.config.configuration?.connectionTimeoutMillis as number) || 30000,
      socketTimeoutMS: (this.config.configuration?.queryTimeout as number) || 60000,
      connectTimeoutMS: (this.config.configuration?.connectionTimeoutMillis as number) || 30000,
      retryWrites: true,
      retryReads: true,
    };

    return options;
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    if (!this.client) return;

    this.client.on('error', (error) => {
      this.logger.error('MongoDB client error', {
        connectionId: this.id,
        error: error.message,
      });
      this.metadata.isHealthy = false;
    });

    this.client.on('timeout', () => {
      this.logger.warn('MongoDB client timeout', { connectionId: this.id });
    });

    this.client.on('close', () => {
      this.logger.info('MongoDB client closed', { connectionId: this.id });
      this.metadata.isHealthy = false;
    });
  }

  /**
   * Infer schema from sample documents
   */
  private inferSchema(documents: Document[]): ColumnInfo[] {
    const fieldMap = new Map<string, Set<string>>();

    documents.forEach(doc => {
      Object.entries(doc).forEach(([key, value]) => {
        if (!fieldMap.has(key)) {
          fieldMap.set(key, new Set());
        }
        fieldMap.get(key)!.add(this.getMongoType(value));
      });
    });

    return Array.from(fieldMap.entries()).map(([name, types]) => ({
      name,
      type: Array.from(types).join(' | '),
      nullable: documents.some(doc => !(name in doc)),
    }));
  }

  /**
   * Get MongoDB type
   */
  private getMongoType(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (value instanceof Date) return 'Date';
    if (value instanceof RegExp) return 'RegExp';
    if (Array.isArray(value)) return 'Array';
    if (value._bsontype) return value._bsontype;
    return typeof value;
  }

  /**
   * Handle errors
   */
  private handleError(error: any): ConnectionError {
    let errorType = ConnectionErrorType.UNKNOWN;
    let message = error.message || 'Unknown error';

    if (error.code === 'ECONNREFUSED') {
      errorType = ConnectionErrorType.CONNECTION_REFUSED;
      message = `Cannot connect to MongoDB server at ${this.config.host}:${this.config.port || 27017}`;
    } else if (error.code === 'ENOTFOUND') {
      errorType = ConnectionErrorType.HOST_NOT_FOUND;
      message = `Host '${this.config.host}' not found`;
    } else if (error.code === 18 || error.codeName === 'AuthenticationFailed') {
      errorType = ConnectionErrorType.AUTHENTICATION_FAILED;
      message = 'Authentication failed. Please check your username and password.';
    } else if (error.code === 'ETIMEDOUT') {
      errorType = ConnectionErrorType.TIMEOUT;
      message = 'Connection timeout';
    } else if (error.message?.includes('pool destroyed')) {
      errorType = ConnectionErrorType.POOL_EXHAUSTED;
      message = 'Connection pool destroyed';
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