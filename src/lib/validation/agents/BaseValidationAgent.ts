import { 
  ValidationResult, 
  ValidationSeverity, 
  ValidationStatus, 
  MappedData, 
  AgentConfiguration 
} from '../types/ValidationTypes';

export abstract class BaseValidationAgent {
  protected name: string;
  protected description: string;
  protected priority: number;
  protected dependencies: string[];
  protected timeout: number;

  constructor(config: AgentConfiguration) {
    this.name = config.name;
    this.description = config.description;
    this.priority = config.priority;
    this.dependencies = config.dependencies;
    this.timeout = config.timeout;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getPriority(): number {
    return this.priority;
  }

  public getDependencies(): string[] {
    return this.dependencies;
  }

  // Abstract method that each agent must implement
  public abstract validate(data: MappedData): Promise<ValidationResult[]>;

  // Helper methods for creating validation results
  protected createResult(
    field: string,
    message: string,
    severity: ValidationSeverity,
    status: ValidationStatus = severity === 'critical' ? 'error' : 
             severity === 'warning' ? 'warning' : 'success',
    suggestion?: string,
    affectedRows?: number[],
    metadata?: Record<string, any>
  ): ValidationResult {
    return {
      agent: this.name,
      field,
      message,
      severity,
      status,
      suggestion,
      affectedRows,
      metadata
    };
  }

  protected createSuccessResult(
    field: string,
    message: string,
    metadata?: Record<string, any>
  ): ValidationResult {
    return this.createResult(field, message, 'info', 'success', undefined, undefined, metadata);
  }

  protected createWarningResult(
    field: string,
    message: string,
    suggestion?: string,
    affectedRows?: number[],
    metadata?: Record<string, any>
  ): ValidationResult {
    return this.createResult(field, message, 'warning', 'warning', suggestion, affectedRows, metadata);
  }

  protected createErrorResult(
    field: string,
    message: string,
    suggestion?: string,
    affectedRows?: number[],
    metadata?: Record<string, any>
  ): ValidationResult {
    return this.createResult(field, message, 'critical', 'error', suggestion, affectedRows, metadata);
  }

  // Helper method for date validation
  protected parseDate(dateValue: any): Date | null {
    if (!dateValue) return null;
    
    if (dateValue instanceof Date) {
      return isNaN(dateValue.getTime()) ? null : dateValue;
    }
    
    if (typeof dateValue === 'string') {
      // Handle multiple date formats
      const formats = [
        /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
        /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
        /^\d{1,2}\/\d{1,2}\/\d{4}$/, // D/M/YYYY
        /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
        /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
      ];
      
      for (const format of formats) {
        if (format.test(dateValue.trim())) {
          let parsedDate: Date;
          
          if (dateValue.includes('-')) {
            if (dateValue.startsWith('20') || dateValue.startsWith('19')) {
              // YYYY-MM-DD
              parsedDate = new Date(dateValue);
            } else {
              // DD-MM-YYYY
              const parts = dateValue.split('-');
              parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
          } else {
            // Handle slash formats
            const parts = dateValue.split('/');
            if (parts[2].length === 4) {
              // DD/MM/YYYY or D/M/YYYY
              parsedDate = new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`);
            } else {
              // YYYY/MM/DD
              parsedDate = new Date(dateValue);
            }
          }
          
          return isNaN(parsedDate.getTime()) ? null : parsedDate;
        }
      }
    }
    
    if (typeof dateValue === 'number') {
      // Handle Excel serial dates
      if (dateValue > 25000 && dateValue < 50000) {
        const excelEpoch = new Date(1900, 0, 1);
        const date = new Date(excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000);
        return isNaN(date.getTime()) ? null : date;
      }
    }
    
    return null;
  }

  // Helper method for RFC extraction from date field
  protected extractRFCFromMixed(value: any): string | null {
    if (typeof value === 'string' && value.length >= 10) {
      // Look for RFC pattern in the string
      const rfcMatch = value.match(/[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]/);
      return rfcMatch ? rfcMatch[0] : null;
    }
    return null;
  }

  // Helper method for extracting birth date from RFC
  protected extractBirthDateFromRFC(rfc: string): Date | null {
    if (!rfc || rfc.length < 10) return null;
    
    try {
      // RFC format: AAAA######??? where ###### is YYMMDD
      const yearPart = rfc.substring(4, 6);
      const monthPart = rfc.substring(6, 8);
      const dayPart = rfc.substring(8, 10);
      
      // Determine century (assuming people born between 1940-2010)
      let fullYear = parseInt(yearPart);
      if (fullYear <= 10) {
        fullYear += 2000; // 00-10 = 2000-2010
      } else {
        fullYear += 1900; // 11-99 = 1911-1999
      }
      
      const month = parseInt(monthPart);
      const day = parseInt(dayPart);
      
      // Validate ranges
      if (month < 1 || month > 12 || day < 1 || day > 31) {
        return null;
      }
      
      const birthDate = new Date(fullYear, month - 1, day);
      return isNaN(birthDate.getTime()) ? null : birthDate;
    } catch {
      return null;
    }
  }

  // Helper method for numeric validation
  protected parseNumeric(value: any): number | null {
    if (typeof value === 'number' && !isNaN(value)) {
      return value;
    }
    
    if (typeof value === 'string') {
      // Remove common currency symbols and formatting
      const cleaned = value
        .replace(/[$,\s]/g, '') // Remove $, commas, spaces
        .replace(/[^\d.-]/g, '') // Keep only digits, dots, and dashes
        .trim();
      
      if (cleaned === '' || cleaned === '-') return null;
      
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? null : parsed;
    }
    
    return null;
  }

  // Helper method for string cleaning
  protected cleanString(value: any): string | null {
    if (typeof value !== 'string') {
      if (value === null || value === undefined) return null;
      value = String(value);
    }
    
    const cleaned = value.trim().toUpperCase();
    return cleaned === '' ? null : cleaned;
  }

  // Helper method to check if a year is reasonable for employment
  protected isReasonableYear(year: number, context: 'birth' | 'hire'): boolean {
    const currentYear = new Date().getFullYear();
    
    if (context === 'birth') {
      return year >= 1940 && year <= (currentYear - 16); // At least 16 years old
    } else if (context === 'hire') {
      return year >= 1970 && year <= currentYear; // Reasonable hire year range
    }
    
    return false;
  }

  // Helper method to calculate age at a specific date
  protected calculateAge(birthDate: Date, referenceDate: Date = new Date()): number {
    const age = referenceDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    
    return age;
  }

  // Helper method to calculate service years
  protected calculateServiceYears(hireDate: Date, referenceDate: Date = new Date()): number {
    const years = referenceDate.getFullYear() - hireDate.getFullYear();
    const monthDiff = referenceDate.getMonth() - hireDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < hireDate.getDate())) {
      return Math.max(0, years - 1);
    }
    
    return Math.max(0, years);
  }

  // Helper method to extract birth date from personnel record
  protected extractBirthDate(person: any): Date | null {
    // Try different possible field names for birth date
    const possibleFields = [
      'fechaNacimiento', 'fecha_nacimiento', 'nacimiento',
      'birthDate', 'birth_date', 'dateOfBirth', 
      'fechanac', 'fecnac'
    ];
    
    for (const field of possibleFields) {
      if (person[field]) {
        const date = this.parseDate(person[field]);
        if (date) return date;
      }
    }
    
    // Try extracting from RFC if available
    if (person.rfc || person.RFC) {
      return this.extractBirthDateFromRFC(person.rfc || person.RFC);
    }
    
    return null;
  }

  // Helper method to extract hire date from personnel record
  protected extractHireDate(person: any): Date | null {
    // Try different possible field names for hire date
    const possibleFields = [
      'fechaIngreso', 'fecha_ingreso', 'ingreso',
      'hireDate', 'hire_date', 'dateOfHire',
      'fechaalta', 'fecalta', 'startDate'
    ];
    
    for (const field of possibleFields) {
      if (person[field]) {
        const date = this.parseDate(person[field]);
        if (date) return date;
      }
    }
    
    return null;
  }

  // Timeout wrapper for validation execution
  protected async executeWithTimeout<T>(
    operation: Promise<T>, 
    timeoutMs: number = this.timeout
  ): Promise<T> {
    return Promise.race([
      operation,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`${this.name} timed out after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  }
}