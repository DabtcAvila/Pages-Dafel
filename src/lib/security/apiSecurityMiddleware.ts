/**
 * Enterprise API Security Middleware
 * Advanced security middleware for API routes
 * @module lib/security/apiSecurityMiddleware
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { SecurityManager } from './SecurityManager';
import { RateLimiter } from './RateLimiter';
import { Logger } from '../monitoring/Logger';

export interface SecurityConfig {
  enableRateLimit: boolean;
  enableCSRFProtection: boolean;
  enableInputValidation: boolean;
  enableAuditLogging: boolean;
  requireHttps: boolean;
  allowedOrigins: string[];
  maxRequestSize: number; // in bytes
}

export class APISecurityMiddleware {
  private securityManager: SecurityManager;
  private rateLimiter: RateLimiter;
  private logger: Logger;
  private config: SecurityConfig;

  constructor(config?: Partial<SecurityConfig>) {
    this.securityManager = SecurityManager.getInstance();
    this.rateLimiter = new RateLimiter();
    this.logger = Logger.getInstance();
    
    this.config = {
      enableRateLimit: true,
      enableCSRFProtection: true,
      enableInputValidation: true,
      enableAuditLogging: true,
      requireHttps: process.env.NODE_ENV === 'production',
      allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
      maxRequestSize: 10 * 1024 * 1024, // 10MB
      ...config
    };
  }

  /**
   * Main security middleware handler
   */
  public async handle(request: NextRequest, handler: Function): Promise<NextResponse> {
    const startTime = Date.now();
    const ip = this.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    const method = request.method;
    const pathname = new URL(request.url).pathname;

    try {
      // 1. HTTPS Enforcement
      if (this.config.requireHttps && !this.isHTTPS(request)) {
        return this.createErrorResponse('HTTPS required', 426, 'upgrade-required');
      }

      // 2. Request Size Validation
      const contentLength = parseInt(request.headers.get('content-length') || '0');
      if (contentLength > this.config.maxRequestSize) {
        return this.createErrorResponse('Request too large', 413, 'payload-too-large');
      }

      // 3. CORS Check
      if (!this.validateCORS(request)) {
        return this.createErrorResponse('CORS policy violation', 403, 'cors-violation');
      }

      // 4. Rate Limiting
      if (this.config.enableRateLimit) {
        const rateLimitResult = await this.rateLimiter.checkRateLimit(ip, pathname, method);
        if (!rateLimitResult.allowed) {
          this.logSecurityEvent('RATE_LIMIT_EXCEEDED', 'medium', {
            ip,
            pathname,
            method,
            reason: rateLimitResult.reason
          });
          
          return this.createRateLimitResponse(rateLimitResult);
        }
      }

      // 5. Authentication Check
      const session = await getServerSession(authOptions);
      const isPublicEndpoint = this.isPublicEndpoint(pathname);
      
      if (!isPublicEndpoint && !session) {
        return this.createErrorResponse('Authentication required', 401, 'authentication-required');
      }

      // 6. CSRF Protection for state-changing methods
      if (this.config.enableCSRFProtection && this.isStateMutatingMethod(method)) {
        const csrfValid = await this.validateCSRF(request, session);
        if (!csrfValid) {
          this.logSecurityEvent('CSRF_VIOLATION', 'high', {
            ip,
            pathname,
            method,
            userId: session?.user?.id
          });
          
          return this.createErrorResponse('CSRF token validation failed', 403, 'csrf-violation');
        }
      }

      // 7. Input Validation
      if (this.config.enableInputValidation) {
        const validationResult = await this.validateInput(request);
        if (!validationResult.isValid) {
          this.logSecurityEvent('INPUT_VALIDATION_FAILED', 'high', {
            ip,
            pathname,
            method,
            threats: validationResult.threats
          });
          
          return this.createErrorResponse(
            'Request contains potentially malicious content',
            400,
            'input-validation-failed',
            { threats: validationResult.threats }
          );
        }
      }

      // 8. Authorization Check
      const authResult = await this.checkAuthorization(request, session, pathname, method);
      if (!authResult.authorized) {
        return this.createErrorResponse(authResult.reason, 403, 'authorization-failed');
      }

      // Execute the actual handler
      const response = await handler(request);
      const responseTime = Date.now() - startTime;

      // 9. Record successful request
      if (this.config.enableRateLimit) {
        this.rateLimiter.recordRequest(ip, pathname, method, true, responseTime);
      }

      // 10. Add security headers to response
      this.addSecurityHeaders(response);

      // 11. Audit logging
      if (this.config.enableAuditLogging) {
        this.logAPIAccess(request, session, response.status, responseTime);
      }

      return response;

    } catch (error) {
      this.logger.error('API Security Middleware Error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        pathname,
        method,
        ip
      });

      return this.createErrorResponse('Internal security error', 500, 'internal-error');
    }
  }

  private getClientIP(request: NextRequest): string {
    return request.ip || 
           request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
           request.headers.get('x-real-ip') ||
           request.headers.get('cf-connecting-ip') ||
           request.headers.get('x-client-ip') ||
           '127.0.0.1';
  }

  private isHTTPS(request: NextRequest): boolean {
    const protocol = request.headers.get('x-forwarded-proto') || 
                    request.nextUrl.protocol ||
                    'http:';
    return protocol === 'https:';
  }

  private validateCORS(request: NextRequest): boolean {
    const origin = request.headers.get('origin');
    
    if (!origin) {
      return true; // Same-origin requests don't have origin header
    }

    if (this.config.allowedOrigins.length === 0) {
      return true; // No CORS restrictions
    }

    return this.config.allowedOrigins.includes(origin) ||
           this.config.allowedOrigins.includes('*');
  }

  private isPublicEndpoint(pathname: string): boolean {
    const publicEndpoints = [
      '/api/health',
      '/api/auth',
      '/api/public'
    ];

    return publicEndpoints.some(endpoint => pathname.startsWith(endpoint));
  }

  private isStateMutatingMethod(method: string): boolean {
    return ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase());
  }

  private async validateCSRF(request: NextRequest, session: any): Promise<boolean> {
    if (!session?.user?.id) {
      return false;
    }

    const csrfToken = request.headers.get('x-csrf-token') || 
                     request.headers.get('csrf-token');
    
    if (!csrfToken) {
      return false;
    }

    return this.securityManager.validateCSRFToken(csrfToken, session.user.id);
  }

  private async validateInput(request: NextRequest): Promise<{
    isValid: boolean;
    threats: string[];
    sanitized?: any;
  }> {
    try {
      // Validate URL parameters
      const url = new URL(request.url);
      const urlValidation = this.securityManager.validateInput(url.search, 'general');
      
      if (!urlValidation.isValid) {
        return {
          isValid: false,
          threats: urlValidation.threats
        };
      }

      // Validate request body for POST/PUT requests
      if (this.isStateMutatingMethod(request.method) && request.body) {
        const body = await request.text();
        const bodyValidation = this.securityManager.validateInput(body, 'json');
        
        if (!bodyValidation.isValid) {
          return {
            isValid: false,
            threats: bodyValidation.threats
          };
        }
      }

      return { isValid: true, threats: [] };
    } catch (error) {
      return { isValid: false, threats: ['VALIDATION_ERROR'] };
    }
  }

  private async checkAuthorization(
    request: NextRequest,
    session: any,
    pathname: string,
    method: string
  ): Promise<{ authorized: boolean; reason: string }> {
    // Admin endpoints require ADMIN role
    if (pathname.startsWith('/api/admin')) {
      if (!session || session.user.role !== 'ADMIN') {
        return {
          authorized: false,
          reason: 'Admin privileges required'
        };
      }
    }

    // User-specific endpoints require matching user ID or admin role
    const userIdMatch = pathname.match(/\/api\/users\/([^\/]+)/);
    if (userIdMatch) {
      const targetUserId = userIdMatch[1];
      if (session?.user?.id !== targetUserId && session?.user?.role !== 'ADMIN') {
        return {
          authorized: false,
          reason: 'Insufficient privileges to access this user resource'
        };
      }
    }

    // Data source endpoints require ownership or admin role
    if (pathname.startsWith('/api/data-sources')) {
      // This would require checking data source ownership in the database
      // For now, we allow authenticated users to access their own data sources
      if (!session) {
        return {
          authorized: false,
          reason: 'Authentication required for data source access'
        };
      }
    }

    return { authorized: true, reason: 'Authorized' };
  }

  private addSecurityHeaders(response: NextResponse): void {
    // Add security headers that weren't added by Next.js config
    response.headers.set('X-API-Version', '1.0');
    response.headers.set('X-Request-ID', this.generateRequestId());
    
    // Remove potentially sensitive headers
    response.headers.delete('Server');
    response.headers.delete('X-Powered-By');
  }

  private logAPIAccess(request: NextRequest, session: any, status: number, responseTime: number): void {
    const pathname = new URL(request.url).pathname;
    
    this.logger.info('API Access', {
      method: request.method,
      path: pathname,
      status,
      responseTime,
      userId: session?.user?.id,
      userAgent: request.headers.get('user-agent'),
      ip: this.getClientIP(request),
      timestamp: new Date().toISOString()
    });
  }

  private logSecurityEvent(type: string, severity: 'low' | 'medium' | 'high' | 'critical', details: any): void {
    this.securityManager.logSecurityEvent({
      type: type as any,
      severity,
      source: 'api_middleware',
      details,
      blocked: true,
      risk_score: severity === 'critical' ? 100 : severity === 'high' ? 75 : severity === 'medium' ? 50 : 25
    });
  }

  private createErrorResponse(
    message: string,
    status: number,
    code: string,
    details?: any
  ): NextResponse {
    const response = NextResponse.json(
      {
        error: message,
        code,
        timestamp: new Date().toISOString(),
        ...details
      },
      { status }
    );

    // Add security headers even to error responses
    this.addSecurityHeaders(response);
    
    return response;
  }

  private createRateLimitResponse(rateLimitResult: any): NextResponse {
    const response = this.createErrorResponse(
      'Rate limit exceeded',
      429,
      'rate-limit-exceeded'
    );

    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
    response.headers.set('Retry-After', '60');

    return response;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Helper function to wrap API handlers with security middleware
 */
export function withSecurity(handler: Function, config?: Partial<SecurityConfig>) {
  const middleware = new APISecurityMiddleware(config);
  
  return async (request: NextRequest) => {
    return middleware.handle(request, handler);
  };
}

/**
 * Security middleware factory for different security levels
 */
export const SecurityLevels = {
  LOW: {
    enableRateLimit: true,
    enableCSRFProtection: false,
    enableInputValidation: false,
    enableAuditLogging: false
  },
  MEDIUM: {
    enableRateLimit: true,
    enableCSRFProtection: true,
    enableInputValidation: true,
    enableAuditLogging: true
  },
  HIGH: {
    enableRateLimit: true,
    enableCSRFProtection: true,
    enableInputValidation: true,
    enableAuditLogging: true,
    requireHttps: true
  },
  MAXIMUM: {
    enableRateLimit: true,
    enableCSRFProtection: true,
    enableInputValidation: true,
    enableAuditLogging: true,
    requireHttps: true,
    maxRequestSize: 5 * 1024 * 1024 // 5MB for maximum security
  }
};

export const withSecurityLevel = (level: keyof typeof SecurityLevels) => {
  return (handler: Function) => withSecurity(handler, SecurityLevels[level]);
};