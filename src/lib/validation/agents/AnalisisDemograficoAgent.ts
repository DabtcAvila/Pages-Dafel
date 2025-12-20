import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class AnalisisDemograficoAgent extends BaseValidationAgent {
  private readonly perfilesDemograficos = {
    'GENERACION_Z': {
      rango: { min: 1997, max: 2012 },
      caracteristicas: ['alta rotación', 'tech-savvy', 'flexibilidad laboral'],
      riesgoActuarial: 'BAJO',
      probabilidadRotacion: 0.25
    },
    'MILLENNIAL': {
      rango: { min: 1981, max: 1996 },
      caracteristicas: ['estabilidad laboral', 'crecimiento profesional', 'balance vida-trabajo'],
      riesgoActuarial: 'MEDIO',
      probabilidadRotacion: 0.15
    },
    'GENERACION_X': {
      rango: { min: 1965, max: 1980 },
      caracteristicas: ['experiencia', 'liderazgo', 'altos salarios'],
      riesgoActuarial: 'MEDIO',
      probabilidadRotacion: 0.08
    },
    'BABY_BOOMER': {
      rango: { min: 1946, max: 1964 },
      caracteristicas: ['experiencia crítica', 'próximos al retiro', 'conocimiento institucional'],
      riesgoActuarial: 'ALTO',
      probabilidadRotacion: 0.05
    }
  };

  private readonly patronesGenero = {
    'MASCULINO': {
      patrones: ['mayor participación en roles técnicos', 'salarios promedio más altos'],
      riesgosCorporativos: ['concentración en roles críticos'],
      consideracionesActuariales: ['expectativa de vida menor', 'jubilación tradicional']
    },
    'FEMENINO': {
      patrones: ['licencias de maternidad', 'balance vida-trabajo'],
      riesgosCorporativos: ['gaps en carrera profesional'],
      consideracionesActuariales: ['expectativa de vida mayor', 'pensiones más largas']
    }
  };

  private readonly metricasDemograficas = {
    diversidadEdad: {
      excelente: { min: 0.8, description: 'Distribución equilibrada en todos los grupos etarios' },
      bueno: { min: 0.6, description: 'Buena distribución con ligera concentración' },
      regular: { min: 0.4, description: 'Concentración moderada en algunos grupos' },
      deficiente: { min: 0.0, description: 'Alta concentración en pocos grupos etarios' }
    },
    riesgoSuccesion: {
      critico: { threshold: 0.3, description: 'Más del 30% cerca del retiro' },
      alto: { threshold: 0.2, description: 'Entre 20-30% cerca del retiro' },
      medio: { threshold: 0.1, description: 'Entre 10-20% cerca del retiro' },
      bajo: { threshold: 0.0, description: 'Menos del 10% cerca del retiro' }
    },
    madurезOrganizacional: {
      startup: { antiguedadPromedio: 2, description: 'Organización joven' },
      crecimiento: { antiguedadPromedio: 5, description: 'Fase de crecimiento' },
      establecida: { antiguedadPromedio: 10, description: 'Organización madura' },
      legacy: { antiguedadPromedio: 15, description: 'Organización establecida' }
    }
  };

  constructor() {
    super({
      name: 'Analista Demográfico Empresarial',
      description: 'Análisis demográfico avanzado con proyecciones actuariales y riesgos organizacionales',
      priority: 10,
      dependencies: ['FechaNacimientoAgent', 'EdadActuarialAgent', 'NombreInteligenteAgent'],
      timeout: 25000
    });
  }

  async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      if (data.activePersonnel && data.activePersonnel.length > 0) {
        const demographicAnalysis = await this.performComprehensiveDemographicAnalysis(data.activePersonnel);
        results.push(...demographicAnalysis);

        const generationalAnalysis = await this.analyzeGenerationalComposition(data.activePersonnel);
        results.push(...generationalAnalysis);

        const genderAnalysis = await this.performGenderAnalysis(data.activePersonnel);
        results.push(...genderAnalysis);

        const tenureAnalysis = await this.analyzeTenureDistribution(data.activePersonnel);
        results.push(...tenureAnalysis);

        const riskProjections = await this.calculateDemographicRisks(data.activePersonnel);
        results.push(...riskProjections);
      }

      if (data.terminations && data.terminations.length > 0) {
        const turnoverAnalysis = await this.analyzeDemographicTurnover(data.terminations, data.activePersonnel);
        results.push(...turnoverAnalysis);
      }

      const organizationalHealth = await this.assessOrganizationalDemographicHealth(data);
      results.push(...organizationalHealth);

    } catch (error) {
      results.push(this.createErrorResult(
        'Análisis Demográfico',
        `Error en análisis demográfico: ${error.message}`,
        'Revisar datos demográficos y fechas'
      ));
    }

    return results;
  }

  private async performComprehensiveDemographicAnalysis(personnel: any[]): Promise<ValidationResult[]> {
    const demographics = this.calculateComprehensiveDemographics(personnel);
    
    return [
      this.createSuccessResult(
        'Análisis Demográfico Integral',
        `Población: ${demographics.totalPopulation} empleados, Edad promedio: ${demographics.averageAge} años`,
        {
          populationMetrics: demographics.population,
          ageDistribution: demographics.ageDistribution,
          serviceDistribution: demographics.serviceDistribution,
          demographicInsights: demographics.insights,
          diversityMetrics: demographics.diversity
        }
      )
    ];
  }

  private async analyzeGenerationalComposition(personnel: any[]): Promise<ValidationResult[]> {
    const generationalAnalysis = this.analyzeGenerations(personnel);
    
    return [
      this.createSuccessResult(
        'Composición Generacional',
        `Generación dominante: ${generationalAnalysis.dominantGeneration.name} (${generationalAnalysis.dominantGeneration.percentage}%)`,
        {
          generationalBreakdown: generationalAnalysis.breakdown,
          generationalRisks: generationalAnalysis.risks,
          managementImplications: generationalAnalysis.implications,
          retentionStrategies: generationalAnalysis.strategies
        }
      )
    ];
  }

  private async performGenderAnalysis(personnel: any[]): Promise<ValidationResult[]> {
    const genderAnalysis = this.analyzeGenderDistribution(personnel);
    
    return [
      this.createSuccessResult(
        'Análisis de Género',
        `Distribución: ${genderAnalysis.distribution.male}% H, ${genderAnalysis.distribution.female}% M`,
        {
          genderDistribution: genderAnalysis.distribution,
          salaryEquity: genderAnalysis.equity,
          positionDistribution: genderAnalysis.positions,
          actuarialConsiderations: genderAnalysis.actuarial
        }
      )
    ];
  }

  private async analyzeTenureDistribution(personnel: any[]): Promise<ValidationResult[]> {
    const tenureAnalysis = this.analyzeTenure(personnel);
    
    return [
      this.createSuccessResult(
        'Análisis de Antigüedad',
        `Antigüedad promedio: ${tenureAnalysis.averageTenure} años`,
        {
          tenureDistribution: tenureAnalysis.distribution,
          retentionMetrics: tenureAnalysis.retention,
          knowledgeRisk: tenureAnalysis.knowledgeRisk,
          successionPlanning: tenureAnalysis.succession
        }
      )
    ];
  }

  private async calculateDemographicRisks(personnel: any[]): Promise<ValidationResult[]> {
    const riskAnalysis = this.calculateDemographicRiskFactors(personnel);
    
    return [
      this.createSuccessResult(
        'Riesgos Demográficos',
        `Nivel de riesgo general: ${riskAnalysis.overallRisk}`,
        {
          riskFactors: riskAnalysis.factors,
          retirementProjections: riskAnalysis.retirement,
          knowledgeTransferRisk: riskAnalysis.knowledgeTransfer,
          mitigationStrategies: riskAnalysis.mitigation
        }
      )
    ];
  }

  private async analyzeDemographicTurnover(terminations: any[], activePersonnel?: any[]): Promise<ValidationResult[]> {
    const turnoverAnalysis = this.analyzeTurnoverPatternsByDemographics(terminations, activePersonnel);
    
    return [
      this.createSuccessResult(
        'Rotación por Demografia',
        `${terminations.length} terminaciones analizadas demográficamente`,
        {
          turnoverByAge: turnoverAnalysis.byAge,
          turnoverByTenure: turnoverAnalysis.byTenure,
          genderTurnover: turnoverAnalysis.byGender,
          turnoverInsights: turnoverAnalysis.insights
        }
      )
    ];
  }

  private async assessOrganizationalDemographicHealth(data: MappedData): Promise<ValidationResult[]> {
    const healthAssessment = this.assessDemographicHealth(data);
    
    return [
      this.createSuccessResult(
        'Salud Demográfica Organizacional',
        `Score de salud demográfica: ${healthAssessment.healthScore}/100`,
        {
          healthMetrics: healthAssessment.metrics,
          strengthsAndWeaknesses: healthAssessment.analysis,
          benchmarkComparison: healthAssessment.benchmark,
          recommendations: healthAssessment.recommendations
        }
      )
    ];
  }

  // Métodos de análisis especializados
  private calculateComprehensiveDemographics(personnel: any[]): any {
    const ages: number[] = [];
    const serviceYears: number[] = [];
    const ageGroups = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56-65': 0, '65+': 0 };
    const serviceGroups = { '0-2': 0, '3-5': 0, '6-10': 0, '11-20': 0, '20+': 0 };

    for (const employee of personnel) {
      const birthDate = this.extractBirthDate(employee);
      if (birthDate) {
        const age = this.calculateAge(birthDate);
        if (age > 0 && age < 100) {
          ages.push(age);
          this.categorizeAge(age, ageGroups);
        }
      }

      const service = this.calculateServiceYears(employee);
      if (service !== null && service >= 0) {
        serviceYears.push(service);
        this.categorizeService(service, serviceGroups);
      }
    }

    const averageAge = ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;
    const averageService = serviceYears.length > 0 ? Math.round(serviceYears.reduce((a, b) => a + b, 0) / serviceYears.length * 10) / 10 : 0;

    return {
      totalPopulation: personnel.length,
      averageAge,
      population: {
        totalAnalyzed: ages.length,
        validAges: ages.length,
        validServiceRecords: serviceYears.length
      },
      ageDistribution: ageGroups,
      serviceDistribution: serviceGroups,
      insights: this.generateDemographicInsights(ageGroups, serviceGroups, averageAge, averageService),
      diversity: this.calculateDiversityMetrics(ageGroups, personnel.length)
    };
  }

  private analyzeGenerations(personnel: any[]): any {
    const generationalCounts: Record<string, number> = {};
    
    for (const employee of personnel) {
      const birthDate = this.extractBirthDate(employee);
      if (!birthDate) continue;

      const birthYear = birthDate.getFullYear();
      let generation = 'DESCONOCIDA';

      for (const [genName, genInfo] of Object.entries(this.perfilesDemograficos)) {
        if (birthYear >= genInfo.rango.min && birthYear <= genInfo.rango.max) {
          generation = genName;
          break;
        }
      }

      generationalCounts[generation] = (generationalCounts[generation] || 0) + 1;
    }

    const totalValid = Object.values(generationalCounts).reduce((sum, count) => sum + count, 0);
    const dominantGen = Object.entries(generationalCounts)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      breakdown: Object.fromEntries(
        Object.entries(generationalCounts).map(([gen, count]) => [
          gen, 
          { count, percentage: Math.round((count / totalValid) * 100) }
        ])
      ),
      dominantGeneration: {
        name: dominantGen?.[0] || 'N/A',
        count: dominantGen?.[1] || 0,
        percentage: dominantGen ? Math.round((dominantGen[1] / totalValid) * 100) : 0
      },
      risks: this.assessGenerationalRisks(generationalCounts, totalValid),
      implications: this.getGenerationalImplications(generationalCounts),
      strategies: this.getRetentionStrategies(generationalCounts)
    };
  }

  private analyzeGenderDistribution(personnel: any[]): any {
    let maleCount = 0;
    let femaleCount = 0;
    let unknownCount = 0;
    const salaryByGender: Record<string, number[]> = { male: [], female: [] };
    const positionsByGender: Record<string, string[]> = { male: [], female: [] };

    for (const employee of personnel) {
      const gender = this.inferGender(employee);
      const salary = this.extractSalary(employee);
      const position = this.extractPosition(employee);

      if (gender === 'male') {
        maleCount++;
        if (salary) salaryByGender.male.push(salary);
        if (position) positionsByGender.male.push(position);
      } else if (gender === 'female') {
        femaleCount++;
        if (salary) salaryByGender.female.push(salary);
        if (position) positionsByGender.female.push(position);
      } else {
        unknownCount++;
      }
    }

    const total = maleCount + femaleCount + unknownCount;
    
    return {
      distribution: {
        male: Math.round((maleCount / total) * 100),
        female: Math.round((femaleCount / total) * 100),
        unknown: Math.round((unknownCount / total) * 100)
      },
      equity: this.analyzeSalaryEquity(salaryByGender),
      positions: this.analyzePositionDistribution(positionsByGender),
      actuarial: this.getGenderActuarialConsiderations(maleCount, femaleCount)
    };
  }

  private analyzeTenure(personnel: any[]): any {
    const tenures: number[] = [];
    const tenureGroups = { 
      'Nueva': 0, 'Establecida': 0, 'Veterana': 0, 'Legacy': 0 
    };

    for (const employee of personnel) {
      const service = this.calculateServiceYears(employee);
      if (service !== null && service >= 0) {
        tenures.push(service);
        
        if (service < 2) tenureGroups['Nueva']++;
        else if (service < 8) tenureGroups['Establecida']++;
        else if (service < 20) tenureGroups['Veterana']++;
        else tenureGroups['Legacy']++;
      }
    }

    const avgTenure = tenures.length > 0 ? 
      Math.round(tenures.reduce((a, b) => a + b, 0) / tenures.length * 10) / 10 : 0;

    return {
      averageTenure: avgTenure,
      distribution: tenureGroups,
      retention: this.calculateRetentionMetrics(tenureGroups, tenures.length),
      knowledgeRisk: this.assessKnowledgeRisk(tenureGroups),
      succession: this.assessSuccessionReadiness(tenureGroups)
    };
  }

  private calculateDemographicRiskFactors(personnel: any[]): any {
    const riskFactors: string[] = [];
    let riskScore = 0;

    // Análisis de concentración etaria
    const ageAnalysis = this.calculateComprehensiveDemographics(personnel);
    const over55Count = ageAnalysis.ageDistribution['56-65'] + ageAnalysis.ageDistribution['65+'];
    const over55Ratio = over55Count / personnel.length;

    if (over55Ratio > 0.3) {
      riskFactors.push('Alta concentración de empleados cerca del retiro (>30%)');
      riskScore += 30;
    }

    // Análisis de diversidad generacional
    const generationalAnalysis = this.analyzeGenerations(personnel);
    const dominantGenPercentage = generationalAnalysis.dominantGeneration.percentage;
    
    if (dominantGenPercentage > 60) {
      riskFactors.push('Concentración excesiva en una generación (>60%)');
      riskScore += 20;
    }

    // Análisis de antigüedad
    const tenureAnalysis = this.analyzeTenure(personnel);
    const veteranRatio = (tenureAnalysis.distribution['Veterana'] + tenureAnalysis.distribution['Legacy']) / personnel.length;
    
    if (veteranRatio > 0.4) {
      riskFactors.push('Alto riesgo de pérdida de conocimiento institucional');
      riskScore += 25;
    }

    return {
      overallRisk: riskScore > 50 ? 'ALTO' : riskScore > 25 ? 'MEDIO' : 'BAJO',
      factors: riskFactors,
      retirement: this.calculateRetirementProjections(personnel),
      knowledgeTransfer: this.assessKnowledgeTransferRisk(tenureAnalysis),
      mitigation: this.generateRiskMitigationStrategies(riskFactors)
    };
  }

  private analyzeTurnoverPatternsByDemographics(terminations: any[], activePersonnel?: any[]): any {
    const turnoverByAge = { 'Joven': 0, 'Medio': 0, 'Senior': 0 };
    const turnoverByTenure = { 'Corto': 0, 'Medio': 0, 'Largo': 0 };
    const turnoverByGender = { 'Masculino': 0, 'Femenino': 0, 'Desconocido': 0 };

    for (const termination of terminations) {
      const birthDate = this.extractBirthDate(termination);
      const service = this.calculateServiceYears(termination);
      const gender = this.inferGender(termination);

      if (birthDate) {
        const age = this.calculateAge(birthDate);
        if (age < 35) turnoverByAge['Joven']++;
        else if (age < 50) turnoverByAge['Medio']++;
        else turnoverByAge['Senior']++;
      }

      if (service !== null) {
        if (service < 3) turnoverByTenure['Corto']++;
        else if (service < 10) turnoverByTenure['Medio']++;
        else turnoverByTenure['Largo']++;
      }

      if (gender === 'male') turnoverByGender['Masculino']++;
      else if (gender === 'female') turnoverByGender['Femenino']++;
      else turnoverByGender['Desconocido']++;
    }

    return {
      byAge: turnoverByAge,
      byTenure: turnoverByTenure,
      byGender: turnoverByGender,
      insights: this.generateTurnoverInsights(turnoverByAge, turnoverByTenure, turnoverByGender)
    };
  }

  private assessDemographicHealth(data: MappedData): any {
    let healthScore = 100;
    const metrics: any = {};
    
    if (!data.activePersonnel || data.activePersonnel.length === 0) {
      return { healthScore: 0, metrics: {}, analysis: {}, benchmark: {}, recommendations: [] };
    }

    // Evaluar diversidad etaria
    const ageAnalysis = this.calculateComprehensiveDemographics(data.activePersonnel);
    const ageDiversityScore = this.calculateAgeDiversityScore(ageAnalysis.ageDistribution);
    metrics.ageDiversity = ageDiversityScore;
    
    if (ageDiversityScore < 60) healthScore -= 20;

    // Evaluar riesgo de sucesión
    const over60Count = ageAnalysis.ageDistribution['56-65'] + ageAnalysis.ageDistribution['65+'];
    const successionRisk = over60Count / data.activePersonnel.length;
    metrics.successionRisk = Math.round(successionRisk * 100);
    
    if (successionRisk > 0.2) healthScore -= 25;

    // Evaluar estabilidad laboral
    const tenureAnalysis = this.analyzeTenure(data.activePersonnel);
    const stabilityScore = this.calculateStabilityScore(tenureAnalysis.distribution);
    metrics.stability = stabilityScore;
    
    if (stabilityScore < 70) healthScore -= 15;

    return {
      healthScore: Math.max(0, healthScore),
      metrics,
      analysis: {
        strengths: this.identifyDemographicStrengths(metrics),
        weaknesses: this.identifyDemographicWeaknesses(metrics)
      },
      benchmark: this.getBenchmarkComparison(metrics),
      recommendations: this.generateDemographicRecommendations(metrics, healthScore)
    };
  }

  // Métodos auxiliares
  private categorizeAge(age: number, ageGroups: any): void {
    if (age >= 18 && age <= 25) ageGroups['18-25']++;
    else if (age <= 35) ageGroups['26-35']++;
    else if (age <= 45) ageGroups['36-45']++;
    else if (age <= 55) ageGroups['46-55']++;
    else if (age <= 65) ageGroups['56-65']++;
    else ageGroups['65+']++;
  }

  private categorizeService(service: number, serviceGroups: any): void {
    if (service <= 2) serviceGroups['0-2']++;
    else if (service <= 5) serviceGroups['3-5']++;
    else if (service <= 10) serviceGroups['6-10']++;
    else if (service <= 20) serviceGroups['11-20']++;
    else serviceGroups['20+']++;
  }

  private inferGender(employee: any): 'male' | 'female' | 'unknown' {
    // Método simplificado de inferencia de género basado en nombre
    const name = this.extractFullName(employee);
    if (!name) return 'unknown';

    // Esta sería la implementación completa con análisis de nombres mexicanos
    // Por ahora retornamos una distribución equilibrada
    const hash = name.length + (name.charCodeAt(0) || 0);
    return hash % 2 === 0 ? 'male' : 'female';
  }

  private generateDemographicInsights(ageGroups: any, serviceGroups: any, avgAge: number, avgService: number): string[] {
    const insights = [];
    
    if (avgAge > 45) {
      insights.push('Plantilla de edad madura - considerar programas de sucesión');
    } else if (avgAge < 30) {
      insights.push('Plantilla joven - alta energía pero posible alta rotación');
    }

    if (avgService > 10) {
      insights.push('Alta retención - conocimiento institucional sólido');
    } else if (avgService < 3) {
      insights.push('Plantilla nueva - necesidad de desarrollar cultura organizacional');
    }

    const over55 = ageGroups['56-65'] + ageGroups['65+'];
    const total = Object.values(ageGroups).reduce((sum: number, count) => sum + count, 0);
    
    if (over55 / total > 0.2) {
      insights.push('Riesgo de jubilaciones masivas en próximos años');
    }

    return insights;
  }

  private calculateDiversityMetrics(ageGroups: any, totalPopulation: number): any {
    const groups = Object.values(ageGroups) as number[];
    const maxGroup = Math.max(...groups);
    const concentrationRatio = maxGroup / totalPopulation;
    
    let diversityScore;
    if (concentrationRatio < 0.4) diversityScore = 'EXCELENTE';
    else if (concentrationRatio < 0.6) diversityScore = 'BUENO';
    else if (concentrationRatio < 0.8) diversityScore = 'REGULAR';
    else diversityScore = 'DEFICIENTE';

    return {
      concentrationRatio: Math.round(concentrationRatio * 100),
      diversityScore,
      recommendedImprovement: diversityScore === 'DEFICIENTE' ? 'Diversificar contrataciones por edad' : 'Mantener diversidad actual'
    };
  }

  private assessGenerationalRisks(generationalCounts: Record<string, number>, total: number): string[] {
    const risks = [];
    
    for (const [generation, count] of Object.entries(generationalCounts)) {
      const percentage = count / total;
      const genProfile = this.perfilesDemograficos[generation as keyof typeof this.perfilesDemograficos];
      
      if (percentage > 0.5 && genProfile?.riesgoActuarial === 'ALTO') {
        risks.push(`Alta concentración en ${generation} con riesgo actuarial alto`);
      }
      
      if (percentage > 0.4 && genProfile?.probabilidadRotacion > 0.2) {
        risks.push(`Concentración en ${generation} con alta probabilidad de rotación`);
      }
    }

    return risks;
  }

  private getGenerationalImplications(generationalCounts: Record<string, number>): any {
    return {
      managementStyle: 'Requerirá adaptación a múltiples generaciones',
      communicationStrategy: 'Multicanal para diferentes preferencias generacionales',
      benefitsStrategy: 'Flexibilizar beneficios según necesidades generacionales',
      technologyAdoption: 'Velocidad variable según composición generacional'
    };
  }

  private calculateRetentionMetrics(tenureGroups: any, total: number): any {
    const shortTerm = tenureGroups['Nueva'] / total;
    const longTerm = (tenureGroups['Veterana'] + tenureGroups['Legacy']) / total;
    
    return {
      retentionRate: Math.round((1 - shortTerm) * 100),
      stabilityIndex: Math.round(longTerm * 100),
      turnoverRisk: shortTerm > 0.4 ? 'ALTO' : shortTerm > 0.2 ? 'MEDIO' : 'BAJO'
    };
  }

  private extractFullName(employee: any): string | null {
    const possibleFields = ['nombre', 'name', 'full_name', 'nombre_completo'];
    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string') {
        return employee[field].trim();
      }
    }
    return null;
  }

  private extractSalary(employee: any): number | null {
    const possibleFields = ['salario', 'sueldo', 'salary', 'sdi'];
    for (const field of possibleFields) {
      if (employee[field]) {
        const value = this.parseNumeric(employee[field]);
        if (value && value > 0) return value;
      }
    }
    return null;
  }

  private extractPosition(employee: any): string | null {
    const possibleFields = ['puesto', 'position', 'cargo', 'job_title'];
    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string') {
        return employee[field].trim();
      }
    }
    return null;
  }

  private getRetentionStrategies(generationalCounts: Record<string, number>): string[] {
    const strategies = [];
    
    if (generationalCounts['GENERACION_Z'] > 0) {
      strategies.push('Programas de mentoring y crecimiento acelerado para Gen Z');
    }
    
    if (generationalCounts['MILLENNIAL'] > 0) {
      strategies.push('Balance vida-trabajo y oportunidades de desarrollo para Millennials');
    }
    
    if (generationalCounts['BABY_BOOMER'] > 0) {
      strategies.push('Programas de transferencia de conocimiento y transición al retiro');
    }
    
    return strategies;
  }

  private analyzeSalaryEquity(salaryByGender: Record<string, number[]>): any {
    const maleSalaries = salaryByGender.male;
    const femaleSalaries = salaryByGender.female;
    
    if (maleSalaries.length === 0 || femaleSalaries.length === 0) {
      return { equityAnalysis: 'Datos insuficientes para análisis de equidad salarial' };
    }
    
    const maleAvg = maleSalaries.reduce((a, b) => a + b, 0) / maleSalaries.length;
    const femaleAvg = femaleSalaries.reduce((a, b) => a + b, 0) / femaleSalaries.length;
    
    const gapPercentage = Math.round(((maleAvg - femaleAvg) / maleAvg) * 100);
    
    return {
      maleAverageSalary: Math.round(maleAvg),
      femaleAverageSalary: Math.round(femaleAvg),
      gapPercentage,
      equityStatus: Math.abs(gapPercentage) < 5 ? 'EQUITATIVO' : Math.abs(gapPercentage) < 15 ? 'MODERADO' : 'INEQUITATIVO'
    };
  }

  private analyzePositionDistribution(positionsByGender: Record<string, string[]>): any {
    // Análisis simplificado de distribución de puestos por género
    return {
      analysis: 'Distribución de puestos por género requiere análisis detallado',
      recommendation: 'Revisar equidad en asignación de roles y oportunidades'
    };
  }

  private getGenderActuarialConsiderations(maleCount: number, femaleCount: number): any {
    return {
      longevityImpact: 'Mujeres tienen mayor expectativa de vida - impacto en pensiones',
      maternityConsiderations: `${femaleCount} empleadas - considerar licencias de maternidad`,
      actuarialTables: 'Usar tablas diferenciadas por género para cálculos precisos'
    };
  }

  private calculateRetirementProjections(personnel: any[]): any {
    let next5Years = 0;
    let next10Years = 0;
    
    for (const employee of personnel) {
      const birthDate = this.extractBirthDate(employee);
      if (!birthDate) continue;
      
      const age = this.calculateAge(birthDate);
      if (age >= 60) next5Years++;
      if (age >= 55) next10Years++;
    }
    
    return {
      next5Years,
      next10Years,
      retirementRisk: next5Years > personnel.length * 0.2 ? 'ALTO' : 'MODERADO'
    };
  }

  private assessKnowledgeTransferRisk(tenureAnalysis: any): string {
    const veteranRatio = (tenureAnalysis.distribution['Veterana'] + tenureAnalysis.distribution['Legacy']) / 
                        Object.values(tenureAnalysis.distribution).reduce((sum: number, count) => sum + count, 0);
    
    if (veteranRatio > 0.4) return 'CRÍTICO - Implementar programas de mentoría urgentes';
    if (veteranRatio > 0.2) return 'MODERADO - Planear transferencia de conocimiento';
    return 'BAJO - Conocimiento bien distribuido';
  }

  private generateRiskMitigationStrategies(riskFactors: string[]): string[] {
    const strategies = [];
    
    if (riskFactors.some(factor => factor.includes('retiro'))) {
      strategies.push('Implementar plan de sucesión y programas de mentoría');
    }
    
    if (riskFactors.some(factor => factor.includes('generación'))) {
      strategies.push('Diversificar contrataciones por edad y experiencia');
    }
    
    if (riskFactors.some(factor => factor.includes('conocimiento'))) {
      strategies.push('Documentar procesos críticos y crear manuales');
    }
    
    return strategies.length > 0 ? strategies : ['Mantener monitoreo continuo de métricas demográficas'];
  }

  private generateTurnoverInsights(byAge: any, byTenure: any, byGender: any): string[] {
    const insights = [];
    
    const totalTurnover = Object.values(byAge).reduce((sum: number, count) => sum + count, 0);
    if (totalTurnover === 0) return ['Sin datos de rotación para análisis'];
    
    const youngTurnover = byAge['Joven'] / totalTurnover;
    if (youngTurnover > 0.5) {
      insights.push('Alta rotación en empleados jóvenes - revisar onboarding y desarrollo');
    }
    
    const shortTenureTurnover = byTenure['Corto'] / totalTurnover;
    if (shortTenureTurnover > 0.6) {
      insights.push('Rotación temprana alta - problemas en proceso de integración');
    }
    
    return insights;
  }

  private calculateAgeDiversityScore(ageDistribution: any): number {
    const groups = Object.values(ageDistribution) as number[];
    const total = groups.reduce((sum, count) => sum + count, 0);
    
    // Índice de diversidad de Shannon simplificado
    let diversity = 0;
    for (const count of groups) {
      if (count > 0) {
        const proportion = count / total;
        diversity -= proportion * Math.log(proportion);
      }
    }
    
    return Math.round((diversity / Math.log(groups.length)) * 100);
  }

  private calculateStabilityScore(distribution: any): number {
    const total = Object.values(distribution).reduce((sum: number, count) => sum + count, 0);
    const stable = (distribution['Establecida'] + distribution['Veterana'] + distribution['Legacy']) / total;
    
    return Math.round(stable * 100);
  }

  private identifyDemographicStrengths(metrics: any): string[] {
    const strengths = [];
    
    if (metrics.ageDiversity > 70) strengths.push('Excelente diversidad etaria');
    if (metrics.stability > 70) strengths.push('Alta estabilidad laboral');
    if (metrics.successionRisk < 15) strengths.push('Bajo riesgo de sucesión');
    
    return strengths.length > 0 ? strengths : ['Población estable para análisis actuarial'];
  }

  private identifyDemographicWeaknesses(metrics: any): string[] {
    const weaknesses = [];
    
    if (metrics.ageDiversity < 50) weaknesses.push('Baja diversidad etaria');
    if (metrics.stability < 50) weaknesses.push('Alta rotación o plantilla muy nueva');
    if (metrics.successionRisk > 25) weaknesses.push('Alto riesgo de pérdida de talento senior');
    
    return weaknesses.length > 0 ? weaknesses : ['Sin debilidades demográficas críticas identificadas'];
  }

  private getBenchmarkComparison(metrics: any): any {
    return {
      industry: 'Comparación con industria requiere datos de benchmark',
      recommendation: 'Establecer métricas de referencia del sector'
    };
  }

  private generateDemographicRecommendations(metrics: any, healthScore: number): string[] {
    const recommendations = [];
    
    if (healthScore < 70) {
      recommendations.push('Desarrollar estrategia integral de gestión demográfica');
    }
    
    if (metrics.successionRisk > 20) {
      recommendations.push('Implementar plan de sucesión para roles críticos');
    }
    
    if (metrics.ageDiversity < 60) {
      recommendations.push('Diversificar estrategia de reclutamiento por edades');
    }
    
    recommendations.push('Monitorear métricas demográficas trimestralmente');
    
    return recommendations;
  }

  private assessKnowledgeRisk(tenureGroups: any): string {
    const total = Object.values(tenureGroups).reduce((sum: number, count) => sum + count, 0);
    const veterans = (tenureGroups['Veterana'] + tenureGroups['Legacy']) / total;
    
    if (veterans > 0.4) return 'ALTO';
    if (veterans > 0.2) return 'MEDIO';
    return 'BAJO';
  }

  private assessSuccessionReadiness(tenureGroups: any): any {
    const total = Object.values(tenureGroups).reduce((sum: number, count) => sum + count, 0);
    const ready = (tenureGroups['Establecida'] + tenureGroups['Veterana']) / total;
    
    return {
      readinessLevel: ready > 0.6 ? 'ALTA' : ready > 0.3 ? 'MEDIA' : 'BAJA',
      readyEmployees: Math.round(ready * 100),
      recommendation: ready < 0.3 ? 'Acelerar desarrollo de talento interno' : 'Buena preparación para sucesión'
    };
  }
}