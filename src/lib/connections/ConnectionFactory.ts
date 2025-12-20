/**
 * Connection Factory
 * Factory pattern for creating data source connectors
 * @module lib/connections/ConnectionFactory
 */

import { DataSourceType } from '@prisma/client';
import { ConnectionConfig, ConnectionError, ConnectionErrorType } from './types';
import { IDataSourceConnector } from './interfaces/IDataSourceConnector';
import { PostgreSQLConnector } from './connectors/PostgreSQLConnector';
import { MySQLConnector } from './connectors/MySQLConnector';
import { MongoDBConnector } from './connectors/MongoDBConnector';
import { RESTAPIConnector } from './connectors/RESTAPIConnector';
import { S3Connector } from './connectors/S3Connector';
import { GraphQLConnector } from './connectors/GraphQLConnector';
import { GoogleSheetsConnector } from './connectors/GoogleSheetsConnector';
import { CSVFileConnector } from './connectors/CSVFileConnector';
import { Logger } from '../monitoring/Logger';
import { VaultManager } from '../security/VaultManager';

/**
 * Connector constructor type
 */
type ConnectorConstructor = new (config: ConnectionConfig) => IDataSourceConnector;

/**
 * Registry of available connectors
 */
const connectorRegistry: Map<DataSourceType, ConnectorConstructor> = new Map();

/**
 * Connection Factory
 * Creates appropriate connector instances based on configuration
 */
export class ConnectionFactory {
  private static logger = Logger.getInstance();
  private static vault = process.env.NODE_ENV === 'production' ? null : VaultManager.getInstance();

  /**
   * Static initializer to register all connectors
   */
  static {
    // Register all available connectors
    ConnectionFactory.registerConnector(DataSourceType.POSTGRESQL, PostgreSQLConnector);
    ConnectionFactory.registerConnector(DataSourceType.MYSQL, MySQLConnector);
    ConnectionFactory.registerConnector(DataSourceType.MONGODB, MongoDBConnector);
    ConnectionFactory.registerConnector(DataSourceType.REST_API, RESTAPIConnector);
    ConnectionFactory.registerConnector(DataSourceType.S3, S3Connector);
    ConnectionFactory.registerConnector(DataSourceType.GRAPHQL, GraphQLConnector);
    ConnectionFactory.registerConnector(DataSourceType.GOOGLE_SHEETS, GoogleSheetsConnector);
    ConnectionFactory.registerConnector(DataSourceType.CSV_FILE, CSVFileConnector);
  }

  /**
   * Register a new connector type
   */
  public static registerConnector(type: DataSourceType, connector: ConnectorConstructor): void {
    connectorRegistry.set(type, connector);
    this.logger.debug(`Registered connector for ${type}`);
  }

  /**
   * Create a connector instance based on configuration
   */
  public static async create(config: ConnectionConfig): Promise<IDataSourceConnector> {
    const startTime = Date.now();

    try {
      // Validate configuration
      this.validateConfig(config);

      // Get connector class
      const ConnectorClass = connectorRegistry.get(config.type);
      if (!ConnectorClass) {
        throw new ConnectionError(
          `Unsupported data source type: ${config.type}`,
          ConnectionErrorType.INVALID_CONFIGURATION,
          'UNSUPPORTED_TYPE',
          { type: config.type }
        );
      }

      // Decrypt sensitive fields
      const decryptedConfig = await this.decryptConfig(config);

      // Apply default configuration
      const finalConfig = this.applyDefaults(decryptedConfig);

      // Create connector instance
      const connector = new ConnectorClass(finalConfig);

      this.logger.info(`Created ${config.type} connector`, {
        connectionId: config.id,
        duration: Date.now() - startTime
      });

      return connector;

    } catch (error) {
      this.logger.error(`Failed to create connector`, {
        type: config.type,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      });
      throw error;
    }
  }

