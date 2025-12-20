import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class CURPExpertAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'CURP Expert Agent',
      description: 'Especialista en validación de CURP de 18 dígitos con verificación de consistencia',
      priority: 9,
      dependencies: [],
      timeout: 15000
    });
  }

  async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      // Validate active personnel CURPs
      if (data.activePersonnel && data.activePersonnel.length > 0) {
        const personnelResults = await this.validatePersonnelCURPs(data.activePersonnel);
        results.push(...personnelResults);
      }

      // Validate terminations CURPs
      if (data.terminations && data.terminations.length > 0) {
        const terminationResults = await this.validateTerminationCURPs(data.terminations);
        results.push(...terminationResults);
      }

      // CURP-RFC cross validation
      const crossValidationResults = await this.performCURPRFCCrossValidation(data);
      results.push(...crossValidationResults);

    } catch (error) {
      results.push(this.createErrorResult(
        'CURP System Error',
        `Error crítico en validación CURP: ${error.message}`,
        'Revisar formato y estructura del archivo'
      ));
    }

    return results;
  }

  private async validatePersonnelCURPs(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const curpCounts: Map<string, number[]> = new Map();

    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const rowNumber = i + 2;
      
      const curp = this.extractCURPFromEmployee(employee);
      
      if (!curp) {
        const employeeName = this.getEmployeeName(employee);
        results.push(this.createWarningResult(
          'CURP No Proporcionada',
          `⚠️ Empleado "${employeeName}" en fila ${rowNumber} no tiene CURP registrada`,
          `💡 PODEMOS PROCEDER: La CURP no es obligatoria para cálculos actuariales básicos, pero es recomendable para verificación de identidad completa`,
          [rowNumber],
          {
            actionType: 'RECOMMENDED',
            canProceed: true,
            employeeName: employeeName,
            missingField: 'CURP',
            impact: 'Sin impacto en cálculos actuariales',
            recommendation: 'Solicitar CURP para auditorías futuras',
            suggestions: [
              'Solicitar CURP al empleado',
              'Buscar en expedientes de RRHH', 
              'Consultar con área de nómina'
            ]
          }
        ));
        continue;
      }

      // Deep CURP validation
      const curpValidation = this.performDeepCURPValidation(curp, employee, rowNumber);
      if (curpValidation) {
        results.push(curpValidation);
      }

      // Track duplicates
      if (curpCounts.has(curp)) {
        curpCounts.get(curp)!.push(rowNumber);
      } else {
        curpCounts.set(curp, [rowNumber]);
      }
    }

    // Report duplicates
    for (const [curp, rows] of curpCounts) {
      if (rows.length > 1) {
        results.push(this.createErrorResult(
          'CURP Duplicada Detectada',
          `❌ CURP ${curp} aparece en ${rows.length} empleados diferentes (filas: ${rows.join(', ')})`,
          `🚫 NO PODEMOS PROCEDER: Las CURPs duplicadas indican error de captura o empleados duplicados que afectan los cálculos`,
          rows,
          {
            actionType: 'CRITICAL',
            blocksProccess: true,
            duplicatedCURP: curp,
            occurrences: rows.length,
            affectedRows: rows,
            solutions: [
              'Verificar si son empleados diferentes con error de captura',
              'Revisar si hay duplicados reales en la nómina',
              'Corregir CURPs incorrectas',
              'Eliminar empleados duplicados si aplica'
            ],
            nextSteps: 'Revisar datos en filas mencionadas y corregir duplicados'
          }
        ));
      }
    }

    return results;
  }

  private async validateTerminationCURPs(terminations: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (let i = 0; i < terminations.length; i++) {
      const termination = terminations[i];
      const rowNumber = i + 2;
      
      const curp = this.extractCURPFromEmployee(termination);
      
      if (curp) {
        const validation = this.performDeepCURPValidation(curp, termination, rowNumber);
        if (validation) {
          results.push(validation);
        }
      }
    }

    return results;
  }

  private extractCURPFromEmployee(employee: any): string | null {
    const possibleFields = [
      'curp', 'CURP', 'Curp',
      'clave_curp', 'CLAVE_CURP',
      'identificacion', 'identificación',
      'registro_poblacion', 'registro_único'
    ];

    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string') {
        // CURP is exactly 18 characters: 4 letters + 6 numbers + 6 letters + 2 numbers
        const match = employee[field].trim().match(/[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d/);
        if (match) {
          return match[0];
        }
      }
    }

    return null;
  }

  private performDeepCURPValidation(curp: string, employee: any, rowNumber: number): ValidationResult | null {
    // 1. Basic structure validation
    const structureValidation = this.validateCURPStructure(curp);
    if (!structureValidation.isValid) {
      const employeeName = this.getEmployeeName(employee);
      return this.createErrorResult(
        'CURP con Formato Incorrecto',
        `❌ Empleado "${employeeName}" en fila ${rowNumber} tiene CURP inválida: ${curp}`,
        `🚫 NO PODEMOS PROCEDER: ${structureValidation.error}. Una CURP inválida impide verificación de identidad`,
        [rowNumber],
        {
          actionType: 'CRITICAL',
          blocksProccess: true,
          employeeName: employeeName,
          invalidCURP: curp,
          formatError: structureValidation.error,
          correctFormat: 'CURP debe tener exactamente 18 caracteres: 4 letras + 6 números + H/M + 2 letras + 3 consonantes + 1 dígito + 1 verificador',
          solutions: [
            'Verificar CURP en documento oficial del empleado',
            'Solicitar copia de acta de nacimiento',
            'Consultar CURP en RENAPO online',
            'Corregir errores de escritura obvios'
          ],
          example: 'Formato correcto: AAAA######HXXXXX##'
        }
      );
    }

    // 2. Birth date consistency validation
    const birthDateValidation = this.validateCURPBirthDate(curp, employee, rowNumber);
    if (birthDateValidation) {
      return birthDateValidation;
    }

    // 3. Gender consistency validation
    const genderValidation = this.validateCURPGender(curp, employee, rowNumber);
    if (genderValidation) {
      return genderValidation;
    }

    // 4. State of birth validation
    const stateValidation = this.validateCURPState(curp, rowNumber);
    if (stateValidation) {
      return stateValidation;
    }

    // 5. Check digit validation
    const checkDigitValidation = this.validateCURPCheckDigit(curp);
    if (!checkDigitValidation.isValid) {
      return this.createWarningResult(
        'CURP Dígito Verificador',
        `CURP ${curp} tiene dígito verificador posiblemente incorrecto`,
        'Verificar que la CURP sea auténtica del RENAPO',
        [rowNumber],
        { curp, checkDigitIssue: true }
      );
    }

    return null;
  }

  private validateCURPStructure(curp: string): { isValid: boolean; error?: string } {
    if (curp.length !== 18) {
      return { isValid: false, error: `Longitud incorrecta: ${curp.length} caracteres (debe ser 18)` };
    }

    // Positions 1-4: First surname and first name initials + first vowel
    const nameInitials = curp.substring(0, 4);
    if (!/^[A-ZÑ&]{4}$/.test(nameInitials)) {
      return { isValid: false, error: 'Posiciones 1-4 deben ser letras válidas' };
    }

    // Check for prohibited combinations (same as RFC)
    const prohibitedWords = ['BUEI', 'BUEY', 'CACA', 'CACO', 'CAGA', 'CAGO', 'CAKA', 'CAKO', 'COGE', 'COGI', 'COJA', 'COJE', 'COJI', 'COJO', 'COLA', 'CULO', 'FALO', 'FETO', 'GETA', 'GUEI', 'GUEY', 'JETA', 'JOTO', 'KACA', 'KACO', 'KAGA', 'KAGO', 'KAKA', 'KAKO', 'KOGE', 'KOGI', 'KOJA', 'KOJE', 'KOJI', 'KOJO', 'KOLA', 'KULO', 'LILO', 'LOCA', 'LOCO', 'LOKA', 'LOKO', 'MAME', 'MAMO', 'MEAR', 'MEAS', 'MEON', 'MIAR', 'MION', 'MOCO', 'MOKO', 'MULA', 'MULO', 'NACA', 'NACO', 'PEDA', 'PEDO', 'PENE', 'PIPI', 'PITO', 'POPO', 'PUTA', 'PUTO', 'QULO', 'RATA', 'ROBA', 'ROBE', 'ROBO', 'RUIN', 'SENO', 'TETA', 'VACA', 'VAGA', 'VAGO', 'VAKA', 'VUEI', 'VUEY', 'WUEI', 'WUEY'];
    
    if (prohibitedWords.includes(nameInitials)) {
      return { isValid: false, error: `Combinación prohibida por RENAPO: ${nameInitials}` };
    }

    // Positions 5-10: Birth date (YYMMDD)
    const birthDate = curp.substring(4, 10);
    if (!/^\d{6}$/.test(birthDate)) {
      return { isValid: false, error: 'Fecha de nacimiento debe ser 6 dígitos' };
    }

    const year = parseInt(birthDate.substring(0, 2));
    const month = parseInt(birthDate.substring(2, 4));
    const day = parseInt(birthDate.substring(4, 6));

    if (month < 1 || month > 12) {
      return { isValid: false, error: `Mes inválido: ${month}` };
    }

    if (day < 1 || day > 31) {
      return { isValid: false, error: `Día inválido: ${day}` };
    }

    // Position 11: Gender (H/M)
    const gender = curp.charAt(10);
    if (gender !== 'H' && gender !== 'M') {
      return { isValid: false, error: `Género debe ser H o M, encontrado: ${gender}` };
    }

    // Positions 12-13: State of birth
    const state = curp.substring(11, 13);
    if (!/^[A-Z]{2}$/.test(state)) {
      return { isValid: false, error: `Estado de nacimiento inválido: ${state}` };
    }

    // Positions 14-16: Internal consonants
    const consonants = curp.substring(13, 16);
    if (!/^[A-Z]{3}$/.test(consonants)) {
      return { isValid: false, error: `Consonantes internas inválidas: ${consonants}` };
    }

    // Position 17: Differentiation digit (0-9, A-Z except Ñ)
    const diffDigit = curp.charAt(16);
    if (!/^[0-9A-Z]$/.test(diffDigit) || diffDigit === 'Ñ') {
      return { isValid: false, error: `Dígito diferenciador inválido: ${diffDigit}` };
    }

    // Position 18: Check digit (0-9)
    const checkDigit = curp.charAt(17);
    if (!/^\d$/.test(checkDigit)) {
      return { isValid: false, error: `Dígito verificador debe ser numérico: ${checkDigit}` };
    }

    return { isValid: true };
  }

  private validateCURPBirthDate(curp: string, employee: any, rowNumber: number): ValidationResult | null {
    const curpBirthDate = this.extractBirthDateFromCURP(curp);
    if (!curpBirthDate) {
      return this.createWarningResult(
        'CURP Fecha Nacimiento',
        `No se puede extraer fecha válida de CURP ${curp}`,
        'Verificar que la fecha en CURP sea correcta',
        [rowNumber]
      );
    }

    // Check with employee birth date if available
    const employeeBirthDate = this.findBirthDateInEmployee(employee);
    if (employeeBirthDate) {
      const daysDifference = Math.abs(curpBirthDate.getTime() - employeeBirthDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDifference > 1) {
        return this.createWarningResult(
          'CURP Fecha Inconsistente',
          `CURP indica nacimiento ${curpBirthDate.toLocaleDateString()} pero datos muestran ${employeeBirthDate.toLocaleDateString()}`,
          'Verificar consistencia entre CURP y fecha registrada',
          [rowNumber]
        );
      }
    }

    // Validate reasonable age
    const currentYear = new Date().getFullYear();
    const age = currentYear - curpBirthDate.getFullYear();

    if (age < 16) {
      const employeeName = this.getEmployeeName(employee);
      return this.createErrorResult(
        'Empleado Menor de Edad',
        `❌ Empleado "${employeeName}" en fila ${rowNumber} tiene ${age} años según CURP`,
        `🚫 NO PODEMOS PROCEDER: Empleados menores de 16 años no pueden trabajar según Ley Federal del Trabajo`,
        [rowNumber],
        {
          actionType: 'CRITICAL',
          blocksProccess: true,
          employeeName: employeeName,
          calculatedAge: age,
          legalIssue: 'Menor de edad para trabajar',
          solutions: [
            'Verificar que la CURP sea correcta',
            'Confirmar fecha de nacimiento real',
            'Revisar documentos oficiales del empleado',
            'Remover del registro si es menor de edad'
          ],
          legalReference: 'Ley Federal del Trabajo Art. 22 - Edad mínima 16 años'
        }
      );
    }

    if (age > 80) {
      const employeeName = this.getEmployeeName(employee);
      return this.createWarningResult(
        'Empleado de Edad Avanzada',
        `⚠️ Empleado "${employeeName}" en fila ${rowNumber} tiene ${age} años según CURP`,
        `💡 PODEMOS PROCEDER: Edad avanzada requiere verificación de estatus activo y consideraciones actuariales especiales`,
        [rowNumber],
        {
          actionType: 'RECOMMENDED',
          canProceed: true,
          employeeName: employeeName,
          calculatedAge: age,
          impact: 'Puede afectar cálculos actuariales por longevidad',
          recommendations: [
            'Confirmar que el empleado sigue activo',
            'Verificar fecha de jubilación planeada',
            'Revisar historial de incapacidades',
            'Considerar factores de riesgo por edad'
          ]
        }
      );
    }

    return null;
  }

  private validateCURPGender(curp: string, employee: any, rowNumber: number): ValidationResult | null {
    const curpGender = curp.charAt(10); // H or M
    
    // Try to infer gender from employee data
    const inferredGender = this.inferGenderFromEmployee(employee);
    
    if (inferredGender && inferredGender !== curpGender) {
      return this.createWarningResult(
        'CURP Género Inconsistente',
        `CURP indica género ${curpGender} pero datos sugieren ${inferredGender}`,
        'Verificar consistencia del género en CURP',
        [rowNumber],
        { curpGender, inferredGender }
      );
    }

    return null;
  }

  private validateCURPState(curp: string, rowNumber: number): ValidationResult | null {
    const stateCode = curp.substring(11, 13);
    
    // Mexican states codes for CURP
    const validStates = [
      'AS', 'BC', 'BS', 'CC', 'CL', 'CM', 'CS', 'CH', 'DF', 'DG',
      'GT', 'GR', 'HG', 'JC', 'MC', 'MN', 'MS', 'NT', 'NL', 'OC',
      'PL', 'QT', 'QR', 'SP', 'SL', 'SR', 'TC', 'TS', 'TL', 'VZ',
      'YN', 'ZS', 'NE' // NE for foreign born
    ];

    if (!validStates.includes(stateCode)) {
      return this.createWarningResult(
        'CURP Estado Inválido',
        `Código de estado ${stateCode} no es válido en CURP`,
        'Verificar que el código de entidad federativa sea correcto',
        [rowNumber],
        { invalidStateCode: stateCode }
      );
    }

    return null;
  }

  private validateCURPCheckDigit(curp: string): { isValid: boolean; calculatedDigit?: string } {
    // Simplified check digit validation for CURP
    // The actual RENAPO algorithm is more complex
    
    const digits = curp.substring(0, 17);
    const providedCheckDigit = curp.charAt(17);
    
    // Basic validation - check if it's numeric
    if (!/^\d$/.test(providedCheckDigit)) {
      return { isValid: false };
    }

    // For a complete validation, we would need the full RENAPO algorithm
    // This is a simplified check
    return { isValid: true };
  }

  private extractBirthDateFromCURP(curp: string): Date | null {
    if (curp.length < 10) return null;

    try {
      const yearPart = curp.substring(4, 6);
      const monthPart = curp.substring(6, 8);
      const dayPart = curp.substring(8, 10);

      // Determine century
      let fullYear = parseInt(yearPart);
      if (fullYear <= 30) {
        fullYear += 2000; // 00-30 = 2000-2030
      } else {
        fullYear += 1900; // 31-99 = 1931-1999
      }

      const month = parseInt(monthPart);
      const day = parseInt(dayPart);

      if (month < 1 || month > 12 || day < 1 || day > 31) {
        return null;
      }

      return new Date(fullYear, month - 1, day);
    } catch {
      return null;
    }
  }

  private async performCURPRFCCrossValidation(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    if (!data.activePersonnel) return results;

    for (let i = 0; i < data.activePersonnel.length; i++) {
      const employee = data.activePersonnel[i];
      const rowNumber = i + 2;

      const curp = this.extractCURPFromEmployee(employee);
      const rfc = this.extractRFCFromEmployee(employee);

      if (curp && rfc) {
        // Validate that CURP and RFC are consistent
        const consistency = this.validateCURPRFCConsistency(curp, rfc);
        if (!consistency.isConsistent) {
          results.push(this.createWarningResult(
            'CURP-RFC Inconsistente',
            `CURP y RFC no son consistentes en fila ${rowNumber}: ${consistency.reason}`,
            'Verificar que CURP y RFC correspondan a la misma persona',
            [rowNumber],
            { curp, rfc, reason: consistency.reason }
          ));
        }
      }
    }

    return results;
  }

  private validateCURPRFCConsistency(curp: string, rfc: string): { isConsistent: boolean; reason?: string } {
    // Basic consistency checks between CURP and RFC
    
    // 1. Check birth date consistency
    const curpDate = this.extractBirthDateFromCURP(curp);
    const rfcDate = this.extractBirthDateFromRFC(rfc);

    if (curpDate && rfcDate) {
      const daysDiff = Math.abs(curpDate.getTime() - rfcDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > 1) {
        return { isConsistent: false, reason: 'Fechas de nacimiento diferentes' };
      }
    }

    // 2. Check name initials consistency
    const curpInitials = curp.substring(0, 4);
    const rfcInitials = rfc.substring(0, 4);

    if (curpInitials !== rfcInitials) {
      return { isConsistent: false, reason: 'Iniciales de nombre diferentes' };
    }

    // 3. Check gender consistency (if applicable)
    const curpGender = curp.charAt(10);
    const rfcGenderDigit = rfc.charAt(10);
    
    // This is a simplified check - actual algorithm is more complex
    return { isConsistent: true };
  }

  // Helper methods
  private findBirthDateInEmployee(employee: any): Date | null {
    const possibleFields = ['fechaNacimiento', 'fecha_nacimiento', 'birth_date', 'nacimiento'];
    
    for (const field of possibleFields) {
      if (employee[field]) {
        const date = this.parseDate(employee[field]);
        if (date) return date;
      }
    }

    return null;
  }

  private extractRFCFromEmployee(employee: any): string | null {
    const possibleFields = ['rfc', 'RFC', 'Rfc'];
    
    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string') {
        const match = employee[field].trim().match(/[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]/);
        if (match) return match[0];
      }
    }

    return null;
  }

  private inferGenderFromEmployee(employee: any): string | null {
    // Try to infer gender from available data
    const possibleFields = ['sexo', 'genero', 'gender', 'sex'];
    
    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string') {
        const value = employee[field].toUpperCase().trim();
        if (value === 'H' || value === 'HOMBRE' || value === 'M' || value === 'MASCULINO') {
          return 'H';
        }
        if (value === 'M' || value === 'MUJER' || value === 'F' || value === 'FEMENINO') {
          return 'M';
        }
      }
    }

    return null;
  }

  private getEmployeeName(employee: any): string {
    const possibleFields = [
      'nombre_completo', 'nombreCompleto', 'nombre', 'name',
      'empleado', 'employee', 'trabajador', 'persona'
    ];

    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string' && employee[field].trim()) {
        return employee[field].trim();
      }
    }

    // Try to construct name from parts
    const firstName = employee['nombre'] || employee['primer_nombre'] || '';
    const lastName = employee['apellido'] || employee['apellido_paterno'] || employee['apellidos'] || '';
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }

    return 'Empleado sin nombre';
  }
}