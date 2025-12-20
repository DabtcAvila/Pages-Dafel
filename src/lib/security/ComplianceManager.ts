/**
 * Enterprise Compliance Manager
 * Automated compliance checking and reporting for SOC 2, GDPR, PCI-DSS standards
 * @module lib/security/ComplianceManager
 */

import { Logger } from '../monitoring/Logger';
import { VaultManager } from './VaultManager';
import { SecurityManager } from './SecurityManager';

export enum ComplianceStandard {
  SOC2 = 'SOC2',
  GDPR = 'GDPR',
  PCI_DSS = 'PCI_DSS',
  ISO27001 = 'ISO27001',
  HIPAA = 'HIPAA'
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PARTIAL = 'partial',
  NOT_APPLICABLE = 'not_applicable',
  UNKNOWN = 'unknown'
}

export interface ComplianceControl {
  id: string;
  standard: ComplianceStandard;
  title: string;
  description: string;
  requirement: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  automated: boolean;
  checkFunction?: () => Promise<ComplianceCheckResult>;
  evidence?: string[];
  remediation?: string;
  lastCheck?: Date;
  nextCheck?: Date;
  status: ComplianceStatus;
}

export interface ComplianceCheckResult {
  status: ComplianceStatus;
  score: number; // 0-100
  evidence: string[];
  issues: string[];
  remediation: string[];
  automated: boolean;
  timestamp: Date;
}

export interface ComplianceReport {
  standard: ComplianceStandard;
  overallStatus: ComplianceStatus;
  overallScore: number;
  totalControls: number;
  compliantControls: number;
  controls: Array<{
    control: ComplianceControl;
    result: ComplianceCheckResult;
  }>;
  recommendations: string[];
  generatedAt: Date;
  validUntil: Date;
}

export class ComplianceManager {
  private static instance: ComplianceManager;
  private logger: Logger;
  private vaultManager: VaultManager;
  private securityManager: SecurityManager;
  private controls: Map<string, ComplianceControl> = new Map();
  private lastReports: Map<ComplianceStandard, ComplianceReport> = new Map();

  private constructor() {
    this.logger = Logger.getInstance();
    this.vaultManager = VaultManager.getInstance();
    this.securityManager = SecurityManager.getInstance();
    
    this.initializeControls();
    this.startPeriodicChecks();
    
    this.logger.info('Compliance Manager initialized', {
      totalControls: this.controls.size,
      standards: Object.values(ComplianceStandard)
    });
  }

  public static getInstance(): ComplianceManager {
    if (!ComplianceManager.instance) {
      ComplianceManager.instance = new ComplianceManager();
    }
    return ComplianceManager.instance;
  }

