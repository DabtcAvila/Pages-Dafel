/**
 * Data Source Connector Interface
 * @module lib/connections/interfaces
 */

import { Readable } from 'stream';
import {
  ConnectionConfig,
  ConnectionMetadata,
  ConnectionTestResult,
  QueryResult,
  SchemaInfo,
  StreamOptions,
  ConnectionMetrics,
} from '../types';

/**
 * Base interface for all data source connectors
 * Implements the Strategy pattern for connection handling
 */
export interface IDataSourceConnector {
  /**
   * Unique identifier for this connection instance
   */
  readonly id: string;

  /**
   * Type of the data source
   */
  readonly type: string;

  /**
   * Current connection metadata
   */
  readonly metadata: ConnectionMetadata;

  /**
   * Connection configuration
   */
  readonly config: ConnectionConfig;

  /**
   * Establishes connection to the data source
   * @throws ConnectionError if connection fails
   */
  connect(): Promise<void>;

  /**
   * Closes the connection gracefully
   */
  disconnect(): Promise<void>;

  /**
   * Tests the connection without performing any operations
   */
  testConnection(): Promise<ConnectionTestResult>;

  /**
   * Checks if the connection is currently active
   */
  isConnected(): boolean;

  /**
   * Performs a health check on the connection
   */
  healthCheck(): Promise<boolean>;

  /**
   * Reconnects to the data source
   * @param retries Number of retry attempts
   */
  reconnect(retries?: number): Promise<void>;

  /**
   * Executes a query on the data source
   * @param query Query string or object
   * @param params Query parameters
   */
  query<T = any>(query: string | object, params?: any[]): Promise<QueryResult<T>>;

  /**
   * Executes multiple queries in a transaction (if supported)
   * @param queries Array of queries to execute
   */
  transaction<T = any>(queries: Array<{ query: string | object; params?: any[] }>): Promise<QueryResult<T>[]>;

  /**
   * Streams data from the data source
   * @param query Query to stream
   * @param options Stream options
   */
  stream(query: string | object, options?: StreamOptions): Readable;

  /**
   * Gets schema information from the data source
   * @param schemaName Optional schema name to inspect
   */
  getSchema(schemaName?: string): Promise<SchemaInfo>;

  /**
   * Validates a query without executing it (dry run)
   * @param query Query to validate
   */
  validateQuery(query: string | object): Promise<{ valid: boolean; errors?: string[] }>;

  /**
   * Gets current connection metrics
   */
  getMetrics(): ConnectionMetrics;

  /**
   * Clears any cached data or prepared statements
   */
  clearCache(): Promise<void>;

  /**
   * Sets up event listeners for connection events
   * @param event Event name
   * @param handler Event handler function
   */
  on(event: string, handler: (...args: any[]) => void): void;

  /**
   * Removes event listener
   * @param event Event name
   * @param handler Event handler function
   */
  off(event: string, handler: (...args: any[]) => void): void;

  /**
   * Emits an event
   * @param event Event name
   * @param args Event arguments
   */
  emit(event: string, ...args: any[]): void;
}

/**
 * Extended interface for SQL-based connectors
 */
export interface ISQLConnector extends IDataSourceConnector {
  /**
   * Executes a prepared statement
   * @param statement Statement to prepare and execute
   * @param params Parameters for the statement
   */
  prepare<T = any>(statement: string, params?: any[]): Promise<QueryResult<T>>;

  /**
   * Begins a new transaction
   */
  beginTransaction(): Promise<void>;

  /**
   * Commits the current transaction
   */
  commit(): Promise<void>;

  /**
   * Rolls back the current transaction
   */
  rollback(): Promise<void>;

  /**
   * Gets the current database/schema name
   */
  getCurrentDatabase(): Promise<string>;

  /**
   * Changes the active database/schema
   * @param database Database name
   */
  useDatabase(database: string): Promise<void>;

  /**
   * Escapes a value for safe SQL usage
   * @param value Value to escape
   */
  escape(value: any): string;

  /**
   * Escapes an identifier (table/column name)
   * @param identifier Identifier to escape
   */
  escapeIdentifier(identifier: string): string;
}

/**
 * Extended interface for NoSQL connectors
 */
export interface INoSQLConnector extends IDataSourceConnector {
  /**
   * Finds documents in a collection
   * @param collection Collection name
   * @param filter Query filter
   * @param options Query options
   */
  find<T = any>(collection: string, filter?: object, options?: object): Promise<QueryResult<T[]>>;

