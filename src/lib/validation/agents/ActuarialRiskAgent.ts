import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult } from '../types/ValidationTypes';

interface ActuarialRisk {
  level: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRÍTICO';
  score: number;
  factors: string[];
  liabilityProjection: number;
  recommendations: string[];
}

interface PensionProjection {
  normalRetirementAge: number;
  earlyRetirementAge: number;
  expectedBenefit: number;
  presentValue: number;
  serviceProbability: number;
  mortalityRisk: number;
}

interface PopulationRisk {
  ageConcentration: { range: string; percentage: number; risk: string }[];
  salaryConcentration: { level: string; count: number; totalLiability: number }[];
  turnoverRisk: { rate: number; cost: number; trend: string };
  demographicImbalance: { severity: string; factors: string[] };
}

export class ActuarialRiskAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'ActuarialRiskAgent',
      description: 'Agente experto en evaluación integral de riesgos actuariales',
      priority: 1,
      dependencies: [],
      timeout: 30000
    });
  }

  async validate(mappedData: any): Promise<ValidationResult[]> {
    if (!mappedData?.activePersonnel) {
      return [{
        isValid: false,
        severity: 'critical',
        message: 'No se encontraron datos de personal activo para análisis actuarial',
        field: 'activePersonnel',
        value: null,
        suggestion: 'Proporcione datos válidos de personal activo',
        metadata: { agent: this.name, type: 'MISSING_DATA' }
      }];
    }

    return await this.validatePersonnelActuarialRisk(mappedData.activePersonnel);
  }
  private readonly actuarialTables = {
    mortality: {
      male: { base: 0.008, ageMultiplier: 1.1 },
      female: { base: 0.006, ageMultiplier: 1.08 }
    },
    turnover: {
      ageRanges: {
        '18-25': 0.35,
        '26-35': 0.25,
        '36-45': 0.15,
        '46-55': 0.08,
        '56-65': 0.05
      }
    },
    disability: {
      rates: { base: 0.012, ageProgression: 1.15 }
    }
  };

  private readonly pensionParameters = {
    normalRetirement: { age: 65, serviceYears: 25 },
    earlyRetirement: { age: 60, serviceYears: 25 },
    benefitFormula: {
      accrualRate: 0.025,
      salaryMultiplier: 1.0,
      capPercentage: 0.80
    },
    economicAssumptions: {
      discountRate: 0.075,
      salaryGrowth: 0.04,
      inflation: 0.03
    }
  };

  private readonly riskFactors = {
    demographic: {
      ageConcentration: { threshold: 0.4, weight: 0.3 },
      retirementWave: { threshold: 0.15, weight: 0.4 },
      genderImbalance: { threshold: 0.8, weight: 0.1 }
    },
    financial: {
      salaryConcentration: { threshold: 0.6, weight: 0.3 },
      highEarnerRisk: { threshold: 100000, weight: 0.4 },
      benefitVolatility: { threshold: 0.25, weight: 0.3 }
    },
    operational: {
      turnoverRate: { healthy: 0.15, concerning: 0.30, critical: 0.45 },
      newHireIntegration: { threshold: 0.25, weight: 0.2 }
    }
  };

  async validatePersonnelActuarialRisk(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    if (!personnel?.length) {
      return [{
        isValid: false,
        severity: 'critical',
        message: 'No se proporcionaron datos de personal para análisis actuarial',
        field: 'personnel',
        value: null,
        suggestion: 'Proporcione datos válidos de personal',
        metadata: { agent: 'ActuarialRiskAgent', type: 'DATA_MISSING' }
      }];
    }

    // Análisis de riesgo poblacional
    const populationRisk = this.analyzePopulationRisk(personnel);
    results.push(...this.createPopulationRiskResults(populationRisk));

    // Proyecciones de pensión individuales
    const pensionProjections = this.calculatePensionProjections(personnel);
    results.push(...this.createPensionProjectionResults(pensionProjections));

    // Análisis de concentración de riesgos
    const concentrationRisks = this.analyzeConcentrationRisks(personnel);
    results.push(...this.createConcentrationRiskResults(concentrationRisks));

    // Evaluación de sostenibilidad financiera
    const sustainabilityAnalysis = this.analyzePlanSustainability(personnel);
    results.push(...this.createSustainabilityResults(sustainabilityAnalysis));

    return results;
  }

  private analyzePopulationRisk(personnel: any[]): PopulationRisk {
    const currentYear = new Date().getFullYear();
    
    // Análisis de concentración por edad
    const ageGroups = personnel.reduce((acc, person) => {
      const age = this.calculatePersonAge(person.fechaNacimiento, currentYear);
      const ageRange = this.getAgeRange(age);
      acc[ageRange] = (acc[ageRange] || 0) + 1;
      return acc;
    }, {});

    const total = personnel.length;
    const ageConcentration = Object.entries(ageGroups).map(([range, count]) => ({
      range,
      percentage: (count as number) / total,
      risk: this.assessAgeConcentrationRisk((count as number) / total, range)
    }));

    // Análisis de concentración salarial
    const salaryGroups = this.groupBySalaryLevel(personnel);
    const salaryConcentration = salaryGroups.map(group => ({
      level: group.level,
      count: group.count,
      totalLiability: this.calculateGroupLiability(group.personnel)
    }));

    // Análisis de rotación
    const turnoverRisk = this.analyzeTurnoverRisk(personnel);

    // Identificar desequilibrios demográficos
    const demographicImbalance = this.identifyDemographicImbalances(ageConcentration, personnel);

    return {
      ageConcentration,
      salaryConcentration,
      turnoverRisk,
      demographicImbalance
    };
  }

  private calculatePensionProjections(personnel: any[]): { person: any; projection: PensionProjection; risk: ActuarialRisk }[] {
    const currentYear = new Date().getFullYear();
    
    return personnel.map(person => {
      const age = this.calculatePersonAge(person.fechaNacimiento, currentYear);
      const serviceYears = this.calculatePersonServiceYears(person.fechaIngreso, currentYear);
      const salary = parseFloat(person.salarioIntegrado || person.salarioBase || '0');

      const projection = this.calculateIndividualPensionProjection(age, serviceYears, salary);
      const risk = this.assessIndividualActuarialRisk(person, projection);

      return { person, projection, risk };
    });
  }

  private calculateIndividualPensionProjection(age: number, serviceYears: number, salary: number): PensionProjection {
    const { normalRetirement, earlyRetirement, benefitFormula, economicAssumptions } = this.pensionParameters;
    
    const normalRetirementAge = normalRetirement.age;
    const earlyRetirementAge = earlyRetirement.age;
    
    // Años hasta retiro normal
    const yearsToRetirement = Math.max(0, normalRetirementAge - age);
    const totalServiceAtRetirement = serviceYears + yearsToRetirement;
    
    // Proyección salarial al retiro
    const projectedSalary = salary * Math.pow(1 + economicAssumptions.salaryGrowth, yearsToRetirement);
    
    // Cálculo del beneficio
    const accrualYears = Math.min(totalServiceAtRetirement, normalRetirement.serviceYears);
    const benefitPercentage = Math.min(accrualYears * benefitFormula.accrualRate, benefitFormula.capPercentage);
    const expectedBenefit = projectedSalary * benefitPercentage;
    
    // Valor presente del beneficio
    const benefitDuration = 20; // Años esperados de pago de pensión
    const presentValue = this.calculatePresentValue(expectedBenefit, benefitDuration, economicAssumptions.discountRate);
    
    // Probabilidades actuariales
    const serviceProbability = this.calculateServiceProbability(age, yearsToRetirement);
    const mortalityRisk = this.calculateMortalityRisk(age, 'male'); // Simplificado

    return {
      normalRetirementAge,
      earlyRetirementAge,
      expectedBenefit,
      presentValue,
      serviceProbability,
      mortalityRisk
    };
  }

  private assessIndividualActuarialRisk(person: any, projection: PensionProjection): ActuarialRisk {
    const age = this.calculatePersonAge(person.fechaNacimiento, new Date().getFullYear());
    const salary = parseFloat(person.salarioIntegrado || person.salarioBase || '0');
    
    let riskScore = 0;
    const factors: string[] = [];
    const recommendations: string[] = [];

    // Factor edad
    if (age > 55) {
      riskScore += 30;
      factors.push('Próximo a retiro (alto riesgo de pago inmediato)');
    } else if (age > 45) {
      riskScore += 20;
      factors.push('Mediana edad (riesgo moderado de retiro)');
    }

    // Factor salarial
    if (salary > 100000) {
      riskScore += 25;
      factors.push('Alto salario (alta exposición de beneficios)');
      recommendations.push('Considerar límites de beneficios o contribuciones especiales');
    }

    // Factor de permanencia
    if (projection.serviceProbability < 0.5) {
      riskScore += 15;
      factors.push('Baja probabilidad de permanencia');
    }

    // Factor de valor presente
    if (projection.presentValue > 1000000) {
      riskScore += 20;
      factors.push('Alto valor presente de beneficios');
      recommendations.push('Revisar estrategia de financiamiento');
    }

    // Determinar nivel de riesgo
    let level: ActuarialRisk['level'];
    if (riskScore >= 70) level = 'CRÍTICO';
    else if (riskScore >= 50) level = 'ALTO';
    else if (riskScore >= 30) level = 'MEDIO';
    else level = 'BAJO';

    if (recommendations.length === 0) {
      recommendations.push('Mantener monitoreo regular de métricas actuariales');
    }

    return {
      level,
      score: riskScore,
      factors,
      liabilityProjection: projection.presentValue,
      recommendations
    };
  }

  private analyzeConcentrationRisks(personnel: any[]): any {
    const total = personnel.length;
    
    // Concentración por rango salarial
    const salaryRanges = {
      'Alto (>$50k)': personnel.filter(p => parseFloat(p.salarioIntegrado || '0') > 50000).length,
      'Medio ($20k-$50k)': personnel.filter(p => {
        const salary = parseFloat(p.salarioIntegrado || '0');
        return salary >= 20000 && salary <= 50000;
      }).length,
      'Bajo (<$20k)': personnel.filter(p => parseFloat(p.salarioIntegrado || '0') < 20000).length
    };

    // Concentración por departamento/puesto
    const departmentConcentration = personnel.reduce((acc, person) => {
      const dept = person.puesto || 'No definido';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    // Identificar concentraciones críticas
    const criticalConcentrations: string[] = [];
    Object.entries(salaryRanges).forEach(([range, count]) => {
      const percentage = count / total;
      if (percentage > 0.6) {
        criticalConcentrations.push(`Concentración crítica en rango salarial: ${range} (${(percentage * 100).toFixed(1)}%)`);
      }
    });

    return {
      salaryRanges,
      departmentConcentration,
      criticalConcentrations,
      totalLiability: personnel.reduce((sum, p) => {
        const projection = this.calculateIndividualPensionProjection(
          this.calculatePersonAge(p.fechaNacimiento, new Date().getFullYear()),
          this.calculatePersonServiceYears(p.fechaIngreso, new Date().getFullYear()),
          parseFloat(p.salarioIntegrado || '0')
        );
        return sum + projection.presentValue;
      }, 0)
    };
  }

  private analyzePlanSustainability(personnel: any[]): any {
    const currentYear = new Date().getFullYear();
    const totalLiability = personnel.reduce((sum, person) => {
      const projection = this.calculateIndividualPensionProjection(
        this.calculatePersonAge(person.fechaNacimiento, currentYear),
        this.calculatePersonServiceYears(person.fechaIngreso, currentYear),
        parseFloat(person.salarioIntegrado || '0')
      );
      return sum + projection.presentValue;
    }, 0);

    const averageSalary = personnel.reduce((sum, p) => sum + parseFloat(p.salarioIntegrado || '0'), 0) / personnel.length;
    const estimatedContributions = personnel.length * averageSalary * 0.15 * 20; // 15% contribution rate, 20 years

    const fundingRatio = estimatedContributions / totalLiability;
    
    let sustainabilityLevel: string;
    let recommendations: string[] = [];

    if (fundingRatio >= 1.2) {
      sustainabilityLevel = 'EXCELENTE';
      recommendations.push('Plan bien financiado, considerar mejoras de beneficios');
    } else if (fundingRatio >= 1.0) {
      sustainabilityLevel = 'BUENA';
      recommendations.push('Plan adecuadamente financiado, mantener contribuciones actuales');
    } else if (fundingRatio >= 0.8) {
      sustainabilityLevel = 'MODERADA';
      recommendations.push('Considerar incrementar contribuciones o revisar beneficios');
    } else {
      sustainabilityLevel = 'CRÍTICA';
      recommendations.push('Requiere acción inmediata: incrementar contribuciones significativamente');
      recommendations.push('Considerar modificaciones estructurales al plan');
    }

    return {
      totalLiability,
      estimatedContributions,
      fundingRatio,
      sustainabilityLevel,
      recommendations,
      projectedShortfall: Math.max(0, totalLiability - estimatedContributions)
    };
  }

  // Métodos auxiliares
  private calculatePersonAge(birthDate: string, currentYear: number): number {
    const birth = new Date(birthDate);
    return currentYear - birth.getFullYear();
  }

  private calculatePersonServiceYears(hireDate: string, currentYear: number): number {
    const hire = new Date(hireDate);
    return Math.max(0, currentYear - hire.getFullYear());
  }

  private getAgeRange(age: number): string {
    if (age < 25) return '18-25';
    if (age < 35) return '26-35';
    if (age < 45) return '36-45';
    if (age < 55) return '46-55';
    return '56-65';
  }

  private assessAgeConcentrationRisk(percentage: number, ageRange: string): string {
    if (percentage > 0.4) return 'ALTO';
    if (percentage > 0.25) return 'MEDIO';
    return 'BAJO';
  }

  private groupBySalaryLevel(personnel: any[]): any[] {
    const groups = {
      'Alto': personnel.filter(p => parseFloat(p.salarioIntegrado || '0') > 50000),
      'Medio': personnel.filter(p => {
        const salary = parseFloat(p.salarioIntegrado || '0');
        return salary >= 20000 && salary <= 50000;
      }),
      'Bajo': personnel.filter(p => parseFloat(p.salarioIntegrado || '0') < 20000)
    };

    return Object.entries(groups).map(([level, personnel]) => ({
      level,
      count: personnel.length,
      personnel
    }));
  }

  private calculateGroupLiability(group: any[]): number {
    const currentYear = new Date().getFullYear();
    return group.reduce((sum, person) => {
      const projection = this.calculateIndividualPensionProjection(
        this.calculatePersonAge(person.fechaNacimiento, currentYear),
        this.calculatePersonServiceYears(person.fechaIngreso, currentYear),
        parseFloat(person.salarioIntegrado || '0')
      );
      return sum + projection.presentValue;
    }, 0);
  }

  private analyzeTurnoverRisk(personnel: any[]): any {
    // Análisis simplificado de rotación
    const avgAge = personnel.reduce((sum, p) => sum + this.calculatePersonAge(p.fechaNacimiento, new Date().getFullYear()), 0) / personnel.length;
    const expectedTurnover = this.actuarialTables.turnover.ageRanges[this.getAgeRange(avgAge)] || 0.20;
    
    return {
      rate: expectedTurnover,
      cost: personnel.length * 50000 * expectedTurnover, // Costo estimado de reemplazo
      trend: expectedTurnover > 0.25 ? 'PREOCUPANTE' : 'NORMAL'
    };
  }

  private identifyDemographicImbalances(ageConcentration: any[], personnel: any[]): any {
    const imbalances: string[] = [];
    let severity = 'BAJO';

    // Verificar concentraciones críticas por edad
    ageConcentration.forEach(group => {
      if (group.percentage > 0.4) {
        imbalances.push(`Concentración crítica en rango ${group.range}: ${(group.percentage * 100).toFixed(1)}%`);
        severity = 'ALTO';
      }
    });

    // Verificar próximos retiros
    const nearRetirement = personnel.filter(p => this.calculatePersonAge(p.fechaNacimiento, new Date().getFullYear()) > 60).length;
    const retirementPercentage = nearRetirement / personnel.length;
    
    if (retirementPercentage > 0.15) {
      imbalances.push(`Alto porcentaje próximo al retiro: ${(retirementPercentage * 100).toFixed(1)}%`);
      severity = 'ALTO';
    }

    if (imbalances.length === 0) {
      imbalances.push('Distribución demográfica equilibrada');
    }

    return { severity, factors: imbalances };
  }

  private calculatePresentValue(annualBenefit: number, duration: number, discountRate: number): number {
    let pv = 0;
    for (let year = 1; year <= duration; year++) {
      pv += annualBenefit / Math.pow(1 + discountRate, year);
    }
    return pv;
  }

  private calculateServiceProbability(currentAge: number, yearsToRetirement: number): number {
    const baseRate = 0.95;
    const ageDecline = Math.max(0, (currentAge - 25) * 0.005);
    const timeDecline = yearsToRetirement * 0.02;
    return Math.max(0.3, baseRate - ageDecline - timeDecline);
  }

  private calculateMortalityRisk(age: number, gender: string): number {
    const table = this.actuarialTables.mortality[gender as 'male' | 'female'] || this.actuarialTables.mortality.male;
    return table.base * Math.pow(table.ageMultiplier, Math.max(0, age - 25));
  }

  // Métodos de creación de resultados
  private createPopulationRiskResults(populationRisk: PopulationRisk): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Resultado de análisis demográfico
    const hasHighRisk = populationRisk.ageConcentration.some(group => group.risk === 'ALTO');
    results.push({
      isValid: !hasHighRisk,
      severity: hasHighRisk ? 'warning' : 'info',
      message: `Análisis demográfico de población: ${populationRisk.demographicImbalance.severity}`,
      field: 'demographic_analysis',
      value: populationRisk.ageConcentration,
      suggestion: hasHighRisk ? 'Revisar estrategia de contratación para equilibrar distribución etaria' : 'Distribución demográfica saludable',
      metadata: { 
        agent: 'ActuarialRiskAgent', 
        type: 'POPULATION_RISK',
        details: populationRisk.demographicImbalance.factors
      }
    });

    // Resultado de análisis de rotación
    const turnoverCritical = populationRisk.turnoverRisk.rate > 0.30;
    results.push({
      isValid: !turnoverCritical,
      severity: turnoverCritical ? 'warning' : 'info',
      message: `Análisis de rotación: ${populationRisk.turnoverRisk.trend} (${(populationRisk.turnoverRisk.rate * 100).toFixed(1)}%)`,
      field: 'turnover_analysis',
      value: populationRisk.turnoverRisk.rate,
      suggestion: turnoverCritical ? 'Implementar estrategias de retención de empleados' : 'Tasa de rotación saludable',
      metadata: { 
        agent: 'ActuarialRiskAgent', 
        type: 'TURNOVER_RISK',
        estimatedCost: populationRisk.turnoverRisk.cost
      }
    });

    return results;
  }

  private createPensionProjectionResults(projections: { person: any; projection: PensionProjection; risk: ActuarialRisk }[]): ValidationResult[] {
    const results: ValidationResult[] = [];
    
    const highRiskCount = projections.filter(p => p.risk.level === 'CRÍTICO' || p.risk.level === 'ALTO').length;
    const totalLiability = projections.reduce((sum, p) => sum + p.projection.presentValue, 0);

    // Resultado resumen de proyecciones
    results.push({
      isValid: highRiskCount / projections.length < 0.2,
      severity: highRiskCount / projections.length >= 0.2 ? 'warning' : 'info',
      message: `Proyecciones de pensión: ${highRiskCount} empleados con riesgo alto/crítico de ${projections.length}`,
      field: 'pension_projections',
      value: totalLiability,
      suggestion: highRiskCount > 0 ? 'Revisar casos de alto riesgo y considerar ajustes al plan' : 'Proyecciones actuariales estables',
      metadata: { 
        agent: 'ActuarialRiskAgent', 
        type: 'PENSION_PROJECTIONS',
        totalLiability: totalLiability,
        highRiskCount: highRiskCount
      }
    });

    // Agregar resultados para casos críticos
    projections.filter(p => p.risk.level === 'CRÍTICO').forEach((projection, index) => {
      results.push({
        isValid: false,
        severity: 'critical',
        message: `Riesgo actuarial crítico: ${projection.person.nombre || 'Empleado'} (Score: ${projection.risk.score})`,
        field: 'critical_actuarial_risk',
        value: projection.risk.score,
        suggestion: projection.risk.recommendations[0] || 'Revisar caso individualmente',
        metadata: { 
          agent: 'ActuarialRiskAgent', 
          type: 'CRITICAL_RISK',
          factors: projection.risk.factors,
          liabilityProjection: projection.risk.liabilityProjection
        }
      });
    });

    return results;
  }

  private createConcentrationRiskResults(concentrationRisks: any): ValidationResult[] {
    const results: ValidationResult[] = [];

    const hasCriticalConcentration = concentrationRisks.criticalConcentrations.length > 0;

    results.push({
      isValid: !hasCriticalConcentration,
      severity: hasCriticalConcentration ? 'warning' : 'info',
      message: `Análisis de concentración de riesgos: ${hasCriticalConcentration ? 'Concentraciones críticas detectadas' : 'Distribución equilibrada'}`,
      field: 'concentration_analysis',
      value: concentrationRisks.totalLiability,
      suggestion: hasCriticalConcentration ? 'Diversificar exposición por rango salarial y departamentos' : 'Distribución de riesgos saludable',
      metadata: { 
        agent: 'ActuarialRiskAgent', 
        type: 'CONCENTRATION_RISK',
        criticalConcentrations: concentrationRisks.criticalConcentrations,
        totalLiability: concentrationRisks.totalLiability
      }
    });

    return results;
  }

  private createSustainabilityResults(sustainability: any): ValidationResult[] {
    const isCritical = sustainability.sustainabilityLevel === 'CRÍTICA';
    const isWeak = ['CRÍTICA', 'MODERADA'].includes(sustainability.sustainabilityLevel);

    return [{
      isValid: !isCritical,
      severity: isCritical ? 'critical' : isWeak ? 'warning' : 'info',
      message: `Sostenibilidad del plan: ${sustainability.sustainabilityLevel} (Ratio de financiamiento: ${(sustainability.fundingRatio * 100).toFixed(1)}%)`,
      field: 'plan_sustainability',
      value: sustainability.fundingRatio,
      suggestion: sustainability.recommendations[0] || 'Mantener monitoreo regular',
      metadata: { 
        agent: 'ActuarialRiskAgent', 
        type: 'SUSTAINABILITY_ANALYSIS',
        totalLiability: sustainability.totalLiability,
        estimatedContributions: sustainability.estimatedContributions,
        projectedShortfall: sustainability.projectedShortfall,
        recommendations: sustainability.recommendations
      }
    }];
  }
}