/**
 * Enterprise Security Manager
 * Centralized security orchestration and threat detection
 * @module lib/security/SecurityManager
 */

import { Logger } from '../monitoring/Logger';
import { VaultManager } from './VaultManager';
import { RateLimiter } from './RateLimiter';
import { IntrusionDetector } from './IntrusionDetector';
import { SecurityMetrics } from './SecurityMetrics';

export enum SecurityEventType {
  AUTHENTICATION_FAILURE = 'authentication_failure',
  AUTHORIZATION_FAILURE = 'authorization_failure',
  SQL_INJECTION_ATTEMPT = 'sql_injection_attempt',
  XSS_ATTEMPT = 'xss_attempt',
  BRUTE_FORCE_ATTACK = 'brute_force_attack',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  DATA_EXFILTRATION = 'data_exfiltration',
  PRIVILEGE_ESCALATION = 'privilege_escalation',
  MALICIOUS_PAYLOAD = 'malicious_payload',
  CSRF_ATTEMPT = 'csrf_attempt'
}

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  source: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  details: Record<string, any>;
  blocked: boolean;
  risk_score: number;
}

export interface SecurityPolicy {
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordMinLength: number;
  passwordComplexity: boolean;
  sessionTimeout: number;
  mfaRequired: boolean;
  ipWhitelist?: string[];
  contentFiltering: boolean;
  rateLimitingEnabled: boolean;
  intrusionDetectionEnabled: boolean;
}

export class SecurityManager {
  private static instance: SecurityManager;
  private logger: Logger;
  private vaultManager: VaultManager;
  private rateLimiter: RateLimiter;
  private intrusionDetector: IntrusionDetector;
  private securityMetrics: SecurityMetrics;
  
  private securityEvents: Map<string, SecurityEvent> = new Map();
  private policy: SecurityPolicy;
  
  private constructor() {
    this.logger = Logger.getInstance();
    this.vaultManager = VaultManager.getInstance();
    this.rateLimiter = new RateLimiter();
    this.intrusionDetector = new IntrusionDetector();
    this.securityMetrics = new SecurityMetrics();
    
    this.policy = this.loadSecurityPolicy();
    this.startSecurityMonitoring();
    
    this.logger.info('Security Manager initialized', {
      policy: this.policy,
      components: ['VaultManager', 'RateLimiter', 'IntrusionDetector', 'SecurityMetrics']
    });
  }