  private initializeControls(): void {
    const controls: ComplianceControl[] = [
      // SOC 2 Type II Controls
      {
        id: 'SOC2_CC1_1',
        standard: ComplianceStandard.SOC2,
        title: 'Control Environment',
        description: 'The entity demonstrates a commitment to integrity and ethical values',
        requirement: 'CC1.1 - Control Environment and Integrity',
        category: 'Control Environment',
        priority: 'critical',
        automated: true,
        checkFunction: this.checkControlEnvironment.bind(this),
        status: ComplianceStatus.UNKNOWN
      },
      {
        id: 'SOC2_CC2_1',
        standard: ComplianceStandard.SOC2,
        title: 'Communication and Information',
        description: 'The entity obtains or generates and uses relevant, quality information',
        requirement: 'CC2.1 - Information and Communication',
        category: 'Communication',
        priority: 'high',
        automated: true,
        checkFunction: this.checkCommunicationControls.bind(this),
        status: ComplianceStatus.UNKNOWN
      },
      {
        id: 'SOC2_CC6_1',
        standard: ComplianceStandard.SOC2,
        title: 'Logical and Physical Access Controls',
        description: 'The entity implements logical access security software and infrastructure',
        requirement: 'CC6.1 - Logical and Physical Access',
        category: 'Access Control',
        priority: 'critical',
        automated: true,
        checkFunction: this.checkAccessControls.bind(this),
        status: ComplianceStatus.UNKNOWN
      },
      {
        id: 'SOC2_CC7_1',
        standard: ComplianceStandard.SOC2,
        title: 'System Operations',
        description: 'The entity monitors system components and the operation of controls',
        requirement: 'CC7.1 - System Operations and Monitoring',
        category: 'Operations',
        priority: 'high',
        automated: true,
        checkFunction: this.checkSystemOperations.bind(this),
        status: ComplianceStatus.UNKNOWN
      },
      {
        id: 'SOC2_A1_1',
        standard: ComplianceStandard.SOC2,
        title: 'Availability',
        description: 'The entity maintains system availability as committed or agreed',
        requirement: 'A1.1 - Availability Commitments',
        category: 'Availability',
        priority: 'high',
        automated: true,
        checkFunction: this.checkAvailabilityControls.bind(this),
        status: ComplianceStatus.UNKNOWN
      },

      // GDPR Controls
      {
        id: 'GDPR_ART25',
        standard: ComplianceStandard.GDPR,
        title: 'Data Protection by Design and by Default',
        description: 'Data protection measures are implemented by design and by default',
        requirement: 'Article 25 - Data Protection by Design',
        category: 'Privacy by Design',
        priority: 'critical',
        automated: true,
        checkFunction: this.checkDataProtectionByDesign.bind(this),
        status: ComplianceStatus.UNKNOWN
      },
      {
        id: 'GDPR_ART32',
        standard: ComplianceStandard.GDPR,
        title: 'Security of Processing',
        description: 'Appropriate technical and organizational security measures',
        requirement: 'Article 32 - Security of Processing',
        category: 'Security',
        priority: 'critical',
        automated: true,
        checkFunction: this.checkSecurityOfProcessing.bind(this),
        status: ComplianceStatus.UNKNOWN
      },
      {
        id: 'GDPR_ART33',
        standard: ComplianceStandard.GDPR,
        title: 'Breach Notification',
        description: 'Personal data breach notification to supervisory authority',
        requirement: 'Article 33 - Breach Notification',
        category: 'Incident Response',
        priority: 'high',
        automated: false,
        status: ComplianceStatus.UNKNOWN
      },

      // PCI DSS Controls
      {
        id: 'PCI_REQ1',
        standard: ComplianceStandard.PCI_DSS,
        title: 'Firewall Configuration',
        description: 'Install and maintain a firewall configuration',
        requirement: 'Requirement 1 - Firewall and Router Configuration',
        category: 'Network Security',
        priority: 'critical',
        automated: true,
        checkFunction: this.checkFirewallConfiguration.bind(this),
        status: ComplianceStatus.UNKNOWN
      },
      {
        id: 'PCI_REQ3',
        standard: ComplianceStandard.PCI_DSS,
        title: 'Cardholder Data Protection',
        description: 'Protect stored cardholder data',
        requirement: 'Requirement 3 - Cardholder Data Protection',
        category: 'Data Protection',
        priority: 'critical',
        automated: true,
        checkFunction: this.checkCardholderDataProtection.bind(this),
        status: ComplianceStatus.UNKNOWN
      },
      {
        id: 'PCI_REQ8',
        standard: ComplianceStandard.PCI_DSS,
        title: 'Access Control',
        description: 'Identify and authenticate access to system components',
        requirement: 'Requirement 8 - User Access Management',
        category: 'Access Control',
        priority: 'critical',
        automated: true,
        checkFunction: this.checkUserAccessManagement.bind(this),
        status: ComplianceStatus.UNKNOWN
      }
    ];

    controls.forEach(control => {
      this.controls.set(control.id, control);
    });
  }

