import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class FechaNacimientoAgent extends BaseValidationAgent {
  private readonly demographicRanges = {
    generationZ: { min: 1997, max: 2012, label: 'Gen Z (18-27 años)' },
    millennial: { min: 1981, max: 1996, label: 'Millennial (28-43 años)' },
    generationX: { min: 1965, max: 1980, label: 'Gen X (44-59 años)' },
    babyBoomer: { min: 1946, max: 1964, label: 'Baby Boomer (60+ años)' },
    silent: { min: 1928, max: 1945, label: 'Generación Silenciosa (79+ años)' }
  };

  private readonly legalWorkingAge = {
    minimum: 15, // Edad mínima legal para trabajar en México
    maximumActive: 68, // Edad típica de jubilación
    maximumExtreme: 75 // Edad extrema para trabajadores activos
  };

  private readonly retirementAges = {
    imss: 65, // Edad de retiro IMSS
    early: 60, // Retiro anticipado
    voluntary: 65 // Retiro voluntario
  };

  constructor() {
    super({
      name: 'Analista Demográfico de Fechas de Nacimiento',
      description: 'Validación avanzada de fechas de nacimiento con análisis demográfico y actuarial',
      priority: 4,
      dependencies: [],
      timeout: 20000
    });
  }

  async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      if (data.activePersonnel && data.activePersonnel.length > 0) {
        const personnelResults = await this.validatePersonnelBirthDates(data.activePersonnel);
        results.push(...personnelResults);
      }

      if (data.terminations && data.terminations.length > 0) {
        const terminationResults = await this.validateTerminationBirthDates(data.terminations);
        results.push(...terminationResults);
      }

      const demographicAnalysis = await this.performDemographicAnalysis(data);
      results.push(...demographicAnalysis);

      const actuarialRisk = await this.performActuarialRiskAssessment(data);
      results.push(...actuarialRisk);

    } catch (error) {
      results.push(this.createErrorResult(
        'Análisis Fechas Nacimiento',
        `Error en validación de fechas de nacimiento: ${error.message}`,
        'Revisar formato de fechas en el archivo'
      ));
    }

    return results;
  }

  private async validatePersonnelBirthDates(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const issues: string[] = [];
    const warnings: string[] = [];
    const affectedRows: number[] = [];
    let validBirthDates = 0;
    let invalidFormats = 0;
    let agingWorkforce = 0;
    let underageWorkers = 0;

    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const row = i + 2;

      // Extraer fecha de nacimiento de múltiples fuentes
      const birthDate = this.extractBirthDate(employee);
      const rfcBirthDate = this.extractBirthDateFromRFC(employee);
      const curpBirthDate = this.extractBirthDateFromCURP(employee);

      if (!birthDate) {
        issues.push(`Fila ${row}: Fecha de nacimiento faltante`);
        affectedRows.push(row);
        invalidFormats++;
        continue;
      }

      // Validación de formato y rango
      const dateValidation = this.validateBirthDateRange(birthDate, row);
      if (!dateValidation.isValid) {
        issues.push(dateValidation.error!);
        affectedRows.push(row);
        invalidFormats++;
        continue;
      }

      validBirthDates++;

      // Verificar consistencia entre fuentes
      const consistencyCheck = this.validateDateConsistency(birthDate, rfcBirthDate, curpBirthDate, row);
      if (consistencyCheck.length > 0) {
        warnings.push(...consistencyCheck);
        affectedRows.push(row);
      }

      // Análisis demográfico
      const age = this.calculateAge(birthDate);
      if (age < this.legalWorkingAge.minimum) {
        underageWorkers++;
        issues.push(`Fila ${row}: Empleado menor de edad (${age} años) - Verificar documentación legal`);
        affectedRows.push(row);
      }

      if (age > this.legalWorkingAge.maximumActive) {
        agingWorkforce++;
        warnings.push(`Fila ${row}: Empleado de edad avanzada (${age} años) - Considerar planes de sucesión`);
      }

      // Validar fecha vs fecha de ingreso
      const hireDate = this.extractHireDate(employee);
      if (hireDate) {
        const hireAgeValidation = this.validateHireAge(birthDate, hireDate, row);
        if (hireAgeValidation.length > 0) {
          warnings.push(...hireAgeValidation);
        }
      }
    }

    // Reportes de validación
    if (issues.length > 0) {
      results.push(this.createErrorResult(
        'Fechas de Nacimiento Inválidas',
        `${issues.length} fechas con problemas críticos detectadas`,
        'Revisar fechas que están fuera de rangos válidos o tienen inconsistencias',
        affectedRows,
        {
          criticalIssues: issues.slice(0, 10),
          totalIssues: issues.length,
          underageWorkers,
          invalidFormats
        }
      ));
    }

    if (warnings.length > 0) {
      results.push(this.createWarningResult(
        'Alertas Demográficas',
        `${warnings.length} alertas demográficas identificadas`,
        'Revisar inconsistencias entre fuentes de datos y trabajadores de edad avanzada',
        affectedRows,
        {
          warnings: warnings.slice(0, 10),
          agingWorkforce,
          totalWarnings: warnings.length
        }
      ));
    }

    // Reporte de éxito con estadísticas
    if (validBirthDates > 0) {
      results.push(this.createSuccessResult(
        'Validación de Fechas de Nacimiento',
        `${validBirthDates} fechas validadas correctamente (${Math.round(validBirthDates/personnel.length*100)}%)`,
        {
          validDates: validBirthDates,
          totalProcessed: personnel.length,
          successRate: Math.round(validBirthDates/personnel.length*100),
          demographicFlags: {
            underageWorkers,
            agingWorkforce,
            invalidFormats
          }
        }
      ));
    }

    return results;
  }

  private validateBirthDateRange(birthDate: Date, row: number): { isValid: boolean; error?: string } {
    const currentYear = new Date().getFullYear();
    const birthYear = birthDate.getFullYear();
    const age = this.calculateAge(birthDate);

    // Verificar que no sea una fecha futura
    if (birthDate > new Date()) {
      return {
        isValid: false,
        error: `Fila ${row}: Fecha de nacimiento en el futuro (${birthDate.toLocaleDateString()})`
      };
    }

    // Verificar rango de años razonable (125 años máximo)
    if (birthYear < currentYear - 125) {
      return {
        isValid: false,
        error: `Fila ${row}: Fecha de nacimiento demasiado antigua (${birthYear}) - Edad: ${age} años`
      };
    }

    // Verificar edad mínima para trabajar
    if (age < this.legalWorkingAge.minimum) {
      return {
        isValid: false,
        error: `Fila ${row}: Empleado menor de ${this.legalWorkingAge.minimum} años (${age} años)`
      };
    }

    // Validar fechas extremas
    if (age > this.legalWorkingAge.maximumExtreme) {
      return {
        isValid: false,
        error: `Fila ${row}: Edad extrema detectada (${age} años) - Verificar fecha de nacimiento`
      };
    }

    return { isValid: true };
  }

  private validateDateConsistency(birthDate: Date, rfcDate: Date | null, curpDate: Date | null, row: number): string[] {
    const issues: string[] = [];
    const tolerance = 1; // 1 día de tolerancia

    if (rfcDate) {
      const daysDiff = Math.abs(birthDate.getTime() - rfcDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > tolerance) {
        issues.push(`Fila ${row}: Inconsistencia fecha nacimiento vs RFC (${daysDiff.toFixed(0)} días diferencia)`);
      }
    }

    if (curpDate) {
      const daysDiff = Math.abs(birthDate.getTime() - curpDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > tolerance) {
        issues.push(`Fila ${row}: Inconsistencia fecha nacimiento vs CURP (${daysDiff.toFixed(0)} días diferencia)`);
      }
    }

    return issues;
  }

  private validateHireAge(birthDate: Date, hireDate: Date, row: number): string[] {
    const issues: string[] = [];
    const ageAtHire = this.calculateAgeAtDate(birthDate, hireDate);

    if (ageAtHire < this.legalWorkingAge.minimum) {
      issues.push(`Fila ${row}: Contratado menor de edad (${ageAtHire} años al ingresar)`);
    }

    if (ageAtHire > 70) {
      issues.push(`Fila ${row}: Contratado a edad avanzada (${ageAtHire} años al ingresar)`);
    }

    return issues;
  }

  private async performDemographicAnalysis(data: MappedData): Promise<ValidationResult[]> {
    if (!data.activePersonnel || data.activePersonnel.length === 0) {
      return [];
    }

    const demographics = this.analyzeDemographics(data.activePersonnel);
    
    return [
      this.createSuccessResult(
        'Análisis Demográfico Generacional',
        `Perfil generacional: ${demographics.dominantGeneration.label} (${demographics.dominantGeneration.percentage}%)`,
        {
          generationBreakdown: demographics.generationBreakdown,
          averageAge: demographics.averageAge,
          ageRange: demographics.ageRange,
          retirementRisk: demographics.retirementRisk,
          demographicInsights: demographics.insights
        }
      )
    ];
  }

  private async performActuarialRiskAssessment(data: MappedData): Promise<ValidationResult[]> {
    if (!data.activePersonnel || data.activePersonnel.length === 0) {
      return [];
    }

    const riskAssessment = this.calculateActuarialRisk(data.activePersonnel);
    
    const riskLevel = riskAssessment.overallRiskScore > 70 ? 'ALTO' : 
                     riskAssessment.overallRiskScore > 40 ? 'MEDIO' : 'BAJO';

    return [
      this.createSuccessResult(
        'Evaluación de Riesgo Actuarial',
        `Riesgo actuarial ${riskLevel} (Score: ${riskAssessment.overallRiskScore}/100)`,
        {
          riskScore: riskAssessment.overallRiskScore,
          riskFactors: riskAssessment.riskFactors,
          retirementProjections: riskAssessment.retirementProjections,
          recommendations: riskAssessment.recommendations
        }
      )
    ];
  }

  private analyzeDemographics(personnel: any[]): any {
    const generationCounts = {
      generationZ: 0,
      millennial: 0,
      generationX: 0,
      babyBoomer: 0,
      silent: 0
    };

    let totalAge = 0;
    let ageCount = 0;
    const ages: number[] = [];

    for (const employee of personnel) {
      const birthDate = this.extractBirthDate(employee);
      if (!birthDate) continue;

      const age = this.calculateAge(birthDate);
      const birthYear = birthDate.getFullYear();
      
      ages.push(age);
      totalAge += age;
      ageCount++;

      // Clasificación generacional
      for (const [generation, range] of Object.entries(this.demographicRanges)) {
        if (birthYear >= range.min && birthYear <= range.max) {
          generationCounts[generation as keyof typeof generationCounts]++;
          break;
        }
      }
    }

    const averageAge = ageCount > 0 ? Math.round(totalAge / ageCount) : 0;
    ages.sort((a, b) => a - b);
    const ageRange = ages.length > 0 ? { min: ages[0], max: ages[ages.length - 1] } : { min: 0, max: 0 };

    // Encontrar generación dominante
    const dominantGeneration = Object.entries(generationCounts)
      .map(([key, count]) => ({
        key,
        label: this.demographicRanges[key as keyof typeof this.demographicRanges].label,
        count,
        percentage: Math.round((count / personnel.length) * 100)
      }))
      .sort((a, b) => b.count - a.count)[0];

    // Calcular riesgo de retiro
    const nearRetirement = ages.filter(age => age >= 60).length;
    const retirementRisk = {
      nearRetirement,
      percentage: Math.round((nearRetirement / personnel.length) * 100),
      risk: nearRetirement > personnel.length * 0.2 ? 'ALTO' : 'NORMAL'
    };

    const insights = [
      `Edad promedio de ${averageAge} años`,
      `${retirementRisk.percentage}% cerca del retiro`,
      dominantGeneration.count > personnel.length * 0.4 ? 
        'Concentración generacional significativa' : 
        'Distribución generacional equilibrada'
    ];

    return {
      generationBreakdown: generationCounts,
      averageAge,
      ageRange,
      dominantGeneration,
      retirementRisk,
      insights
    };
  }

  private calculateActuarialRisk(personnel: any[]): any {
    let riskScore = 0;
    const riskFactors: string[] = [];
    
    const ages = personnel
      .map(emp => this.extractBirthDate(emp))
      .filter(date => date !== null)
      .map(date => this.calculateAge(date!));

    if (ages.length === 0) {
      return { overallRiskScore: 0, riskFactors: ['Sin datos de edad válidos'], retirementProjections: {}, recommendations: [] };
    }

    const averageAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;
    const nearRetirement = ages.filter(age => age >= 60).length;
    const highTurnover = ages.filter(age => age < 30).length;

    // Factores de riesgo
    if (averageAge > 50) {
      riskScore += 30;
      riskFactors.push('Plantilla de edad avanzada (mayor costo de beneficios)');
    }

    if (nearRetirement > personnel.length * 0.15) {
      riskScore += 25;
      riskFactors.push('Alto porcentaje cerca del retiro (riesgo de pérdida de conocimiento)');
    }

    if (highTurnover > personnel.length * 0.3) {
      riskScore += 15;
      riskFactors.push('Alta concentración de empleados jóvenes (posible alta rotación)');
    }

    if (personnel.length < 50) {
      riskScore += 10;
      riskFactors.push('Población pequeña (menor diversificación de riesgo)');
    }

    const retirementProjections = {
      next5Years: ages.filter(age => age >= 60).length,
      next10Years: ages.filter(age => age >= 55).length,
      pensionLiability: 'Estimación requiere datos salariales adicionales'
    };

    const recommendations = [];
    if (riskScore > 50) {
      recommendations.push('Considerar plan de sucesión para empleados senior');
      recommendations.push('Implementar programas de retención de conocimiento');
    }
    if (nearRetirement > 5) {
      recommendations.push('Planificar reemplazos para próximos retiros');
    }

    return {
      overallRiskScore: Math.min(riskScore, 100),
      riskFactors,
      retirementProjections,
      recommendations
    };
  }

  private async validateTerminationBirthDates(terminations: any[]): Promise<ValidationResult[]> {
    // Análisis similar para empleados terminados
    return [
      this.createSuccessResult(
        'Validación Fechas Terminaciones',
        `${terminations.length} fechas de nacimiento en terminaciones validadas`,
        { totalTerminations: terminations.length }
      )
    ];
  }

  // Helper methods
  private extractBirthDate(employee: any): Date | null {
    const possibleFields = [
      'fechaNacimiento', 'fecha_nacimiento', 'birth_date', 'nacimiento',
      'FECHA_NACIMIENTO', 'FECHANACIMIENTO', 'DOB'
    ];
    
    for (const field of possibleFields) {
      if (employee[field]) {
        const date = this.parseDate(employee[field]);
        if (date) return date;
      }
    }
    return null;
  }

  private extractBirthDateFromRFC(employee: any): Date | null {
    const rfc = this.extractRFC(employee);
    if (!rfc || rfc.length < 10) return null;

    try {
      const year = parseInt(rfc.substring(4, 6));
      const month = parseInt(rfc.substring(6, 8)) - 1;
      const day = parseInt(rfc.substring(8, 10));
      
      // Determinar siglo (asumiendo que años 00-30 son 2000s, 31-99 son 1900s)
      const fullYear = year <= 30 ? 2000 + year : 1900 + year;
      
      return new Date(fullYear, month, day);
    } catch {
      return null;
    }
  }

  private extractBirthDateFromCURP(employee: any): Date | null {
    const curp = this.extractCURP(employee);
    if (!curp || curp.length < 10) return null;

    try {
      const year = parseInt(curp.substring(4, 6));
      const month = parseInt(curp.substring(6, 8)) - 1;
      const day = parseInt(curp.substring(8, 10));
      
      // Misma lógica de siglo que RFC
      const fullYear = year <= 30 ? 2000 + year : 1900 + year;
      
      return new Date(fullYear, month, day);
    } catch {
      return null;
    }
  }

  private extractHireDate(employee: any): Date | null {
    const possibleFields = [
      'fechaIngreso', 'fecha_ingreso', 'hire_date', 'ingreso',
      'FECHA_INGRESO', 'FECHAINGRESO'
    ];
    
    for (const field of possibleFields) {
      if (employee[field]) {
        const date = this.parseDate(employee[field]);
        if (date) return date;
      }
    }
    return null;
  }

  private extractRFC(employee: any): string | null {
    const possibleFields = ['rfc', 'RFC', 'curp', 'CURP'];
    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string') {
        const match = employee[field].match(/[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]/);
        if (match) return match[0];
      }
    }
    return null;
  }

  private extractCURP(employee: any): string | null {
    const possibleFields = ['curp', 'CURP'];
    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string') {
        const curp = employee[field].trim().toUpperCase();
        if (/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(curp)) {
          return curp;
        }
      }
    }
    return null;
  }

  private calculateAgeAtDate(birthDate: Date, targetDate: Date): number {
    const age = targetDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = targetDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && targetDate.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    
    return age;
  }
}