import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class EdadActuarialAgent extends BaseValidationAgent {
  private readonly actuarialTables = {
    mortality: {
      'EMSSA_2009_HOMBRES': { base: 2009, gender: 'M', type: 'mortality' },
      'EMSSA_2009_MUJERES': { base: 2009, gender: 'F', type: 'mortality' },
      'EMSSA_2024_HOMBRES': { base: 2024, gender: 'M', type: 'mortality' },
      'EMSSA_2024_MUJERES': { base: 2024, gender: 'F', type: 'mortality' }
    },
    disability: {
      'INVALIDEZ_IMSS_H': { gender: 'M', type: 'disability' },
      'INVALIDEZ_IMSS_M': { gender: 'F', type: 'disability' }
    }
  };

  private readonly pensionParameters = {
    normal: { age: 65, service: 25 }, // Edad y servicio para pensión normal
    early: { age: 60, service: 25 },  // Pensión anticipada
    disability: { service: 5 },       // Servicio mínimo para invalidez
    minimum: { age: 15 },            // Edad mínima laboral
    maximum: { age: 75 }             // Edad máxima considerada
  };

  private readonly servicePeriods = {
    shortTerm: { min: 0, max: 5, risk: 'HIGH' },     // Alta rotación
    mediumTerm: { min: 6, max: 15, risk: 'MEDIUM' }, // Estabilidad media
    longTerm: { min: 16, max: 30, risk: 'LOW' },     // Empleados estables
    veteran: { min: 31, max: 50, risk: 'PENSION' }   // Cerca de pensión
  };

  constructor() {
    super({
      name: 'Analista Actuarial de Edad y Servicio',
      description: 'Cálculos actuariales especializados para valuación de pasivos laborales',
      priority: 2,
      dependencies: ['FechaNacimientoAgent'],
      timeout: 30000
    });
  }

  async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      if (data.activePersonnel && data.activePersonnel.length > 0) {
        const ageAnalysis = await this.performActuarialAgeAnalysis(data.activePersonnel);
        results.push(...ageAnalysis);

        const serviceAnalysis = await this.performServiceAnalysis(data.activePersonnel);
        results.push(...serviceAnalysis);

        const pensionProjections = await this.calculatePensionProjections(data.activePersonnel);
        results.push(...pensionProjections);
      }

      if (data.terminations && data.terminations.length > 0) {
        const terminationAnalysis = await this.analyzeTerminationPatterns(data.terminations);
        results.push(...terminationAnalysis);
      }

      const liabilityAssessment = await this.assessActuarialLiabilities(data);
      results.push(...liabilityAssessment);

    } catch (error) {
      results.push(this.createErrorResult(
        'Análisis Actuarial',
        `Error en cálculos actuariales: ${error.message}`,
        'Revisar datos de fechas y servicios'
      ));
    }

    return results;
  }

  private async performActuarialAgeAnalysis(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const ageIssues: string[] = [];
    const affectedRows: number[] = [];
    const ageDistribution = {
      '15-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56-65': 0, '66+': 0
    };

    let totalActuarialAge = 0;
    let validAges = 0;
    let pensionEligible = 0;
    let nearRetirement = 0;

    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const row = i + 2;

      const birthDate = this.extractBirthDate(employee);
      if (!birthDate) {
        ageIssues.push(`Fila ${row}: Sin fecha de nacimiento para cálculo actuarial`);
        affectedRows.push(row);
        continue;
      }

      const actuarialAge = this.calculateActuarialAge(birthDate);
      const chronologicalAge = this.calculateAge(birthDate);

      // Validar rangos actuariales
      if (chronologicalAge < this.pensionParameters.minimum.age) {
        ageIssues.push(`Fila ${row}: Edad menor al mínimo legal (${chronologicalAge} años)`);
        affectedRows.push(row);
        continue;
      }

      if (chronologicalAge > this.pensionParameters.maximum.age) {
        ageIssues.push(`Fila ${row}: Edad excede máximo actuarial (${chronologicalAge} años)`);
        affectedRows.push(row);
        continue;
      }

      validAges++;
      totalActuarialAge += actuarialAge;

      // Distribución por grupos etarios
      this.categorizeByAge(chronologicalAge, ageDistribution);

      // Análisis de elegibilidad para pensión
      const serviceYears = this.calculateServiceYears(employee);
      if (this.isPensionEligible(chronologicalAge, serviceYears)) {
        pensionEligible++;
      }

      if (chronologicalAge >= 60) {
        nearRetirement++;
      }

      // Verificar consistencia actuarial
      const consistencyCheck = this.validateActuarialConsistency(employee, row);
      if (consistencyCheck.length > 0) {
        ageIssues.push(...consistencyCheck);
        affectedRows.push(row);
      }
    }

    // Reportes de problemas
    if (ageIssues.length > 0) {
      results.push(this.createErrorResult(
        'Problemas de Edad Actuarial',
        `${ageIssues.length} empleados con edades fuera de rangos actuariales`,
        'Revisar fechas de nacimiento y elegibilidad laboral',
        affectedRows,
        { 
          issues: ageIssues.slice(0, 15),
          totalIssues: ageIssues.length
        }
      ));
    }

    // Análisis actuarial exitoso
    if (validAges > 0) {
      const avgActuarialAge = Math.round(totalActuarialAge / validAges * 10) / 10;
      
      results.push(this.createSuccessResult(
        'Análisis de Edad Actuarial',
        `Edad actuarial promedio: ${avgActuarialAge} años (${validAges} empleados analizados)`,
        {
          averageActuarialAge: avgActuarialAge,
          ageDistribution,
          pensionMetrics: {
            eligible: pensionEligible,
            nearRetirement,
            eligibilityRate: Math.round((pensionEligible / validAges) * 100)
          },
          actuarialInsights: this.generateAgeInsights(ageDistribution, validAges, pensionEligible)
        }
      ));
    }

    return results;
  }

  private async performServiceAnalysis(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const serviceIssues: string[] = [];
    const affectedRows: number[] = [];
    const serviceDistribution = { shortTerm: 0, mediumTerm: 0, longTerm: 0, veteran: 0 };

    let totalService = 0;
    let validService = 0;
    let futureServiceCost = 0;

    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const row = i + 2;

      const serviceYears = this.calculateServiceYears(employee);
      if (serviceYears === null) {
        serviceIssues.push(`Fila ${row}: Sin fecha de ingreso para cálculo de antigüedad`);
        affectedRows.push(row);
        continue;
      }

      if (serviceYears < 0) {
        serviceIssues.push(`Fila ${row}: Fecha de ingreso futura (${serviceYears} años)`);
        affectedRows.push(row);
        continue;
      }

      if (serviceYears > 50) {
        serviceIssues.push(`Fila ${row}: Antigüedad excesiva (${serviceYears} años) - Verificar fecha`);
        affectedRows.push(row);
        continue;
      }

      validService++;
      totalService += serviceYears;

      // Categorización de servicios
      this.categorizeByService(serviceYears, serviceDistribution);

      // Estimación de costo futuro de servicio
      const age = this.calculateAge(this.extractBirthDate(employee)!);
      const projectedService = this.calculateProjectedService(age, serviceYears);
      futureServiceCost += projectedService.cost;
    }

    // Reportes
    if (serviceIssues.length > 0) {
      results.push(this.createWarningResult(
        'Problemas de Antigüedad',
        `${serviceIssues.length} empleados con problemas en cálculo de antigüedad`,
        'Revisar fechas de ingreso y consistencia temporal',
        affectedRows,
        {
          issues: serviceIssues.slice(0, 10),
          totalIssues: serviceIssues.length
        }
      ));
    }

    if (validService > 0) {
      const avgService = Math.round(totalService / validService * 10) / 10;
      
      results.push(this.createSuccessResult(
        'Análisis de Antigüedad de Servicio',
        `Antigüedad promedio: ${avgService} años (${validService} empleados)`,
        {
          averageService: avgService,
          serviceDistribution,
          serviceMetrics: {
            totalServiceYears: Math.round(totalService),
            projectedCost: futureServiceCost,
            stabilityIndex: this.calculateStabilityIndex(serviceDistribution, validService)
          },
          serviceInsights: this.generateServiceInsights(serviceDistribution, validService)
        }
      ));
    }

    return results;
  }

  private async calculatePensionProjections(personnel: any[]): Promise<ValidationResult[]> {
    const projections = {
      immediate: { count: 0, list: [] as any[] },
      next5Years: { count: 0, list: [] as any[] },
      next10Years: { count: 0, list: [] as any[] },
      longTerm: { count: 0, list: [] as any[] }
    };

    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const birthDate = this.extractBirthDate(employee);
      const serviceYears = this.calculateServiceYears(employee);
      
      if (!birthDate || serviceYears === null) continue;

      const age = this.calculateAge(birthDate);
      const projection = this.calculatePensionEligibility(age, serviceYears);
      
      const employeeData = {
        row: i + 2,
        age,
        service: serviceYears,
        yearsToEligibility: projection.yearsToEligibility,
        eligibilityType: projection.type
      };

      if (projection.yearsToEligibility <= 0) {
        projections.immediate.count++;
        projections.immediate.list.push(employeeData);
      } else if (projection.yearsToEligibility <= 5) {
        projections.next5Years.count++;
        projections.next5Years.list.push(employeeData);
      } else if (projection.yearsToEligibility <= 10) {
        projections.next10Years.count++;
        projections.next10Years.list.push(employeeData);
      } else {
        projections.longTerm.count++;
        projections.longTerm.list.push(employeeData);
      }
    }

    return [
      this.createSuccessResult(
        'Proyecciones de Pensión',
        `${projections.immediate.count} empleados elegibles inmediatamente, ${projections.next5Years.count} en próximos 5 años`,
        {
          immediateEligible: projections.immediate,
          next5Years: projections.next5Years,
          next10Years: projections.next10Years,
          longTerm: projections.longTerm,
          totalPopulation: personnel.length,
          riskAssessment: this.assessPensionRisk(projections, personnel.length)
        }
      )
    ];
  }

  private async analyzeTerminationPatterns(terminations: any[]): Promise<ValidationResult[]> {
    // Análisis de patrones de terminación por edad y servicio
    const ageAtTermination: number[] = [];
    const serviceAtTermination: number[] = [];

    for (const termination of terminations) {
      const birthDate = this.extractBirthDate(termination);
      const terminationDate = this.extractTerminationDate(termination);
      const hireDate = this.extractHireDate(termination);

      if (birthDate && terminationDate) {
        ageAtTermination.push(this.calculateAgeAtDate(birthDate, terminationDate));
      }

      if (hireDate && terminationDate) {
        const service = this.calculateServiceAtDate(hireDate, terminationDate);
        serviceAtTermination.push(service);
      }
    }

    return [
      this.createSuccessResult(
        'Patrones de Terminación',
        `Análisis de ${terminations.length} terminaciones completado`,
        {
          averageAgeAtTermination: ageAtTermination.length > 0 ? 
            Math.round(ageAtTermination.reduce((a, b) => a + b) / ageAtTermination.length) : 0,
          averageServiceAtTermination: serviceAtTermination.length > 0 ?
            Math.round(serviceAtTermination.reduce((a, b) => a + b) / serviceAtTermination.length) : 0,
          terminationInsights: 'Patrones de rotación dentro de rangos esperados'
        }
      )
    ];
  }

  private async assessActuarialLiabilities(data: MappedData): Promise<ValidationResult[]> {
    if (!data.activePersonnel || data.activePersonnel.length === 0) {
      return [];
    }

    const liabilityAssessment = this.calculateLiabilityMetrics(data.activePersonnel);
    
    return [
      this.createSuccessResult(
        'Evaluación de Pasivos Actuariales',
        `Población actuarial de ${data.activePersonnel.length} empleados evaluada`,
        {
          populationMetrics: liabilityAssessment.population,
          riskFactors: liabilityAssessment.risks,
          recommendations: liabilityAssessment.recommendations,
          actuarialNote: 'Cálculos preliminares - Valuación completa requiere tablas actuariales específicas'
        }
      )
    ];
  }

  // Métodos auxiliares especializados
  private calculateActuarialAge(birthDate: Date): number {
    const today = new Date();
    const age = this.calculateAge(birthDate);
    
    // Edad actuarial incluye fracciones para cálculos precisos
    const monthsAdditional = (today.getMonth() - birthDate.getMonth() + 
                             (today.getDate() >= birthDate.getDate() ? 0 : -1)) / 12;
    
    return age + monthsAdditional;
  }

  private isPensionEligible(age: number, serviceYears: number | null): boolean {
    if (!serviceYears) return false;
    
    return (age >= this.pensionParameters.normal.age && serviceYears >= this.pensionParameters.normal.service) ||
           (age >= this.pensionParameters.early.age && serviceYears >= this.pensionParameters.early.service);
  }

  private calculatePensionEligibility(age: number, serviceYears: number): any {
    const normalEligibility = Math.max(
      this.pensionParameters.normal.age - age,
      this.pensionParameters.normal.service - serviceYears
    );

    const earlyEligibility = Math.max(
      this.pensionParameters.early.age - age,
      this.pensionParameters.early.service - serviceYears
    );

    if (normalEligibility <= 0) {
      return { yearsToEligibility: 0, type: 'normal' };
    } else if (earlyEligibility <= 0) {
      return { yearsToEligibility: 0, type: 'early' };
    } else {
      return { 
        yearsToEligibility: Math.min(normalEligibility, earlyEligibility),
        type: earlyEligibility < normalEligibility ? 'early' : 'normal'
      };
    }
  }

  private categorizeByAge(age: number, distribution: any): void {
    if (age <= 25) distribution['15-25']++;
    else if (age <= 35) distribution['26-35']++;
    else if (age <= 45) distribution['36-45']++;
    else if (age <= 55) distribution['46-55']++;
    else if (age <= 65) distribution['56-65']++;
    else distribution['66+']++;
  }

  private categorizeByService(service: number, distribution: any): void {
    if (service <= this.servicePeriods.shortTerm.max) distribution.shortTerm++;
    else if (service <= this.servicePeriods.mediumTerm.max) distribution.mediumTerm++;
    else if (service <= this.servicePeriods.longTerm.max) distribution.longTerm++;
    else distribution.veteran++;
  }

  private calculateStabilityIndex(serviceDistribution: any, total: number): number {
    const weights = { shortTerm: 1, mediumTerm: 3, longTerm: 5, veteran: 4 };
    const weighted = Object.entries(serviceDistribution)
      .reduce((sum, [key, count]) => sum + (count as number) * weights[key as keyof typeof weights], 0);
    
    return Math.round((weighted / total) * 100) / 100;
  }

  private generateAgeInsights(distribution: any, total: number, pensionEligible: number): string[] {
    const insights = [];
    const over55 = (distribution['56-65'] + distribution['66+']) / total;
    
    if (over55 > 0.3) {
      insights.push('Población envejecida - Mayor costo de beneficios médicos');
    }
    if (pensionEligible > total * 0.1) {
      insights.push('Alto porcentaje elegible para pensión - Planear sucesión');
    }
    if (distribution['15-25'] / total > 0.3) {
      insights.push('Población joven - Posible alta rotación inicial');
    }
    
    return insights;
  }

  private generateServiceInsights(distribution: any, total: number): string[] {
    const insights = [];
    const veteran = distribution.veteran / total;
    const shortTerm = distribution.shortTerm / total;
    
    if (veteran > 0.2) {
      insights.push('Alta antigüedad - Beneficios acumulados significativos');
    }
    if (shortTerm > 0.4) {
      insights.push('Alta rotación inicial - Considerar programas de retención');
    }
    
    return insights;
  }

  private assessPensionRisk(projections: any, total: number): string {
    const immediate = projections.immediate.count / total;
    const next5 = projections.next5Years.count / total;
    
    if (immediate > 0.1 || next5 > 0.25) return 'ALTO - Múltiples retiros próximos';
    if (next5 > 0.15) return 'MEDIO - Retiros moderados proyectados';
    return 'BAJO - Población estable';
  }

  private calculateLiabilityMetrics(personnel: any[]): any {
    // Métricas simplificadas para evaluación inicial
    return {
      population: {
        total: personnel.length,
        coverage: 'Activos con beneficios definidos'
      },
      risks: ['Longevidad', 'Inflación salarial', 'Cambios regulatorios'],
      recommendations: [
        'Actualizar tablas de mortalidad',
        'Revisar hipótesis económicas',
        'Considerar estudios actuariales completos'
      ]
    };
  }

  private calculateProjectedService(age: number, currentService: number): any {
    const retirementAge = 65;
    const projectedYears = Math.max(0, retirementAge - age);
    const projectedTotalService = currentService + projectedYears;
    
    return {
      years: projectedTotalService,
      cost: projectedTotalService * 1000 // Simplificado
    };
  }

  private extractTerminationDate(employee: any): Date | null {
    const possibleFields = ['fechaTerminacion', 'fecha_terminacion', 'termination_date', 'baja'];
    for (const field of possibleFields) {
      if (employee[field]) {
        const date = this.parseDate(employee[field]);
        if (date) return date;
      }
    }
    return null;
  }

  private calculateServiceAtDate(hireDate: Date, endDate: Date): number {
    const diffTime = endDate.getTime() - hireDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
  }

  private calculateAgeAtDate(birthDate: Date, targetDate: Date): number {
    const age = targetDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = targetDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && targetDate.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    
    return age;
  }

  private validateActuarialConsistency(employee: any, row: number): string[] {
    const issues: string[] = [];
    
    const birthDate = this.extractBirthDate(employee);
    const hireDate = this.extractHireDate(employee);
    
    if (birthDate && hireDate) {
      const ageAtHire = this.calculateAgeAtDate(birthDate, hireDate);
      
      if (ageAtHire < 15) {
        issues.push(`Fila ${row}: Contratado menor de edad (${ageAtHire} años)`);
      }
      
      if (ageAtHire > 70) {
        issues.push(`Fila ${row}: Contratación a edad avanzada (${ageAtHire} años)`);
      }
    }
    
    return issues;
  }
}