  /**
   * Validate connection configuration
   */
  private static validateConfig(config: ConnectionConfig): void {
    if (!config.id) {
      throw new ConnectionError(
        'Connection ID is required',
        ConnectionErrorType.INVALID_CONFIGURATION,
        'MISSING_ID'
      );
    }

    if (!config.type) {
      throw new ConnectionError(
        'Connection type is required',
        ConnectionErrorType.INVALID_CONFIGURATION,
        'MISSING_TYPE'
      );
    }

    if (!config.name) {
      throw new ConnectionError(
        'Connection name is required',
        ConnectionErrorType.INVALID_CONFIGURATION,
        'MISSING_NAME'
      );
    }

    // Type-specific validation
    switch (config.type) {
      case DataSourceType.POSTGRESQL:
      case DataSourceType.MYSQL:
        if (!config.host || !config.port || !config.database) {
          throw new ConnectionError(
            'Host, port, and database are required for SQL connections',
            ConnectionErrorType.INVALID_CONFIGURATION,
            'MISSING_SQL_CONFIG'
          );
        }
        break;

      case DataSourceType.MONGODB:
        if (!config.host || !config.database) {
          throw new ConnectionError(
            'Host and database are required for MongoDB connections',
            ConnectionErrorType.INVALID_CONFIGURATION,
            'MISSING_MONGO_CONFIG'
          );
        }
        break;

      case DataSourceType.REST_API:
      case DataSourceType.GRAPHQL:
        if (!config.endpoint) {
          throw new ConnectionError(
            'Endpoint is required for API connections',
            ConnectionErrorType.INVALID_CONFIGURATION,
            'MISSING_API_ENDPOINT'
          );
        }
        break;

      case DataSourceType.S3:
        if (!config.configuration?.bucket || !config.configuration?.region) {
          throw new ConnectionError(
            'Bucket and region are required for S3 connections',
            ConnectionErrorType.INVALID_CONFIGURATION,
            'MISSING_S3_CONFIG'
          );
        }
        break;

      case DataSourceType.GOOGLE_SHEETS:
        if (!config.configuration?.spreadsheetId) {
          throw new ConnectionError(
            'Spreadsheet ID is required for Google Sheets connections',
            ConnectionErrorType.INVALID_CONFIGURATION,
            'MISSING_SHEETS_CONFIG'
          );
        }
        break;

      case DataSourceType.CSV_FILE:
        if (!config.configuration?.filePath) {
          throw new ConnectionError(
            'File path is required for CSV connections',
            ConnectionErrorType.INVALID_CONFIGURATION,
            'MISSING_CSV_PATH'
          );
        }
        break;
    }
  }

  /**
   * Decrypt sensitive configuration fields
   */
  private static async decryptConfig(config: ConnectionConfig): Promise<ConnectionConfig> {
    const decrypted = { ...config };

    // Decrypt password if present
    if (config.password) {
      try {
        decrypted.password = this.vault ? await this.vault.decrypt(config.password) : config.password;
      } catch (error) {
        this.logger.warn('Failed to decrypt password, using as-is', {
          connectionId: config.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Decrypt API key if present
    if (config.apiKey) {
      try {
        decrypted.apiKey = this.vault ? await this.vault.decrypt(config.apiKey) : config.apiKey;
      } catch (error) {
        this.logger.warn('Failed to decrypt API key, using as-is', {
          connectionId: config.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Decrypt any sensitive configuration fields
    if (config.configuration?.credentials) {
      try {
        decrypted.configuration.credentials = this.vault ? await this.vault.decrypt(config.configuration.credentials) : config.configuration.credentials;
      } catch (error) {
        this.logger.warn('Failed to decrypt credentials, using as-is', {
          connectionId: config.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return decrypted;
  }

  /**
   * Apply default configuration values
   */
  private static applyDefaults(config: ConnectionConfig): ConnectionConfig {
    const defaults: Partial<ConnectionConfig> = {
      maxRetries: config.maxRetries ?? 3,
      retryDelay: config.retryDelay ?? 1000,
      connectionTimeout: config.connectionTimeout ?? 30000,
      queryTimeout: config.queryTimeout ?? 60000,
      poolSize: config.poolSize ?? 10,
    };

    // Apply type-specific defaults
    switch (config.type) {
      case DataSourceType.POSTGRESQL:
        return {
          ...defaults,
          port: config.port ?? 5432,
          ssl: config.ssl ?? false,
          ...config,
        };

      case DataSourceType.MYSQL:
        return {
          ...defaults,
          port: config.port ?? 3306,
          ssl: config.ssl ?? false,
          ...config,
        };

      case DataSourceType.MONGODB:
        return {
          ...defaults,
          port: config.port ?? 27017,
          ssl: config.ssl ?? false,
          ...config,
        };

      case DataSourceType.REST_API:
      case DataSourceType.GRAPHQL:
        return {
          ...defaults,
          configuration: {
            method: 'GET',
            headers: {},
            timeout: 30000,
            ...config.configuration,
          },
          ...config,
        };

      case DataSourceType.S3:
        return {
          ...defaults,
          configuration: {
            maxKeys: 1000,
            ...config.configuration,
          },
          ...config,
        };

      case DataSourceType.CSV_FILE:
        return {
          ...defaults,
          configuration: {
            delimiter: ',',
            encoding: 'utf8',
            hasHeaders: true,
            ...config.configuration,
          },
          ...config,
        };

      default:
        return {
          ...defaults,
          ...config,
        };
    }
  }

  /**
   * Get list of supported connector types
   */
  public static getSupportedTypes(): DataSourceType[] {
    return Array.from(connectorRegistry.keys());
  }

  /**
   * Check if a connector type is supported
   */
  public static isSupported(type: DataSourceType): boolean {
    return connectorRegistry.has(type);
  }

  /**
   * Get connector metadata
   */
  public static getConnectorMetadata(type: DataSourceType): object | null {
    const ConnectorClass = connectorRegistry.get(type);
    if (!ConnectorClass) {
      return null;
    }

    // Return static metadata if available
    return {
      type,
      available: true,
      // Add more metadata as needed
    };
  }
}