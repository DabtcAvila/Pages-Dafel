/**
 * Enterprise Rate Limiter
 * Advanced rate limiting with DDoS protection and intelligent blocking
 * @module lib/security/RateLimiter
 */

import { Logger } from '../monitoring/Logger';

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (identifier: string) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  blockDuration?: number;
}

export interface RateLimitRule {
  endpoint: string;
  method?: string;
  config: RateLimitConfig;
}

export interface RequestInfo {
  identifier: string;
  timestamp: number;
  endpoint: string;
  method: string;
  success: boolean;
  responseTime: number;
}

export class RateLimiter {
  private logger: Logger;
  private requestLog: Map<string, RequestInfo[]> = new Map();
  private blockedIPs: Map<string, number> = new Map();
  private suspiciousActivities: Map<string, number> = new Map();
  
  // Default configurations for different endpoint types
  private defaultRules: RateLimitRule[] = [
    {
      endpoint: '/api/auth',
      config: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5,
        blockDuration: 30 * 60 * 1000 // 30 minutes
      }
    },
    {
      endpoint: '/api/users',
      config: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10,
        blockDuration: 5 * 60 * 1000 // 5 minutes
      }
    },
    {
      endpoint: '/api/data-sources',
      config: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 20,
        blockDuration: 2 * 60 * 1000 // 2 minutes
      }
    },
    {
      endpoint: '/api',
      config: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 100,
        blockDuration: 60 * 1000 // 1 minute
      }
    }
  ];

  // DDoS detection thresholds
  private ddosConfig = {
    suspiciousRequestsPerMinute: 200,
    criticalRequestsPerMinute: 500,
    unusualPatternThreshold: 0.8, // 80% similar requests
    blockDurationMinutes: 60
  };

  constructor() {
    this.logger = Logger.getInstance();
    this.startCleanupInterval();
    this.logger.info('Rate Limiter initialized', {
      rules: this.defaultRules.length,
      ddosProtection: true
    });
  }

  /**
   * Check if request should be rate limited
   */
  public async checkRateLimit(
    identifier: string,
    endpoint: string,
    method: string = 'GET'
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    reason?: string;
  }> {
    // Check if IP is blocked
    if (this.isBlocked(identifier)) {
      const blockExpiry = this.blockedIPs.get(identifier) || 0;
      return {
        allowed: false,
        remaining: 0,
        resetTime: blockExpiry,
        reason: 'IP_BLOCKED'
      };
    }

    // Find applicable rule
    const rule = this.findRule(endpoint, method);
    if (!rule) {
      return {
        allowed: true,
        remaining: 999,
        resetTime: Date.now() + 60000
      };
    }

    // Get or create request history for this identifier
    const key = rule.config.keyGenerator ? rule.config.keyGenerator(identifier) : identifier;
    let requests = this.requestLog.get(key) || [];
    
    // Clean old requests outside the window
    const now = Date.now();
    const windowStart = now - rule.config.windowMs;
    requests = requests.filter(req => req.timestamp > windowStart);

    // Count relevant requests based on rule configuration
    let relevantRequests = requests;
    if (rule.config.skipSuccessfulRequests) {
      relevantRequests = relevantRequests.filter(req => !req.success);
    }
    if (rule.config.skipFailedRequests) {
      relevantRequests = relevantRequests.filter(req => req.success);
    }

    const requestCount = relevantRequests.length;
    const remaining = Math.max(0, rule.config.maxRequests - requestCount);
    const resetTime = requests.length > 0 
      ? requests[0].timestamp + rule.config.windowMs
      : now + rule.config.windowMs;

    // Check for rate limit violation
    if (requestCount >= rule.config.maxRequests) {
      // Log rate limit violation
      this.logger.warn('Rate limit exceeded', {
        identifier,
        endpoint,
        method,
        requestCount,
        maxRequests: rule.config.maxRequests,
        windowMs: rule.config.windowMs
      });

      // Check if should block (repeated violations)
      this.checkForBlocking(identifier, endpoint, rule);

      return {
        allowed: false,
        remaining: 0,
        resetTime,
        reason: 'RATE_LIMIT_EXCEEDED'
      };
    }

    // Update request log
    this.requestLog.set(key, requests);

    return {
      allowed: true,
      remaining,
      resetTime
    };
  }

  /**
   * Record a request for rate limiting and analysis
   */
  public recordRequest(
    identifier: string,
    endpoint: string,
    method: string,
    success: boolean,
    responseTime: number
  ): void {
    const rule = this.findRule(endpoint, method);
    if (!rule) return;

    const key = rule.config.keyGenerator ? rule.config.keyGenerator(identifier) : identifier;
    const requests = this.requestLog.get(key) || [];

    const requestInfo: RequestInfo = {
      identifier,
      timestamp: Date.now(),
      endpoint,
      method,
      success,
      responseTime
    };

    requests.push(requestInfo);
    this.requestLog.set(key, requests);

    // Check for suspicious patterns
    this.detectSuspiciousActivity(identifier, requests);
  }

  /**
   * Block an IP address
   */
  public blockIP(ip: string, durationMs: number): void {
    const blockUntil = Date.now() + durationMs;
    this.blockedIPs.set(ip, blockUntil);
    
    this.logger.warn('IP blocked', {
      ip,
      durationMs,
      blockUntil: new Date(blockUntil)
    });
  }

  /**
   * Unblock an IP address
   */
  public unblockIP(ip: string): void {
    this.blockedIPs.delete(ip);
    this.logger.info('IP unblocked', { ip });
  }

  /**
   * Check if IP is currently blocked
   */
  public isBlocked(ip: string): boolean {
    const blockExpiry = this.blockedIPs.get(ip);
    if (!blockExpiry) return false;

    if (Date.now() > blockExpiry) {
      this.blockedIPs.delete(ip);
      return false;
    }

    return true;
  }

  /**
   * Get rate limiting statistics
   */
  public getStats(): {
    totalRequests: number;
    blockedIPs: number;
    suspiciousActivities: number;
    topEndpoints: Array<{ endpoint: string; count: number }>;
    topIPs: Array<{ ip: string; count: number }>;
  } {
    let totalRequests = 0;
    const endpointCounts = new Map<string, number>();
    const ipCounts = new Map<string, number>();

    this.requestLog.forEach((requests) => {
      requests.forEach(req => {
        totalRequests++;
        endpointCounts.set(req.endpoint, (endpointCounts.get(req.endpoint) || 0) + 1);
        ipCounts.set(req.identifier, (ipCounts.get(req.identifier) || 0) + 1);
      });
    });

    const topEndpoints = Array.from(endpointCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([endpoint, count]) => ({ endpoint, count }));

    const topIPs = Array.from(ipCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count }));

    return {
      totalRequests,
      blockedIPs: this.blockedIPs.size,
      suspiciousActivities: this.suspiciousActivities.size,
      topEndpoints,
      topIPs
    };
  }

  private findRule(endpoint: string, method: string): RateLimitRule | null {
    // Find most specific rule first
    for (const rule of this.defaultRules) {
      if (rule.method && rule.method !== method) continue;
      if (endpoint.startsWith(rule.endpoint)) {
        return rule;
      }
    }
    return null;
  }

  private checkForBlocking(identifier: string, endpoint: string, rule: RateLimitRule): void {
    if (!rule.config.blockDuration) return;

    // Count violations in the last hour
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const requests = this.requestLog.get(identifier) || [];
    const recentViolations = requests.filter(req => 
      req.timestamp > oneHourAgo && 
      !req.success &&
      req.endpoint === endpoint
    ).length;

    // Block if too many violations
    if (recentViolations >= 3) {
      this.blockIP(identifier, rule.config.blockDuration);
    }
  }

  private detectSuspiciousActivity(identifier: string, requests: RequestInfo[]): void {
    const now = Date.now();
    const lastMinute = requests.filter(req => now - req.timestamp < 60000);

    // Check for DDoS patterns
    if (lastMinute.length >= this.ddosConfig.suspiciousRequestsPerMinute) {
      this.suspiciousActivities.set(identifier, now);

      this.logger.warn('Suspicious activity detected', {
        identifier,
        requestsLastMinute: lastMinute.length,
        threshold: this.ddosConfig.suspiciousRequestsPerMinute
      });

      // Block if critical threshold reached
      if (lastMinute.length >= this.ddosConfig.criticalRequestsPerMinute) {
        this.blockIP(identifier, this.ddosConfig.blockDurationMinutes * 60 * 1000);
      }
    }

    // Check for unusual patterns (same endpoint repeatedly)
    if (lastMinute.length > 20) {
      const endpointCounts = new Map<string, number>();
      lastMinute.forEach(req => {
        endpointCounts.set(req.endpoint, (endpointCounts.get(req.endpoint) || 0) + 1);
      });

      const maxEndpointCount = Math.max(...endpointCounts.values());
      const patternRatio = maxEndpointCount / lastMinute.length;

      if (patternRatio >= this.ddosConfig.unusualPatternThreshold) {
        this.logger.warn('Unusual request pattern detected', {
          identifier,
          pattern: Array.from(endpointCounts.entries()),
          patternRatio
        });

        this.suspiciousActivities.set(identifier, now);
      }
    }
  }

  private startCleanupInterval(): void {
    // Clean up old data every 5 minutes
    setInterval(() => {
      const now = Date.now();
      
      // Clean request logs
      this.requestLog.forEach((requests, key) => {
        const filtered = requests.filter(req => now - req.timestamp < 24 * 60 * 60 * 1000);
        if (filtered.length === 0) {
          this.requestLog.delete(key);
        } else {
          this.requestLog.set(key, filtered);
        }
      });

      // Clean expired blocks
      this.blockedIPs.forEach((expiry, ip) => {
        if (now > expiry) {
          this.blockedIPs.delete(ip);
        }
      });

      // Clean old suspicious activities
      this.suspiciousActivities.forEach((timestamp, ip) => {
        if (now - timestamp > 24 * 60 * 60 * 1000) {
          this.suspiciousActivities.delete(ip);
        }
      });

    }, 5 * 60 * 1000);
  }

  /**
   * Add custom rate limiting rule
   */
  public addRule(rule: RateLimitRule): void {
    this.defaultRules.unshift(rule); // Add to beginning for higher priority
    this.logger.info('Rate limiting rule added', {
      endpoint: rule.endpoint,
      method: rule.method,
      config: rule.config
    });
  }

  /**
   * Get current blocked IPs
   */
  public getBlockedIPs(): Array<{ ip: string; expiresAt: Date }> {
    return Array.from(this.blockedIPs.entries()).map(([ip, expiry]) => ({
      ip,
      expiresAt: new Date(expiry)
    }));
  }

  /**
   * Get current suspicious activities
   */
  public getSuspiciousActivities(): Array<{ ip: string; detectedAt: Date }> {
    return Array.from(this.suspiciousActivities.entries()).map(([ip, timestamp]) => ({
      ip,
      detectedAt: new Date(timestamp)
    }));
  }
}