  public static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  private loadSecurityPolicy(): SecurityPolicy {
    return {
      maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
      lockoutDuration: parseInt(process.env.LOCKOUT_DURATION_MINUTES || '30'),
      passwordMinLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '12'),
      passwordComplexity: process.env.PASSWORD_COMPLEXITY === 'true',
      sessionTimeout: parseInt(process.env.SESSION_TIMEOUT_MINUTES || '480'),
      mfaRequired: process.env.MFA_REQUIRED === 'true',
      ipWhitelist: process.env.IP_WHITELIST?.split(',').map(ip => ip.trim()),
      contentFiltering: process.env.CONTENT_FILTERING !== 'false',
      rateLimitingEnabled: process.env.RATE_LIMITING_ENABLED !== 'false',
      intrusionDetectionEnabled: process.env.INTRUSION_DETECTION_ENABLED !== 'false'
    };
  }

  /**
   * Validate and sanitize input data
   */
  public validateInput(input: any, type: 'sql' | 'html' | 'json' | 'general'): {
    isValid: boolean;
    sanitized?: any;
    threats: string[];
  } {
    const threats: string[] = [];
    
    if (typeof input !== 'string') {
      input = JSON.stringify(input);
    }

    // SQL injection detection
    if (type === 'sql' || type === 'general') {
      const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)\b)/gi,
        /(--|\#|\/\*|\*\/)/g,
        /('|('')|;|%|_)/g,
        /(EXEC|EXECUTE|SP_|XP_)/gi,
        /(SCRIPT|JAVASCRIPT|VBSCRIPT)/gi
      ];

      sqlPatterns.forEach((pattern, index) => {
        if (pattern.test(input)) {
          threats.push(`SQL_INJECTION_PATTERN_${index}`);
        }
      });
    }

    // XSS detection
    if (type === 'html' || type === 'general') {
      const xssPatterns = [
        /<script[^>]*>[\s\S]*?<\/script>/gi,
        /<iframe[^>]*>[\s\S]*?<\/iframe>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<object[^>]*>[\s\S]*?<\/object>/gi,
        /<embed[^>]*>/gi,
        /<link[^>]*>/gi,
        /<meta[^>]*>/gi
      ];

      xssPatterns.forEach((pattern, index) => {
        if (pattern.test(input)) {
          threats.push(`XSS_PATTERN_${index}`);
        }
      });
    }

    // Path traversal detection
    const pathTraversalPatterns = [
      /\.{2}[\/\\]/g,
      /[\/\\]\.{2}/g,
      /%2e%2e/gi,
      /%c0%ae/gi
    ];

    pathTraversalPatterns.forEach((pattern, index) => {
      if (pattern.test(input)) {
        threats.push(`PATH_TRAVERSAL_PATTERN_${index}`);
      }
    });

    // Command injection detection
    const commandPatterns = [
      /[\|\&\;\$\>\<\`\\!]/g,
      /(bash|sh|cmd|powershell|eval)/gi,
      /[\r\n]/g
    ];

    commandPatterns.forEach((pattern, index) => {
      if (pattern.test(input)) {
        threats.push(`COMMAND_INJECTION_PATTERN_${index}`);
      }
    });

    let sanitized = input;

    if (threats.length > 0) {
      // Log security event
      this.logSecurityEvent({
        type: threats.includes('SQL') ? SecurityEventType.SQL_INJECTION_ATTEMPT : SecurityEventType.XSS_ATTEMPT,
        severity: 'high',
        source: 'input_validation',
        details: { input: input.substring(0, 1000), threats },
        blocked: true,
        risk_score: threats.length * 20
      });

      // Sanitize input
      sanitized = this.sanitizeInput(input, type);
    }

    return {
      isValid: threats.length === 0,
      sanitized,
      threats
    };
  }

  private sanitizeInput(input: string, type: string): string {
    let sanitized = input;

    // HTML encoding
    if (type === 'html' || type === 'general') {
      sanitized = sanitized
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }

    // SQL escaping
    if (type === 'sql' || type === 'general') {
      sanitized = sanitized
        .replace(/'/g, "''")
        .replace(/;/g, '')
        .replace(/--/g, '')
        .replace(/\/\*/g, '')
        .replace(/\*\//g, '');
    }

    // Remove dangerous characters
    sanitized = sanitized
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .replace(/[\u0080-\uFFFF]/g, '');

    return sanitized;
  }

  /**
   * Check if IP is allowed
   */
  public isIPAllowed(ip: string): boolean {
    if (!this.policy.ipWhitelist || this.policy.ipWhitelist.length === 0) {
      return true;
    }

    return this.policy.ipWhitelist.some(allowedIP => {
      if (allowedIP.includes('/')) {
        // CIDR notation
        return this.isIPInCIDR(ip, allowedIP);
      }
      return ip === allowedIP;
    });
  }

  private isIPInCIDR(ip: string, cidr: string): boolean {
    const [network, prefixLength] = cidr.split('/');
    const mask = (0xffffffff << (32 - parseInt(prefixLength))) >>> 0;
    
    const ipNum = this.ipToNumber(ip);
    const networkNum = this.ipToNumber(network);
    
    return (ipNum & mask) === (networkNum & mask);
  }

  private ipToNumber(ip: string): number {
    return ip.split('.').reduce((num, octet) => (num << 8) + parseInt(octet), 0) >>> 0;
  }

  /**
   * Generate secure CSRF token
   */
  public generateCSRFToken(sessionId: string): string {
    const timestamp = Date.now().toString();
    const nonce = this.vaultManager.generateToken(16);
    const payload = `${sessionId}:${timestamp}:${nonce}`;
    const signature = this.vaultManager.createHMAC(payload);
    
    return Buffer.from(`${payload}:${signature}`).toString('base64');
  }

  /**
   * Validate CSRF token
   */
  public validateCSRFToken(token: string, sessionId: string): boolean {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf8');
      const parts = decoded.split(':');
      
      if (parts.length !== 4) return false;
      
      const [tokenSessionId, timestamp, nonce, signature] = parts;
      
      if (tokenSessionId !== sessionId) return false;
      
      // Check if token is not expired (1 hour)
      const tokenTime = parseInt(timestamp);
      const now = Date.now();
      if (now - tokenTime > 3600000) return false;
      
      // Verify signature
      const payload = `${tokenSessionId}:${timestamp}:${nonce}`;
      return this.vaultManager.verifyHMAC(payload, signature);
      
    } catch (error) {
      return false;
    }
  }

  /**
   * Log security event
   */
  public logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      id: this.vaultManager.generateUUID(),
      timestamp: new Date(),
      ...event
    };

    this.securityEvents.set(securityEvent.id, securityEvent);
    this.securityMetrics.recordSecurityEvent(securityEvent);

    this.logger.warn('Security Event Detected', {
      eventId: securityEvent.id,
      type: securityEvent.type,
      severity: securityEvent.severity,
      source: securityEvent.source,
      blocked: securityEvent.blocked,
      riskScore: securityEvent.risk_score
    });

    // Trigger alerts for high-severity events
    if (securityEvent.severity === 'critical' || securityEvent.risk_score >= 80) {
      this.triggerSecurityAlert(securityEvent);
    }
  }

  private triggerSecurityAlert(event: SecurityEvent): void {
    // In production, this would integrate with alerting systems
    this.logger.error('CRITICAL SECURITY ALERT', {
      eventId: event.id,
      type: event.type,
      details: event.details,
      immediate_action_required: true
    });

    // Block source if needed
    if (event.ip && event.severity === 'critical') {
      this.rateLimiter.blockIP(event.ip, 3600000); // Block for 1 hour
    }
  }

  /**
   * Get security metrics
   */
  public getSecurityMetrics(): any {
    return this.securityMetrics.getMetrics();
  }

  /**
   * Validate password strength
   */
  public validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length < this.policy.passwordMinLength) {
      feedback.push(`Password must be at least ${this.policy.passwordMinLength} characters long`);
    } else {
      score += 20;
    }

    if (this.policy.passwordComplexity) {
      if (!/[a-z]/.test(password)) feedback.push('Password must contain lowercase letters');
      else score += 15;

      if (!/[A-Z]/.test(password)) feedback.push('Password must contain uppercase letters');
      else score += 15;

      if (!/\d/.test(password)) feedback.push('Password must contain numbers');
      else score += 15;

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) feedback.push('Password must contain special characters');
      else score += 15;
    }

    // Check for common patterns
    const commonPatterns = [
      /(.)\1{2,}/g, // Repeated characters
      /123|abc|qwe/gi, // Sequential patterns
      /(password|admin|user|test)/gi // Common words
    ];

    commonPatterns.forEach(pattern => {
      if (pattern.test(password)) {
        feedback.push('Password contains common patterns');
        score -= 10;
      }
    });

    // Length bonus
    if (password.length >= 16) score += 10;
    if (password.length >= 20) score += 10;

    return {
      isValid: feedback.length === 0 && score >= 60,
      score: Math.max(0, Math.min(100, score)),
      feedback
    };
  }

  private startSecurityMonitoring(): void {
    // Clean up old events every hour
    setInterval(() => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      for (const [id, event] of this.securityEvents.entries()) {
        if (event.timestamp < oneDayAgo) {
          this.securityEvents.delete(id);
        }
      }
    }, 3600000);

    this.logger.info('Security monitoring started');
  }

  /**
   * Get security health status
   */
  public getSecurityHealth(): {
    status: 'healthy' | 'warning' | 'critical';
    checks: Record<string, boolean>;
    recommendations: string[];
  } {
    const checks = {
      vaultManagerActive: true,
      rateLimitingEnabled: this.policy.rateLimitingEnabled,
      intrusionDetectionEnabled: this.policy.intrusionDetectionEnabled,
      passwordPolicyEnforced: this.policy.passwordComplexity,
      mfaConfigured: this.policy.mfaRequired,
      httpsConfigured: process.env.NODE_ENV === 'production',
      environmentSecure: process.env.NODE_ENV === 'production'
    };

    const recommendations: string[] = [];
    
    if (!checks.rateLimitingEnabled) {
      recommendations.push('Enable rate limiting to prevent abuse');
    }
    
    if (!checks.intrusionDetectionEnabled) {
      recommendations.push('Enable intrusion detection for better threat monitoring');
    }
    
    if (!checks.passwordPolicyEnforced) {
      recommendations.push('Enforce strong password complexity requirements');
    }
    
    if (!checks.mfaConfigured) {
      recommendations.push('Implement multi-factor authentication for enhanced security');
    }

    if (process.env.NODE_ENV !== 'production') {
      recommendations.push('Ensure all security features are properly configured for production');
    }

    const failedChecks = Object.values(checks).filter(check => !check).length;
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    if (failedChecks >= 3) status = 'critical';
    else if (failedChecks >= 1) status = 'warning';

    return { status, checks, recommendations };
  }

  public shutdown(): void {
    this.vaultManager.shutdown();
    this.logger.info('Security Manager shutdown complete');
  }
}