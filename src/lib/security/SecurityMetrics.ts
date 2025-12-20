/**
 * Enterprise Security Metrics and Monitoring
 * Real-time security metrics collection and analysis
 * @module lib/security/SecurityMetrics
 */

import { Logger } from '../monitoring/Logger';

export interface SecurityMetric {
  timestamp: Date;
  metric: string;
  value: number;
  tags: Record<string, string>;
}

export interface SecurityAlert {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  source: string;
  resolved: boolean;
  resolvedAt?: Date;
  metadata: Record<string, any>;
}

export interface ComplianceCheck {
  standard: 'SOC2' | 'GDPR' | 'PCI_DSS' | 'ISO27001';
  control: string;
  status: 'compliant' | 'non_compliant' | 'partial' | 'unknown';
  lastCheck: Date;
  evidence?: string;
  remediation?: string;
}

export class SecurityMetrics {
  private logger: Logger;
  private metrics: SecurityMetric[] = [];
  private alerts: Map<string, SecurityAlert> = new Map();
  private complianceChecks: Map<string, ComplianceCheck> = new Map();
  private counters: Map<string, number> = new Map();

  // Alert thresholds
  private alertThresholds = {
    authentication_failures_per_minute: 10,
    blocked_ips_threshold: 50,
    high_severity_events_per_hour: 5,
    critical_events_per_hour: 1,
    failed_compliance_checks: 3,
    average_response_time_ms: 5000,
    error_rate_percentage: 5
  };

  constructor() {
    this.logger = Logger.getInstance();
    this.initializeComplianceChecks();
    this.startMetricsCollection();
    this.logger.info('Security Metrics initialized');
  }

  /**
   * Record a security event for metrics
   */
  public recordSecurityEvent(event: any): void {
    const timestamp = new Date();
    const tags = {
      type: event.type,
      severity: event.severity,
      source: event.source || 'unknown',
      blocked: event.blocked.toString()
    };

    // Record general metrics
    this.recordMetric('security_events_total', 1, tags);
    this.recordMetric(`security_events_${event.severity}`, 1, tags);
    this.recordMetric(`security_events_${event.type}`, 1, tags);

    if (event.blocked) {
      this.recordMetric('security_events_blocked', 1, tags);
    }

    // Update counters for alerting
    this.incrementCounter(`${event.severity}_events_last_hour`);
    if (!event.success && event.type.includes('authentication')) {
      this.incrementCounter('auth_failures_last_minute');
    }

    // Check for alert conditions
    this.checkAlertConditions();
  }

  /**
   * Record a custom security metric
   */
  public recordMetric(metric: string, value: number, tags: Record<string, string> = {}): void {
    this.metrics.push({
      timestamp: new Date(),
      metric,
      value,
      tags: { ...tags, environment: process.env.NODE_ENV || 'development' }
    });

    // Keep only last 24 hours of metrics
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.metrics = this.metrics.filter(m => m.timestamp > oneDayAgo);
  }

  /**
   * Create a security alert
   */
  public createAlert(
    level: 'info' | 'warning' | 'critical',
    title: string,
    description: string,
    source: string,
    metadata: Record<string, any> = {}
  ): string {
    const alertId = this.generateAlertId();
    const alert: SecurityAlert = {
      id: alertId,
      timestamp: new Date(),
      level,
      title,
      description,
      source,
      resolved: false,
      metadata
    };

    this.alerts.set(alertId, alert);

    this.logger.warn('Security alert created', {
      alertId,
      level,
      title,
      source
    });

    // Record alert metric
    this.recordMetric('security_alerts_total', 1, { level, source });

    return alertId;
  }

  /**
   * Resolve a security alert
   */
  public resolveAlert(alertId: string, resolution?: string): boolean {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;

    alert.resolved = true;
    alert.resolvedAt = new Date();
    if (resolution) {
      alert.metadata.resolution = resolution;
    }

    this.alerts.set(alertId, alert);
    this.logger.info('Security alert resolved', { alertId, resolution });

    return true;
  }