  /**
   * Finds a single document
   * @param collection Collection name
   * @param filter Query filter
   * @param options Query options
   */
  findOne<T = any>(collection: string, filter?: object, options?: object): Promise<QueryResult<T>>;

  /**
   * Inserts documents into a collection
   * @param collection Collection name
   * @param documents Documents to insert
   * @param options Insert options
   */
  insert<T = any>(collection: string, documents: T | T[], options?: object): Promise<QueryResult<any>>;

  /**
   * Updates documents in a collection
   * @param collection Collection name
   * @param filter Query filter
   * @param update Update operations
   * @param options Update options
   */
  update(collection: string, filter: object, update: object, options?: object): Promise<QueryResult<any>>;

  /**
   * Deletes documents from a collection
   * @param collection Collection name
   * @param filter Query filter
   * @param options Delete options
   */
  delete(collection: string, filter: object, options?: object): Promise<QueryResult<any>>;

  /**
   * Performs aggregation on a collection
   * @param collection Collection name
   * @param pipeline Aggregation pipeline
   * @param options Aggregation options
   */
  aggregate<T = any>(collection: string, pipeline: object[], options?: object): Promise<QueryResult<T[]>>;

  /**
   * Lists all collections in the database
   */
  listCollections(): Promise<string[]>;

  /**
   * Creates a new collection
   * @param collection Collection name
   * @param options Collection options
   */
  createCollection(collection: string, options?: object): Promise<void>;

  /**
   * Drops a collection
   * @param collection Collection name
   */
  dropCollection(collection: string): Promise<void>;
}

/**
 * Extended interface for API-based connectors
 */
export interface IAPIConnector extends IDataSourceConnector {
  /**
   * Makes a GET request
   * @param endpoint API endpoint
   * @param params Query parameters
   * @param headers Additional headers
   */
  get<T = any>(endpoint: string, params?: object, headers?: object): Promise<QueryResult<T>>;

  /**
   * Makes a POST request
   * @param endpoint API endpoint
   * @param body Request body
   * @param headers Additional headers
   */
  post<T = any>(endpoint: string, body?: object, headers?: object): Promise<QueryResult<T>>;

  /**
   * Makes a PUT request
   * @param endpoint API endpoint
   * @param body Request body
   * @param headers Additional headers
   */
  put<T = any>(endpoint: string, body?: object, headers?: object): Promise<QueryResult<T>>;

  /**
   * Makes a PATCH request
   * @param endpoint API endpoint
   * @param body Request body
   * @param headers Additional headers
   */
  patch<T = any>(endpoint: string, body?: object, headers?: object): Promise<QueryResult<T>>;

  /**
   * Makes a DELETE request
   * @param endpoint API endpoint
   * @param headers Additional headers
   */
  delete<T = any>(endpoint: string, headers?: object): Promise<QueryResult<T>>;

  /**
   * Sets default headers for all requests
   * @param headers Headers object
   */
  setDefaultHeaders(headers: object): void;

  /**
   * Sets authentication for the API
   * @param auth Authentication configuration
   */
  setAuthentication(auth: { type: 'bearer' | 'basic' | 'apikey' | 'oauth2'; credentials: any }): void;

  /**
   * Gets the current rate limit status
   */
  getRateLimitStatus(): Promise<{ remaining: number; limit: number; reset: Date }>;
}

/**
 * Extended interface for file-based connectors
 */
export interface IFileConnector extends IDataSourceConnector {
  /**
   * Lists files in a path
   * @param path File path
   * @param options List options
   */
  list(path: string, options?: object): Promise<QueryResult<any[]>>;

  /**
   * Reads a file
   * @param path File path
   * @param options Read options
   */
  read<T = any>(path: string, options?: object): Promise<QueryResult<T>>;

  /**
   * Writes to a file
   * @param path File path
   * @param data Data to write
   * @param options Write options
   */
  write(path: string, data: any, options?: object): Promise<QueryResult<any>>;

  /**
   * Deletes a file
   * @param path File path
   */
  deleteFile(path: string): Promise<QueryResult<any>>;

  /**
   * Checks if a file exists
   * @param path File path
   */
  exists(path: string): Promise<boolean>;

  /**
   * Gets file metadata
   * @param path File path
   */
  getMetadata(path: string): Promise<QueryResult<any>>;

  /**
   * Creates a read stream for a file
   * @param path File path
   * @param options Stream options
   */
  createReadStream(path: string, options?: StreamOptions): Readable;

  /**
   * Creates a write stream for a file
   * @param path File path
   * @param options Stream options
   */
  createWriteStream(path: string, options?: StreamOptions): NodeJS.WritableStream;
}