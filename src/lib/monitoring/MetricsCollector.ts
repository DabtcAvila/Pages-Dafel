/**
 * Metrics Collector
 * Prometheus-compatible metrics collection
 * @module lib/monitoring/MetricsCollector
 */

import { Registry, Counter, Histogram, Gauge, Summary, register } from 'prom-client';
import { DataSourceType } from '@prisma/client';
import { ConnectionMetrics } from '../connections/types';

/**
 * Metric labels
 */
interface MetricLabels {
  type?: string;
  status?: 'success' | 'failure';
  operation?: string;
  error_type?: string;
}

/**
 * Enterprise Metrics Collector
 * Collects and exposes metrics in Prometheus format
 */
export class MetricsCollector {
  private static instance: MetricsCollector;
  private registry: Registry;

  // Connection metrics
  private connectionsTotal: Counter<string>;
  private connectionsActive: Gauge<string>;
  private connectionDuration: Histogram<string>;
  private connectionErrors: Counter<string>;

  // Query metrics
  private queriesTotal: Counter<string>;
  private queryDuration: Histogram<string>;
  private queryErrors: Counter<string>;
  private queriesActive: Gauge<string>;

  // Pool metrics
  private poolSize: Gauge<string>;
  private poolAvailable: Gauge<string>;
  private poolBorrowed: Gauge<string>;
  private poolPending: Gauge<string>;
  private poolAcquisitionDuration: Histogram<string>;

  // Sync metrics
  private syncsTotal: Counter<string>;
  private syncDuration: Histogram<string>;
  private syncRecords: Counter<string>;
  private syncErrors: Counter<string>;

  // System metrics
  private systemMemory: Gauge<string>;
  private systemCpu: Gauge<string>;
  private systemUptime: Gauge<string>;