  /**
   * Get security metrics summary
   */
  public getMetricsSummary(timeRange: { start: Date; end: Date }): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    blockedEvents: number;
    averageEventsPerHour: number;
    topSources: Array<{ source: string; count: number }>;
  } {
    const filteredMetrics = this.metrics.filter(m => 
      m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
    );

    const eventMetrics = filteredMetrics.filter(m => m.metric === 'security_events_total');
    const totalEvents = eventMetrics.reduce((sum, m) => sum + m.value, 0);

    const eventsByType: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};
    const sourceCount: Record<string, number> = {};
    let blockedEvents = 0;

    filteredMetrics.forEach(metric => {
      if (metric.metric.startsWith('security_events_')) {
        if (metric.tags.type) {
          eventsByType[metric.tags.type] = (eventsByType[metric.tags.type] || 0) + metric.value;
        }
        if (metric.tags.severity) {
          eventsBySeverity[metric.tags.severity] = (eventsBySeverity[metric.tags.severity] || 0) + metric.value;
        }
        if (metric.tags.source) {
          sourceCount[metric.tags.source] = (sourceCount[metric.tags.source] || 0) + metric.value;
        }
        if (metric.metric === 'security_events_blocked') {
          blockedEvents += metric.value;
        }
      }
    });

    const hoursInRange = (timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60);
    const averageEventsPerHour = hoursInRange > 0 ? totalEvents / hoursInRange : 0;

    const topSources = Object.entries(sourceCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([source, count]) => ({ source, count }));

    return {
      totalEvents,
      eventsByType,
      eventsBySeverity,
      blockedEvents,
      averageEventsPerHour,
      topSources
    };
  }

  /**
   * Get active alerts
   */
  public getActiveAlerts(): SecurityAlert[] {
    return Array.from(this.alerts.values())
      .filter(alert => !alert.resolved)
      .sort((a, b) => {
        const levelPriority = { critical: 3, warning: 2, info: 1 };
        const aPriority = levelPriority[a.level];
        const bPriority = levelPriority[b.level];
        if (aPriority !== bPriority) return bPriority - aPriority;
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
  }

  /**
   * Update compliance check status
   */
  public updateComplianceCheck(
    standard: 'SOC2' | 'GDPR' | 'PCI_DSS' | 'ISO27001',
    control: string,
    status: 'compliant' | 'non_compliant' | 'partial' | 'unknown',
    evidence?: string,
    remediation?: string
  ): void {
    const key = `${standard}_${control}`;
    const check: ComplianceCheck = {
      standard,
      control,
      status,
      lastCheck: new Date(),
      evidence,
      remediation
    };

    this.complianceChecks.set(key, check);
    this.recordMetric('compliance_check', 1, { 
      standard, 
      control, 
      status,
      compliant: (status === 'compliant').toString()
    });

    if (status === 'non_compliant') {
      this.createAlert(
        'warning',
        'Compliance Violation',
        `${standard} control ${control} is non-compliant`,
        'compliance_monitor',
        { standard, control, remediation }
      );
    }
  }

  /**
   * Get compliance status summary
   */
  public getComplianceStatus(): {
    overview: Record<string, { compliant: number; total: number; percentage: number }>;
    failedChecks: ComplianceCheck[];
    lastUpdated: Date;
  } {
    const checks = Array.from(this.complianceChecks.values());
    const overview: Record<string, { compliant: number; total: number; percentage: number }> = {};
    const failedChecks = checks.filter(check => check.status === 'non_compliant');

    // Group by standard
    ['SOC2', 'GDPR', 'PCI_DSS', 'ISO27001'].forEach(standard => {
      const standardChecks = checks.filter(check => check.standard === standard);
      const compliantChecks = standardChecks.filter(check => check.status === 'compliant');
      const total = standardChecks.length;
      const compliant = compliantChecks.length;
      const percentage = total > 0 ? Math.round((compliant / total) * 100) : 0;

      overview[standard] = { compliant, total, percentage };
    });

    const lastUpdated = checks.reduce((latest, check) => 
      check.lastCheck > latest ? check.lastCheck : latest, new Date(0)
    );

    return { overview, failedChecks, lastUpdated };
  }

  /**
   * Generate security report
   */
  public generateSecurityReport(timeRange: { start: Date; end: Date }): {
    summary: any;
    alerts: SecurityAlert[];
    compliance: any;
    recommendations: string[];
  } {
    const summary = this.getMetricsSummary(timeRange);
    const alerts = Array.from(this.alerts.values())
      .filter(alert => alert.timestamp >= timeRange.start && alert.timestamp <= timeRange.end);
    const compliance = this.getComplianceStatus();
    const recommendations = this.generateRecommendations(summary, alerts, compliance);

    return { summary, alerts, compliance, recommendations };
  }

  private generateRecommendations(summary: any, alerts: SecurityAlert[], compliance: any): string[] {
    const recommendations: string[] = [];

    // High event volume
    if (summary.averageEventsPerHour > 100) {
      recommendations.push('High security event volume detected. Consider reviewing and tuning detection rules.');
    }

    // High block rate
    const blockRate = summary.totalEvents > 0 ? (summary.blockedEvents / summary.totalEvents) * 100 : 0;
    if (blockRate > 50) {
      recommendations.push('High block rate suggests aggressive filtering. Review false positive rates.');
    }

    // Critical alerts
    const criticalAlerts = alerts.filter(alert => alert.level === 'critical');
    if (criticalAlerts.length > 0) {
      recommendations.push(`${criticalAlerts.length} critical alerts require immediate attention.`);
    }

    // Compliance issues
    const failedChecks = compliance.failedChecks.length;
    if (failedChecks > 0) {
      recommendations.push(`${failedChecks} compliance violations need remediation.`);
    }

    // Low compliance scores
    Object.entries(compliance.overview).forEach(([standard, stats]: [string, any]) => {
      if (stats.percentage < 80) {
        recommendations.push(`${standard} compliance is at ${stats.percentage}%. Immediate action required.`);
      }
    });

    return recommendations;
  }

  private initializeComplianceChecks(): void {
    // SOC 2 Type II Controls
    const soc2Controls = [
      'CC1.1 - Control Environment',
      'CC2.1 - Communication and Information',
      'CC3.1 - Risk Assessment',
      'CC4.1 - Monitoring Activities',
      'CC5.1 - Control Activities',
      'CC6.1 - Logical and Physical Access',
      'CC7.1 - System Operations',
      'CC8.1 - Change Management',
      'A1.1 - Availability'
    ];

    // GDPR Requirements
    const gdprControls = [
      'Art.25 - Data Protection by Design',
      'Art.32 - Security of Processing',
      'Art.33 - Breach Notification',
      'Art.35 - Data Protection Impact Assessment',
      'Art.37 - Data Protection Officer'
    ];

    // PCI DSS Requirements
    const pciControls = [
      'Req.1 - Firewall Configuration',
      'Req.2 - Default Passwords',
      'Req.3 - Cardholder Data Protection',
      'Req.4 - Data Transmission Encryption',
      'Req.8 - User Access Management',
      'Req.11 - Security Testing'
    ];

    // Initialize all checks as unknown
    [...soc2Controls, ...gdprControls, ...pciControls].forEach(control => {
      const [standard] = control.includes('CC') || control.includes('A1') ? ['SOC2'] : 
                        control.includes('Art') ? ['GDPR'] : ['PCI_DSS'];
      
      this.updateComplianceCheck(
        standard as any,
        control,
        'unknown',
        'Initial setup - requires assessment'
      );
    });
  }

  private incrementCounter(key: string): void {
    this.counters.set(key, (this.counters.get(key) || 0) + 1);
  }

  private checkAlertConditions(): void {
    // Check authentication failures
    const authFailures = this.counters.get('auth_failures_last_minute') || 0;
    if (authFailures >= this.alertThresholds.authentication_failures_per_minute) {
      this.createAlert(
        'warning',
        'High Authentication Failure Rate',
        `${authFailures} authentication failures in the last minute`,
        'metrics_monitor',
        { count: authFailures, threshold: this.alertThresholds.authentication_failures_per_minute }
      );
    }

    // Check critical events
    const criticalEvents = this.counters.get('critical_events_last_hour') || 0;
    if (criticalEvents >= this.alertThresholds.critical_events_per_hour) {
      this.createAlert(
        'critical',
        'Critical Security Events Detected',
        `${criticalEvents} critical security events in the last hour`,
        'metrics_monitor',
        { count: criticalEvents, threshold: this.alertThresholds.critical_events_per_hour }
      );
    }
  }

  private startMetricsCollection(): void {
    // Reset minute counters every minute
    setInterval(() => {
      this.counters.delete('auth_failures_last_minute');
    }, 60000);

    // Reset hour counters every hour
    setInterval(() => {
      this.counters.delete('critical_events_last_hour');
      this.counters.delete('high_severity_events_last_hour');
    }, 3600000);

    // System metrics collection every 5 minutes
    setInterval(() => {
      this.collectSystemMetrics();
    }, 5 * 60000);
  }

  private collectSystemMetrics(): void {
    const tags = { source: 'system_monitor' };

    // Memory usage
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memory = process.memoryUsage();
      this.recordMetric('system_memory_usage_mb', memory.heapUsed / 1024 / 1024, tags);
      this.recordMetric('system_memory_total_mb', memory.heapTotal / 1024 / 1024, tags);
    }

    // Active alerts count
    this.recordMetric('security_alerts_active', this.getActiveAlerts().length, tags);

    // Compliance score
    const compliance = this.getComplianceStatus();
    Object.entries(compliance.overview).forEach(([standard, stats]: [string, any]) => {
      this.recordMetric('compliance_percentage', stats.percentage, { 
        ...tags, 
        standard: standard.toLowerCase() 
      });
    });
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Export metrics in Prometheus format
   */
  public exportPrometheusMetrics(): string {
    const lines: string[] = [];
    const metricGroups = new Map<string, SecurityMetric[]>();

    // Group metrics by name
    this.metrics.forEach(metric => {
      if (!metricGroups.has(metric.metric)) {
        metricGroups.set(metric.metric, []);
      }
      metricGroups.get(metric.metric)!.push(metric);
    });

    // Generate Prometheus format
    metricGroups.forEach((metrics, metricName) => {
      const latest = metrics[metrics.length - 1];
      const tagsString = Object.entries(latest.tags)
        .map(([key, value]) => `${key}="${value}"`)
        .join(',');
      
      lines.push(`# TYPE ${metricName} counter`);
      lines.push(`${metricName}{${tagsString}} ${latest.value}`);
    });

    return lines.join('\n');
  }

  public getMetrics(): any {
    return {
      recent: this.metrics.slice(-100),
      alerts: this.getActiveAlerts(),
      compliance: this.getComplianceStatus(),
      counters: Object.fromEntries(this.counters)
    };
  }
}