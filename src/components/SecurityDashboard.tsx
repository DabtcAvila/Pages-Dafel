'use client';

/**
 * Enterprise Security Dashboard
 * Real-time security monitoring and management interface
 */

import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface SecurityMetric {
  label: string;
  value: number | string;
  status: 'healthy' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  change?: string;
}

interface SecurityAlert {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  source: string;
  resolved: boolean;
}

interface ComplianceStatus {
  standard: string;
  compliant: number;
  total: number;
  percentage: number;
  status: 'compliant' | 'partial' | 'non_compliant';
}

interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  description: string;
  blocked: boolean;
}

export function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [compliance, setCompliance] = useState<ComplianceStatus[]>([]);
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = async () => {
    try {
      // In a real implementation, these would be separate API calls
      const [metricsRes, alertsRes, complianceRes, eventsRes] = await Promise.all([
        fetch('/api/security/metrics'),
        fetch('/api/security/alerts'),
        fetch('/api/security/compliance'),
        fetch('/api/security/events?limit=10')
      ]);

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(transformMetricsData(metricsData));
      }

      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData);
      }

      if (complianceRes.ok) {
        const complianceData = await complianceRes.json();
        setCompliance(transformComplianceData(complianceData));
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setRecentEvents(eventsData);
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const transformMetricsData = (data: any): SecurityMetric[] => {
    return [
      {
        label: 'Security Events (24h)',
        value: data.totalEvents || 0,
        status: data.totalEvents > 100 ? 'warning' : 'healthy',
        trend: 'stable',
        change: '+12%'
      },
      {
        label: 'Blocked Threats',
        value: data.blockedEvents || 0,
        status: data.blockedEvents > 50 ? 'warning' : 'healthy',
        trend: 'down',
        change: '-5%'
      },
      {
        label: 'Active Alerts',
        value: data.activeAlerts || 0,
        status: data.activeAlerts > 5 ? 'critical' : data.activeAlerts > 0 ? 'warning' : 'healthy',
        trend: 'stable'
      },
      {
        label: 'Average Response Time',
        value: `${data.avgResponseTime || 150}ms`,
        status: (data.avgResponseTime || 150) > 1000 ? 'warning' : 'healthy',
        trend: 'stable'
      },
      {
        label: 'Failed Login Attempts',
        value: data.failedLogins || 0,
        status: data.failedLogins > 20 ? 'critical' : data.failedLogins > 5 ? 'warning' : 'healthy',
        trend: 'up',
        change: '+8%'
      },
      {
        label: 'Compliance Score',
        value: `${data.complianceScore || 85}%`,
        status: (data.complianceScore || 85) < 80 ? 'critical' : (data.complianceScore || 85) < 90 ? 'warning' : 'healthy',
        trend: 'up',
        change: '+2%'
      }
    ];
  };

  const transformComplianceData = (data: any): ComplianceStatus[] => {
    return Object.entries(data.overview || {}).map(([standard, stats]: [string, any]) => ({
      standard,
      compliant: stats.compliant,
      total: stats.total,
      percentage: stats.percentage,
      status: stats.percentage >= 90 ? 'compliant' : stats.percentage >= 70 ? 'partial' : 'non_compliant'
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': case 'compliant': return 'text-green-600 bg-green-100';
      case 'warning': case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'critical': case 'non_compliant': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600 bg-blue-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      await fetch(`/api/security/alerts/${alertId}/resolve`, { method: 'POST' });
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      ));
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Dashboard</h1>
          <p className="text-gray-600">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadSecurityData} variant="outline">
            Refresh
          </Button>
          <Button>Export Report</Button>
        </div>
      </div>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                  {metric.change && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      metric.trend === 'up' ? 'text-green-600 bg-green-100' :
                      metric.trend === 'down' ? 'text-red-600 bg-red-100' :
                      'text-gray-600 bg-gray-100'
                    }`}>
                      {metric.change}
                    </span>
                  )}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                {metric.status}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Alerts</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.filter(alert => !alert.resolved).slice(0, 10).map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getSeverityColor(alert.level)}>
                      {alert.level}
                    </Badge>
                    <span className="text-xs text-gray-500">{alert.source}</span>
                  </div>
                  <h3 className="font-medium text-gray-900">{alert.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {alert.timestamp.toLocaleString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resolveAlert(alert.id)}
                >
                  Resolve
                </Button>
              </div>
            ))}
            {alerts.filter(alert => !alert.resolved).length === 0 && (
              <p className="text-gray-500 text-center py-8">No active alerts</p>
            )}
          </div>
        </Card>

        {/* Compliance Status */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Compliance Status</h2>
          <div className="space-y-4">
            {compliance.map((item) => (
              <div key={item.standard} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{item.standard}</span>
                    <span className="text-sm text-gray-600">
                      {item.compliant}/{item.total} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.status === 'compliant' ? 'bg-green-500' :
                        item.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <Badge className={`ml-3 ${getStatusColor(item.status)}`}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Security Events</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Time</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Type</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Severity</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Source</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Description</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event) => (
                <tr key={event.id} className="border-b border-gray-100">
                  <td className="py-2 px-3 text-xs text-gray-600">
                    {event.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-900">{event.type}</td>
                  <td className="py-2 px-3">
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-600">{event.source}</td>
                  <td className="py-2 px-3 text-sm text-gray-600 max-w-xs truncate">
                    {event.description}
                  </td>
                  <td className="py-2 px-3">
                    <Badge className={event.blocked ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'}>
                      {event.blocked ? 'Blocked' : 'Allowed'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}