/**
 * Enterprise Intrusion Detection System
 * Real-time threat detection and automated response
 * @module lib/security/IntrusionDetector
 */

import { Logger } from '../monitoring/Logger';

export enum ThreatType {
  BRUTE_FORCE = 'brute_force',
  SQL_INJECTION = 'sql_injection',
  XSS_ATTACK = 'xss_attack',
  CSRF_ATTACK = 'csrf_attack',
  DATA_EXFILTRATION = 'data_exfiltration',
  PRIVILEGE_ESCALATION = 'privilege_escalation',
  ANOMALOUS_BEHAVIOR = 'anomalous_behavior',
  MALWARE_SIGNATURE = 'malware_signature',
  SUSPICIOUS_FILE_ACCESS = 'suspicious_file_access',
  UNUSUAL_NETWORK_ACTIVITY = 'unusual_network_activity'
}

export interface ThreatSignature {
  id: string;
  type: ThreatType;
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  action: 'log' | 'block' | 'alert';
}

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: ThreatType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  target?: string;
  description: string;
  evidence: any;
  blocked: boolean;
  falsePositive?: boolean;
}

export interface BehaviorBaseline {
  userId: string;
  normalLoginHours: number[];
  typicalEndpoints: string[];
  averageSessionDuration: number;
  commonUserAgents: string[];
  geolocation: { country?: string; region?: string };
  requestFrequency: number;
}

export class IntrusionDetector {
  private logger: Logger;
  private threatSignatures: Map<string, ThreatSignature> = new Map();
  private securityEvents: Map<string, SecurityEvent> = new Map();
  private userBaselines: Map<string, BehaviorBaseline> = new Map();
  private eventCounter: number = 0;

  constructor() {
    this.logger = Logger.getInstance();
    this.initializeThreatSignatures();
    this.startBehaviorAnalysis();
    
    this.logger.info('Intrusion Detection System initialized', {
      signatures: this.threatSignatures.size,
      behaviorAnalysis: true
    });
  }

  private initializeThreatSignatures(): void {
    const signatures: ThreatSignature[] = [
      // SQL Injection Patterns
      {
        id: 'SQL_UNION_ATTACK',
        type: ThreatType.SQL_INJECTION,
        pattern: /(\bunion\b|\bselect\b).*(\bfrom\b|\bwhere\b)/gi,
        severity: 'high',
        description: 'SQL UNION injection attempt detected',
        action: 'block'
      },
      {
        id: 'SQL_COMMENT_ATTACK',
        type: ThreatType.SQL_INJECTION,
        pattern: /(--|\#|\/\*[\s\S]*?\*\/)/g,
        severity: 'medium',
        description: 'SQL comment injection attempt detected',
        action: 'block'
      },
      {
        id: 'SQL_BLIND_INJECTION',
        type: ThreatType.SQL_INJECTION,
        pattern: /(\b(and|or)\b\s+\d+\s*=\s*\d+)|(\b(and|or)\b\s+\d+\s*<\s*\d+)/gi,
        severity: 'high',
        description: 'SQL blind injection attempt detected',
        action: 'block'
      },

      // XSS Attack Patterns
      {
        id: 'XSS_SCRIPT_TAG',
        type: ThreatType.XSS_ATTACK,
        pattern: /<script[^>]*>[\s\S]*?<\/script>/gi,
        severity: 'high',
        description: 'XSS script tag injection detected',
        action: 'block'
      },
      {
        id: 'XSS_EVENT_HANDLER',
        type: ThreatType.XSS_ATTACK,
        pattern: /on\w+\s*=\s*['"]*[^'"]*['"]*/gi,
        severity: 'medium',
        description: 'XSS event handler injection detected',
        action: 'block'
      },
      {
        id: 'XSS_IFRAME_INJECTION',
        type: ThreatType.XSS_ATTACK,
        pattern: /<iframe[^>]*>[\s\S]*?<\/iframe>/gi,
        severity: 'high',
        description: 'XSS iframe injection detected',
        action: 'block'
      },

      // Brute Force Patterns
      {
        id: 'RAPID_LOGIN_ATTEMPTS',
        type: ThreatType.BRUTE_FORCE,
        pattern: /login|auth|signin/gi,
        severity: 'medium',
        description: 'Rapid authentication attempts detected',
        action: 'alert'
      },

      // Data Exfiltration Patterns
      {
        id: 'LARGE_DATA_EXPORT',
        type: ThreatType.DATA_EXFILTRATION,
        pattern: /(export|download|backup|dump)/gi,
        severity: 'medium',
        description: 'Potential data exfiltration attempt',
        action: 'alert'
      },

      // File System Access Patterns
      {
        id: 'PATH_TRAVERSAL',
        type: ThreatType.SUSPICIOUS_FILE_ACCESS,
        pattern: /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e%5c)/gi,
        severity: 'high',
        description: 'Path traversal attempt detected',
        action: 'block'
      },

      // Privilege Escalation
      {
        id: 'ADMIN_ENDPOINT_ACCESS',
        type: ThreatType.PRIVILEGE_ESCALATION,
        pattern: /(\/admin|\/root|sudo|su\s)/gi,
        severity: 'high',
        description: 'Unauthorized admin access attempt',
        action: 'block'
      },

      // Command Injection
      {
        id: 'COMMAND_INJECTION',
        type: ThreatType.SQL_INJECTION, // Reusing for simplicity
        pattern: /(;\s*(ls|cat|pwd|whoami|id|ps|netstat|ifconfig))|(\|\s*(ls|cat|pwd))/gi,
        severity: 'critical',
        description: 'Command injection attempt detected',
        action: 'block'
      }
    ];

    signatures.forEach(sig => this.threatSignatures.set(sig.id, sig));
  }