  /**
   * Run compliance check for a specific standard
   */
  public async runComplianceCheck(standard: ComplianceStandard): Promise<ComplianceReport> {
    this.logger.info('Starting compliance check', { standard });

    const standardControls = Array.from(this.controls.values())
      .filter(control => control.standard === standard);

    const controlResults: Array<{ control: ComplianceControl; result: ComplianceCheckResult }> = [];
    let totalScore = 0;
    let compliantControls = 0;

    for (const control of standardControls) {
      try {
        let result: ComplianceCheckResult;

        if (control.automated && control.checkFunction) {
          result = await control.checkFunction();
        } else {
          result = {
            status: ComplianceStatus.UNKNOWN,
            score: 0,
            evidence: ['Manual verification required'],
            issues: ['Automated check not available'],
            remediation: ['Manual assessment needed'],
            automated: false,
            timestamp: new Date()
          };
        }

        controlResults.push({ control, result });
        totalScore += result.score;
        
        if (result.status === ComplianceStatus.COMPLIANT) {
          compliantControls++;
        }

        // Update control status
        control.status = result.status;
        control.lastCheck = new Date();
        control.nextCheck = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      } catch (error) {
        this.logger.error('Compliance check failed for control', {
          controlId: control.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });

        const errorResult: ComplianceCheckResult = {
          status: ComplianceStatus.UNKNOWN,
          score: 0,
          evidence: [],
          issues: [`Check failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
          remediation: ['Fix automated check implementation'],
          automated: true,
          timestamp: new Date()
        };

        controlResults.push({ control, result: errorResult });
      }
    }

    const overallScore = standardControls.length > 0 ? Math.round(totalScore / standardControls.length) : 0;
    let overallStatus: ComplianceStatus;

    if (overallScore >= 90) overallStatus = ComplianceStatus.COMPLIANT;
    else if (overallScore >= 70) overallStatus = ComplianceStatus.PARTIAL;
    else overallStatus = ComplianceStatus.NON_COMPLIANT;

    const recommendations = this.generateRecommendations(controlResults);

    const report: ComplianceReport = {
      standard,
      overallStatus,
      overallScore,
      totalControls: standardControls.length,
      compliantControls,
      controls: controlResults,
      recommendations,
      generatedAt: new Date(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // Valid for 90 days
    };

    this.lastReports.set(standard, report);
    
    this.logger.info('Compliance check completed', {
      standard,
      overallScore,
      overallStatus,
      compliantControls,
      totalControls: standardControls.length
    });

    return report;
  }

  /**
   * Get the latest compliance report for a standard
   */
  public getLatestReport(standard: ComplianceStandard): ComplianceReport | null {
    return this.lastReports.get(standard) || null;
  }

  /**
   * Get compliance summary for all standards
   */
  public getComplianceSummary(): {
    standards: Record<ComplianceStandard, {
      status: ComplianceStatus;
      score: number;
      lastCheck: Date | null;
    }>;
    overallHealth: 'healthy' | 'warning' | 'critical';
  } {
    const standards: Record<string, any> = {};
    let totalScore = 0;
    let standardCount = 0;

    Object.values(ComplianceStandard).forEach(standard => {
      const report = this.lastReports.get(standard);
      standards[standard] = {
        status: report?.overallStatus || ComplianceStatus.UNKNOWN,
        score: report?.overallScore || 0,
        lastCheck: report?.generatedAt || null
      };

      if (report) {
        totalScore += report.overallScore;
        standardCount++;
      }
    });

    const averageScore = standardCount > 0 ? totalScore / standardCount : 0;
    let overallHealth: 'healthy' | 'warning' | 'critical' = 'healthy';

    if (averageScore < 70) overallHealth = 'critical';
    else if (averageScore < 85) overallHealth = 'warning';

    return { standards, overallHealth };
  }

  // Automated Check Functions

  private async checkControlEnvironment(): Promise<ComplianceCheckResult> {
    const evidence = [];
    const issues = [];
    const remediation = [];
    let score = 100;

    // Check if security policies are in place
    if (!process.env.SECURITY_POLICY_VERSION) {
      issues.push('No documented security policy version found');
      remediation.push('Document and version security policies');
      score -= 25;
    } else {
      evidence.push('Security policy version documented');
    }

    // Check if there's a designated security officer
    if (!process.env.SECURITY_OFFICER_EMAIL) {
      issues.push('No designated security officer found');
      remediation.push('Assign a security officer and document contact information');
      score -= 25;
    } else {
      evidence.push('Security officer designated');
    }

    // Check logging and monitoring
    const securityHealth = this.securityManager.getSecurityHealth();
    if (securityHealth.status !== 'healthy') {
      issues.push('Security monitoring not fully operational');
      remediation.push('Address security monitoring issues');
      score -= 20;
    } else {
      evidence.push('Security monitoring operational');
    }

    return {
      status: score >= 80 ? ComplianceStatus.COMPLIANT : 
              score >= 60 ? ComplianceStatus.PARTIAL : ComplianceStatus.NON_COMPLIANT,
      score: Math.max(0, score),
      evidence,
      issues,
      remediation,
      automated: true,
      timestamp: new Date()
    };
  }

  private async checkCommunicationControls(): Promise<ComplianceCheckResult> {
    const evidence = [];
    const issues = [];
    const remediation = [];
    let score = 100;

    // Check if audit logging is enabled
    if (!process.env.AUDIT_LOGGING_ENABLED || process.env.AUDIT_LOGGING_ENABLED !== 'true') {
      issues.push('Audit logging not enabled');
      remediation.push('Enable comprehensive audit logging');
      score -= 30;
    } else {
      evidence.push('Audit logging enabled');
    }

    // Check if there's incident response documentation
    if (!process.env.INCIDENT_RESPONSE_PLAN) {
      issues.push('No incident response plan documented');
      remediation.push('Create and document incident response procedures');
      score -= 25;
    } else {
      evidence.push('Incident response plan documented');
    }

    // Check security awareness training
    if (!process.env.SECURITY_TRAINING_PROGRAM) {
      issues.push('No security training program documented');
      remediation.push('Implement security awareness training program');
      score -= 20;
    } else {
      evidence.push('Security training program in place');
    }

    return {
      status: score >= 80 ? ComplianceStatus.COMPLIANT : 
              score >= 60 ? ComplianceStatus.PARTIAL : ComplianceStatus.NON_COMPLIANT,
      score: Math.max(0, score),
      evidence,
      issues,
      remediation,
      automated: true,
      timestamp: new Date()
    };
  }

  private async checkAccessControls(): Promise<ComplianceCheckResult> {
    const evidence = [];
    const issues = [];
    const remediation = [];
    let score = 100;

    // Check authentication mechanisms
    if (!process.env.NEXTAUTH_SECRET) {
      issues.push('Authentication secret not properly configured');
      remediation.push('Configure strong authentication secret');
      score -= 30;
    } else {
      evidence.push('Authentication system configured');
    }

    // Check password policy
    const securityHealth = this.securityManager.getSecurityHealth();
    if (!securityHealth.checks.passwordPolicyEnforced) {
      issues.push('Password policy not enforced');
      remediation.push('Implement and enforce strong password policy');
      score -= 25;
    } else {
      evidence.push('Password policy enforced');
    }

    // Check MFA
    if (!securityHealth.checks.mfaConfigured) {
      issues.push('Multi-factor authentication not configured');
      remediation.push('Implement multi-factor authentication');
      score -= 25;
    } else {
      evidence.push('Multi-factor authentication configured');
    }

    // Check role-based access
    if (!process.env.RBAC_ENABLED || process.env.RBAC_ENABLED !== 'true') {
      issues.push('Role-based access control not fully implemented');
      remediation.push('Implement comprehensive RBAC system');
      score -= 20;
    } else {
      evidence.push('Role-based access control implemented');
    }

    return {
      status: score >= 80 ? ComplianceStatus.COMPLIANT : 
              score >= 60 ? ComplianceStatus.PARTIAL : ComplianceStatus.NON_COMPLIANT,
      score: Math.max(0, score),
      evidence,
      issues,
      remediation,
      automated: true,
      timestamp: new Date()
    };
  }

  private async checkSystemOperations(): Promise<ComplianceCheckResult> {
    const evidence = [];
    const issues = [];
    const remediation = [];
    let score = 100;

    // Check monitoring systems
    const securityHealth = this.securityManager.getSecurityHealth();
    if (securityHealth.status === 'critical') {
      issues.push('Critical issues in security monitoring');
      remediation.push('Address critical security monitoring issues');
      score -= 40;
    } else if (securityHealth.status === 'warning') {
      issues.push('Warnings in security monitoring');
      remediation.push('Address security monitoring warnings');
      score -= 20;
    } else {
      evidence.push('Security monitoring healthy');
    }

    // Check backup procedures
    if (!process.env.BACKUP_POLICY) {
      issues.push('No backup policy documented');
      remediation.push('Document and implement backup procedures');
      score -= 25;
    } else {
      evidence.push('Backup policy documented');
    }

    // Check change management
    if (!process.env.CHANGE_MANAGEMENT_PROCESS) {
      issues.push('No change management process documented');
      remediation.push('Implement formal change management process');
      score -= 25;
    } else {
      evidence.push('Change management process documented');
    }

    return {
      status: score >= 80 ? ComplianceStatus.COMPLIANT : 
              score >= 60 ? ComplianceStatus.PARTIAL : ComplianceStatus.NON_COMPLIANT,
      score: Math.max(0, score),
      evidence,
      issues,
      remediation,
      automated: true,
      timestamp: new Date()
    };
  }

  private async checkAvailabilityControls(): Promise<ComplianceCheckResult> {
    const evidence = [];
    const issues = [];
    const remediation = [];
    let score = 100;

    // Check SLA documentation
    if (!process.env.SLA_AVAILABILITY_TARGET) {
      issues.push('No availability SLA target documented');
      remediation.push('Document availability commitments and SLA targets');
      score -= 30;
    } else {
      evidence.push('Availability SLA documented');
    }

    // Check monitoring and alerting
    const securityHealth = this.securityManager.getSecurityHealth();
    if (!securityHealth.checks.rateLimitingEnabled) {
      issues.push('Rate limiting not enabled for availability protection');
      remediation.push('Enable rate limiting to protect system availability');
      score -= 25;
    } else {
      evidence.push('Rate limiting enabled for availability protection');
    }

    // Check disaster recovery
    if (!process.env.DISASTER_RECOVERY_PLAN) {
      issues.push('No disaster recovery plan documented');
      remediation.push('Create and document disaster recovery procedures');
      score -= 25;
    } else {
      evidence.push('Disaster recovery plan documented');
    }

    return {
      status: score >= 80 ? ComplianceStatus.COMPLIANT : 
              score >= 60 ? ComplianceStatus.PARTIAL : ComplianceStatus.NON_COMPLIANT,
      score: Math.max(0, score),
      evidence,
      issues,
      remediation,
      automated: true,
      timestamp: new Date()
    };
  }

  private async checkDataProtectionByDesign(): Promise<ComplianceCheckResult> {
    const evidence = [];
    const issues = [];
    const remediation = [];
    let score = 100;

    // Check encryption
    if (!process.env.ENCRYPTION_MASTER_KEY) {
      issues.push('Data encryption not properly configured');
      remediation.push('Implement encryption for personal data');
      score -= 30;
    } else {
      evidence.push('Data encryption configured');
    }

    // Check data minimization
    if (!process.env.DATA_RETENTION_POLICY) {
      issues.push('No data retention policy documented');
      remediation.push('Implement data minimization and retention policies');
      score -= 25;
    } else {
      evidence.push('Data retention policy documented');
    }

    // Check privacy by default settings
    if (!process.env.PRIVACY_BY_DEFAULT) {
      issues.push('Privacy by default not implemented');
      remediation.push('Configure privacy-friendly default settings');
      score -= 25;
    } else {
      evidence.push('Privacy by default implemented');
    }

    return {
      status: score >= 80 ? ComplianceStatus.COMPLIANT : 
              score >= 60 ? ComplianceStatus.PARTIAL : ComplianceStatus.NON_COMPLIANT,
      score: Math.max(0, score),
      evidence,
      issues,
      remediation,
      automated: true,
      timestamp: new Date()
    };
  }

  private async checkSecurityOfProcessing(): Promise<ComplianceCheckResult> {
    const evidence = [];
    const issues = [];
    const remediation = [];
    let score = 100;

    // Check encryption in transit
    if (process.env.NODE_ENV === 'production' && !process.env.FORCE_HTTPS) {
      issues.push('HTTPS not enforced for production');
      remediation.push('Enforce HTTPS for all communications');
      score -= 30;
    } else {
      evidence.push('Secure communications enforced');
    }

    // Check access controls
    const securityHealth = this.securityManager.getSecurityHealth();
    if (!securityHealth.checks.vaultManagerActive) {
      issues.push('Secure credential management not active');
      remediation.push('Activate secure credential management system');
      score -= 25;
    } else {
      evidence.push('Secure credential management active');
    }

    // Check intrusion detection
    if (!securityHealth.checks.intrusionDetectionEnabled) {
      issues.push('Intrusion detection not enabled');
      remediation.push('Enable intrusion detection system');
      score -= 25;
    } else {
      evidence.push('Intrusion detection system enabled');
    }

    return {
      status: score >= 80 ? ComplianceStatus.COMPLIANT : 
              score >= 60 ? ComplianceStatus.PARTIAL : ComplianceStatus.NON_COMPLIANT,
      score: Math.max(0, score),
      evidence,
      issues,
      remediation,
      automated: true,
      timestamp: new Date()
    };
  }

  private async checkFirewallConfiguration(): Promise<ComplianceCheckResult> {
    const evidence = [];
    const issues = [];
    const remediation = [];
    let score = 100;

    // Check rate limiting (acts as application firewall)
    const securityHealth = this.securityManager.getSecurityHealth();
    if (!securityHealth.checks.rateLimitingEnabled) {
      issues.push('Application-level rate limiting not enabled');
      remediation.push('Enable rate limiting as application firewall');
      score -= 30;
    } else {
      evidence.push('Application-level rate limiting enabled');
    }

    // Check input validation
    if (!process.env.INPUT_VALIDATION_ENABLED || process.env.INPUT_VALIDATION_ENABLED !== 'true') {
      issues.push('Input validation not properly configured');
      remediation.push('Enable comprehensive input validation');
      score -= 35;
    } else {
      evidence.push('Input validation configured');
    }

    // Check CSP headers
    if (!process.env.CSP_ENABLED || process.env.CSP_ENABLED !== 'true') {
      issues.push('Content Security Policy headers not configured');
      remediation.push('Configure Content Security Policy headers');
      score -= 35;
    } else {
      evidence.push('Content Security Policy headers configured');
    }

    return {
      status: score >= 80 ? ComplianceStatus.COMPLIANT : 
              score >= 60 ? ComplianceStatus.PARTIAL : ComplianceStatus.NON_COMPLIANT,
      score: Math.max(0, score),
      evidence,
      issues,
      remediation,
      automated: true,
      timestamp: new Date()
    };
  }

  private async checkCardholderDataProtection(): Promise<ComplianceCheckResult> {
    const evidence = [];
    const issues = [];
    const remediation = [];
    let score = 100;

    // Check if cardholder data is stored (should not be)
    if (process.env.STORES_CARDHOLDER_DATA === 'true') {
      issues.push('Application configured to store cardholder data');
      remediation.push('Eliminate cardholder data storage or implement PCI DSS requirements');
      score -= 50;
    } else {
      evidence.push('No cardholder data storage configured');
    }

    // Check encryption
    if (!process.env.ENCRYPTION_MASTER_KEY) {
      issues.push('Encryption not properly configured for sensitive data');
      remediation.push('Implement strong encryption for any sensitive data');
      score -= 30;
    } else {
      evidence.push('Encryption configured for sensitive data');
    }

    // Check secure transmission
    if (process.env.NODE_ENV === 'production' && !process.env.FORCE_HTTPS) {
      issues.push('Secure transmission not enforced');
      remediation.push('Enforce HTTPS for all transmissions');
      score -= 20;
    } else {
      evidence.push('Secure transmission enforced');
    }

    return {
      status: score >= 80 ? ComplianceStatus.COMPLIANT : 
              score >= 60 ? ComplianceStatus.PARTIAL : ComplianceStatus.NON_COMPLIANT,
      score: Math.max(0, score),
      evidence,
      issues,
      remediation,
      automated: true,
      timestamp: new Date()
    };
  }

  private async checkUserAccessManagement(): Promise<ComplianceCheckResult> {
    const evidence = [];
    const issues = [];
    const remediation = [];
    let score = 100;

    // Check unique user identification
    if (!process.env.UNIQUE_USER_IDS || process.env.UNIQUE_USER_IDS !== 'true') {
      issues.push('Unique user identification not enforced');
      remediation.push('Ensure each user has a unique identifier');
      score -= 25;
    } else {
      evidence.push('Unique user identification enforced');
    }

    // Check authentication controls
    const securityHealth = this.securityManager.getSecurityHealth();
    if (!securityHealth.checks.mfaConfigured) {
      issues.push('Multi-factor authentication not implemented');
      remediation.push('Implement multi-factor authentication');
      score -= 30;
    } else {
      evidence.push('Multi-factor authentication implemented');
    }

    // Check password policy
    if (!securityHealth.checks.passwordPolicyEnforced) {
      issues.push('Strong password policy not enforced');
      remediation.push('Implement and enforce strong password requirements');
      score -= 25;
    } else {
      evidence.push('Strong password policy enforced');
    }

    // Check session management
    if (!process.env.SESSION_TIMEOUT || parseInt(process.env.SESSION_TIMEOUT) > 900) {
      issues.push('Session timeout not appropriately configured');
      remediation.push('Configure session timeout to 15 minutes or less');
      score -= 20;
    } else {
      evidence.push('Appropriate session timeout configured');
    }

    return {
      status: score >= 80 ? ComplianceStatus.COMPLIANT : 
              score >= 60 ? ComplianceStatus.PARTIAL : ComplianceStatus.NON_COMPLIANT,
      score: Math.max(0, score),
      evidence,
      issues,
      remediation,
      automated: true,
      timestamp: new Date()
    };
  }

  private generateRecommendations(controlResults: Array<{ control: ComplianceControl; result: ComplianceCheckResult }>): string[] {
    const recommendations: string[] = [];
    const criticalIssues = controlResults.filter(cr => 
      cr.control.priority === 'critical' && cr.result.status !== ComplianceStatus.COMPLIANT
    );

    if (criticalIssues.length > 0) {
      recommendations.push(`Address ${criticalIssues.length} critical compliance issues immediately`);
    }

    const nonCompliantControls = controlResults.filter(cr => 
      cr.result.status === ComplianceStatus.NON_COMPLIANT
    );

    if (nonCompliantControls.length > 0) {
      recommendations.push(`${nonCompliantControls.length} controls are non-compliant and require immediate attention`);
    }

    const partialControls = controlResults.filter(cr => 
      cr.result.status === ComplianceStatus.PARTIAL
    );

    if (partialControls.length > 0) {
      recommendations.push(`${partialControls.length} controls are partially compliant and need improvement`);
    }

    // Add specific recommendations based on common issues
    const allIssues = controlResults.flatMap(cr => cr.result.issues);
    const allRemediations = controlResults.flatMap(cr => cr.result.remediation);

    const uniqueRemediations = [...new Set(allRemediations)];
    recommendations.push(...uniqueRemediations.slice(0, 5)); // Top 5 most common remediations

    return recommendations;
  }

  private startPeriodicChecks(): void {
    // Run compliance checks weekly
    setInterval(async () => {
      for (const standard of Object.values(ComplianceStandard)) {
        try {
          await this.runComplianceCheck(standard);
        } catch (error) {
          this.logger.error('Periodic compliance check failed', {
            standard,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    }, 7 * 24 * 60 * 60 * 1000); // Weekly

    this.logger.info('Periodic compliance checks scheduled');
  }

  /**
   * Export compliance report
   */
  public exportReport(standard: ComplianceStandard, format: 'json' | 'csv' = 'json'): string {
    const report = this.getLatestReport(standard);
    if (!report) {
      throw new Error(`No report available for ${standard}`);
    }

    if (format === 'csv') {
      const headers = ['Control ID', 'Title', 'Status', 'Score', 'Issues', 'Remediation'];
      const rows = report.controls.map(({ control, result }) => [
        control.id,
        `"${control.title}"`,
        result.status,
        result.score,
        `"${result.issues.join('; ')}"`,
        `"${result.remediation.join('; ')}"`
      ]);

      return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }

    return JSON.stringify(report, null, 2);
  }
}

export default ComplianceManager;