import { BaseValidationAgent } from './BaseValidationAgent';
import { 
  ValidationResult, 
  MappedData, 
  MEXICAN_RFC_PATTERN 
} from '../types/ValidationTypes';

export class RFCValidationAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'RFC Validation Agent',
      description: 'Validates Mexican RFC format, structure, and extracts birth dates',
      priority: 2,
      dependencies: [],
      timeout: 10000 // 10 seconds
    });
  }

  public async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    try {
      // Validate Active Personnel RFCs
      const activePersonnelResults = await this.validateActivePersonnelRFCs(data);
      results.push(...activePersonnelResults);
      
      // Validate Terminations RFCs
      const terminationsResults = await this.validateTerminationsRFCs(data);
      results.push(...terminationsResults);
      
      // Summary result
      const totalValidated = data.activePersonnel.length + data.terminations.length;
      const totalErrors = results.filter(r => r.severity === 'critical').length;
      const totalWarnings = results.filter(r => r.severity === 'warning').length;
      
      if (totalErrors === 0 && totalWarnings === 0) {
        results.push(
          this.createSuccessResult(
            'RFC Validation',
            `${totalValidated} RFCs validados exitosamente - Todos conformes`,
            { totalValidated, totalErrors, totalWarnings }
          )
        );
      }
      
    } catch (error) {
      results.push(
        this.createErrorResult(
          'RFC Validation',
          `Error durante validación de RFCs: ${error instanceof Error ? error.message : 'Error desconocido'}`
        )
      );
    }
    
    return results;
  }

  private async validateActivePersonnelRFCs(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const invalidRFCs: number[] = [];
    const extractedBirthDates: number[] = [];
    const suspiciousRFCs: number[] = [];

    for (let i = 0; i < data.activePersonnel.length; i++) {
      const employee = data.activePersonnel[i];
      const rowIndex = employee.rowIndex || i + 2; // +2 for header and 1-based indexing
      
      // Check if RFC is in birth date field (common client error)
      const rfcFromBirthDate = this.extractRFCFromMixed(employee.birthDate);
      const explicitRFC = this.cleanString(employee.rfc);
      
      let rfcToValidate = explicitRFC || rfcFromBirthDate;
      
      if (!rfcToValidate) {
        // No RFC found - check if we have birth date instead
        const birthDate = this.parseDate(employee.birthDate);
        if (!birthDate && !rfcFromBirthDate) {
          results.push(
            this.createErrorResult(
              'RFC Missing',
              `Empleado ${employee.employeeCode || rowIndex} sin RFC ni fecha de nacimiento`,
              'Proporcionar RFC válido o fecha de nacimiento',
              [rowIndex]
            )
          );
        }
        continue;
      }

      // Validate RFC format
      const validationResult = this.validateRFCFormat(rfcToValidate);
      
      if (!validationResult.isValid) {
        invalidRFCs.push(rowIndex);
        results.push(
          this.createErrorResult(
            'RFC Format',
            `RFC inválido: ${rfcToValidate} - ${validationResult.error}`,
            'Corregir formato de RFC según estándares SAT',
            [rowIndex],
            { rfc: rfcToValidate, error: validationResult.error }
          )
        );
        continue;
      }

      // Extract birth date from RFC
      const birthDateFromRFC = this.extractBirthDateFromRFC(rfcToValidate);
      if (birthDateFromRFC) {
        extractedBirthDates.push(rowIndex);
        
        // Check if extracted date seems reasonable
        const age = this.calculateAge(birthDateFromRFC);
        if (age < 16 || age > 70) {
          suspiciousRFCs.push(rowIndex);
          results.push(
            this.createWarningResult(
              'RFC Birth Date',
              `RFC ${rfcToValidate} indica edad de ${age} años - Revisar fecha`,
              'Verificar que el RFC corresponde a la persona correcta',
              [rowIndex],
              { rfc: rfcToValidate, extractedAge: age, extractedBirthDate: birthDateFromRFC }
            )
          );
        }
      }

      // Cross-validate with explicit birth date if available
      const explicitBirthDate = this.parseDate(employee.birthDate);
      if (explicitBirthDate && birthDateFromRFC) {
        const daysDiff = Math.abs(explicitBirthDate.getTime() - birthDateFromRFC.getTime()) / (1000 * 60 * 60 * 24);
        if (daysDiff > 7) { // Allow for some tolerance
          results.push(
            this.createWarningResult(
              'RFC Birth Date Mismatch',
              `RFC y fecha de nacimiento no coinciden para empleado ${employee.employeeCode || rowIndex}`,
              'Verificar cuál fecha es correcta',
              [rowIndex],
              { 
                rfc: rfcToValidate, 
                rfcDate: birthDateFromRFC, 
                explicitDate: explicitBirthDate,
                daysDifference: Math.round(daysDiff)
              }
            )
          );
        }
      }
    }

    // Summary for active personnel
    if (extractedBirthDates.length > 0) {
      results.push(
        this.createSuccessResult(
          'RFC Birth Date Extraction',
          `${extractedBirthDates.length} fechas de nacimiento extraídas exitosamente de RFCs`,
          { extractedCount: extractedBirthDates.length, affectedRows: extractedBirthDates }
        )
      );
    }

    return results;
  }

  private async validateTerminationsRFCs(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const invalidRFCs: number[] = [];

    for (let i = 0; i < data.terminations.length; i++) {
      const termination = data.terminations[i];
      const rowIndex = termination.rowIndex || i + 2;
      
      const rfcFromBirthDate = this.extractRFCFromMixed(termination.birthDate);
      const explicitRFC = this.cleanString(termination.rfc);
      
      let rfcToValidate = explicitRFC || rfcFromBirthDate;
      
      if (!rfcToValidate) {
        // Check if we have birth date
        const birthDate = this.parseDate(termination.birthDate);
        if (!birthDate && !rfcFromBirthDate) {
          results.push(
            this.createWarningResult(
              'RFC Missing (Termination)',
              `Empleado terminado ${termination.employeeCode || rowIndex} sin RFC ni fecha de nacimiento`,
              'RFC ayuda a validar cálculos de beneficios',
              [rowIndex]
            )
          );
        }
        continue;
      }

      const validationResult = this.validateRFCFormat(rfcToValidate);
      
      if (!validationResult.isValid) {
        invalidRFCs.push(rowIndex);
        results.push(
          this.createErrorResult(
            'RFC Format (Termination)',
            `RFC inválido en terminación: ${rfcToValidate}`,
            'Corregir formato de RFC',
            [rowIndex],
            { rfc: rfcToValidate, error: validationResult.error }
          )
        );
      }
    }

    return results;
  }

  private validateRFCFormat(rfc: string): { isValid: boolean; error?: string } {
    if (!rfc || typeof rfc !== 'string') {
      return { isValid: false, error: 'RFC vacío o no válido' };
    }

    const cleanRFC = rfc.trim().toUpperCase();
    
    // Check length
    if (cleanRFC.length !== 13) {
      return { isValid: false, error: `Longitud incorrecta: ${cleanRFC.length} caracteres (debe ser 13)` };
    }

    // Check pattern
    if (!MEXICAN_RFC_PATTERN.test(cleanRFC)) {
      return { isValid: false, error: 'Formato no coincide con estándar SAT' };
    }

    // Additional business logic checks
    const letters = cleanRFC.substring(0, 4);
    const datepart = cleanRFC.substring(4, 10);
    
    // Check for forbidden words (basic check)
    const forbiddenWords = ['BUEI', 'BUEY', 'CACA', 'CAGA', 'CAKA', 'COGE', 'COJA', 'COJE', 'CULO', 'FETO', 'GUEY', 'JOTO', 'KACA', 'KAGA', 'KOGE', 'KOJO', 'KULO', 'MAME', 'MAMO', 'MEAR', 'MEAS', 'MEON', 'MIAR', 'MION', 'MOCO', 'MULA', 'PEDA', 'PEDO', 'PENE', 'PUTA', 'PUTO', 'QULO', 'RATA', 'RULN'];
    
    if (forbiddenWords.includes(letters)) {
      return { isValid: false, error: 'RFC contiene palabra no permitida por SAT' };
    }

    // Validate date part
    const year = parseInt(datepart.substring(0, 2));
    const month = parseInt(datepart.substring(2, 4));
    const day = parseInt(datepart.substring(4, 6));

    if (month < 1 || month > 12) {
      return { isValid: false, error: `Mes inválido en RFC: ${month}` };
    }

    if (day < 1 || day > 31) {
      return { isValid: false, error: `Día inválido en RFC: ${day}` };
    }

    // Basic date validation
    let fullYear = year;
    if (year <= 10) {
      fullYear += 2000;
    } else {
      fullYear += 1900;
    }

    if (!this.isReasonableYear(fullYear, 'birth')) {
      return { isValid: false, error: `Año de nacimiento no razonable: ${fullYear}` };
    }

    return { isValid: true };
  }
}