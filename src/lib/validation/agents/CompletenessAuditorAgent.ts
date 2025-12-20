import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class CompletenessAuditorAgent extends BaseValidationAgent {
  private readonly criticalFields = {
    OBLIGATORIOS: {
      personal: ['nombre', 'fechaNacimiento', 'rfc', 'curp'],
      laboral: ['fechaIngreso', 'puesto', 'salario'],
      legal: ['imss', 'salarioIntegrado']
    },
    IMPORTANTES: {
      demograficos: ['genero', 'estadoCivil', 'escolaridad'],
      contacto: ['direccion', 'telefono', 'email'],
      beneficiarios: ['beneficiarios', 'porcentajeBeneficiarios']
    },
    ADICIONALES: {
      prestaciones: ['vacaciones', 'aguinaldo', 'primaVacacional'],
      medicos: ['tipoSangre', 'alergias', 'enfermedades'],
      emergencia: ['contactoEmergencia', 'telefonoEmergencia']
    }
  };

  private readonly completenessThresholds = {
    CRÍTICO: { min: 95, description: 'Completitud crítica para cumplimiento' },
    ALTO: { min: 80, description: 'Alta completitud recomendada' },
    MODERADO: { min: 65, description: 'Completitud moderada aceptable' },
    BAJO: { min: 50, description: 'Completitud mínima' },
    INSUFICIENTE: { min: 0, description: 'Completitud insuficiente' }
  };

  private readonly dataQualityMetrics = {
    completeness: { weight: 0.4, description: 'Porcentaje de campos completos' },
    consistency: { weight: 0.3, description: 'Consistencia entre campos relacionados' },
    validity: { weight: 0.2, description: 'Validez del formato de datos' },
    timeliness: { weight: 0.1, description: 'Actualidad de la información' }
  };

  private readonly businessImpact = {
    LEGAL: {
      fields: ['rfc', 'curp', 'imss', 'fechaNacimiento'],
      impact: 'Incumplimiento normativo',
      urgency: 'CRÍTICA'
    },
    ACTUARIAL: {
      fields: ['fechaNacimiento', 'fechaIngreso', 'salario', 'salarioIntegrado'],
      impact: 'Cálculos actuariales incorrectos',
      urgency: 'ALTA'
    },
    OPERACIONAL: {
      fields: ['nombre', 'puesto', 'contacto'],
      impact: 'Operaciones diarias afectadas',
      urgency: 'MEDIA'
    },
    ESTRATÉGICO: {
      fields: ['escolaridad', 'competencias', 'evaluaciones'],
      impact: 'Decisiones estratégicas limitadas',
      urgency: 'BAJA'
    }
  };

  constructor() {
    super({
      name: 'Auditor de Completitud de Datos',
      description: 'Auditoría exhaustiva de completitud con análisis de impacto empresarial y actuarial',
      priority: 12,
      dependencies: [],
      timeout: 30000
    });
  }

  async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      if (data.activePersonnel && data.activePersonnel.length > 0) {
        const completenessAnalysis = await this.auditDataCompleteness(data.activePersonnel);
        results.push(...completenessAnalysis);

        const fieldCoverageAnalysis = await this.analyzeFieldCoverage(data.activePersonnel);
        results.push(...fieldCoverageAnalysis);

        const businessImpactAnalysis = await this.assessBusinessImpact(data.activePersonnel);
        results.push(...businessImpactAnalysis);

        const dataQualityAssessment = await this.assessOverallDataQuality(data.activePersonnel);
        results.push(...dataQualityAssessment);
      }

      if (data.terminations && data.terminations.length > 0) {
        const terminationCompleteness = await this.auditTerminationCompleteness(data.terminations);
        results.push(...terminationCompleteness);
      }

      const datasetHealthCheck = await this.performDatasetHealthCheck(data);
      results.push(...datasetHealthCheck);

    } catch (error) {
      results.push(this.createErrorResult(
        'Auditoría de Completitud',
        `Error en auditoría de completitud: ${error.message}`,
        'Revisar estructura de datos y campos disponibles'
      ));
    }

    return results;
  }

  private async auditDataCompleteness(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const completenessReport = this.generateCompletenessReport(personnel);
    
    // Analizar campos críticos faltantes
    if (completenessReport.criticalGaps.length > 0) {
      results.push(this.createErrorResult(
        'Campos Críticos Faltantes',
        `${completenessReport.criticalGaps.length} campos críticos con completitud insuficiente`,
        'Completar campos obligatorios para cumplimiento legal y actuarial',
        completenessReport.affectedEmployees,
        {
          criticalGaps: completenessReport.criticalGaps,
          completenessRates: completenessReport.ratesByCriticality,
          legalRisk: completenessReport.legalRisk,
          actuarialImpact: completenessReport.actuarialImpact
        }
      ));
    }

    // Analizar campos importantes faltantes
    if (completenessReport.importantGaps.length > 0) {
      results.push(this.createWarningResult(
        'Campos Importantes Incompletos',
        `${completenessReport.importantGaps.length} campos importantes con baja completitud`,
        'Mejorar completitud para optimizar análisis y operaciones',
        [],
        {
          importantGaps: completenessReport.importantGaps,
          operationalImpact: completenessReport.operationalImpact,
          recommendedActions: completenessReport.recommendations
        }
      ));
    }

    // Reporte general de completitud
    results.push(this.createSuccessResult(
      'Reporte de Completitud General',
      `Completitud promedio: ${completenessReport.overallCompleteness}% (${personnel.length} empleados)`,
      {
        overallMetrics: completenessReport.overallMetrics,
        fieldAnalysis: completenessReport.fieldAnalysis,
        qualityScore: completenessReport.qualityScore,
        improvementPlan: completenessReport.improvementPlan
      }
    ));

    return results;
  }

  private async analyzeFieldCoverage(personnel: any[]): Promise<ValidationResult[]> {
    const fieldCoverage = this.calculateFieldCoverage(personnel);
    
    return [
      this.createSuccessResult(
        'Análisis de Cobertura de Campos',
        `${fieldCoverage.availableFields} campos detectados de ${fieldCoverage.expectedFields} esperados`,
        {
          fieldInventory: fieldCoverage.inventory,
          coverageMetrics: fieldCoverage.metrics,
          missingFields: fieldCoverage.missing,
          fieldUtilization: fieldCoverage.utilization
        }
      )
    ];
  }

  private async assessBusinessImpact(personnel: any[]): Promise<ValidationResult[]> {
    const businessAnalysis = this.analyzeBusinessImpact(personnel);
    
    return [
      this.createSuccessResult(
        'Impacto de Completitud en Negocio',
        `Riesgo empresarial: ${businessAnalysis.overallRisk}`,
        {
          riskByArea: businessAnalysis.riskByArea,
          operationalLimitations: businessAnalysis.limitations,
          complianceStatus: businessAnalysis.compliance,
          mitigationStrategies: businessAnalysis.mitigation
        }
      )
    ];
  }

  private async assessOverallDataQuality(personnel: any[]): Promise<ValidationResult[]> {
    const qualityAssessment = this.calculateDataQualityScore(personnel);
    
    return [
      this.createSuccessResult(
        'Evaluación de Calidad de Datos',
        `Score de calidad: ${qualityAssessment.overallScore}/100`,
        {
          qualityDimensions: qualityAssessment.dimensions,
          strengthsAndWeaknesses: qualityAssessment.analysis,
          benchmarkComparison: qualityAssessment.benchmark,
          qualityImprovementPlan: qualityAssessment.improvementPlan
        }
      )
    ];
  }

  private async auditTerminationCompleteness(terminations: any[]): Promise<ValidationResult[]> {
    const terminationCompleteness = this.auditTerminationData(terminations);
    
    return [
      this.createSuccessResult(
        'Completitud en Datos de Terminación',
        `${terminations.length} terminaciones auditadas`,
        {
          terminationCompleteness: terminationCompleteness.completeness,
          requiredFields: terminationCompleteness.requiredFields,
          missingData: terminationCompleteness.missing,
          finiquitoCompleteness: terminationCompleteness.finiquito
        }
      )
    ];
  }

  private async performDatasetHealthCheck(data: MappedData): Promise<ValidationResult[]> {
    const healthCheck = this.performComprehensiveHealthCheck(data);
    
    return [
      this.createSuccessResult(
        'Estado de Salud del Dataset',
        `Salud general del dataset: ${healthCheck.overallHealth}`,
        {
          healthMetrics: healthCheck.metrics,
          dataIntegrity: healthCheck.integrity,
          usabilityAssessment: healthCheck.usability,
          strategicRecommendations: healthCheck.recommendations
        }
      )
    ];
  }

  // Métodos de análisis especializados
  private generateCompletenessReport(personnel: any[]): any {
    const report = {
      criticalGaps: [] as any[],
      importantGaps: [] as any[],
      affectedEmployees: [] as number[],
      ratesByCriticality: {} as any,
      overallCompleteness: 0,
      overallMetrics: {} as any,
      fieldAnalysis: {} as any,
      qualityScore: 0,
      legalRisk: '',
      actuarialImpact: '',
      operationalImpact: '',
      recommendations: [] as string[],
      improvementPlan: [] as string[]
    };

    // Analizar campos críticos
    const criticalCompleteness = this.analyzeCriticalFields(personnel);
    report.criticalGaps = criticalCompleteness.gaps;
    report.ratesByCriticality.critical = criticalCompleteness.averageCompleteness;
    
    if (criticalCompleteness.averageCompleteness < this.completenessThresholds.CRÍTICO.min) {
      report.legalRisk = 'ALTO - Riesgo de incumplimiento normativo';
      report.actuarialImpact = 'SEVERO - Cálculos actuariales comprometidos';
    }

    // Analizar campos importantes
    const importantCompleteness = this.analyzeImportantFields(personnel);
    report.importantGaps = importantCompleteness.gaps;
    report.ratesByCriticality.important = importantCompleteness.averageCompleteness;
    
    if (importantCompleteness.averageCompleteness < this.completenessThresholds.ALTO.min) {
      report.operationalImpact = 'MODERADO - Limitaciones en análisis operacional';
    }

    // Calcular completitud general
    const allFields = this.getAllPossibleFields();
    let totalCompleteness = 0;
    let fieldCount = 0;

    for (const field of allFields) {
      const completeness = this.calculateFieldCompleteness(personnel, field);
      totalCompleteness += completeness;
      fieldCount++;
      
      report.fieldAnalysis[field] = {
        completeness,
        category: this.categorizeField(field),
        businessImpact: this.getFieldBusinessImpact(field)
      };
    }

    report.overallCompleteness = Math.round(totalCompleteness / fieldCount);
    
    // Métricas generales
    report.overallMetrics = {
      totalEmployees: personnel.length,
      fieldsAnalyzed: fieldCount,
      averageCompleteness: report.overallCompleteness,
      completenessGrade: this.getCompletenessGrade(report.overallCompleteness)
    };

    // Score de calidad basado en completitud
    report.qualityScore = this.calculateQualityScoreFromCompleteness(report);

    // Identificar empleados más afectados
    report.affectedEmployees = this.identifyMostAffectedEmployees(personnel).slice(0, 20);

    // Generar recomendaciones
    report.recommendations = this.generateCompletenessRecommendations(report);
    report.improvementPlan = this.generateImprovementPlan(report);

    return report;
  }

  private analyzeCriticalFields(personnel: any[]): any {
    const criticalFields = [
      ...this.criticalFields.OBLIGATORIOS.personal,
      ...this.criticalFields.OBLIGATORIOS.laboral,
      ...this.criticalFields.OBLIGATORIOS.legal
    ];

    const gaps: any[] = [];
    let totalCompleteness = 0;

    for (const field of criticalFields) {
      const completeness = this.calculateFieldCompleteness(personnel, field);
      totalCompleteness += completeness;

      if (completeness < this.completenessThresholds.CRÍTICO.min) {
        gaps.push({
          field,
          completeness,
          missingCount: Math.round((100 - completeness) / 100 * personnel.length),
          impact: 'CRÍTICO',
          recommendation: this.getFieldRecommendation(field, completeness)
        });
      }
    }

    return {
      gaps,
      averageCompleteness: Math.round(totalCompleteness / criticalFields.length),
      fieldsAnalyzed: criticalFields.length
    };
  }

  private analyzeImportantFields(personnel: any[]): any {
    const importantFields = [
      ...this.criticalFields.IMPORTANTES.demograficos,
      ...this.criticalFields.IMPORTANTES.contacto
    ];

    const gaps: any[] = [];
    let totalCompleteness = 0;

    for (const field of importantFields) {
      const completeness = this.calculateFieldCompleteness(personnel, field);
      totalCompleteness += completeness;

      if (completeness < this.completenessThresholds.ALTO.min) {
        gaps.push({
          field,
          completeness,
          missingCount: Math.round((100 - completeness) / 100 * personnel.length),
          impact: 'IMPORTANTE',
          businessValue: this.getFieldBusinessValue(field)
        });
      }
    }

    return {
      gaps,
      averageCompleteness: Math.round(totalCompleteness / importantFields.length),
      fieldsAnalyzed: importantFields.length
    };
  }

  private calculateFieldCompleteness(personnel: any[], fieldName: string): number {
    let completeCount = 0;

    for (const employee of personnel) {
      if (this.isFieldComplete(employee, fieldName)) {
        completeCount++;
      }
    }

    return Math.round((completeCount / personnel.length) * 100);
  }

  private isFieldComplete(employee: any, fieldName: string): boolean {
    const possibleNames = this.getFieldVariations(fieldName);
    
    for (const name of possibleNames) {
      const value = employee[name];
      
      if (value !== null && value !== undefined && value !== '' && 
          value !== 'N/A' && value !== 'NULL' && value !== 'SIN DATO') {
        // Validación adicional para campos específicos
        if (this.requiresSpecialValidation(fieldName)) {
          return this.validateSpecialField(value, fieldName);
        }
        return true;
      }
    }
    
    return false;
  }

  private getFieldVariations(fieldName: string): string[] {
    const variations: Record<string, string[]> = {
      'nombre': ['nombre', 'name', 'full_name', 'nombre_completo'],
      'fechaNacimiento': ['fechaNacimiento', 'fecha_nacimiento', 'birth_date', 'nacimiento'],
      'rfc': ['rfc', 'RFC'],
      'curp': ['curp', 'CURP'],
      'fechaIngreso': ['fechaIngreso', 'fecha_ingreso', 'hire_date', 'ingreso'],
      'puesto': ['puesto', 'position', 'cargo', 'job_title'],
      'salario': ['salario', 'sueldo', 'salary', 'salarioBase'],
      'salarioIntegrado': ['salarioIntegrado', 'sdi', 'salario_integrado'],
      'imss': ['imss', 'IMSS', 'nss', 'NSS'],
      'genero': ['genero', 'gender', 'sexo'],
      'estadoCivil': ['estadoCivil', 'marital_status', 'estado_civil'],
      'escolaridad': ['escolaridad', 'education', 'educacion'],
      'direccion': ['direccion', 'address', 'domicilio'],
      'telefono': ['telefono', 'phone', 'celular'],
      'email': ['email', 'correo', 'mail']
    };

    return variations[fieldName] || [fieldName];
  }

  private requiresSpecialValidation(fieldName: string): boolean {
    return ['rfc', 'curp', 'imss', 'email', 'telefono'].includes(fieldName);
  }

  private validateSpecialField(value: any, fieldName: string): boolean {
    const strValue = String(value).trim();
    
    switch (fieldName) {
      case 'rfc':
        return /^[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/.test(strValue);
      case 'curp':
        return /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(strValue);
      case 'imss':
        return /^\d{10,11}$/.test(strValue.replace(/\D/g, ''));
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strValue);
      case 'telefono':
        return /^\d{10,15}$/.test(strValue.replace(/\D/g, ''));
      default:
        return strValue.length > 0;
    }
  }

  private calculateFieldCoverage(personnel: any[]): any {
    const allPossibleFields = this.getAllPossibleFields();
    const detectedFields = this.getDetectedFields(personnel);
    
    const inventory = {};
    const utilization = {};
    
    for (const field of allPossibleFields) {
      const completeness = this.calculateFieldCompleteness(personnel, field);
      const isDetected = detectedFields.includes(field);
      
      inventory[field] = {
        detected: isDetected,
        completeness,
        category: this.categorizeField(field)
      };
      
      if (isDetected) {
        utilization[field] = completeness;
      }
    }

    return {
      availableFields: detectedFields.length,
      expectedFields: allPossibleFields.length,
      inventory,
      metrics: {
        coverageRate: Math.round((detectedFields.length / allPossibleFields.length) * 100),
        utilizationRate: detectedFields.length > 0 ? 
          Math.round(Object.values(utilization).reduce((sum: number, val) => sum + val, 0) / detectedFields.length) : 0
      },
      missing: allPossibleFields.filter(field => !detectedFields.includes(field)),
      utilization
    };
  }

  private analyzeBusinessImpact(personnel: any[]): any {
    const riskByArea: any = {};
    const limitations: string[] = [];
    
    // Evaluar riesgo por área de negocio
    for (const [area, config] of Object.entries(this.businessImpact)) {
      let areaCompleteness = 0;
      let fieldCount = 0;
      
      for (const field of config.fields) {
        const completeness = this.calculateFieldCompleteness(personnel, field);
        areaCompleteness += completeness;
        fieldCount++;
      }
      
      const avgCompleteness = fieldCount > 0 ? Math.round(areaCompleteness / fieldCount) : 0;
      
      riskByArea[area] = {
        completeness: avgCompleteness,
        impact: config.impact,
        urgency: config.urgency,
        risk: this.calculateRiskLevel(avgCompleteness, config.urgency)
      };
      
      if (avgCompleteness < 80) {
        limitations.push(`${area}: ${config.impact} (${avgCompleteness}% completitud)`);
      }
    }

    return {
      overallRisk: this.calculateOverallBusinessRisk(riskByArea),
      riskByArea,
      limitations,
      compliance: this.assessComplianceStatus(riskByArea),
      mitigation: this.generateMitigationStrategies(riskByArea)
    };
  }

  private calculateDataQualityScore(personnel: any[]): any {
    const dimensions: any = {};
    
    // Completitud
    const completenessReport = this.generateCompletenessReport(personnel);
    dimensions.completeness = {
      score: completenessReport.overallCompleteness,
      weight: this.dataQualityMetrics.completeness.weight
    };
    
    // Consistencia (simplificada)
    dimensions.consistency = {
      score: 85, // Sería calculada con validaciones cruzadas
      weight: this.dataQualityMetrics.consistency.weight
    };
    
    // Validez
    dimensions.validity = {
      score: this.calculateValidityScore(personnel),
      weight: this.dataQualityMetrics.validity.weight
    };
    
    // Actualidad
    dimensions.timeliness = {
      score: this.calculateTimelinessScore(personnel),
      weight: this.dataQualityMetrics.timeliness.weight
    };
    
    // Calcular score ponderado
    const overallScore = Object.values(dimensions).reduce((score: number, dim: any) => 
      score + (dim.score * dim.weight), 0
    );

    return {
      overallScore: Math.round(overallScore),
      dimensions,
      analysis: this.analyzeQualityStrengthsWeaknesses(dimensions),
      benchmark: this.getQualityBenchmark(overallScore),
      improvementPlan: this.generateQualityImprovementPlan(dimensions)
    };
  }

  private auditTerminationData(terminations: any[]): any {
    const requiredFields = ['fechaTerminacion', 'motivoTerminacion', 'finiquito'];
    const completeness: any = {};
    
    for (const field of requiredFields) {
      completeness[field] = this.calculateFieldCompleteness(terminations, field);
    }
    
    return {
      completeness,
      requiredFields,
      missing: Object.entries(completeness)
        .filter(([, comp]) => comp < 90)
        .map(([field]) => field),
      finiquito: this.analyzeFiniquitoCompleteness(terminations)
    };
  }

  private performComprehensiveHealthCheck(data: MappedData): any {
    const activeCount = data.activePersonnel?.length || 0;
    const terminatedCount = data.terminations?.length || 0;
    
    let healthScore = 100;
    const issues: string[] = [];
    
    // Evaluar tamaño del dataset
    if (activeCount < 10) {
      healthScore -= 30;
      issues.push('Dataset muy pequeño para análisis robusto');
    }
    
    // Evaluar balance activos/terminados
    if (terminatedCount > activeCount) {
      healthScore -= 20;
      issues.push('Más empleados terminados que activos');
    }
    
    // Evaluar completitud general
    if (data.activePersonnel) {
      const completenessReport = this.generateCompletenessReport(data.activePersonnel);
      if (completenessReport.overallCompleteness < 70) {
        healthScore -= 25;
        issues.push('Completitud general baja');
      }
    }

    const overallHealth = healthScore > 85 ? 'EXCELENTE' : 
                          healthScore > 70 ? 'BUENO' : 
                          healthScore > 55 ? 'REGULAR' : 'DEFICIENTE';

    return {
      overallHealth,
      metrics: {
        healthScore,
        totalRecords: activeCount + terminatedCount,
        activeEmployees: activeCount,
        terminatedEmployees: terminatedCount
      },
      integrity: issues.length === 0 ? 'ÍNTEGRO' : 'COMPROMETIDO',
      usability: this.assessUsability(healthScore),
      recommendations: this.generateHealthRecommendations(issues, healthScore)
    };
  }

  // Métodos auxiliares
  private getAllPossibleFields(): string[] {
    return [
      // Campos críticos
      ...this.criticalFields.OBLIGATORIOS.personal,
      ...this.criticalFields.OBLIGATORIOS.laboral,
      ...this.criticalFields.OBLIGATORIOS.legal,
      // Campos importantes
      ...this.criticalFields.IMPORTANTES.demograficos,
      ...this.criticalFields.IMPORTANTES.contacto,
      ...this.criticalFields.IMPORTANTES.beneficiarios,
      // Campos adicionales
      ...this.criticalFields.ADICIONALES.prestaciones,
      ...this.criticalFields.ADICIONALES.medicos,
      ...this.criticalFields.ADICIONALES.emergencia
    ];
  }

  private getDetectedFields(personnel: any[]): string[] {
    const detectedFields = new Set<string>();
    
    for (const employee of personnel) {
      Object.keys(employee).forEach(key => detectedFields.add(key));
    }
    
    return Array.from(detectedFields);
  }

  private categorizeField(field: string): string {
    for (const [category, groups] of Object.entries(this.criticalFields)) {
      for (const group of Object.values(groups)) {
        if (group.includes(field)) {
          return category;
        }
      }
    }
    return 'ADICIONAL';
  }

  private getFieldBusinessImpact(field: string): string {
    for (const [area, config] of Object.entries(this.businessImpact)) {
      if (config.fields.includes(field)) {
        return `${area}: ${config.impact}`;
      }
    }
    return 'Impacto menor en operaciones';
  }

  private getFieldBusinessValue(field: string): string {
    const businessValues: Record<string, string> = {
      'genero': 'Análisis demográfico y equidad',
      'escolaridad': 'Planificación de desarrollo',
      'direccion': 'Logística y comunicaciones',
      'telefono': 'Contacto de emergencia',
      'email': 'Comunicaciones corporativas'
    };
    
    return businessValues[field] || 'Valor operacional';
  }

  private getFieldRecommendation(field: string, completeness: number): string {
    const recommendations: Record<string, string> = {
      'rfc': 'Obtener RFC de empleados - obligatorio fiscal',
      'curp': 'Solicitar CURP - identificación oficial',
      'imss': 'Registrar en IMSS - obligación patronal',
      'fechaNacimiento': 'Validar fechas de nacimiento - cálculos actuariales',
      'salario': 'Documentar salarios - cumplimiento laboral'
    };
    
    return recommendations[field] || `Completar ${field} - ${Math.round(100 - completeness)}% faltante`;
  }

  private calculateRiskLevel(completeness: number, urgency: string): string {
    if (completeness < 50) return 'CRÍTICO';
    if (completeness < 70 && urgency === 'CRÍTICA') return 'ALTO';
    if (completeness < 80) return 'MEDIO';
    return 'BAJO';
  }

  private calculateOverallBusinessRisk(riskByArea: any): string {
    const riskScores: Record<string, number> = { 'CRÍTICO': 4, 'ALTO': 3, 'MEDIO': 2, 'BAJO': 1 };
    let totalRisk = 0;
    let areaCount = 0;
    
    for (const area of Object.values(riskByArea)) {
      totalRisk += riskScores[(area as any).risk] || 1;
      areaCount++;
    }
    
    const avgRisk = areaCount > 0 ? totalRisk / areaCount : 1;
    
    if (avgRisk >= 3.5) return 'CRÍTICO';
    if (avgRisk >= 2.5) return 'ALTO';
    if (avgRisk >= 1.5) return 'MEDIO';
    return 'BAJO';
  }

  private assessComplianceStatus(riskByArea: any): string {
    const legalRisk = riskByArea['LEGAL']?.risk || 'BAJO';
    const actuarialRisk = riskByArea['ACTUARIAL']?.risk || 'BAJO';
    
    if (legalRisk === 'CRÍTICO' || actuarialRisk === 'CRÍTICO') {
      return 'NO_CONFORME - Riesgo de incumplimiento';
    }
    
    if (legalRisk === 'ALTO' || actuarialRisk === 'ALTO') {
      return 'CONFORME_LIMITADO - Requiere mejoras';
    }
    
    return 'CONFORME - Cumplimiento adecuado';
  }

  private generateMitigationStrategies(riskByArea: any): string[] {
    const strategies = [];
    
    if (riskByArea['LEGAL']?.risk === 'CRÍTICO') {
      strategies.push('Priorizar completitud de RFC, CURP e IMSS');
    }
    
    if (riskByArea['ACTUARIAL']?.risk === 'ALTO') {
      strategies.push('Validar fechas y salarios para cálculos precisos');
    }
    
    if (riskByArea['OPERACIONAL']?.completeness < 80) {
      strategies.push('Mejorar datos de contacto y puestos');
    }
    
    return strategies.length > 0 ? strategies : ['Mantener nivel actual de completitud'];
  }

  private calculateValidityScore(personnel: any[]): number {
    // Simplificación - en implementación real validaría formatos de todos los campos
    const fieldsToValidate = ['rfc', 'curp', 'imss', 'email'];
    let totalValid = 0;
    let totalFields = 0;
    
    for (const employee of personnel) {
      for (const field of fieldsToValidate) {
        const value = this.getFieldValue(employee, field);
        if (value) {
          totalFields++;
          if (this.validateSpecialField(value, field)) {
            totalValid++;
          }
        }
      }
    }
    
    return totalFields > 0 ? Math.round((totalValid / totalFields) * 100) : 100;
  }

  private calculateTimelinessScore(personnel: any[]): number {
    // Simplificación - evaluaría actualidad de datos basado en fechas de modificación
    return 90; // Asume datos relativamente actuales
  }

  private getFieldValue(employee: any, fieldName: string): any {
    const variations = this.getFieldVariations(fieldName);
    for (const variation of variations) {
      if (employee[variation] !== undefined && employee[variation] !== null) {
        return employee[variation];
      }
    }
    return null;
  }

  private identifyMostAffectedEmployees(personnel: any[]): number[] {
    const employeeCompleteness: { index: number; completeness: number }[] = [];
    
    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const criticalFields = [
        ...this.criticalFields.OBLIGATORIOS.personal,
        ...this.criticalFields.OBLIGATORIOS.laboral,
        ...this.criticalFields.OBLIGATORIOS.legal
      ];
      
      let completeFields = 0;
      for (const field of criticalFields) {
        if (this.isFieldComplete(employee, field)) {
          completeFields++;
        }
      }
      
      const completeness = Math.round((completeFields / criticalFields.length) * 100);
      employeeCompleteness.push({ index: i + 2, completeness });
    }
    
    return employeeCompleteness
      .filter(emp => emp.completeness < 80)
      .sort((a, b) => a.completeness - b.completeness)
      .map(emp => emp.index);
  }

  private generateCompletenessRecommendations(report: any): string[] {
    const recommendations = [];
    
    if (report.overallCompleteness < 80) {
      recommendations.push('Implementar proceso de recolección de datos faltantes');
    }
    
    if (report.criticalGaps.length > 0) {
      recommendations.push('Priorizar completitud de campos críticos para cumplimiento');
    }
    
    if (report.ratesByCriticality.important < 70) {
      recommendations.push('Mejorar calidad de datos demográficos y de contacto');
    }
    
    return recommendations;
  }

  private generateImprovementPlan(report: any): string[] {
    const plan = [];
    
    plan.push('Fase 1: Completar campos críticos obligatorios (RFC, CURP, IMSS)');
    plan.push('Fase 2: Validar y corregir fechas de nacimiento e ingreso');
    plan.push('Fase 3: Recopilar datos demográficos y de contacto faltantes');
    plan.push('Fase 4: Implementar controles de calidad para nuevos registros');
    
    return plan;
  }

  private getCompletenessGrade(completeness: number): string {
    if (completeness >= 95) return 'A+';
    if (completeness >= 90) return 'A';
    if (completeness >= 85) return 'B+';
    if (completeness >= 80) return 'B';
    if (completeness >= 75) return 'C+';
    if (completeness >= 70) return 'C';
    if (completeness >= 65) return 'D+';
    if (completeness >= 60) return 'D';
    return 'F';
  }

  private calculateQualityScoreFromCompleteness(report: any): number {
    let score = report.overallCompleteness;
    
    // Penalizar campos críticos faltantes
    if (report.ratesByCriticality.critical < 95) {
      score -= (95 - report.ratesByCriticality.critical) * 0.5;
    }
    
    // Bonificar alta completitud en campos importantes
    if (report.ratesByCriticality.important > 90) {
      score += 5;
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private analyzeQualityStrengthsWeaknesses(dimensions: any): any {
    const strengths = [];
    const weaknesses = [];
    
    for (const [dim, data] of Object.entries(dimensions)) {
      const score = (data as any).score;
      if (score >= 90) {
        strengths.push(`Excelente ${dim} (${score}%)`);
      } else if (score < 70) {
        weaknesses.push(`${dim} necesita mejora (${score}%)`);
      }
    }
    
    return { strengths, weaknesses };
  }

  private getQualityBenchmark(score: number): string {
    if (score >= 90) return 'EXCELENTE - Por encima de estándares industriales';
    if (score >= 80) return 'BUENO - Cumple estándares industriales';
    if (score >= 70) return 'ACEPTABLE - Cerca de estándares industriales';
    return 'NECESITA_MEJORA - Por debajo de estándares industriales';
  }

  private generateQualityImprovementPlan(dimensions: any): string[] {
    const plan = [];
    
    for (const [dim, data] of Object.entries(dimensions)) {
      const score = (data as any).score;
      if (score < 80) {
        plan.push(`Mejorar ${dim}: implementar controles y validaciones adicionales`);
      }
    }
    
    if (plan.length === 0) {
      plan.push('Mantener niveles actuales de calidad de datos');
    }
    
    return plan;
  }

  private analyzeFiniquitoCompleteness(terminations: any[]): any {
    return {
      finiquitoFieldsPresent: 'Requiere análisis específico de campos de finiquito',
      calculationsComplete: 'Validar cálculos de finiquito por separado'
    };
  }

  private assessUsability(healthScore: number): string {
    if (healthScore > 85) return 'ALTA - Dataset listo para análisis avanzados';
    if (healthScore > 70) return 'MEDIA - Útil para análisis básicos';
    if (healthScore > 55) return 'BAJA - Requiere limpieza antes de análisis';
    return 'CRÍTICA - No recomendado para análisis sin mejoras significativas';
  }

  private generateHealthRecommendations(issues: string[], healthScore: number): string[] {
    const recommendations = [];
    
    if (healthScore < 70) {
      recommendations.push('Realizar auditoría completa de calidad de datos');
    }
    
    if (issues.includes('Dataset muy pequeño')) {
      recommendations.push('Considerar agregación de datos adicionales');
    }
    
    if (issues.includes('Completitud general baja')) {
      recommendations.push('Implementar proceso sistemático de completitud');
    }
    
    return recommendations.length > 0 ? recommendations : ['Mantener prácticas actuales de gestión de datos'];
  }
}