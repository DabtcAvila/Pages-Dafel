import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class TerminacionAnalystAgent extends BaseValidationAgent {
  private readonly terminationTypes = {
    'VOLUNTARIA': {
      codes: ['RENUNCIA', 'RENUNCIA_VOLUNTARIA', 'RETIRO_VOLUNTARIO'],
      legalRequirements: ['Carta de renuncia', 'Finiquito'],
      noticePeriod: 0,
      severance: false,
      description: 'Terminación por decisión del empleado'
    },
    'INVOLUNTARIA': {
      codes: ['DESPIDO', 'TERMINACION_SIN_CAUSA', 'DESPIDO_PROCEDENTE'],
      legalRequirements: ['Notificación', 'Indemnización', 'Finiquito'],
      noticePeriod: 30,
      severance: true,
      description: 'Terminación por decisión del empleador'
    },
    'JUBILACION': {
      codes: ['JUBILACION', 'PENSION', 'RETIRO_EDAD'],
      legalRequirements: ['Trámite IMSS', 'Finiquito'],
      noticePeriod: 0,
      severance: false,
      description: 'Retiro por edad o años de servicio'
    },
    'DEFUNCION': {
      codes: ['DEFUNCION', 'FALLECIMIENTO', 'MUERTE'],
      legalRequirements: ['Acta defunción', 'Beneficiarios'],
      noticePeriod: 0,
      severance: true,
      description: 'Terminación por fallecimiento'
    },
    'INVALIDEZ': {
      codes: ['INVALIDEZ', 'INCAPACIDAD_PERMANENTE', 'DISCAPACIDAD'],
      legalRequirements: ['Dictamen médico', 'Trámite IMSS'],
      noticePeriod: 0,
      severance: true,
      description: 'Terminación por invalidez'
    }
  };

  private readonly finiquitoComponents = {
    OBLIGATORIOS: {
      'salarios_pendientes': 'Salarios devengados no pagados',
      'vacaciones_proporcionales': 'Vacaciones proporcionales al tiempo trabajado',
      'aguinaldo_proporcional': 'Aguinaldo proporcional al año',
      'prima_vacacional': 'Prima vacacional correspondiente'
    },
    CONDICIONALES: {
      'indemnizacion_constitucional': 'Indemnización por despido injustificado',
      'prima_antiguedad': 'Prima de antigüedad (más de 15 años)',
      'pension_imss': 'Pensión IMSS si aplica',
      'seguro_vida': 'Seguro de vida si está contratado'
    },
    ADICIONALES: {
      'bonos_pendientes': 'Bonos o comisiones pendientes',
      'reembolsos': 'Gastos por reembolsar',
      'prestamos_descuento': 'Préstamos pendientes de descuento'
    }
  };

  private readonly legalCalculations = {
    indemnizacion: {
      formula: '3 meses + 20 días por año trabajado',
      tope: 'Sin tope legal',
      base: 'Salario diario integrado'
    },
    primaAntiguedad: {
      formula: '12 días por año trabajado',
      tope: '2 salarios mínimos por día',
      requisito: '15 años o más de servicios'
    },
    vacaciones: {
      formula: 'Proporcional al tiempo trabajado en el año',
      minimo: '6 días primer año, incremento anual',
      base: 'Salario diario'
    },
    aguinaldo: {
      formula: '15 días mínimo, proporcional',
      proporcion: 'Días trabajados en el año / 365',
      base: 'Salario diario'
    }
  };

  constructor() {
    super({
      name: 'Analista Especialista en Terminaciones',
      description: 'Análisis integral de terminaciones con validación legal, cálculos actuariales y patrones de rotación',
      priority: 14,
      dependencies: ['FechaIngresoAgent', 'SalarioIntegradoAgent', 'ValidadorLeyFederalAgent'],
      timeout: 30000
    });
  }

  async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      if (data.terminations && data.terminations.length > 0) {
        const terminationValidation = await this.validateTerminations(data.terminations);
        results.push(...terminationValidation);

        const finiquitoValidation = await this.validateFiniquitoCalculations(data.terminations);
        results.push(...finiquitoValidation);

        const legalComplianceCheck = await this.validateLegalCompliance(data.terminations);
        results.push(...legalComplianceCheck);

        const turnoverAnalysis = await this.analyzeTurnoverPatterns(data.terminations, data.activePersonnel);
        results.push(...turnoverAnalysis);
      } else {
        results.push(this.createSuccessResult(
          'Análisis de Terminaciones',
          'No hay datos de terminaciones para analizar',
          { 
            dataAvailability: 'Sin terminaciones en el dataset',
            recommendation: 'Incluir datos históricos de terminaciones para análisis completo'
          }
        ));
      }

      if (data.activePersonnel && data.activePersonnel.length > 0) {
        const retentionRisk = await this.assessRetentionRisk(data.activePersonnel);
        results.push(...retentionRisk);
      }

      const terminationHealthCheck = await this.performTerminationHealthCheck(data);
      results.push(...terminationHealthCheck);

    } catch (error) {
      results.push(this.createErrorResult(
        'Análisis de Terminaciones',
        `Error en análisis de terminaciones: ${error.message}`,
        'Revisar estructura de datos de terminaciones'
      ));
    }

    return results;
  }

  private async validateTerminations(terminations: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const validationIssues: string[] = [];
    const warnings: string[] = [];
    const affectedRows: number[] = [];

    let validTerminations = 0;
    let missingDates = 0;
    let invalidDates = 0;
    let missingReasons = 0;
    let inconsistentData = 0;

    for (let i = 0; i < terminations.length; i++) {
      const termination = terminations[i];
      const row = i + 2;

      // Validar fecha de terminación
      const terminationDate = this.extractTerminationDate(termination);
      if (!terminationDate) {
        validationIssues.push(`Fila ${row}: Fecha de terminación faltante`);
        affectedRows.push(row);
        missingDates++;
        continue;
      }

      // Validar que fecha de terminación sea válida
      if (terminationDate > new Date()) {
        validationIssues.push(`Fila ${row}: Fecha de terminación futura (${terminationDate.toLocaleDateString()})`);
        affectedRows.push(row);
        invalidDates++;
        continue;
      }

      // Validar motivo de terminación
      const reason = this.extractTerminationReason(termination);
      if (!reason) {
        warnings.push(`Fila ${row}: Motivo de terminación no especificado`);
        missingReasons++;
      }

      // Validar consistencia temporal
      const hireDate = this.extractHireDate(termination);
      if (hireDate && terminationDate) {
        if (hireDate >= terminationDate) {
          validationIssues.push(`Fila ${row}: Fecha de ingreso posterior a terminación`);
          affectedRows.push(row);
          inconsistentData++;
          continue;
        }

        // Validar período de servicio mínimo
        const serviceDays = (terminationDate.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24);
        if (serviceDays < 1) {
          warnings.push(`Fila ${row}: Período de servicio muy corto (${Math.round(serviceDays)} días)`);
        }
      }

      validTerminations++;

      // Validaciones adicionales específicas por tipo
      const typeValidation = this.validateTerminationType(termination, row);
      if (typeValidation.length > 0) {
        warnings.push(...typeValidation);
      }
    }

    // Reportar errores críticos
    if (validationIssues.length > 0) {
      results.push(this.createErrorResult(
        'Errores en Datos de Terminación',
        `${validationIssues.length} terminaciones con errores críticos`,
        'Corregir fechas y datos básicos de terminaciones',
        affectedRows,
        {
          criticalErrors: validationIssues.slice(0, 15),
          errorBreakdown: {
            missingDates,
            invalidDates,
            inconsistentData
          },
          totalCritical: validationIssues.length
        }
      ));
    }

    // Reportar advertencias
    if (warnings.length > 0) {
      results.push(this.createWarningResult(
        'Alertas en Terminaciones',
        `${warnings.length} alertas en datos de terminación`,
        'Revisar completitud y consistencia de datos',
        [],
        {
          warnings: warnings.slice(0, 12),
          missingReasons,
          totalWarnings: warnings.length
        }
      ));
    }

    // Reporte exitoso
    if (validTerminations > 0) {
      const validationRate = Math.round((validTerminations / terminations.length) * 100);
      
      results.push(this.createSuccessResult(
        'Validación de Terminaciones',
        `${validTerminations} terminaciones validadas correctamente (${validationRate}%)`,
        {
          validTerminations,
          validationRate,
          terminationAnalysis: this.analyzeTerminationData(terminations),
          dataQualityMetrics: this.calculateTerminationDataQuality(terminations, validationIssues.length)
        }
      ));
    }

    return results;
  }

  private async validateFiniquitoCalculations(terminations: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const calculationIssues: string[] = [];
    const affectedRows: number[] = [];

    let validCalculations = 0;
    let missingFiniquitos = 0;
    let incorrectCalculations = 0;

    for (let i = 0; i < terminations.length; i++) {
      const termination = terminations[i];
      const row = i + 2;

      const finiquitoData = this.extractFiniquitoData(termination);
      
      if (!finiquitoData.hasFiniquito) {
        calculationIssues.push(`Fila ${row}: Finiquito no documentado`);
        affectedRows.push(row);
        missingFiniquitos++;
        continue;
      }

      // Validar componentes obligatorios del finiquito
      const componentValidation = this.validateFiniquitoComponents(termination, row);
      if (componentValidation.length > 0) {
        calculationIssues.push(...componentValidation);
        affectedRows.push(row);
        incorrectCalculations++;
      }

      // Validar cálculos específicos
      const calculationValidation = this.validateSpecificCalculations(termination, row);
      if (calculationValidation.length > 0) {
        calculationIssues.push(...calculationValidation);
        affectedRows.push(row);
        incorrectCalculations++;
      }

      if (componentValidation.length === 0 && calculationValidation.length === 0) {
        validCalculations++;
      }
    }

    if (calculationIssues.length > 0) {
      results.push(this.createWarningResult(
        'Problemas en Cálculos de Finiquito',
        `${calculationIssues.length} problemas en cálculos de finiquito detectados`,
        'Revisar y recalcular finiquitos con problemas',
        affectedRows,
        {
          calculationIssues: calculationIssues.slice(0, 15),
          issueBreakdown: {
            missingFiniquitos,
            incorrectCalculations
          },
          legalRequirements: this.finiquitoComponents.OBLIGATORIOS,
          calculationFormulas: this.legalCalculations
        }
      ));
    } else {
      results.push(this.createSuccessResult(
        'Validación de Finiquitos',
        `${validCalculations} finiquitos validados correctamente`,
        {
          validCalculations,
          finiquitoCompleteness: Math.round((validCalculations / terminations.length) * 100),
          legalCompliance: 'Cálculos aparentan cumplir con LFT'
        }
      ));
    }

    return results;
  }

  private async validateLegalCompliance(terminations: any[]): Promise<ValidationResult[]> {
    const complianceAnalysis = this.analyzeLegalCompliance(terminations);
    
    return [
      this.createSuccessResult(
        'Cumplimiento Legal en Terminaciones',
        `Cumplimiento general: ${complianceAnalysis.overallCompliance}`,
        {
          complianceByType: complianceAnalysis.byType,
          legalRequirements: complianceAnalysis.requirements,
          riskAreas: complianceAnalysis.riskAreas,
          recommendations: complianceAnalysis.recommendations
        }
      )
    ];
  }

  private async analyzeTurnoverPatterns(terminations: any[], activePersonnel?: any[]): Promise<ValidationResult[]> {
    const turnoverAnalysis = this.performTurnoverAnalysis(terminations, activePersonnel);
    
    return [
      this.createSuccessResult(
        'Análisis de Patrones de Rotación',
        `Tasa de rotación: ${turnoverAnalysis.turnoverRate}%`,
        {
          turnoverMetrics: turnoverAnalysis.metrics,
          seasonalPatterns: turnoverAnalysis.seasonality,
          departmentalAnalysis: turnoverAnalysis.byDepartment,
          retentionInsights: turnoverAnalysis.insights,
          benchmarkComparison: turnoverAnalysis.benchmark
        }
      )
    ];
  }

  private async assessRetentionRisk(activePersonnel: any[]): Promise<ValidationResult[]> {
    const riskAssessment = this.calculateRetentionRisk(activePersonnel);
    
    return [
      this.createSuccessResult(
        'Evaluación de Riesgo de Retención',
        `Riesgo general de rotación: ${riskAssessment.overallRisk}`,
        {
          riskFactors: riskAssessment.factors,
          highRiskEmployees: riskAssessment.highRisk,
          retentionStrategies: riskAssessment.strategies,
          predictiveInsights: riskAssessment.predictions
        }
      )
    ];
  }

  private async performTerminationHealthCheck(data: MappedData): Promise<ValidationResult[]> {
    const healthCheck = this.calculateTerminationHealth(data);
    
    return [
      this.createSuccessResult(
        'Estado de Salud de Terminaciones',
        `Salud de datos de terminación: ${healthCheck.overallHealth}`,
        {
          healthMetrics: healthCheck.metrics,
          dataCompleteness: healthCheck.completeness,
          processEfficiency: healthCheck.efficiency,
          improvementOpportunities: healthCheck.improvements
        }
      )
    ];
  }

  // Métodos de validación especializados
  private validateTerminationType(termination: any, row: number): string[] {
    const issues: string[] = [];
    const reason = this.extractTerminationReason(termination);
    
    if (!reason) return issues;

    const terminationType = this.classifyTerminationType(reason);
    const typeConfig = this.terminationTypes[terminationType];

    if (!typeConfig) {
      issues.push(`Fila ${row}: Tipo de terminación no reconocido: "${reason}"`);
      return issues;
    }

    // Validaciones específicas por tipo
    switch (terminationType) {
      case 'JUBILACION':
        const age = this.calculateEmployeeAge(termination);
        if (age && age < 60) {
          issues.push(`Fila ${row}: Jubilación a edad temprana (${age} años) - Verificar elegibilidad`);
        }
        break;

      case 'INVOLUNTARIA':
        const indemnization = this.extractIndemnization(termination);
        if (!indemnization) {
          issues.push(`Fila ${row}: Terminación involuntaria sin indemnización documentada`);
        }
        break;

      case 'DEFUNCION':
        const beneficiaries = this.extractBeneficiaries(termination);
        if (!beneficiaries) {
          issues.push(`Fila ${row}: Defunción sin beneficiarios documentados`);
        }
        break;
    }

    return issues;
  }

  private validateFiniquitoComponents(termination: any, row: number): string[] {
    const issues: string[] = [];
    
    // Verificar componentes obligatorios
    for (const [component, description] of Object.entries(this.finiquitoComponents.OBLIGATORIOS)) {
      const value = this.extractFiniquitoComponent(termination, component);
      if (value === null) {
        issues.push(`Fila ${row}: Falta ${description} en finiquito`);
      }
    }

    return issues;
  }

  private validateSpecificCalculations(termination: any, row: number): string[] {
    const issues: string[] = [];
    
    const hireDate = this.extractHireDate(termination);
    const terminationDate = this.extractTerminationDate(termination);
    const salary = this.extractSalary(termination);

    if (!hireDate || !terminationDate || !salary) {
      issues.push(`Fila ${row}: Datos insuficientes para validar cálculos`);
      return issues;
    }

    const serviceYears = this.calculateServiceYears(termination);
    if (serviceYears === null) return issues;

    // Validar aguinaldo proporcional
    const aguinaldo = this.extractFiniquitoComponent(termination, 'aguinaldo_proporcional');
    if (aguinaldo !== null) {
      const expectedAguinaldo = this.calculateAguinaldoProporcional(salary, terminationDate);
      const difference = Math.abs(aguinaldo - expectedAguinaldo);
      
      if (difference > expectedAguinaldo * 0.1) { // 10% tolerancia
        issues.push(`Fila ${row}: Aguinaldo proporcional incorrecto ($${aguinaldo} vs $${expectedAguinaldo.toFixed(2)} esperado)`);
      }
    }

    // Validar vacaciones proporcionales
    const vacaciones = this.extractFiniquitoComponent(termination, 'vacaciones_proporcionales');
    if (vacaciones !== null) {
      const expectedVacaciones = this.calculateVacacionesProporcionales(salary, serviceYears, terminationDate);
      const difference = Math.abs(vacaciones - expectedVacaciones);
      
      if (difference > expectedVacaciones * 0.1) { // 10% tolerancia
        issues.push(`Fila ${row}: Vacaciones proporcionales incorrectas ($${vacaciones} vs $${expectedVacaciones.toFixed(2)} esperado)`);
      }
    }

    return issues;
  }

  private analyzeTerminationData(terminations: any[]): any {
    const reasons: Record<string, number> = {};
    const monthlyTerminations: Record<string, number> = {};
    let totalServiceYears = 0;
    let validServiceCount = 0;

    for (const termination of terminations) {
      // Analizar motivos
      const reason = this.extractTerminationReason(termination);
      if (reason) {
        const type = this.classifyTerminationType(reason);
        reasons[type] = (reasons[type] || 0) + 1;
      }

      // Analizar patrones temporales
      const terminationDate = this.extractTerminationDate(termination);
      if (terminationDate) {
        const monthKey = `${terminationDate.getFullYear()}-${terminationDate.getMonth() + 1}`;
        monthlyTerminations[monthKey] = (monthlyTerminations[monthKey] || 0) + 1;
      }

      // Analizar antigüedad al terminar
      const serviceYears = this.calculateServiceYears(termination);
      if (serviceYears !== null && serviceYears >= 0) {
        totalServiceYears += serviceYears;
        validServiceCount++;
      }
    }

    const averageServiceAtTermination = validServiceCount > 0 ? 
      Math.round(totalServiceYears / validServiceCount * 10) / 10 : 0;

    return {
      terminationsByType: reasons,
      monthlyPattern: monthlyTerminations,
      averageServiceAtTermination,
      totalTerminations: terminations.length,
      mostCommonReason: Object.entries(reasons).sort(([,a], [,b]) => b - a)[0]
    };
  }

  private calculateTerminationDataQuality(terminations: any[], errors: number): any {
    const dataQualityScore = Math.max(0, 100 - (errors / terminations.length * 100));
    
    return {
      qualityScore: Math.round(dataQualityScore),
      qualityGrade: this.getQualityGrade(dataQualityScore),
      completenessRate: Math.round(((terminations.length - errors) / terminations.length) * 100),
      recommendation: dataQualityScore > 90 ? 'Excelente calidad' : 
                      dataQualityScore > 75 ? 'Buena calidad' : 'Requiere mejoras'
    };
  }

  private analyzeLegalCompliance(terminations: any[]): any {
    const complianceByType: Record<string, any> = {};
    const riskAreas: string[] = [];
    
    for (const termination of terminations) {
      const reason = this.extractTerminationReason(termination);
      if (!reason) continue;
      
      const type = this.classifyTerminationType(reason);
      const typeConfig = this.terminationTypes[type];
      
      if (!complianceByType[type]) {
        complianceByType[type] = {
          count: 0,
          compliant: 0,
          requirements: typeConfig?.legalRequirements || []
        };
      }
      
      complianceByType[type].count++;
      
      // Evaluar cumplimiento básico (simplificado)
      const hasFiniquito = this.extractFiniquitoData(termination).hasFiniquito;
      if (hasFiniquito) {
        complianceByType[type].compliant++;
      }
    }
    
    // Identificar áreas de riesgo
    for (const [type, data] of Object.entries(complianceByType)) {
      const complianceRate = data.compliant / data.count;
      if (complianceRate < 0.9) {
        riskAreas.push(`${type}: ${Math.round(complianceRate * 100)}% cumplimiento`);
      }
    }

    const overallCompliant = Object.values(complianceByType).reduce((sum: number, data: any) => sum + data.compliant, 0);
    const overallTotal = Object.values(complianceByType).reduce((sum: number, data: any) => sum + data.count, 0);
    const overallCompliance = overallTotal > 0 ? Math.round((overallCompliant / overallTotal) * 100) + '%' : 'N/A';

    return {
      overallCompliance,
      byType: complianceByType,
      requirements: this.legalCalculations,
      riskAreas,
      recommendations: this.generateLegalRecommendations(riskAreas)
    };
  }

  private performTurnoverAnalysis(terminations: any[], activePersonnel?: any[]): any {
    const activeCount = activePersonnel?.length || 0;
    const terminationCount = terminations.length;
    
    // Calcular tasa de rotación (simplificada)
    const turnoverRate = activeCount > 0 ? 
      Math.round((terminationCount / (activeCount + terminationCount)) * 100) : 0;

    // Análisis de estacionalidad
    const monthlyTerminations: Record<string, number> = {};
    for (const termination of terminations) {
      const date = this.extractTerminationDate(termination);
      if (date) {
        const month = date.toLocaleDateString('es-ES', { month: 'long' });
        monthlyTerminations[month] = (monthlyTerminations[month] || 0) + 1;
      }
    }

    return {
      turnoverRate,
      metrics: {
        totalTerminations: terminationCount,
        activeEmployees: activeCount,
        annualizedRate: turnoverRate * 12 // Simplificado
      },
      seasonality: {
        monthlyPattern: monthlyTerminations,
        peakMonth: Object.entries(monthlyTerminations).sort(([,a], [,b]) => b - a)[0]
      },
      byDepartment: 'Requiere datos de departamento para análisis detallado',
      insights: this.generateTurnoverInsights(turnoverRate, terminationCount),
      benchmark: this.getTurnoverBenchmark(turnoverRate)
    };
  }

  private calculateRetentionRisk(activePersonnel: any[]): any {
    let highRiskCount = 0;
    const riskFactors: string[] = [];
    
    for (const employee of activePersonnel) {
      const serviceYears = this.calculateServiceYears(employee);
      const age = this.calculateEmployeeAge(employee);
      
      // Factores de riesgo simplificados
      if (serviceYears !== null && serviceYears < 2) {
        // Empleados nuevos tienen mayor riesgo de rotación
      }
      
      if (age && age > 60) {
        highRiskCount++; // Riesgo de jubilación
      }
    }

    if (highRiskCount > activePersonnel.length * 0.2) {
      riskFactors.push('Alta concentración de empleados cerca del retiro');
    }

    const overallRisk = highRiskCount > activePersonnel.length * 0.3 ? 'ALTO' :
                        highRiskCount > activePersonnel.length * 0.15 ? 'MEDIO' : 'BAJO';

    return {
      overallRisk,
      factors: riskFactors,
      highRisk: {
        count: highRiskCount,
        percentage: Math.round((highRiskCount / activePersonnel.length) * 100)
      },
      strategies: this.generateRetentionStrategies(riskFactors),
      predictions: 'Análisis predictivo requiere datos históricos adicionales'
    };
  }

  private calculateTerminationHealth(data: MappedData): any {
    const terminationCount = data.terminations?.length || 0;
    const activeCount = data.activePersonnel?.length || 0;
    
    let healthScore = 100;
    const issues: string[] = [];

    // Evaluar proporción de terminaciones
    if (terminationCount === 0 && activeCount > 50) {
      healthScore -= 20;
      issues.push('Sin datos de terminaciones para análisis');
    }

    // Evaluar completitud de datos
    if (data.terminations) {
      const dataCompleteness = this.assessTerminationDataCompleteness(data.terminations);
      if (dataCompleteness < 80) {
        healthScore -= 15;
        issues.push('Completitud de datos de terminación baja');
      }
    }

    const overallHealth = healthScore > 90 ? 'EXCELENTE' :
                          healthScore > 75 ? 'BUENO' :
                          healthScore > 60 ? 'REGULAR' : 'DEFICIENTE';

    return {
      overallHealth,
      metrics: {
        healthScore,
        terminationRecords: terminationCount,
        activeEmployees: activeCount
      },
      completeness: terminationCount > 0 ? this.assessTerminationDataCompleteness(data.terminations!) : 'N/A',
      efficiency: this.assessProcessEfficiency(data.terminations || []),
      improvements: this.generateImprovementRecommendations(issues, healthScore)
    };
  }

  // Métodos auxiliares
  private extractTerminationDate(termination: any): Date | null {
    const possibleFields = ['fechaTerminacion', 'fecha_terminacion', 'termination_date', 'fecha_baja', 'baja'];
    for (const field of possibleFields) {
      if (termination[field]) {
        const date = this.parseDate(termination[field]);
        if (date) return date;
      }
    }
    return null;
  }

  private extractTerminationReason(termination: any): string | null {
    const possibleFields = ['motivoTerminacion', 'motivo_terminacion', 'reason', 'causa', 'tipo_baja'];
    for (const field of possibleFields) {
      if (termination[field] && typeof termination[field] === 'string') {
        return termination[field].trim();
      }
    }
    return null;
  }

  private extractFiniquitoData(termination: any): any {
    const finiquitoFields = ['finiquito', 'finiquito_total', 'settlement'];
    const hasFiniquito = finiquitoFields.some(field => 
      termination[field] !== null && termination[field] !== undefined
    );

    return {
      hasFiniquito,
      total: this.extractFiniquitoComponent(termination, 'finiquito') || 0
    };
  }

  private extractFiniquitoComponent(termination: any, component: string): number | null {
    const fieldMappings: Record<string, string[]> = {
      'salarios_pendientes': ['salarios_pendientes', 'pending_salary'],
      'vacaciones_proporcionales': ['vacaciones_proporcionales', 'proportional_vacation'],
      'aguinaldo_proporcional': ['aguinaldo_proporcional', 'proportional_bonus'],
      'prima_vacacional': ['prima_vacacional', 'vacation_premium'],
      'indemnizacion_constitucional': ['indemnizacion', 'severance'],
      'finiquito': ['finiquito', 'finiquito_total', 'total_settlement']
    };

    const possibleFields = fieldMappings[component] || [component];
    
    for (const field of possibleFields) {
      if (termination[field] !== null && termination[field] !== undefined) {
        const value = this.parseNumeric(termination[field]);
        if (value !== null) return value;
      }
    }
    
    return null;
  }

  private extractIndemnization(termination: any): number | null {
    return this.extractFiniquitoComponent(termination, 'indemnizacion_constitucional');
  }

  private extractBeneficiaries(termination: any): string | null {
    const possibleFields = ['beneficiarios', 'beneficiaries', 'herederos'];
    for (const field of possibleFields) {
      if (termination[field] && typeof termination[field] === 'string') {
        return termination[field].trim();
      }
    }
    return null;
  }

  private extractSalary(termination: any): number | null {
    const possibleFields = ['salario', 'sueldo', 'salary', 'salarioBase', 'sdi'];
    for (const field of possibleFields) {
      if (termination[field]) {
        const value = this.parseNumeric(termination[field]);
        if (value && value > 0) return value;
      }
    }
    return null;
  }

  private extractHireDate(termination: any): Date | null {
    const possibleFields = ['fechaIngreso', 'fecha_ingreso', 'hire_date', 'ingreso'];
    for (const field of possibleFields) {
      if (termination[field]) {
        const date = this.parseDate(termination[field]);
        if (date) return date;
      }
    }
    return null;
  }

  private classifyTerminationType(reason: string): string {
    const upperReason = reason.toUpperCase();
    
    for (const [type, config] of Object.entries(this.terminationTypes)) {
      if (config.codes.some(code => upperReason.includes(code))) {
        return type;
      }
    }
    
    return 'OTROS';
  }

  private calculateEmployeeAge(termination: any): number | null {
    const birthDate = this.extractBirthDate(termination);
    const terminationDate = this.extractTerminationDate(termination);
    
    if (!birthDate || !terminationDate) return null;
    
    return this.calculateAgeAtDate(birthDate, terminationDate);
  }

  private extractBirthDate(termination: any): Date | null {
    const possibleFields = ['fechaNacimiento', 'fecha_nacimiento', 'birth_date', 'nacimiento'];
    for (const field of possibleFields) {
      if (termination[field]) {
        const date = this.parseDate(termination[field]);
        if (date) return date;
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

  private calculateAguinaldoProporcional(salary: number, terminationDate: Date): number {
    const year = terminationDate.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const daysWorked = Math.floor((terminationDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return (15 * salary * daysWorked) / 365;
  }

  private calculateVacacionesProporcionales(salary: number, serviceYears: number, terminationDate: Date): number {
    // Días de vacaciones según antiguedad (LFT)
    let vacationDays = 6; // Primer año
    if (serviceYears >= 2) vacationDays = 8;
    if (serviceYears >= 3) vacationDays = 10;
    if (serviceYears >= 4) vacationDays = 12;
    if (serviceYears >= 5) vacationDays = 14;
    
    // Proporcional al año actual
    const year = terminationDate.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const daysWorked = Math.floor((terminationDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return (vacationDays * salary * daysWorked) / 365;
  }

  private getQualityGrade(score: number): string {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    return 'F';
  }

  private generateLegalRecommendations(riskAreas: string[]): string[] {
    const recommendations = [];
    
    if (riskAreas.length > 0) {
      recommendations.push('Revisar procesos de terminación con bajo cumplimiento');
      recommendations.push('Capacitar a personal de RH en cálculos de finiquito');
      recommendations.push('Implementar checklist de cumplimiento legal');
    } else {
      recommendations.push('Mantener estándares actuales de cumplimiento');
    }
    
    return recommendations;
  }

  private generateTurnoverInsights(turnoverRate: number, terminationCount: number): string[] {
    const insights = [];
    
    if (turnoverRate > 20) {
      insights.push('Tasa de rotación alta - Revisar cultura organizacional');
    } else if (turnoverRate > 10) {
      insights.push('Tasa de rotación moderada - Monitorear tendencias');
    } else {
      insights.push('Tasa de rotación baja - Retención efectiva');
    }
    
    if (terminationCount > 50) {
      insights.push('Volumen alto de terminaciones - Analizar causas principales');
    }
    
    return insights;
  }

  private getTurnoverBenchmark(turnoverRate: number): string {
    if (turnoverRate > 25) return 'Por encima del promedio industrial (15-20%)';
    if (turnoverRate > 20) return 'Ligeramente por encima del promedio';
    if (turnoverRate > 10) return 'Dentro del rango normal';
    return 'Por debajo del promedio - Excelente retención';
  }

  private generateRetentionStrategies(riskFactors: string[]): string[] {
    const strategies = [];
    
    if (riskFactors.some(factor => factor.includes('retiro'))) {
      strategies.push('Implementar programas de mentoring y transferencia de conocimiento');
    }
    
    strategies.push('Desarrollar planes de carrera y crecimiento profesional');
    strategies.push('Revisar estructura de compensaciones y beneficios');
    strategies.push('Implementar programas de reconocimiento y engagement');
    
    return strategies;
  }

  private assessTerminationDataCompleteness(terminations: any[]): number {
    if (terminations.length === 0) return 0;
    
    const requiredFields = ['fechaTerminacion', 'motivoTerminacion', 'finiquito'];
    let completeRecords = 0;
    
    for (const termination of terminations) {
      const hasAllFields = requiredFields.every(field => {
        const value = termination[field] || termination[field.toLowerCase()] || termination[field.toUpperCase()];
        return value !== null && value !== undefined && value !== '';
      });
      
      if (hasAllFields) {
        completeRecords++;
      }
    }
    
    return Math.round((completeRecords / terminations.length) * 100);
  }

  private assessProcessEfficiency(terminations: any[]): string {
    // Análisis simplificado de eficiencia del proceso
    const withFiniquito = terminations.filter(t => this.extractFiniquitoData(t).hasFiniquito).length;
    const efficiency = terminations.length > 0 ? (withFiniquito / terminations.length) * 100 : 0;
    
    if (efficiency >= 90) return 'ALTA - Procesos bien documentados';
    if (efficiency >= 75) return 'MEDIA - Mayoría de casos completos';
    return 'BAJA - Muchos casos incompletos';
  }

  private generateImprovementRecommendations(issues: string[], healthScore: number): string[] {
    const recommendations = [];
    
    if (healthScore < 75) {
      recommendations.push('Implementar checklist de terminación');
      recommendations.push('Capacitar personal en procesos de terminación');
    }
    
    if (issues.some(issue => issue.includes('completitud'))) {
      recommendations.push('Mejorar captura de datos en terminaciones');
    }
    
    recommendations.push('Realizar auditorías regulares de finiquitos');
    recommendations.push('Automatizar cálculos de finiquito donde sea posible');
    
    return recommendations;
  }
}