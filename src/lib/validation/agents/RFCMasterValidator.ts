import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class RFCMasterValidator extends BaseValidationAgent {
  constructor() {
    super({
      name: 'RFC Master Validator',
      description: 'Experto absoluto en validación de RFC mexicano según normativas SAT',
      priority: 10,
      dependencies: [],
      timeout: 15000
    });
  }

  async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      // Validate active personnel RFCs
      if (data.activePersonnel && data.activePersonnel.length > 0) {
        const personnelResults = await this.validatePersonnelRFCs(data.activePersonnel);
        results.push(...personnelResults);
      }

      // Validate terminations RFCs
      if (data.terminations && data.terminations.length > 0) {
        const terminationResults = await this.validateTerminationRFCs(data.terminations);
        results.push(...terminationResults);
      }

      // Cross-validation analysis
      const crossValidationResults = await this.performRFCCrossValidation(data);
      results.push(...crossValidationResults);

    } catch (error) {
      results.push(this.createErrorResult(
        'RFC System Error',
        `Error crítico en validación RFC: ${error.message}`,
        'Revisar formato y estructura del archivo de datos'
      ));
    }

    return results;
  }

  private async validatePersonnelRFCs(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const rfcCounts: Map<string, number[]> = new Map();
    const suspiciousPatterns: string[] = [];

    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const rowNumber = i + 2; // Excel row counting
      
      // Extract RFC from possible column variations
      const rfc = this.extractRFCFromEmployee(employee);
      
      if (!rfc) {
        results.push(this.createErrorResult(
          'RFC Obligatorio Faltante',
          `❌ Empleado en fila ${rowNumber} no tiene RFC registrado`,
          `🔧 ACCIÓN REQUERIDA: Agregar RFC válido. Sin RFC no se puede proceder con nómina fiscal`,
          [rowNumber],
          {
            actionType: 'CRITICAL',
            blocksProccess: true,
            employeeName: employee.nombre || employee.NOMBRE || 'Empleado',
            suggestions: [
              'Solicitar RFC al empleado',
              'Buscar RFC en registros de RRHH',
              'Generar RFC temporal en SAT'
            ]
          }
        ));
        continue;
      }

      // Deep RFC validation
      const rfcValidation = this.performDeepRFCValidation(rfc, employee, rowNumber);
      if (rfcValidation) {
        results.push(rfcValidation);
      }

      // Track duplicates
      if (rfcCounts.has(rfc)) {
        rfcCounts.get(rfc)!.push(rowNumber);
      } else {
        rfcCounts.set(rfc, [rowNumber]);
      }

      // Detect suspicious patterns
      if (this.isSuspiciousRFC(rfc)) {
        suspiciousPatterns.push(`${rfc} (fila ${rowNumber})`);
      }
    }

    // Report duplicates
    for (const [rfc, rows] of rfcCounts) {
      if (rows.length > 1) {
        results.push(this.createErrorResult(
          'RFC Duplicado',
          `RFC ${rfc} aparece en múltiples empleados`,
          'Cada empleado debe tener RFC único. Revisar si son personas diferentes o error de captura',
          rows,
          { duplicatedRFC: rfc, occurrences: rows.length }
        ));
      }
    }

    // Report suspicious patterns
    if (suspiciousPatterns.length > 0) {
      results.push(this.createWarningResult(
        'RFCs Sospechosos',
        `Detectados ${suspiciousPatterns.length} RFCs con patrones atípicos`,
        'Verificar que no sean RFCs genéricos o temporales',
        [],
        { suspiciousRFCs: suspiciousPatterns }
      ));
    }

    return results;
  }

  private async validateTerminationRFCs(terminations: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (let i = 0; i < terminations.length; i++) {
      const termination = terminations[i];
      const rowNumber = i + 2;
      
      const rfc = this.extractRFCFromEmployee(termination);
      
      if (!rfc) {
        results.push(this.createErrorResult(
          'RFC Faltante en Terminación',
          `Terminación sin RFC en fila ${rowNumber}`,
          'Toda terminación debe incluir RFC del empleado',
          [rowNumber]
        ));
        continue;
      }

      const validation = this.performDeepRFCValidation(rfc, termination, rowNumber);
      if (validation) {
        results.push(validation);
      }
    }

    return results;
  }

  private extractRFCFromEmployee(employee: any): string | null {
    // Look for RFC in multiple possible column names
    const possibleFields = [
      'rfc', 'RFC', 'Rfc',
      'curp', 'CURP', 'Curp', // Sometimes RFC is in CURP field
      'identificacion', 'identificación', 'IDENTIFICACION',
      'clave', 'CLAVE', 'Clave',
      'registro', 'REGISTRO'
    ];

    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string') {
        // Extract RFC pattern from the string
        const match = employee[field].trim().match(/[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]/);
        if (match) {
          return match[0];
        }
      }
    }

    return null;
  }

  private performDeepRFCValidation(rfc: string, employee: any, rowNumber: number): ValidationResult | null {
    // 1. Basic structure validation
    const structureValidation = this.validateRFCStructure(rfc);
    if (!structureValidation.isValid) {
      return this.createErrorResult(
        'RFC Inválido',
        `❌ RFC "${rfc}" en fila ${rowNumber} tiene formato incorrecto: ${structureValidation.error}`,
        `🔧 ACCIÓN REQUERIDA: Corregir el RFC. Formato válido: AAAA000000XXX (ej: PÉRF850101ABC)`,
        [rowNumber],
        { 
          invalidRFC: rfc, 
          reason: structureValidation.error,
          actionType: 'CRITICAL',
          example: 'GOME850815XYZ',
          blocksProccess: true
        }
      );
    }

    // 2. Birth date consistency validation
    const birthDateValidation = this.validateRFCBirthDate(rfc, employee, rowNumber);
    if (birthDateValidation) {
      return birthDateValidation;
    }

    // 3. Name consistency validation
    const nameValidation = this.validateRFCNameConsistency(rfc, employee, rowNumber);
    if (nameValidation) {
      return nameValidation;
    }

    // 4. Homoclave validation
    const homoclaveValidation = this.validateHomoclave(rfc);
    if (!homoclaveValidation.isValid) {
      return this.createWarningResult(
        'RFC con Homoclave Sospechosa',
        `⚠️ RFC "${rfc}" en fila ${rowNumber} puede tener homoclave incorrecta`,
        `💡 RECOMENDADO: Verificar con SAT. Podemos proceder pero puede causar problemas fiscales`,
        [rowNumber],
        { 
          rfc, 
          suspiciousHomoclave: true,
          actionType: 'RECOMMENDED',
          canProceed: true,
          riskLevel: 'Medio'
        }
      );
    }

    return null; // RFC is valid
  }

  private validateRFCStructure(rfc: string): { isValid: boolean; error?: string } {
    // RFC must be exactly 13 characters
    if (rfc.length !== 13) {
      return { isValid: false, error: `Longitud incorrecta: ${rfc.length} caracteres (debe ser 13)` };
    }

    // First 4 characters: 3-4 letters (apellidos + nombre)
    const letters = rfc.substring(0, 4);
    if (!/^[A-ZÑ&]{3,4}$/.test(letters)) {
      return { isValid: false, error: 'Primeras 4 posiciones deben ser letras válidas' };
    }

    // Check for prohibited combinations
    const prohibitedWords = ['BUEI', 'BUEY', 'CACA', 'CACO', 'CAGA', 'CAGO', 'CAKA', 'CAKO', 'COGE', 'COGI', 'COJA', 'COJE', 'COJI', 'COJO', 'COLA', 'CULO', 'FALO', 'FETO', 'GETA', 'GUEI', 'GUEY', 'JETA', 'JOTO', 'KACA', 'KACO', 'KAGA', 'KAGO', 'KAKA', 'KAKO', 'KOGE', 'KOGI', 'KOJA', 'KOJE', 'KOJI', 'KOJO', 'KOLA', 'KULO', 'LILO', 'LOCA', 'LOCO', 'LOKA', 'LOKO', 'MAME', 'MAMO', 'MEAR', 'MEAS', 'MEON', 'MIAR', 'MION', 'MOCO', 'MOKO', 'MULA', 'MULO', 'NACA', 'NACO', 'PEDA', 'PEDO', 'PENE', 'PIPI', 'PITO', 'POPO', 'PUTA', 'PUTO', 'QULO', 'RATA', 'ROBA', 'ROBE', 'ROBO', 'RUIN', 'SENO', 'TETA', 'VACA', 'VAGA', 'VAGO', 'VAKA', 'VUEI', 'VUEY', 'WUEI', 'WUEY'];
    if (prohibitedWords.includes(letters)) {
      return { isValid: false, error: `Combinación prohibida por SAT: ${letters}` };
    }

    // Positions 5-10: birth date (YYMMDD)
    const birthDate = rfc.substring(4, 10);
    if (!/^\d{6}$/.test(birthDate)) {
      return { isValid: false, error: 'Fecha de nacimiento debe ser 6 dígitos' };
    }

    const year = parseInt(birthDate.substring(0, 2));
    const month = parseInt(birthDate.substring(2, 4));
    const day = parseInt(birthDate.substring(4, 6));

    if (month < 1 || month > 12) {
      return { isValid: false, error: `Mes inválido en RFC: ${month}` };
    }

    if (day < 1 || day > 31) {
      return { isValid: false, error: `Día inválido en RFC: ${day}` };
    }

    // Position 11: gender/century
    const genderChar = rfc.charAt(10);
    if (!/[A-V1-9]/.test(genderChar)) {
      return { isValid: false, error: `Carácter de género/siglo inválido: ${genderChar}` };
    }

    // Position 12: state of birth
    const stateChar = rfc.charAt(11);
    if (!/[A-Z1-9]/.test(stateChar)) {
      return { isValid: false, error: `Carácter de estado inválido: ${stateChar}` };
    }

    // Position 13: verification digit
    const verificationChar = rfc.charAt(12);
    if (!/[0-9A]/.test(verificationChar)) {
      return { isValid: false, error: `Dígito verificador inválido: ${verificationChar}` };
    }

    return { isValid: true };
  }

  private validateRFCBirthDate(rfc: string, employee: any, rowNumber: number): ValidationResult | null {
    // Extract birth date from RFC
    const rfcBirthDate = this.extractBirthDateFromRFC(rfc);
    if (!rfcBirthDate) {
      return this.createWarningResult(
        'RFC Fecha Nacimiento',
        `No se puede extraer fecha de nacimiento válida del RFC ${rfc}`,
        'Verificar que la fecha en el RFC sea correcta',
        [rowNumber]
      );
    }

    // Try to find birth date in employee data
    const employeeBirthDate = this.findBirthDateInEmployee(employee);
    if (employeeBirthDate) {
      const daysDifference = Math.abs(rfcBirthDate.getTime() - employeeBirthDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDifference > 1) { // Allow 1 day tolerance
        return this.createWarningResult(
          'RFC Fecha Inconsistente',
          `RFC indica nacimiento ${rfcBirthDate.toLocaleDateString()} pero datos muestran ${employeeBirthDate.toLocaleDateString()}`,
          'Verificar consistencia entre RFC y fecha de nacimiento registrada',
          [rowNumber],
          { 
            rfcDate: rfcBirthDate.toISOString(),
            employeeDate: employeeBirthDate.toISOString(),
            daysDifference: Math.round(daysDifference)
          }
        );
      }
    }

    // Validate reasonable birth year for employment
    const currentYear = new Date().getFullYear();
    const birthYear = rfcBirthDate.getFullYear();
    const age = currentYear - birthYear;

    if (age < 16) {
      return this.createErrorResult(
        'RFC Edad Menor',
        `RFC indica edad de ${age} años, menor al mínimo legal laboral`,
        'Verificar que el RFC sea correcto o que se trate de un error de captura',
        [rowNumber],
        { rfc, calculatedAge: age }
      );
    }

    if (age > 80) {
      return this.createWarningResult(
        'RFC Edad Avanzada',
        `RFC indica edad de ${age} años, revisar si está activo laboralmente`,
        'Confirmar que el empleado esté efectivamente activo',
        [rowNumber],
        { rfc, calculatedAge: age }
      );
    }

    return null;
  }

  private validateRFCNameConsistency(rfc: string, employee: any, rowNumber: number): ValidationResult | null {
    // Extract name components from employee data
    const name = this.extractNameFromEmployee(employee);
    if (!name) {
      return null; // Can't validate without name
    }

    // Extract initials from RFC
    const rfcInitials = rfc.substring(0, 4);
    
    // Basic name consistency check
    const nameValidation = this.checkNameRFCConsistency(name, rfcInitials);
    if (!nameValidation.isConsistent) {
      return this.createWarningResult(
        'RFC Nombre Inconsistente',
        `RFC ${rfc} no parece corresponder con nombre "${name.full}"`,
        'Verificar que el RFC corresponda al nombre del empleado',
        [rowNumber],
        { 
          rfc, 
          employeeName: name.full,
          rfcInitials,
          reason: nameValidation.reason 
        }
      );
    }

    return null;
  }

  private validateHomoclave(rfc: string): { isValid: boolean; reason?: string } {
    // This is a simplified homoclave validation
    // Full SAT algorithm is complex and proprietary
    const homoclave = rfc.substring(10, 12);
    
    // Basic checks for obviously invalid homoclaves
    if (homoclave === '00') {
      return { isValid: false, reason: 'Homoclave 00 es típicamente inválida' };
    }

    if (/^(.)\1$/.test(homoclave)) {
      return { isValid: false, reason: 'Homoclave con caracteres idénticos es sospechosa' };
    }

    return { isValid: true };
  }

  private isSuspiciousRFC(rfc: string): boolean {
    // Common patterns of fake or temporary RFCs
    const suspiciousPatterns = [
      /^[A-Z]{4}000000/, // All zeros in date
      /^XXXX/, // XXXX prefix
      /^TEST/, // TEST prefix
      /^TEMP/, // TEMP prefix
      /000101/, // January 1st, 2000 (common default)
      /010101/, // January 1st, 2001
    ];

    return suspiciousPatterns.some(pattern => pattern.test(rfc));
  }

  private async performRFCCrossValidation(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Cross-validate RFCs between active personnel and terminations
    if (data.activePersonnel && data.terminations) {
      const activeRFCs = new Set<string>();
      const terminatedRFCs = new Set<string>();

      // Collect active RFCs
      data.activePersonnel.forEach(employee => {
        const rfc = this.extractRFCFromEmployee(employee);
        if (rfc) activeRFCs.add(rfc);
      });

      // Collect terminated RFCs
      data.terminations.forEach(termination => {
        const rfc = this.extractRFCFromEmployee(termination);
        if (rfc) terminatedRFCs.add(rfc);
      });

      // Find overlaps (employees both active and terminated)
      const overlapping = Array.from(activeRFCs).filter(rfc => terminatedRFCs.has(rfc));
      
      if (overlapping.length > 0) {
        results.push(this.createErrorResult(
          'RFCs en Activos y Terminaciones',
          `${overlapping.length} empleados aparecen tanto en activos como en terminaciones`,
          'Un empleado no puede estar simultáneamente activo y terminado',
          [],
          { overlappingRFCs: overlapping }
        ));
      }
    }

    return results;
  }

  // Helper methods
  private findBirthDateInEmployee(employee: any): Date | null {
    const possibleFields = ['fechaNacimiento', 'fecha_nacimiento', 'birth_date', 'nacimiento', 'fechanac'];
    
    for (const field of possibleFields) {
      if (employee[field]) {
        const date = this.parseDate(employee[field]);
        if (date) return date;
      }
    }

    return null;
  }

  private extractNameFromEmployee(employee: any): { full: string; firstName: string; lastName: string } | null {
    const possibleFields = ['nombre', 'NOMBRE', 'name', 'empleado', 'EMPLEADO'];
    
    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string') {
        const fullName = employee[field].trim();
        const nameParts = fullName.split(' ');
        return {
          full: fullName,
          firstName: nameParts[nameParts.length - 1] || '', // Last part is usually first name
          lastName: nameParts.slice(0, -1).join(' ') || '' // Everything before is last name
        };
      }
    }

    return null;
  }

  private checkNameRFCConsistency(name: { full: string; firstName: string; lastName: string }, rfcInitials: string): { isConsistent: boolean; reason?: string } {
    // This is a simplified consistency check
    // Real implementation would need extensive Mexican name databases
    
    const cleanLastName = name.lastName.replace(/[^A-ZÁÉÍÓÚÑ]/gi, '').toUpperCase();
    const cleanFirstName = name.firstName.replace(/[^A-ZÁÉÍÓÚÑ]/gi, '').toUpperCase();
    
    // Basic check: first character should match
    if (cleanLastName.length > 0 && cleanLastName[0] !== rfcInitials[0]) {
      return { isConsistent: false, reason: 'Primer apellido no coincide con RFC' };
    }

    return { isConsistent: true };
  }
}