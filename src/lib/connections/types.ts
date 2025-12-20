/**
 * Enterprise Data Source Connection Types
 * @module lib/connections/types
 */

import { DataSourceType, DataSourceStatus } from '@prisma/client';

/**
 * Connection configuration for different data source types
 */
export interface ConnectionConfig {
  id: string;
  type: DataSourceType;
  name: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  ssl?: boolean;
  apiKey?: string;
  endpoint?: string;
  configuration?: Record<string, any>;
  maxRetries?: number;
  retryDelay?: number;
  connectionTimeout?: number;
  queryTimeout?: number;
  poolSize?: number;
}

/**
 * Connection metadata and statistics
 */
export interface ConnectionMetadata {
  connectedAt?: Date;
  lastActivity?: Date;
  totalQueries?: number;
  failedQueries?: number;
  avgResponseTime?: number;
  isHealthy: boolean;
  lastError?: string;
  poolStats?: {
    size: number;
    available: number;
    pending: number;
    borrowed: number;
  };
}

/**
 * Query result structure
 */
export interface QueryResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    rowCount?: number;
    executionTime?: number;
    affectedRows?: number;
  };
}

/**
 * Connection test result
 */
export interface ConnectionTestResult {
  success: boolean;
  message: string;
  responseTime?: number;
  serverInfo?: Record<string, any>;
  warnings?: string[];
}

/**
 * Schema information for databases
 */
export interface SchemaInfo {
  tables?: TableInfo[];
  views?: ViewInfo[];
  procedures?: ProcedureInfo[];
  functions?: FunctionInfo[];
}

export interface TableInfo {
  name: string;
  schema?: string;
  columns: ColumnInfo[];
  primaryKey?: string[];
  foreignKeys?: ForeignKeyInfo[];
  indexes?: IndexInfo[];
  rowCount?: number;
  sizeBytes?: number;
}

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: any;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isUnique?: boolean;
  comment?: string;
}

export interface ForeignKeyInfo {
  name: string;
  column: string;
  referencedTable: string;
  referencedColumn: string;
  onDelete?: string;
  onUpdate?: string;
}

export interface IndexInfo {
  name: string;
  columns: string[];
  unique: boolean;
  type?: string;
}

export interface ViewInfo {
  name: string;
  schema?: string;
  definition?: string;
  columns: ColumnInfo[];
}

export interface ProcedureInfo {
  name: string;
  schema?: string;
  parameters?: ParameterInfo[];
  returnType?: string;
}

export interface FunctionInfo {
  name: string;
  schema?: string;
  parameters?: ParameterInfo[];
  returnType: string;
}

export interface ParameterInfo {
  name: string;
  type: string;
  mode?: 'IN' | 'OUT' | 'INOUT';
  defaultValue?: any;
}

/**
 * Data synchronization options
 */
export interface SyncOptions {
  mode: 'full' | 'incremental' | 'cdc';
  batchSize?: number;
  parallelism?: number;
  transformations?: DataTransformation[];
  filters?: DataFilter[];
  schedule?: string; // Cron expression
  notifyOnComplete?: boolean;
  notifyOnError?: boolean;
}

export interface DataTransformation {
  field: string;
  type: 'map' | 'filter' | 'aggregate' | 'custom';
  config: Record<string, any>;
}

export interface DataFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'regex';
  value: any;
}

/**
 * Stream processing options
 */
export interface StreamOptions {
  highWaterMark?: number;
  encoding?: BufferEncoding;
  objectMode?: boolean;
  autoDestroy?: boolean;
}

/**
 * Connection pool configuration
 */
export interface PoolConfig {
  min: number;
  max: number;
  acquireTimeout?: number;
  createTimeout?: number;
  destroyTimeout?: number;
  idleTimeout?: number;
  reapInterval?: number;
  createRetryInterval?: number;
  propagateCreateError?: boolean;
}

/**
 * Connection events
 */
export enum ConnectionEvent {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
  RECONNECTING = 'reconnecting',
  POOL_CREATED = 'pool_created',
  POOL_DESTROYED = 'pool_destroyed',
  QUERY_START = 'query_start',
  QUERY_END = 'query_end',
  HEALTH_CHECK = 'health_check',
}

/**
 * Error types for better error handling
 */
export enum ConnectionErrorType {
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  CONNECTION_TIMEOUT = 'CONNECTION_TIMEOUT',
  CONNECTION_REFUSED = 'CONNECTION_REFUSED',
  SSL_ERROR = 'SSL_ERROR',
  INVALID_CONFIGURATION = 'INVALID_CONFIGURATION',
  POOL_EXHAUSTED = 'POOL_EXHAUSTED',
  QUERY_TIMEOUT = 'QUERY_TIMEOUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  HOST_NOT_FOUND = 'HOST_NOT_FOUND',
  DATABASE_NOT_FOUND = 'DATABASE_NOT_FOUND',
  TIMEOUT = 'TIMEOUT',
  NOT_CONNECTED = 'NOT_CONNECTED',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Custom error class for connection errors
 */
export class ConnectionError extends Error {
  constructor(
    message: string,
    public type: ConnectionErrorType,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ConnectionError';
  }
}

/**
 * Monitoring metrics
 */
export interface ConnectionMetrics {
  connectionsTotal: number;
  connectionsActive: number;
  connectionsFailed: number;
  queriesTotal: number;
  queriesActive: number;
  queriesFailed: number;
  queryDurationSeconds: number[];
  connectionDurationSeconds: number[];
  errorRate: number;
  throughput: number;
}