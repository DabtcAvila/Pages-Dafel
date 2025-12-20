import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class IMSSValidatorAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'IMSS Validator Expert',
      description: 'Especialista en validación de números IMSS con verificación de dígito verificador',
      priority: 8,
      dependencies: [],
      timeout: 15000
    });
  }

  async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      // Validate active personnel IMSS numbers
      if (data.activePersonnel && data.activePersonnel.length > 0) {
        const personnelResults = await this.validatePersonnelIMSS(data.activePersonnel);
        results.push(...personnelResults);
      }

      // Validate terminations IMSS numbers
      if (data.terminations && data.terminations.length > 0) {
        const terminationResults = await this.validateTerminationIMSS(data.terminations);
        results.push(...terminationResults);
      }

      // IMSS duplication and pattern analysis
      const patternResults = await this.performIMSSPatternAnalysis(data);
      results.push(...patternResults);

    } catch (error) {
      results.push(this.createErrorResult(
        'IMSS System Error',
        `Error crítico en validación IMSS: ${error.message}`,
        'Revisar formato de números IMSS en el archivo'
      ));
    }

    return results;
  }

  private async validatePersonnelIMSS(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const imssCounts: Map<string, number[]> = new Map();

    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const rowNumber = i + 2;
      
      const imssNumber = this.extractIMSSFromEmployee(employee);
      
      if (!imssNumber) {
        results.push(this.createErrorResult(
          'IMSS Faltante',
          `Empleado sin número IMSS en fila ${rowNumber}`,
          'Todo empleado debe tener número de seguridad social IMSS',
          [rowNumber]
        ));
        continue;
      }

      // Deep IMSS validation
      const imssValidation = this.performDeepIMSSValidation(imssNumber, employee, rowNumber);
      if (imssValidation) {
        results.push(imssValidation);
      }

      // Track duplicates
      if (imssCounts.has(imssNumber)) {
        imssCounts.get(imssNumber)!.push(rowNumber);
      } else {
        imssCounts.set(imssNumber, [rowNumber]);
      }
    }

    // Report duplicates
    for (const [imss, rows] of imssCounts) {
      if (rows.length > 1) {
        results.push(this.createErrorResult(
          'IMSS Duplicado',
          `Número IMSS ${imss} aparece en múltiples empleados`,
          'Cada empleado debe tener número IMSS único',
          rows,
          { duplicatedIMSS: imss, occurrences: rows.length }
        ));
      }
    }

    return results;
  }

  private async validateTerminationIMSS(terminations: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (let i = 0; i < terminations.length; i++) {
      const termination = terminations[i];
      const rowNumber = i + 2;
      
      const imssNumber = this.extractIMSSFromEmployee(termination);
      
      if (!imssNumber) {
        results.push(this.createWarningResult(
          'IMSS Faltante en Terminación',
          `Terminación sin número IMSS en fila ${rowNumber}`,
          'Se recomienda incluir número IMSS para procesamiento de baja',
          [rowNumber]
        ));
        continue;
      }

      const validation = this.performDeepIMSSValidation(imssNumber, termination, rowNumber);
      if (validation) {
        results.push(validation);
      }
    }

    return results;
  }

  private extractIMSSFromEmployee(employee: any): string | null {
    const possibleFields = [
      'imss', 'IMSS', 'nss', 'NSS',
      'numeroIMSS', 'numero_imss', 'NUMERO_IMSS',
      'numeroSeguroSocial', 'numero_seguro_social', 'NUMERO_SEGURO_SOCIAL',
      'nss_imss', 'NSS_IMSS', 'seguridadSocial', 'seguridad_social'
    ];

    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string') {
        // Extract 11-digit IMSS number
        const cleaned = employee[field].replace(/[^0-9]/g, '');
        if (cleaned.length === 11 && /^\d{11}$/.test(cleaned)) {
          return cleaned;
        }
      }
      
      // Also try numeric fields
      if (typeof employee[field] === 'number') {
        const numberStr = employee[field].toString();
        if (numberStr.length === 11) {
          return numberStr;
        }
      }
    }

    return null;
  }

  private performDeepIMSSValidation(imssNumber: string, employee: any, rowNumber: number): ValidationResult | null {
    // 1. Basic structure validation
    const structureValidation = this.validateIMSSStructure(imssNumber);
    if (!structureValidation.isValid) {
      return this.createErrorResult(
        'IMSS Estructura Inválida',
        `IMSS ${imssNumber} en fila ${rowNumber}: ${structureValidation.error}`,
        'Número IMSS debe tener exactamente 11 dígitos',
        [rowNumber],
        { invalidIMSS: imssNumber, reason: structureValidation.error }
      );
    }

    // 2. Check digit validation
    const checkDigitValidation = this.validateIMSSCheckDigit(imssNumber);
    if (!checkDigitValidation.isValid) {
      return this.createErrorResult(
        'IMSS Dígito Verificador Inválido',
        `IMSS ${imssNumber} tiene dígito verificador incorrecto`,
        'El dígito verificador no coincide con el algoritmo IMSS',
        [rowNumber],
        { 
          imss: imssNumber, 
          providedCheckDigit: checkDigitValidation.providedDigit,
          expectedCheckDigit: checkDigitValidation.expectedDigit
        }
      );
    }

    // 3. Subdelegation code validation
    const subdelegationValidation = this.validateSubdelegationCode(imssNumber);
    if (!subdelegationValidation.isValid) {
      return this.createWarningResult(
        'IMSS Subdelegación Sospechosa',
        `IMSS ${imssNumber}: código de subdelegación ${subdelegationValidation.code} no es común`,
        'Verificar que el número IMSS sea correcto',
        [rowNumber],
        { imss: imssNumber, subdelegationCode: subdelegationValidation.code }
      );
    }

    // 4. Sequential number analysis
    const sequentialValidation = this.validateSequentialNumber(imssNumber);
    if (!sequentialValidation.isValid) {
      return this.createWarningResult(
        'IMSS Número Secuencial Sospechoso',
        `IMSS ${imssNumber}: ${sequentialValidation.reason}`,
        'Verificar que el número IMSS no sea genérico o de prueba',
        [rowNumber],
        { imss: imssNumber, issue: sequentialValidation.reason }
      );
    }

    // 5. Registration year analysis
    const yearValidation = this.validateRegistrationYear(imssNumber, employee);
    if (yearValidation) {
      return yearValidation;
    }

    return null;
  }

  private validateIMSSStructure(imssNumber: string): { isValid: boolean; error?: string } {
    // IMSS must be exactly 11 digits
    if (imssNumber.length !== 11) {
      return { isValid: false, error: `Longitud incorrecta: ${imssNumber.length} dígitos (debe ser 11)` };
    }

    // Must be all numeric
    if (!/^\d{11}$/.test(imssNumber)) {
      return { isValid: false, error: 'Debe contener solo dígitos numéricos' };
    }

    // Cannot be all zeros or all the same digit
    if (/^(.)\1{10}$/.test(imssNumber)) {
      return { isValid: false, error: 'No puede ser todos los dígitos iguales' };
    }

    // Cannot start with 00
    if (imssNumber.startsWith('00')) {
      return { isValid: false, error: 'No puede iniciar con 00' };
    }

    return { isValid: true };
  }

  private validateIMSSCheckDigit(imssNumber: string): { 
    isValid: boolean; 
    providedDigit?: string; 
    expectedDigit?: string 
  } {
    // IMSS check digit algorithm
    const digits = imssNumber.substring(0, 10);
    const providedCheckDigit = imssNumber.charAt(10);

    const expectedCheckDigit = this.calculateIMSSCheckDigit(digits);

    return {
      isValid: providedCheckDigit === expectedCheckDigit,
      providedDigit: providedCheckDigit,
      expectedDigit: expectedCheckDigit
    };
  }

  private calculateIMSSCheckDigit(digits: string): string {
    // IMSS check digit algorithm (modulo 10 with specific weighting)
    const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
    let sum = 0;

    for (let i = 0; i < 10; i++) {
      let product = parseInt(digits.charAt(i)) * weights[i];
      if (product > 9) {
        product = Math.floor(product / 10) + (product % 10);
      }
      sum += product;
    }

    const remainder = sum % 10;
    return remainder === 0 ? '0' : (10 - remainder).toString();
  }

  private validateSubdelegationCode(imssNumber: string): { isValid: boolean; code?: string } {
    // First two digits represent the subdelegation
    const subdelegationCode = imssNumber.substring(0, 2);
    
    // Common valid subdelegation codes (simplified list)
    const validCodes = [
      '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
      '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
      '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
      '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
      '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
      '51', '52', '53', '54', '55', '56', '57', '58', '59', '60',
      '61', '62', '63', '64', '65', '66', '67', '68', '69', '70',
      '71', '72', '73', '74', '75', '76', '77', '78', '79', '80',
      '81', '82', '83', '84', '85', '86', '87', '88', '89', '90',
      '91', '92', '93', '94', '95', '96', '97'
    ];

    return {
      isValid: validCodes.includes(subdelegationCode),
      code: subdelegationCode
    };
  }

  private validateSequentialNumber(imssNumber: string): { isValid: boolean; reason?: string } {
    // Positions 3-8 represent year and sequential number
    const sequentialPart = imssNumber.substring(2, 8);
    
    // Check for obvious test patterns
    if (sequentialPart === '000000') {
      return { isValid: false, reason: 'Número secuencial es todo ceros' };
    }

    if (sequentialPart === '999999') {
      return { isValid: false, reason: 'Número secuencial es todo nueves' };
    }

    if (sequentialPart === '123456') {
      return { isValid: false, reason: 'Número secuencial es secuencia 123456' };
    }

    if (sequentialPart === '654321') {
      return { isValid: false, reason: 'Número secuencial es secuencia 654321' };
    }

    // Check for repeated patterns
    if (/^(.{2})\1{2}$/.test(sequentialPart)) {
      return { isValid: false, reason: 'Número secuencial tiene patrón repetitivo' };
    }

    return { isValid: true };
  }

  private validateRegistrationYear(imssNumber: string, employee: any): ValidationResult | null {
    // Extract registration year from positions 3-4
    const yearDigits = imssNumber.substring(2, 4);
    let registrationYear: number;

    // Determine century (similar to RFC logic)
    const yearNum = parseInt(yearDigits);
    if (yearNum <= 30) {
      registrationYear = 2000 + yearNum; // 00-30 = 2000-2030
    } else {
      registrationYear = 1900 + yearNum; // 31-99 = 1931-1999
    }

    const currentYear = new Date().getFullYear();

    // Check if registration year is reasonable
    if (registrationYear < 1943) { // IMSS was created in 1943
      return this.createWarningResult(
        'IMSS Año Registro Muy Temprano',
        `IMSS indica registro en ${registrationYear}, antes de la creación del IMSS (1943)`,
        'Verificar que el número IMSS sea correcto',
        [],
        { imss: imssNumber, registrationYear, issue: 'before_imss_creation' }
      );
    }

    if (registrationYear > currentYear) {
      return this.createErrorResult(
        'IMSS Año Registro Futuro',
        `IMSS indica registro en ${registrationYear}, año futuro`,
        'El año de registro no puede ser futuro',
        [],
        { imss: imssNumber, registrationYear, currentYear }
      );
    }

    // Check consistency with hire date if available
    const hireDate = this.extractHireDateFromEmployee(employee);
    if (hireDate) {
      const hireYear = hireDate.getFullYear();
      
      // IMSS registration should be close to hire date
      if (Math.abs(registrationYear - hireYear) > 5) {
        return this.createWarningResult(
          'IMSS Año vs Fecha Ingreso Inconsistente',
          `IMSS registrado en ${registrationYear} pero empleado ingresó en ${hireYear}`,
          'Verificar consistencia entre fecha de registro IMSS e ingreso laboral',
          [],
          { 
            imss: imssNumber, 
            registrationYear, 
            hireYear, 
            yearDifference: Math.abs(registrationYear - hireYear) 
          }
        );
      }
    }

    return null;
  }

  private async performIMSSPatternAnalysis(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    if (!data.activePersonnel) return results;

    // Collect all IMSS numbers
    const imssNumbers: string[] = [];
    for (const employee of data.activePersonnel) {
      const imss = this.extractIMSSFromEmployee(employee);
      if (imss) imssNumbers.push(imss);
    }

    if (imssNumbers.length === 0) return results;

    // Analyze patterns
    const patternAnalysis = this.analyzeIMSSPatterns(imssNumbers);

    // Report suspicious patterns
    if (patternAnalysis.consecutiveNumbers.length > 0) {
      results.push(this.createWarningResult(
        'IMSS Números Consecutivos',
        `Detectados ${patternAnalysis.consecutiveNumbers.length} números IMSS consecutivos`,
        'Números consecutivos pueden indicar asignación en bloque o datos de prueba',
        [],
        { consecutiveIMSS: patternAnalysis.consecutiveNumbers }
      ));
    }

    if (patternAnalysis.sameSubdelegation.size === 1 && imssNumbers.length > 50) {
      results.push(this.createWarningResult(
        'IMSS Misma Subdelegación',
        'Todos los empleados tienen IMSS de la misma subdelegación',
        'Verificar si es correcto que todos sean de la misma región',
        [],
        { subdelegation: Array.from(patternAnalysis.sameSubdelegation)[0] }
      ));
    }

    if (patternAnalysis.suspiciousYears.length > 0) {
      results.push(this.createWarningResult(
        'IMSS Años Registro Concentrados',
        `Alta concentración de registros IMSS en años: ${patternAnalysis.suspiciousYears.join(', ')}`,
        'Verificar si la concentración de años es apropiada',
        [],
        { concentratedYears: patternAnalysis.suspiciousYears }
      ));
    }

    return results;
  }

  private analyzeIMSSPatterns(imssNumbers: string[]): {
    consecutiveNumbers: string[];
    sameSubdelegation: Set<string>;
    suspiciousYears: number[];
  } {
    const consecutive: string[] = [];
    const subdelegations = new Set<string>();
    const yearCounts: Record<number, number> = {};

    // Sort numbers for consecutive detection
    const sortedNumbers = [...imssNumbers].sort();

    for (let i = 0; i < sortedNumbers.length - 1; i++) {
      const current = parseInt(sortedNumbers[i]);
      const next = parseInt(sortedNumbers[i + 1]);
      
      if (next === current + 1) {
        if (!consecutive.includes(sortedNumbers[i])) {
          consecutive.push(sortedNumbers[i]);
        }
        if (!consecutive.includes(sortedNumbers[i + 1])) {
          consecutive.push(sortedNumbers[i + 1]);
        }
      }
    }

    // Analyze subdelegations and years
    for (const imss of imssNumbers) {
      subdelegations.add(imss.substring(0, 2));
      
      const yearDigits = parseInt(imss.substring(2, 4));
      const year = yearDigits <= 30 ? 2000 + yearDigits : 1900 + yearDigits;
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    }

    // Find years with suspicious concentration
    const totalNumbers = imssNumbers.length;
    const suspiciousYears: number[] = [];
    
    for (const [year, count] of Object.entries(yearCounts)) {
      const percentage = count / totalNumbers;
      if (percentage > 0.3 && count > 10) { // More than 30% in one year
        suspiciousYears.push(parseInt(year));
      }
    }

    return {
      consecutiveNumbers: consecutive,
      sameSubdelegation: subdelegations,
      suspiciousYears
    };
  }

  // Helper methods
  private extractHireDateFromEmployee(employee: any): Date | null {
    const possibleFields = [
      'fechaIngreso', 'fecha_ingreso', 'FECHA_INGRESO',
      'fechaAlta', 'fecha_alta', 'FECHA_ALTA',
      'ingreso', 'INGRESO', 'hire_date', 'HIRE_DATE'
    ];

    for (const field of possibleFields) {
      if (employee[field]) {
        const date = this.parseDate(employee[field]);
        if (date) return date;
      }
    }

    return null;
  }
}