  /**
   * Analyze incoming request for threats
   */
  public analyzeRequest(data: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: any;
    ip: string;
    userId?: string;
    userAgent: string;
  }): {
    threats: SecurityEvent[];
    shouldBlock: boolean;
    riskScore: number;
  } {
    const threats: SecurityEvent[] = [];
    let totalRiskScore = 0;

    // Analyze URL parameters
    const urlThreats = this.scanForThreats('url', data.url);
    threats.push(...urlThreats);

    // Analyze request body
    if (data.body) {
      const bodyContent = typeof data.body === 'string' ? data.body : JSON.stringify(data.body);
      const bodyThreats = this.scanForThreats('body', bodyContent);
      threats.push(...bodyThreats);
    }

    // Analyze headers
    const headerString = JSON.stringify(data.headers);
    const headerThreats = this.scanForThreats('headers', headerString);
    threats.push(...headerThreats);

    // Behavior analysis
    if (data.userId) {
      const behaviorThreats = this.analyzeBehavior(data);
      threats.push(...behaviorThreats);
    }

    // Calculate total risk score
    threats.forEach(threat => {
      switch (threat.severity) {
        case 'low': totalRiskScore += 10; break;
        case 'medium': totalRiskScore += 25; break;
        case 'high': totalRiskScore += 50; break;
        case 'critical': totalRiskScore += 100; break;
      }
    });

    // Check if should block
    const shouldBlock = threats.some(threat => {
      const signature = this.threatSignatures.get(threat.type);
      return signature?.action === 'block';
    }) || totalRiskScore >= 75;

    // Log threats
    threats.forEach(threat => {
      this.securityEvents.set(threat.id, threat);
      this.logger.warn('Security threat detected', {
        id: threat.id,
        type: threat.type,
        severity: threat.severity,
        source: threat.source,
        blocked: shouldBlock
      });
    });

    return {
      threats,
      shouldBlock,
      riskScore: totalRiskScore
    };
  }

  private scanForThreats(source: string, content: string): SecurityEvent[] {
    const threats: SecurityEvent[] = [];

    this.threatSignatures.forEach((signature, id) => {
      const matches = content.match(signature.pattern);
      if (matches) {
        const event: SecurityEvent = {
          id: this.generateEventId(),
          timestamp: new Date(),
          type: signature.type,
          severity: signature.severity,
          source,
          description: signature.description,
          evidence: {
            matches: matches.slice(0, 5), // Limit matches for log size
            pattern: signature.pattern.toString(),
            content: content.substring(0, 200) // First 200 chars
          },
          blocked: signature.action === 'block'
        };

        threats.push(event);
      }
    });

    return threats;
  }

  private analyzeBehavior(data: {
    userId: string;
    url: string;
    ip: string;
    userAgent: string;
    method: string;
  }): SecurityEvent[] {
    const threats: SecurityEvent[] = [];
    const baseline = this.userBaselines.get(data.userId);

    if (!baseline) {
      // Create initial baseline
      this.updateUserBaseline(data.userId, data);
      return threats;
    }

    // Check for unusual login time
    const currentHour = new Date().getHours();
    if (!baseline.normalLoginHours.includes(currentHour)) {
      threats.push({
        id: this.generateEventId(),
        timestamp: new Date(),
        type: ThreatType.ANOMALOUS_BEHAVIOR,
        severity: 'low',
        source: 'behavior_analysis',
        description: 'Unusual login time detected',
        evidence: {
          currentHour,
          normalHours: baseline.normalLoginHours,
          userId: data.userId
        },
        blocked: false
      });
    }

    // Check for unusual endpoint access
    if (!baseline.typicalEndpoints.some(endpoint => data.url.includes(endpoint))) {
      threats.push({
        id: this.generateEventId(),
        timestamp: new Date(),
        type: ThreatType.ANOMALOUS_BEHAVIOR,
        severity: 'medium',
        source: 'behavior_analysis',
        description: 'Access to unusual endpoint detected',
        evidence: {
          currentUrl: data.url,
          typicalEndpoints: baseline.typicalEndpoints,
          userId: data.userId
        },
        blocked: false
      });
    }

    // Check for unusual user agent
    if (!baseline.commonUserAgents.includes(data.userAgent)) {
      threats.push({
        id: this.generateEventId(),
        timestamp: new Date(),
        type: ThreatType.ANOMALOUS_BEHAVIOR,
        severity: 'low',
        source: 'behavior_analysis',
        description: 'Unusual user agent detected',
        evidence: {
          currentUserAgent: data.userAgent,
          commonUserAgents: baseline.commonUserAgents,
          userId: data.userId
        },
        blocked: false
      });
    }

    // Update baseline with current behavior
    this.updateUserBaseline(data.userId, data);

    return threats;
  }

  private updateUserBaseline(userId: string, data: {
    url: string;
    ip: string;
    userAgent: string;
  }): void {
    const currentHour = new Date().getHours();
    let baseline = this.userBaselines.get(userId);

    if (!baseline) {
      baseline = {
        userId,
        normalLoginHours: [currentHour],
        typicalEndpoints: [this.extractEndpoint(data.url)],
        averageSessionDuration: 0,
        commonUserAgents: [data.userAgent],
        geolocation: {},
        requestFrequency: 1
      };
    } else {
      // Update baseline with new data
      if (!baseline.normalLoginHours.includes(currentHour)) {
        baseline.normalLoginHours.push(currentHour);
        // Keep only last 30 days of login hours
        if (baseline.normalLoginHours.length > 24) {
          baseline.normalLoginHours = baseline.normalLoginHours.slice(-24);
        }
      }

      const endpoint = this.extractEndpoint(data.url);
      if (!baseline.typicalEndpoints.includes(endpoint)) {
        baseline.typicalEndpoints.push(endpoint);
        // Keep only last 50 endpoints
        if (baseline.typicalEndpoints.length > 50) {
          baseline.typicalEndpoints = baseline.typicalEndpoints.slice(-50);
        }
      }

      if (!baseline.commonUserAgents.includes(data.userAgent)) {
        baseline.commonUserAgents.push(data.userAgent);
        // Keep only last 10 user agents
        if (baseline.commonUserAgents.length > 10) {
          baseline.commonUserAgents = baseline.commonUserAgents.slice(-10);
        }
      }
    }

    this.userBaselines.set(userId, baseline);
  }

  private extractEndpoint(url: string): string {
    try {
      const parsedUrl = new URL(url, 'http://localhost');
      const pathSegments = parsedUrl.pathname.split('/').filter(segment => segment.length > 0);
      // Return first two path segments to identify endpoint pattern
      return '/' + pathSegments.slice(0, 2).join('/');
    } catch {
      return url.split('?')[0]; // Fallback: return path without query params
    }
  }

  /**
   * Add custom threat signature
   */
  public addThreatSignature(signature: ThreatSignature): void {
    this.threatSignatures.set(signature.id, signature);
    this.logger.info('Threat signature added', {
      id: signature.id,
      type: signature.type,
      severity: signature.severity
    });
  }

  /**
   * Mark event as false positive
   */
  public markFalsePositive(eventId: string): void {
    const event = this.securityEvents.get(eventId);
    if (event) {
      event.falsePositive = true;
      this.securityEvents.set(eventId, event);
      this.logger.info('Event marked as false positive', { eventId });
    }
  }

  /**
   * Get security events with optional filtering
   */
  public getSecurityEvents(filter?: {
    type?: ThreatType;
    severity?: string;
    timeRange?: { start: Date; end: Date };
    excludeFalsePositives?: boolean;
  }): SecurityEvent[] {
    let events = Array.from(this.securityEvents.values());

    if (filter) {
      if (filter.type) {
        events = events.filter(event => event.type === filter.type);
      }
      
      if (filter.severity) {
        events = events.filter(event => event.severity === filter.severity);
      }
      
      if (filter.timeRange) {
        events = events.filter(event => 
          event.timestamp >= filter.timeRange!.start && 
          event.timestamp <= filter.timeRange!.end
        );
      }
      
      if (filter.excludeFalsePositives) {
        events = events.filter(event => !event.falsePositive);
      }
    }

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get threat statistics
   */
  public getThreatStatistics(): {
    totalEvents: number;
    eventsBySeverity: Record<string, number>;
    eventsByType: Record<string, number>;
    falsePositives: number;
    topThreats: Array<{ type: string; count: number }>;
  } {
    const events = Array.from(this.securityEvents.values());
    const eventsBySeverity: Record<string, number> = {};
    const eventsByType: Record<string, number> = {};
    let falsePositives = 0;

    events.forEach(event => {
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      
      if (event.falsePositive) falsePositives++;
    });

    const topThreats = Object.entries(eventsByType)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([type, count]) => ({ type, count }));

    return {
      totalEvents: events.length,
      eventsBySeverity,
      eventsByType,
      falsePositives,
      topThreats
    };
  }

  private startBehaviorAnalysis(): void {
    // Clean up old events every hour
    setInterval(() => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      for (const [id, event] of this.securityEvents.entries()) {
        if (event.timestamp < oneDayAgo) {
          this.securityEvents.delete(id);
        }
      }

      // Clean up old baselines (inactive for 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      // In a real implementation, you'd track last activity per user
      // For now, we just limit the size
      if (this.userBaselines.size > 10000) {
        const entries = Array.from(this.userBaselines.entries());
        entries.splice(0, entries.length - 10000);
        this.userBaselines = new Map(entries);
      }
    }, 3600000); // 1 hour
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${++this.eventCounter}`;
  }

  /**
   * Export security events for analysis
   */
  public exportEvents(format: 'json' | 'csv' = 'json'): string {
    const events = this.getSecurityEvents();
    
    if (format === 'csv') {
      const headers = ['id', 'timestamp', 'type', 'severity', 'source', 'description', 'blocked', 'falsePositive'];
      const csvRows = [
        headers.join(','),
        ...events.map(event => [
          event.id,
          event.timestamp.toISOString(),
          event.type,
          event.severity,
          event.source,
          `"${event.description}"`,
          event.blocked,
          event.falsePositive || false
        ].join(','))
      ];
      return csvRows.join('\n');
    }
    
    return JSON.stringify(events, null, 2);
  }
}