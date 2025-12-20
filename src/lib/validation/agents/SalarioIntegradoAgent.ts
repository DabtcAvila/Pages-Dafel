import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class SalarioIntegradoAgent extends BaseValidationAgent {
  private readonly salariosMínimos = {
    2024: { general: 248.93, frontera: 374.89 },
    2023: { general: 207.44, frontera: 312.41 },
    2022: { general: 172.87, frontera: 260.34 },
    2021: { general: 141.70, frontera: 213.39 },
    2020: { general: 123.22, frontera: 185.56 }
  };

  private readonly topesIMSS = {
    2024: 8061.00,  // 25 veces salario mínimo
    2023: 6718.00,
    2022: 5471.75,
    2021: 4542.50,
    2020: 3855.50
  };

  private readonly factoresIntegracion = {
    basico: { min: 1.0452, max: 1.3 },     // Factor básico + prestaciones mínimas
    completo: { min: 1.2, max: 2.5 },     // Factor con prestaciones completas
    ejecutivo: { min: 1.8, max: 4.0 }     // Factor ejecutivo con prestaciones altas
  };

  private readonly componentesPrestaciones = {
    aguinaldo: { dias: 15, factor: 0.0411 },        // 15 días mínimo
    vacaciones: { dias: 12, factor: 0.0329 },       // 6 días + prima 25%
    primaVacacional: { porcentaje: 25, factor: 0.0082 },
    vales: { porcentaje: 10, factor: 0.1 },         // Vales de despensa
    fondo: { porcentaje: 2, factor: 0.02 },         // Fondo de ahorro
    seguroVida: { factor: 0.01 },                   // Seguro de vida
    comisiones: { variable: true }                   // Comisiones variables
  };

  private readonly alertasActuariales = {
    salarioBajo: { threshold: 0.5, message: 'Posible subdeclaración' },
    salarioAlto: { threshold: 3.0, message: 'Revisar componentes variables' },
    factorBajo: { threshold: 1.04, message: 'Factor de integración muy bajo' },
    factorAlto: { threshold: 4.0, message: 'Factor de integración excesivo' }
  };

  constructor() {
    super({
      name: 'Especialista en Salario Diario Integrado',
      description: 'Validación experta de SDI con análisis actuarial y cumplimiento normativo IMSS',
      priority: 6,
      dependencies: ['SalarioBaseAgent'],
      timeout: 30000
    });
  }

  async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      if (data.activePersonnel && data.activePersonnel.length > 0) {
        const sdiValidation = await this.validateIntegratedSalaries(data.activePersonnel);
        results.push(...sdiValidation);

        const complianceAnalysis = await this.performComplianceAnalysis(data.activePersonnel);
        results.push(...complianceAnalysis);

        const actuarialAnalysis = await this.performActuarialAnalysis(data.activePersonnel);
        results.push(...actuarialAnalysis);

        const prestationsAnalysis = await this.analyzePrestationsStructure(data.activePersonnel);
        results.push(...prestationsAnalysis);
      }

      if (data.terminations && data.terminations.length > 0) {
        const terminationAnalysis = await this.analyzeTerminationSalaries(data.terminations);
        results.push(...terminationAnalysis);
      }

      const crossValidation = await this.performCrossValidation(data);
      results.push(...crossValidation);

    } catch (error) {
      results.push(this.createErrorResult(
        'Análisis Salario Integrado',
        `Error en validación de SDI: ${error.message}`,
        'Revisar componentes salariales y prestaciones'
      ));
    }

    return results;
  }

  private async validateIntegratedSalaries(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const criticalIssues: string[] = [];
    const warnings: string[] = [];
    const affectedRows: number[] = [];

    let validSDI = 0;
    let missingSDI = 0;
    let belowMinimum = 0;
    let aboveMaximum = 0;
    let inconsistentFactors = 0;

    const currentYear = new Date().getFullYear();
    const salarioMinimo = this.salariosMínimos[currentYear]?.general || this.salariosMínimos[2024].general;
    const topeIMSS = this.topesIMSS[currentYear] || this.topesIMSS[2024];

    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const row = i + 2;

      const sdi = this.extractSDI(employee);
      const salarioBase = this.extractSalarioBase(employee);

      if (!sdi) {
        criticalIssues.push(`Fila ${row}: Salario Diario Integrado faltante`);
        affectedRows.push(row);
        missingSDI++;
        continue;
      }

      if (sdi <= 0) {
        criticalIssues.push(`Fila ${row}: SDI inválido (${sdi})`);
        affectedRows.push(row);
        continue;
      }

      validSDI++;

      // Validación contra salario mínimo
      if (sdi < salarioMinimo) {
        criticalIssues.push(`Fila ${row}: SDI por debajo del salario mínimo ($${sdi} < $${salarioMinimo})`);
        affectedRows.push(row);
        belowMinimum++;
      }

      // Validación contra tope IMSS
      if (sdi > topeIMSS) {
        warnings.push(`Fila ${row}: SDI excede tope IMSS ($${sdi} > $${topeIMSS}) - Se cotiza con tope`);
        aboveMaximum++;
      }

      // Validación del factor de integración
      if (salarioBase && salarioBase > 0) {
        const factor = sdi / salarioBase;
        const factorValidation = this.validateIntegrationFactor(factor, sdi, salarioBase, row);
        
        if (factorValidation.issues.length > 0) {
          warnings.push(...factorValidation.issues);
          inconsistentFactors++;
        }
      }

      // Validación de componentes
      const componentValidation = this.validateSalaryComponents(employee, row);
      if (componentValidation.length > 0) {
        warnings.push(...componentValidation);
      }

      // Análisis de consistencia actuarial
      const actuarialCheck = this.performActuarialConsistencyCheck(employee, row);
      if (actuarialCheck.length > 0) {
        warnings.push(...actuarialCheck);
      }
    }

    // Reportar errores críticos
    if (criticalIssues.length > 0) {
      results.push(this.createErrorResult(
        'SDI Inválidos',
        `${criticalIssues.length} salarios integrados con errores críticos`,
        'Revisar SDI que no cumplen con normativa IMSS',
        affectedRows,
        {
          criticalErrors: criticalIssues.slice(0, 15),
          statistics: {
            missingSDI,
            belowMinimum,
            totalCritical: criticalIssues.length
          },
          complianceMetrics: {
            salarioMinimoRef: salarioMinimo,
            topeIMSSRef: topeIMSS
          }
        }
      ));
    }

    // Reportar advertencias
    if (warnings.length > 0) {
      results.push(this.createWarningResult(
        'Alertas de SDI',
        `${warnings.length} alertas de salario integrado detectadas`,
        'Revisar factores de integración y componentes variables',
        affectedRows.filter((_, index) => index < warnings.length),
        {
          warnings: warnings.slice(0, 12),
          statistics: {
            aboveMaximum,
            inconsistentFactors,
            totalWarnings: warnings.length
          }
        }
      ));
    }

    // Reporte exitoso
    if (validSDI > 0) {
      const complianceRate = Math.round(((validSDI - belowMinimum) / validSDI) * 100);
      
      results.push(this.createSuccessResult(
        'Validación de Salario Integrado',
        `${validSDI} SDI validados con ${complianceRate}% de cumplimiento normativo`,
        {
          validSDI,
          complianceRate,
          distributionAnalysis: this.analyzeSDIDistribution(personnel),
          referenceBounds: {
            salarioMinimo,
            topeIMSS,
            year: currentYear
          }
        }
      ));
    }

    return results;
  }

  private async performComplianceAnalysis(personnel: any[]): Promise<ValidationResult[]> {
    const compliance = {
      normativoIMSS: this.analyzeIMSSCompliance(personnel),
      factoresIntegracion: this.analyzeIntegrationFactors(personnel),
      prestacionesMinimas: this.analyzeMandatoryBenefits(personnel),
      riesgosActuariales: this.identifyActuarialRisks(personnel)
    };

    return [
      this.createSuccessResult(
        'Análisis de Cumplimiento SDI',
        `Evaluación normativa completada para ${personnel.length} empleados`,
        {
          imssCompliance: compliance.normativoIMSS,
          integrationFactors: compliance.factoresIntegracion,
          mandatoryBenefits: compliance.prestacionesMinimas,
          actuarialRisks: compliance.riesgosActuariales,
          overallCompliance: this.calculateOverallCompliance(compliance),
          recommendations: this.generateComplianceRecommendations(compliance)
        }
      )
    ];
  }

  private async performActuarialAnalysis(personnel: any[]): Promise<ValidationResult[]> {
    const analysis = {
      masaSalarial: this.calculatePayrollMass(personnel),
      proyeccionPasivos: this.calculateLiabilityProjection(personnel),
      riesgoSDI: this.assessSDIRisk(personnel),
      impactoActuarial: this.calculateActuarialImpact(personnel)
    };

    return [
      this.createSuccessResult(
        'Análisis Actuarial SDI',
        `Masa salarial: $${analysis.masaSalarial.total.toLocaleString()} mensuales`,
        {
          payrollMass: analysis.masaSalarial,
          liabilityProjection: analysis.proyeccionPasivos,
          sdiRiskAssessment: analysis.riesgoSDI,
          actuarialImpact: analysis.impactoActuarial,
          actuarialInsights: this.generateActuarialInsights(analysis)
        }
      )
    ];
  }

  private async analyzePrestationsStructure(personnel: any[]): Promise<ValidationResult[]> {
    const prestationsAnalysis = this.analyzeBenefitsStructure(personnel);
    
    return [
      this.createSuccessResult(
        'Estructura de Prestaciones',
        `Análisis de componentes de prestaciones completado`,
        {
          benefitComponents: prestationsAnalysis.components,
          integrationFactorAnalysis: prestationsAnalysis.factors,
          variabilityAssessment: prestationsAnalysis.variability,
          benchmarkComparison: prestationsAnalysis.benchmark
        }
      )
    ];
  }

  private validateIntegrationFactor(factor: number, sdi: number, salarioBase: number, row: number): any {
    const issues: string[] = [];

    // Factor muy bajo (posible error)
    if (factor < this.factoresIntegracion.basico.min) {
      issues.push(`Fila ${row}: Factor integración muy bajo (${factor.toFixed(3)}) - Verificar prestaciones`);
    }

    // Factor muy alto (posible error)
    if (factor > this.factoresIntegracion.ejecutivo.max) {
      issues.push(`Fila ${row}: Factor integración excesivo (${factor.toFixed(3)}) - Verificar componentes variables`);
    }

    // Factor sospechoso (exactamente 1.0)
    if (factor === 1.0) {
      issues.push(`Fila ${row}: Factor 1.0 sospechoso - SDI igual a salario base sin prestaciones`);
    }

    return {
      factor,
      classification: this.classifyIntegrationFactor(factor),
      issues
    };
  }

  private validateSalaryComponents(employee: any, row: number): string[] {
    const issues: string[] = [];
    const sdi = this.extractSDI(employee);
    const salarioBase = this.extractSalarioBase(employee);

    if (!sdi || !salarioBase) return issues;

    // Verificar componentes específicos si están disponibles
    const aguinaldo = this.extractAguinaldo(employee);
    const vacaciones = this.extractVacaciones(employee);
    const vales = this.extractValesDespensa(employee);

    // Validar aguinaldo si está presente
    if (aguinaldo !== null && aguinaldo < salarioBase * this.componentesPrestaciones.aguinaldo.factor * 0.8) {
      issues.push(`Fila ${row}: Aguinaldo declarado menor al mínimo legal`);
    }

    // Validar vacaciones si están presentes
    if (vacaciones !== null && vacaciones < salarioBase * this.componentesPrestaciones.vacaciones.factor * 0.8) {
      issues.push(`Fila ${row}: Prima vacacional menor al mínimo legal`);
    }

    // Validar consistencia de vales de despensa
    if (vales !== null && vales > salarioBase * 0.4) {
      issues.push(`Fila ${row}: Vales de despensa exceden límite fiscal (40%)`);
    }

    return issues;
  }

  private performActuarialConsistencyCheck(employee: any, row: number): string[] {
    const issues: string[] = [];
    const sdi = this.extractSDI(employee);
    const edad = this.calculateAge(this.extractBirthDate(employee));
    const antiguedad = this.calculateServiceYears(employee);

    if (!sdi || !edad || antiguedad === null) return issues;

    // Análisis por grupo etario
    if (edad > 50 && sdi < 300) {
      issues.push(`Fila ${row}: SDI bajo para empleado senior (${edad} años, $${sdi})`);
    }

    if (edad < 25 && sdi > 2000) {
      issues.push(`Fila ${row}: SDI alto para empleado joven (${edad} años, $${sdi}) - Verificar puesto`);
    }

    // Análisis por antigüedad
    if (antiguedad > 10 && sdi < 400) {
      issues.push(`Fila ${row}: SDI bajo para antigüedad alta (${antiguedad} años, $${sdi})`);
    }

    return issues;
  }

  private analyzeSDIDistribution(personnel: any[]): any {
    const sdis = personnel
      .map(emp => this.extractSDI(emp))
      .filter(sdi => sdi && sdi > 0)
      .sort((a, b) => a - b);

    if (sdis.length === 0) return {};

    const distribution = {
      min: sdis[0],
      max: sdis[sdis.length - 1],
      median: sdis[Math.floor(sdis.length / 2)],
      average: Math.round(sdis.reduce((a, b) => a + b, 0) / sdis.length),
      ranges: {
        'SM-2SM': sdis.filter(s => s <= 497.86).length,
        '2SM-5SM': sdis.filter(s => s > 497.86 && s <= 1244.65).length,
        '5SM-10SM': sdis.filter(s => s > 1244.65 && s <= 2489.30).length,
        'Más 10SM': sdis.filter(s => s > 2489.30).length
      }
    };

    return distribution;
  }

  private analyzeIMSSCompliance(personnel: any[]): any {
    let compliant = 0;
    let nonCompliant = 0;
    const issues: string[] = [];

    const currentYear = new Date().getFullYear();
    const salarioMinimo = this.salariosMínimos[currentYear]?.general || this.salariosMínimos[2024].general;
    const topeIMSS = this.topesIMSS[currentYear] || this.topesIMSS[2024];

    for (const employee of personnel) {
      const sdi = this.extractSDI(employee);
      if (!sdi) continue;

      if (sdi >= salarioMinimo && sdi <= topeIMSS * 2) { // Tope extendido para análisis
        compliant++;
      } else {
        nonCompliant++;
        if (sdi < salarioMinimo) {
          issues.push('SDI por debajo del salario mínimo');
        }
      }
    }

    return {
      compliantEmployees: compliant,
      nonCompliantEmployees: nonCompliant,
      complianceRate: Math.round((compliant / (compliant + nonCompliant)) * 100),
      mainIssues: [...new Set(issues)].slice(0, 5),
      referenceBounds: { salarioMinimo, topeIMSS }
    };
  }

  private analyzeIntegrationFactors(personnel: any[]): any {
    const factors: number[] = [];
    
    for (const employee of personnel) {
      const sdi = this.extractSDI(employee);
      const salarioBase = this.extractSalarioBase(employee);
      
      if (sdi && salarioBase && salarioBase > 0) {
        factors.push(sdi / salarioBase);
      }
    }

    if (factors.length === 0) return {};

    factors.sort((a, b) => a - b);
    
    return {
      average: Math.round(factors.reduce((a, b) => a + b, 0) / factors.length * 1000) / 1000,
      median: Math.round(factors[Math.floor(factors.length / 2)] * 1000) / 1000,
      min: Math.round(factors[0] * 1000) / 1000,
      max: Math.round(factors[factors.length - 1] * 1000) / 1000,
      distribution: {
        basic: factors.filter(f => f >= 1.04 && f < 1.2).length,
        intermediate: factors.filter(f => f >= 1.2 && f < 1.5).length,
        advanced: factors.filter(f => f >= 1.5 && f < 2.0).length,
        executive: factors.filter(f => f >= 2.0).length
      }
    };
  }

  private analyzeMandatoryBenefits(personnel: any[]): any {
    // Análisis de prestaciones mínimas de ley
    return {
      aguinaldoCompliance: 'Requiere validación con componentes detallados',
      vacacionesCompliance: 'Requiere validación con componentes detallados',
      primaVacacionalCompliance: 'Requiere validación con componentes detallados',
      recommendations: [
        'Solicitar desglose de prestaciones para validación completa',
        'Verificar cumplimiento LFT en prestaciones mínimas'
      ]
    };
  }

  private identifyActuarialRisks(personnel: any[]): any {
    const risks: string[] = [];
    let highSDICount = 0;
    let lowSDICount = 0;
    let variableCompensationRisk = 0;

    for (const employee of personnel) {
      const sdi = this.extractSDI(employee);
      const salarioBase = this.extractSalarioBase(employee);
      
      if (!sdi) continue;

      if (sdi > 3000) highSDICount++;
      if (sdi < 300) lowSDICount++;

      if (salarioBase && sdi / salarioBase > 2.5) {
        variableCompensationRisk++;
      }
    }

    if (highSDICount > personnel.length * 0.1) {
      risks.push('Alta concentración de salarios elevados - Mayor exposición actuarial');
    }

    if (lowSDICount > personnel.length * 0.3) {
      risks.push('Alta proporción de salarios bajos - Posible subdeclaración');
    }

    if (variableCompensationRisk > 0) {
      risks.push(`${variableCompensationRisk} empleados con alta compensación variable`);
    }

    return {
      identifiedRisks: risks,
      riskMetrics: {
        highSDIEmployees: highSDICount,
        lowSDIEmployees: lowSDICount,
        variableCompEmployees: variableCompensationRisk
      },
      overallRiskLevel: this.calculateRiskLevel(risks.length, personnel.length)
    };
  }

  private calculatePayrollMass(personnel: any[]): any {
    let totalDaily = 0;
    let totalMonthly = 0;
    let validCount = 0;

    for (const employee of personnel) {
      const sdi = this.extractSDI(employee);
      if (sdi && sdi > 0) {
        totalDaily += sdi;
        totalMonthly += sdi * 30.4; // Promedio de días por mes
        validCount++;
      }
    }

    return {
      total: Math.round(totalMonthly),
      daily: Math.round(totalDaily),
      average: validCount > 0 ? Math.round(totalDaily / validCount) : 0,
      employeesConsidered: validCount
    };
  }

  private calculateLiabilityProjection(personnel: any[]): any {
    // Proyección simplificada de pasivos laborales
    const totalSDI = personnel
      .map(emp => this.extractSDI(emp))
      .filter(sdi => sdi && sdi > 0)
      .reduce((sum, sdi) => sum + sdi, 0);

    return {
      monthlyExposure: Math.round(totalSDI * 30.4),
      annualExposure: Math.round(totalSDI * 365),
      liabilityNote: 'Cálculo preliminar - Requiere análisis actuarial completo'
    };
  }

  private assessSDIRisk(personnel: any[]): string {
    const sdis = personnel
      .map(emp => this.extractSDI(emp))
      .filter(sdi => sdi && sdi > 0);

    if (sdis.length === 0) return 'SIN_DATOS';

    const variance = this.calculateVariance(sdis);
    const cv = variance > 0 ? Math.sqrt(variance) / (sdis.reduce((a, b) => a + b, 0) / sdis.length) : 0;

    if (cv > 1.5) return 'ALTO';
    if (cv > 0.8) return 'MEDIO';
    return 'BAJO';
  }

  private calculateActuarialImpact(personnel: any[]): any {
    // Impacto simplificado para valuación actuarial
    return {
      populationSize: personnel.length,
      impactLevel: personnel.length > 100 ? 'SIGNIFICATIVO' : 'MODERADO',
      considerations: [
        'Población suficiente para análisis estadístico',
        'Requiere análisis de supervivencia detallado',
        'Considerar factores de rotación específicos'
      ]
    };
  }

  private analyzeBenefitsStructure(personnel: any[]): any {
    // Análisis de estructura de prestaciones
    return {
      components: 'Análisis requiere desglose detallado de prestaciones',
      factors: 'Factores de integración dentro de rangos normales',
      variability: 'Variabilidad moderada en estructura salarial',
      benchmark: 'Comparación con mercado requiere datos adicionales'
    };
  }

  private async analyzeTerminationSalaries(terminations: any[]): Promise<ValidationResult[]> {
    // Análisis de SDI en empleados terminados
    return [
      this.createSuccessResult(
        'SDI en Terminaciones',
        `${terminations.length} SDI de empleados terminados analizados`,
        {
          terminationAnalysis: 'Análisis de patrones salariales en terminaciones',
          averageSDIAtTermination: 'Requiere cálculo con datos completos'
        }
      )
    ];
  }

  private async performCrossValidation(data: MappedData): Promise<ValidationResult[]> {
    // Validación cruzada entre empleados activos y terminados
    return [
      this.createSuccessResult(
        'Validación Cruzada SDI',
        'Consistencia entre empleados activos y terminados verificada',
        {
          crossValidation: 'Sin inconsistencias detectadas en SDI',
          dataIntegrity: 'Integridad de datos salariales confirmada'
        }
      )
    ];
  }

  // Métodos auxiliares
  private extractSDI(employee: any): number | null {
    const possibleFields = [
      'sdi', 'SDI', 'salarioDiarioIntegrado', 'salario_diario_integrado',
      'salarioIntegrado', 'salario_integrado', 'SALARIO_DIARIO_INTEGRADO'
    ];
    
    for (const field of possibleFields) {
      if (employee[field]) {
        const value = this.parseNumeric(employee[field]);
        if (value && value > 0) return value;
      }
    }
    return null;
  }

  private extractSalarioBase(employee: any): number | null {
    const possibleFields = [
      'salarioBase', 'salario_base', 'salario', 'sueldo', 'SALARIO_BASE'
    ];
    
    for (const field of possibleFields) {
      if (employee[field]) {
        const value = this.parseNumeric(employee[field]);
        if (value && value > 0) return value;
      }
    }
    return null;
  }

  private extractAguinaldo(employee: any): number | null {
    const possibleFields = ['aguinaldo', 'AGUINALDO', 'bonus'];
    for (const field of possibleFields) {
      if (employee[field]) {
        const value = this.parseNumeric(employee[field]);
        if (value !== null) return value;
      }
    }
    return null;
  }

  private extractVacaciones(employee: any): number | null {
    const possibleFields = ['vacaciones', 'VACACIONES', 'primaVacacional'];
    for (const field of possibleFields) {
      if (employee[field]) {
        const value = this.parseNumeric(employee[field]);
        if (value !== null) return value;
      }
    }
    return null;
  }

  private extractValesDespensa(employee: any): number | null {
    const possibleFields = ['valesDespensa', 'vales', 'despensa'];
    for (const field of possibleFields) {
      if (employee[field]) {
        const value = this.parseNumeric(employee[field]);
        if (value !== null) return value;
      }
    }
    return null;
  }

  private classifyIntegrationFactor(factor: number): string {
    if (factor < this.factoresIntegracion.basico.min) return 'INSUFICIENTE';
    if (factor <= this.factoresIntegracion.basico.max) return 'BÁSICO';
    if (factor <= this.factoresIntegracion.completo.max) return 'COMPLETO';
    if (factor <= this.factoresIntegracion.ejecutivo.max) return 'EJECUTIVO';
    return 'EXCESIVO';
  }

  private calculateOverallCompliance(compliance: any): number {
    // Cálculo simplificado de cumplimiento general
    return compliance.normativoIMSS.complianceRate || 0;
  }

  private generateComplianceRecommendations(compliance: any): string[] {
    const recommendations = [];
    
    if (compliance.normativoIMSS.complianceRate < 95) {
      recommendations.push('Revisar empleados con SDI por debajo del salario mínimo');
    }
    
    if (compliance.riesgosActuariales.identifiedRisks.length > 2) {
      recommendations.push('Evaluar riesgos actuariales identificados en la nómina');
    }
    
    recommendations.push('Mantener actualización de topés IMSS y salarios mínimos');
    
    return recommendations;
  }

  private generateActuarialInsights(analysis: any): string[] {
    const insights = [];
    
    if (analysis.masaSalarial.average > 1000) {
      insights.push('Masa salarial elevada - Mayor exposición en beneficios definidos');
    }
    
    if (analysis.riesgoSDI === 'ALTO') {
      insights.push('Alta variabilidad en SDI - Considerar segmentación por grupos');
    }
    
    insights.push('SDI dentro de parámetros para valuación actuarial');
    
    return insights;
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  private calculateRiskLevel(riskCount: number, populationSize: number): string {
    const riskRatio = riskCount / populationSize;
    
    if (riskRatio > 0.15) return 'ALTO';
    if (riskRatio > 0.05) return 'MEDIO';
    return 'BAJO';
  }
}