  private constructor() {
    this.registry = new Registry();

    // Initialize connection metrics
    this.connectionsTotal = new Counter({
      name: 'datasource_connections_total',
      help: 'Total number of connection attempts',
      labelNames: ['type', 'status'],
      registers: [this.registry],
    });

    this.connectionsActive = new Gauge({
      name: 'datasource_connections_active',
      help: 'Number of active connections',
      labelNames: ['type'],
      registers: [this.registry],
    });

    this.connectionDuration = new Histogram({
      name: 'datasource_connection_duration_seconds',
      help: 'Connection establishment duration in seconds',
      labelNames: ['type', 'status'],
      buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
      registers: [this.registry],
    });

    this.connectionErrors = new Counter({
      name: 'datasource_connection_errors_total',
      help: 'Total number of connection errors',
      labelNames: ['type', 'error_type'],
      registers: [this.registry],
    });

    // Initialize query metrics
    this.queriesTotal = new Counter({
      name: 'datasource_queries_total',
      help: 'Total number of queries executed',
      labelNames: ['type', 'operation', 'status'],
      registers: [this.registry],
    });

    this.queryDuration = new Histogram({
      name: 'datasource_query_duration_seconds',
      help: 'Query execution duration in seconds',
      labelNames: ['type', 'operation'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10, 30, 60],
      registers: [this.registry],
    });

    this.queryErrors = new Counter({
      name: 'datasource_query_errors_total',
      help: 'Total number of query errors',
      labelNames: ['type', 'operation', 'error_type'],
      registers: [this.registry],
    });

    this.queriesActive = new Gauge({
      name: 'datasource_queries_active',
      help: 'Number of active queries',
      labelNames: ['type'],
      registers: [this.registry],
    });

    // Initialize pool metrics
    this.poolSize = new Gauge({
      name: 'datasource_pool_size',
      help: 'Current pool size',
      labelNames: ['type'],
      registers: [this.registry],
    });

    this.poolAvailable = new Gauge({
      name: 'datasource_pool_available',
      help: 'Number of available connections in pool',
      labelNames: ['type'],
      registers: [this.registry],
    });

    this.poolBorrowed = new Gauge({
      name: 'datasource_pool_borrowed',
      help: 'Number of borrowed connections from pool',
      labelNames: ['type'],
      registers: [this.registry],
    });

    this.poolPending = new Gauge({
      name: 'datasource_pool_pending',
      help: 'Number of pending connection requests',
      labelNames: ['type'],
      registers: [this.registry],
    });

    this.poolAcquisitionDuration = new Histogram({
      name: 'datasource_pool_acquisition_duration_seconds',
      help: 'Time to acquire connection from pool in seconds',
      labelNames: ['type', 'status'],
      buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
      registers: [this.registry],
    });

    // Initialize sync metrics
    this.syncsTotal = new Counter({
      name: 'datasource_syncs_total',
      help: 'Total number of sync operations',
      labelNames: ['type', 'mode', 'status'],
      registers: [this.registry],
    });

    this.syncDuration = new Histogram({
      name: 'datasource_sync_duration_seconds',
      help: 'Sync operation duration in seconds',
      labelNames: ['type', 'mode'],
      buckets: [1, 5, 10, 30, 60, 300, 600, 1800, 3600],
      registers: [this.registry],
    });

    this.syncRecords = new Counter({
      name: 'datasource_sync_records_total',
      help: 'Total number of records synced',
      labelNames: ['type', 'mode', 'operation'],
      registers: [this.registry],
    });

    this.syncErrors = new Counter({
      name: 'datasource_sync_errors_total',
      help: 'Total number of sync errors',
      labelNames: ['type', 'mode', 'error_type'],
      registers: [this.registry],
    });

    // Initialize system metrics
    this.systemMemory = new Gauge({
      name: 'datasource_system_memory_bytes',
      help: 'System memory usage in bytes',
      labelNames: ['type'],
      registers: [this.registry],
    });

    this.systemCpu = new Gauge({
      name: 'datasource_system_cpu_usage',
      help: 'System CPU usage percentage',
      labelNames: ['type'],
      registers: [this.registry],
    });

    this.systemUptime = new Gauge({
      name: 'datasource_system_uptime_seconds',
      help: 'System uptime in seconds',
      registers: [this.registry],
    });

    // Collect default metrics
    register.setDefaultLabels({
      app: 'dafel-data-connections',
    });

    // Start system metrics collection
    this.startSystemMetricsCollection();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  /**
   * Record connection creation
   */
  public recordConnectionCreation(type: string, success: boolean, duration: number): void {
    const labels = { type, status: success ? 'success' : 'failure' };
    this.connectionsTotal.inc(labels);
    this.connectionDuration.observe(labels, duration / 1000);
    if (success) {
      this.connectionsActive.inc({ type });
    }
  }

  /**
   * Record connection close
   */
  public recordConnectionClose(type: string): void {
    this.connectionsActive.dec({ type });
  }

  /**
   * Record connection error
   */
  public recordConnectionError(type: string, errorType: string): void {
    this.connectionErrors.inc({ type, error_type: errorType });
  }

  /**
   * Record query execution
   */
  public recordQueryExecution(
    type: string,
    operation: string,
    success: boolean,
    duration: number
  ): void {
    const labels = { type, operation, status: success ? 'success' : 'failure' };
    this.queriesTotal.inc(labels);
    this.queryDuration.observe({ type, operation }, duration / 1000);
  }

  /**
   * Record active query
   */
  public recordActiveQuery(type: string, increment: boolean): void {
    if (increment) {
      this.queriesActive.inc({ type });
    } else {
      this.queriesActive.dec({ type });
    }
  }

  /**
   * Record query error
   */
  public recordQueryError(type: string, operation: string, errorType: string): void {
    this.queryErrors.inc({ type, operation, error_type: errorType });
  }

  /**
   * Record pool metrics
   */
  public recordPoolMetrics(
    type: string,
    stats: {
      size: number;
      available: number;
      borrowed: number;
      pending: number;
    }
  ): void {
    this.poolSize.set({ type }, stats.size);
    this.poolAvailable.set({ type }, stats.available);
    this.poolBorrowed.set({ type }, stats.borrowed);
    this.poolPending.set({ type }, stats.pending);
  }

  /**
   * Record pool acquisition
   */
  public recordPoolAcquisition(type: string, success: boolean, duration: number): void {
    const labels = { type, status: success ? 'success' : 'failure' };
    this.poolAcquisitionDuration.observe(labels, duration / 1000);
  }

  /**
   * Record sync operation
   */
  public recordSyncOperation(
    type: string,
    mode: string,
    success: boolean,
    duration: number,
    recordCount?: number
  ): void {
    const labels = { type, mode, status: success ? 'success' : 'failure' };
    this.syncsTotal.inc(labels);
    this.syncDuration.observe({ type, mode }, duration / 1000);
    if (recordCount) {
      this.syncRecords.inc({ type, mode, operation: 'processed' }, recordCount);
    }
  }

  /**
   * Record sync error
   */
  public recordSyncError(type: string, mode: string, errorType: string): void {
    this.syncErrors.inc({ type, mode, error_type: errorType });
  }

  /**
   * Record error
   */
  public recordError(type: string): void {
    this.connectionErrors.inc({ type, error_type: 'general' });
  }

  /**
   * Record snapshot metrics
   */
  public recordSnapshot(metrics: any): void {
    // Record any custom snapshot metrics
  }

  /**
   * Get metrics in Prometheus format
   */
  public async getPrometheusMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  /**
   * Get metrics as JSON
   */
  public async getJSONMetrics(): Promise<any> {
    return this.registry.getMetricsAsJSON();
  }

  /**
   * Get connection metrics
   */
  public getMetrics(): ConnectionMetrics {
    // Get current values from gauges
    const metrics: ConnectionMetrics = {
      connectionsTotal: (this.connectionsTotal as any)._values.size || 0,
      connectionsActive: (this.connectionsActive as any)._values.size || 0,
      connectionsFailed: (this.connectionErrors as any)._values.size || 0,
      queriesTotal: (this.queriesTotal as any)._values.size || 0,
      queriesActive: (this.queriesActive as any)._values.size || 0,
      queriesFailed: (this.queryErrors as any)._values.size || 0,
      queryDurationSeconds: [],
      connectionDurationSeconds: [],
      errorRate: 0,
      throughput: 0,
    };

    // Calculate error rate
    if (metrics.queriesTotal > 0) {
      metrics.errorRate = metrics.queriesFailed / metrics.queriesTotal;
    }

    return metrics;
  }

  /**
   * Reset all metrics
   */
  public reset(): void {
    this.registry.resetMetrics();
  }

  /**
   * Start system metrics collection
   */
  private startSystemMetricsCollection(): void {
    setInterval(() => {
      // Collect memory metrics
      const memUsage = process.memoryUsage();
      this.systemMemory.set({ type: 'rss' }, memUsage.rss);
      this.systemMemory.set({ type: 'heap_used' }, memUsage.heapUsed);
      this.systemMemory.set({ type: 'heap_total' }, memUsage.heapTotal);
      this.systemMemory.set({ type: 'external' }, memUsage.external);

      // Collect CPU metrics
      if (process.cpuUsage) {
        const cpuUsage = process.cpuUsage();
        const totalCpu = cpuUsage.user + cpuUsage.system;
        this.systemCpu.set({ type: 'user' }, cpuUsage.user / 1000000);
        this.systemCpu.set({ type: 'system' }, cpuUsage.system / 1000000);
        this.systemCpu.set({ type: 'total' }, totalCpu / 1000000);
      }

      // Collect uptime
      this.systemUptime.set({}, process.uptime());
    }, 30000); // Every 30 seconds
  }

  /**
   * Create custom metric
   */
  public createCustomMetric(
    type: 'counter' | 'gauge' | 'histogram' | 'summary',
    name: string,
    help: string,
    labelNames?: string[]
  ): Counter | Gauge | Histogram | Summary {
    const metricConfig = {
      name,
      help,
      labelNames: labelNames || [],
      registers: [this.registry],
    };

    switch (type) {
      case 'counter':
        return new Counter(metricConfig);
      case 'gauge':
        return new Gauge(metricConfig);
      case 'histogram':
        return new Histogram({
          ...metricConfig,
          buckets: [0.1, 0.5, 1, 2, 5, 10],
        });
      case 'summary':
        return new Summary({
          ...metricConfig,
          percentiles: [0.5, 0.9, 0.99],
        });
      default:
        throw new Error(`Invalid metric type: ${type}`);
    }
  }
}