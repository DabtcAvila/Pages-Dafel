/**
 * Enterprise Logger
 * Structured logging with multiple transports
 * @module lib/monitoring/Logger
 */

import winston from 'winston';
import { hostname } from 'os';

/**
 * Log levels
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

/**
 * Log context interface
 */
export interface LogContext {
  [key: string]: any;
  correlationId?: string;
  userId?: string;
  connectionId?: string;
  requestId?: string;
  duration?: number;
}

/**
 * Enterprise Logger with structured logging
 */
export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;
  private defaultMeta: object;

  private constructor() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');

    // Default metadata
    this.defaultMeta = {
      service: 'data-connections',
      hostname: hostname(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '0.0.0',
    };

    // Create logger instance
    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss.SSS',
        }),
        winston.format.errors({ stack: true }),
        winston.format.metadata({
          fillExcept: ['message', 'level', 'timestamp', 'label'],
        }),
        winston.format.json()
      ),
      defaultMeta: this.defaultMeta,
      transports: this.createTransports(isDevelopment),
      exceptionHandlers: [
        new winston.transports.File({ 
          filename: 'logs/exceptions.log',
          level: 'error',
        }),
      ],
      rejectionHandlers: [
        new winston.transports.File({ 
          filename: 'logs/rejections.log',
          level: 'error',
        }),
      ],
    });

    // Add request ID to all logs if available
    this.logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, metadata }) => {
          const meta = metadata ? ` ${JSON.stringify(metadata)}` : '';
          return `${timestamp} [${level}]: ${message}${meta}`;
        })
      ),
    }));
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Create transports based on environment
   */
  private createTransports(isDevelopment: boolean): winston.transport[] {
    const transports: winston.transport[] = [];

    if (isDevelopment) {
      // Console transport for development
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        })
      );
    } else {
      // File transports for production
      transports.push(
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        })
      );

      // Console transport for production (structured JSON)
      transports.push(
        new winston.transports.Console({
          format: winston.format.json(),
        })
      );
    }

    return transports;
  }

  /**
   * Log error message
   */
  public error(message: string, context?: LogContext): void {
    this.logger.error(message, this.enrichContext(context));
  }

  /**
   * Log warning message
   */
  public warn(message: string, context?: LogContext): void {
    this.logger.warn(message, this.enrichContext(context));
  }

  /**
   * Log info message
   */
  public info(message: string, context?: LogContext): void {
    this.logger.info(message, this.enrichContext(context));
  }

  /**
   * Log http message
   */
  public http(message: string, context?: LogContext): void {
    this.logger.http(message, this.enrichContext(context));
  }

  /**
   * Log verbose message
   */
  public verbose(message: string, context?: LogContext): void {
    this.logger.verbose(message, this.enrichContext(context));
  }

  /**
   * Log debug message
   */
  public debug(message: string, context?: LogContext): void {
    this.logger.debug(message, this.enrichContext(context));
  }

  /**
   * Log silly message
   */
  public silly(message: string, context?: LogContext): void {
    this.logger.silly(message, this.enrichContext(context));
  }

  /**
   * Create child logger with additional context
   */
  public child(context: LogContext): Logger {
    const childLogger = Object.create(this);
    childLogger.defaultMeta = { ...this.defaultMeta, ...context };
    return childLogger;
  }

  /**
   * Profile a function execution
   */
  public async profile<T>(
    label: string,
    fn: () => Promise<T>,
    context?: LogContext
  ): Promise<T> {
    const startTime = Date.now();
    const profileId = `${label}-${Date.now()}-${Math.random()}`;

    this.debug(`Starting profile: ${label}`, { 
      ...context, 
      profileId,
      profileLabel: label,
    });

    try {
      const result = await fn();
      const duration = Date.now() - startTime;

      this.debug(`Profile complete: ${label}`, {
        ...context,
        profileId,
        profileLabel: label,
        duration,
        success: true,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.error(`Profile failed: ${label}`, {
        ...context,
        profileId,
        profileLabel: label,
        duration,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  /**
   * Start a timer for measuring duration
   */
  public startTimer(): () => number {
    const startTime = Date.now();
    return () => Date.now() - startTime;
  }

  /**
   * Enrich context with additional metadata
   */
  private enrichContext(context?: LogContext): object {
    const enriched: any = {
      timestamp: new Date().toISOString(),
      ...context,
    };

    // Add memory usage in production
    if (process.env.NODE_ENV === 'production') {
      const memUsage = process.memoryUsage();
      enriched.memory = {
        rss: Math.round(memUsage.rss / 1024 / 1024), // MB
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      };
    }

    // Add CPU usage if available
    if (process.cpuUsage) {
      const cpuUsage = process.cpuUsage();
      enriched.cpu = {
        user: Math.round(cpuUsage.user / 1000), // ms
        system: Math.round(cpuUsage.system / 1000), // ms
      };
    }

    return enriched;
  }

  /**
   * Flush all logs
   */
  public async flush(): Promise<void> {
    return new Promise((resolve) => {
      this.logger.end(() => resolve());
    });
  }

  /**
   * Query logs (for development/debugging)
   */
  public query(options: winston.QueryOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      this.logger.query(options, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  /**
   * Set log level dynamically
   */
  public setLevel(level: LogLevel): void {
    this.logger.level = level;
  }

  /**
   * Get current log level
   */
  public getLevel(): string {
    return this.logger.level;
  }

  /**
   * Add custom transport
   */
  public addTransport(transport: winston.transport): void {
    this.logger.add(transport);
  }

  /**
   * Remove transport
   */
  public removeTransport(transport: winston.transport): void {
    this.logger.remove(transport);
  }

  /**
   * Clear all transports
   */
  public clearTransports(): void {
    this.logger.clear();
  }
}