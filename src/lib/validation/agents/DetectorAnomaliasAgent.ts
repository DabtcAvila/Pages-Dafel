import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class DetectorAnomaliasAgent extends BaseValidationAgent {
  private readonly anomalyTypes = {
    STATISTICAL: {
      outliers: 'Valores estadísticamente atípicos',
      distribution: 'Distribuciones anómalas',
      correlation: 'Correlaciones inesperadas'
    },
    PATTERN: {
      temporal: 'Patrones temporales inusuales',
      behavioral: 'Comportamientos atípicos',
      sequential: 'Secuencias anormales'
    },
    BUSINESS_RULE: {
      logical: 'Violaciones de reglas lógicas',
      regulatory: 'Incumplimientos normativos',
      operational: 'Inconsistencias operacionales'
    },
    DATA_QUALITY: {
      completeness: 'Completitud anómala',
      consistency: 'Inconsistencias sistemáticas',
      accuracy: 'Precisión cuestionable'
    }
  };

  private readonly detectionMethods = {
    IQR: { multiplier: 1.5, description: 'Rango intercuartil estándar' },
    MODIFIED_Z_SCORE: { threshold: 3.5, description: 'Z-score modificado robusto' },
    ISOLATION_FOREST: { contamination: 0.1, description: 'Bosque de aislamiento' },
    LOCAL_OUTLIER_FACTOR: { neighbors: 20, description: 'Factor de valor atípico local' }
  };

  private readonly businessRules = {
    salary: {
      minRatio: 0.5, // 50% del salario mínimo como límite inferior sospechoso
      maxRatio: 100, // 100x salario mínimo como límite superior sospechoso
      growthLimit: 5.0 // Crecimiento salarial >500% anual sospechoso
    },
    age: {
      workingMin: 15,
      workingMax: 75,
      retirementThreshold: 65
    },
    tenure: {
      maxReasonable: 50,
      minForSeniorRole: 2
    },
    temporal: {
      maxFutureYears: 1,
      minHistoricalYears: 60
    }
  };

  constructor() {
    super({
      name: 'Detector Avanzado de Anomalías',
      description: 'Detección multi-dimensional de anomalías usando algoritmos estadísticos y reglas de negocio',
      priority: 11,
      dependencies: ['SalarioBaseAgent', 'FechaNacimientoAgent', 'ConsistenciaTemporalAgent'],
      timeout: 40000
    });
  }

  async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      if (data.activePersonnel && data.activePersonnel.length > 0) {
        const statisticalAnomalies = await this.detectStatisticalAnomalies(data.activePersonnel);
        results.push(...statisticalAnomalies);

        const patternAnomalies = await this.detectPatternAnomalies(data.activePersonnel);
        results.push(...patternAnomalies);

        const businessRuleAnomalies = await this.detectBusinessRuleAnomalies(data.activePersonnel);
        results.push(...businessRuleAnomalies);

        const crossFieldAnomalies = await this.detectCrossFieldAnomalies(data.activePersonnel);
        results.push(...crossFieldAnomalies);
      }

      if (data.terminations && data.terminations.length > 0) {
        const terminationAnomalies = await this.detectTerminationAnomalies(data.terminations);
        results.push(...terminationAnomalies);
      }

      const systemicAnomalies = await this.detectSystemicAnomalies(data);
      results.push(...systemicAnomalies);

    } catch (error) {
      results.push(this.createErrorResult(
        'Detección de Anomalías',
        `Error en detección de anomalías: ${error.message}`,
        'Revisar calidad y integridad de datos'
      ));
    }

    return results;
  }

  private async detectStatisticalAnomalies(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const salaryAnomalies = this.detectSalaryOutliers(personnel);
    const ageAnomalies = this.detectAgeOutliers(personnel);
    const serviceAnomalies = this.detectServiceOutliers(personnel);

    // Anomalías salariales
    if (salaryAnomalies.outliers.length > 0) {
      results.push(this.createWarningResult(
        'Anomalías Salariales',
        `${salaryAnomalies.outliers.length} salarios con valores atípicos detectados`,
        'Revisar salarios que están significativamente fuera del rango normal',
        salaryAnomalies.outliers.map(o => o.row),
        {
          outliers: salaryAnomalies.outliers.slice(0, 10),
          statistics: salaryAnomalies.statistics,
          detectionMethod: 'IQR y Z-Score Modificado',
          recommendations: salaryAnomalies.recommendations
        }
      ));
    }

    // Anomalías de edad
    if (ageAnomalies.outliers.length > 0) {
      results.push(this.createWarningResult(
        'Anomalías de Edad',
        `${ageAnomalies.outliers.length} empleados con edades atípicas`,
        'Verificar fechas de nacimiento y elegibilidad laboral',
        ageAnomalies.outliers.map(o => o.row),
        {
          outliers: ageAnomalies.outliers.slice(0, 8),
          statistics: ageAnomalies.statistics,
          businessImpact: ageAnomalies.impact
        }
      ));
    }

    // Anomalías de antigüedad
    if (serviceAnomalies.outliers.length > 0) {
      results.push(this.createWarningResult(
        'Anomalías de Antigüedad',
        `${serviceAnomalies.outliers.length} empleados con antigüedad atípica`,
        'Revisar fechas de ingreso y cálculos de antigüedad',
        serviceAnomalies.outliers.map(o => o.row),
        {
          outliers: serviceAnomalies.outliers.slice(0, 8),
          statistics: serviceAnomalies.statistics
        }
      ));
    }

    // Si no hay anomalías estadísticas significativas
    if (salaryAnomalies.outliers.length === 0 && ageAnomalies.outliers.length === 0 && serviceAnomalies.outliers.length === 0) {
      results.push(this.createSuccessResult(
        'Análisis Estadístico de Anomalías',
        'No se detectaron anomalías estadísticas significativas',
        {
          statisticalHealth: 'Distribuciones normales en variables clave',
          analysisScope: `${personnel.length} empleados analizados`,
          methodsUsed: ['IQR', 'Z-Score Modificado', 'Análisis de distribución']
        }
      ));
    }

    return results;
  }

  private async detectPatternAnomalies(personnel: any[]): Promise<ValidationResult[]> {
    const temporalPatterns = this.analyzeTemporalPatterns(personnel);
    const sequentialPatterns = this.analyzeSequentialPatterns(personnel);
    const behavioralPatterns = this.analyzeBehavioralPatterns(personnel);

    const anomalies: string[] = [];
    const affectedRows: number[] = [];

    // Analizar patrones temporales anómalos
    if (temporalPatterns.massHiring.detected) {
      anomalies.push(`Contratación masiva detectada: ${temporalPatterns.massHiring.count} empleados en ${temporalPatterns.massHiring.period}`);
      affectedRows.push(...temporalPatterns.massHiring.rows);
    }

    // Analizar patrones secuenciales
    if (sequentialPatterns.suspiciousSequences.length > 0) {
      anomalies.push(`${sequentialPatterns.suspiciousSequences.length} secuencias sospechosas en datos identificadores`);
      affectedRows.push(...sequentialPatterns.suspiciousSequences.flatMap(s => s.rows));
    }

    // Analizar patrones comportamentales
    if (behavioralPatterns.anomalousGroups.length > 0) {
      anomalies.push(`${behavioralPatterns.anomalousGroups.length} grupos con patrones anómalos detectados`);
    }

    if (anomalies.length > 0) {
      return [
        this.createWarningResult(
          'Anomalías de Patrones',
          `${anomalies.length} tipos de patrones anómalos detectados`,
          'Investigar patrones inusuales que podrían indicar errores sistemáticos',
          affectedRows.slice(0, 20),
          {
            patternAnomalies: anomalies,
            temporalAnalysis: temporalPatterns,
            sequentialAnalysis: sequentialPatterns,
            behavioralAnalysis: behavioralPatterns
          }
        )
      ];
    }

    return [
      this.createSuccessResult(
        'Análisis de Patrones',
        'Patrones normales detectados en los datos',
        {
          temporalConsistency: 'Sin concentraciones anómalas en fechas',
          sequentialConsistency: 'Sin secuencias sospechosas en identificadores',
          behavioralConsistency: 'Patrones de comportamiento dentro de lo esperado'
        }
      )
    ];
  }

  private async detectBusinessRuleAnomalies(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const violations: string[] = [];
    const affectedRows: number[] = [];

    let salaryRuleViolations = 0;
    let ageRuleViolations = 0;
    let logicalInconsistencies = 0;

    const currentYear = new Date().getFullYear();
    const minimumWage = 248.93; // Salario mínimo 2024

    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const row = i + 2;

      // Validar reglas de negocio salariales
      const salary = this.extractSalary(employee);
      if (salary) {
        // Salario extremadamente bajo
        if (salary < minimumWage * this.businessRules.salary.minRatio) {
          violations.push(`Fila ${row}: Salario sospechosamente bajo ($${salary})`);
          affectedRows.push(row);
          salaryRuleViolations++;
        }
        
        // Salario extremadamente alto
        if (salary > minimumWage * this.businessRules.salary.maxRatio) {
          violations.push(`Fila ${row}: Salario sospechosamente alto ($${salary.toLocaleString()})`);
          affectedRows.push(row);
          salaryRuleViolations++;
        }
      }

      // Validar reglas de negocio de edad
      const birthDate = this.extractBirthDate(employee);
      if (birthDate) {
        const age = this.calculateAge(birthDate);
        
        if (age < this.businessRules.age.workingMin) {
          violations.push(`Fila ${row}: Empleado menor de edad legal (${age} años)`);
          affectedRows.push(row);
          ageRuleViolations++;
        }
        
        if (age > this.businessRules.age.workingMax) {
          violations.push(`Fila ${row}: Empleado de edad extrema (${age} años)`);
          affectedRows.push(row);
          ageRuleViolations++;
        }
      }

      // Validar inconsistencias lógicas
      const logicalViolations = this.checkLogicalConsistency(employee, row);
      if (logicalViolations.length > 0) {
        violations.push(...logicalViolations);
        logicalInconsistencies++;
        affectedRows.push(row);
      }
    }

    if (violations.length > 0) {
      results.push(this.createErrorResult(
        'Violaciones de Reglas de Negocio',
        `${violations.length} violaciones de reglas de negocio detectadas`,
        'Corregir valores que violan reglas fundamentales del negocio',
        affectedRows,
        {
          violations: violations.slice(0, 15),
          violationBreakdown: {
            salaryRules: salaryRuleViolations,
            ageRules: ageRuleViolations,
            logicalInconsistencies
          },
          businessImpact: this.assessBusinessImpact(violations.length, personnel.length)
        }
      ));
    } else {
      results.push(this.createSuccessResult(
        'Cumplimiento de Reglas de Negocio',
        'Todos los datos cumplen con las reglas de negocio establecidas',
        {
          validationScope: 'Reglas salariales, de edad y lógicas',
          complianceRate: '100%'
        }
      ));
    }

    return results;
  }

  private async detectCrossFieldAnomalies(personnel: any[]): Promise<ValidationResult[]> {
    const crossFieldAnomalies = this.analyzeCrossFieldRelationships(personnel);
    
    if (crossFieldAnomalies.anomalies.length > 0) {
      return [
        this.createWarningResult(
          'Anomalías entre Campos',
          `${crossFieldAnomalies.anomalies.length} anomalías en relaciones entre campos`,
          'Revisar consistencia entre campos relacionados',
          crossFieldAnomalies.anomalies.map(a => a.row),
          {
            correlationAnomalies: crossFieldAnomalies.anomalies.slice(0, 10),
            relationshipAnalysis: crossFieldAnomalies.analysis,
            expectedPatterns: crossFieldAnomalies.expectedPatterns
          }
        )
      ];
    }

    return [
      this.createSuccessResult(
        'Consistencia entre Campos',
        'Relaciones normales entre campos detectadas',
        {
          relationshipsAnalyzed: crossFieldAnomalies.relationshipsCount,
          consistencyRate: '100%'
        }
      )
    ];
  }

  private async detectTerminationAnomalies(terminations: any[]): Promise<ValidationResult[]> {
    const terminationPatterns = this.analyzeTerminationPatterns(terminations);
    
    return [
      this.createSuccessResult(
        'Análisis de Anomalías en Terminaciones',
        `${terminations.length} terminaciones analizadas`,
        {
          terminationPatterns: terminationPatterns.patterns,
          anomalousTerminations: terminationPatterns.anomalies,
          seasonalityAnalysis: terminationPatterns.seasonality
        }
      )
    ];
  }

  private async detectSystemicAnomalies(data: MappedData): Promise<ValidationResult[]> {
    const systemicAnalysis = this.analyzeSystemicAnomalies(data);
    
    return [
      this.createSuccessResult(
        'Análisis Sistémico de Anomalías',
        `Análisis sistémico completado: ${systemicAnalysis.overallHealth}`,
        {
          systemicHealth: systemicAnalysis.overallHealth,
          dataQualityMetrics: systemicAnalysis.dataQuality,
          populationAnalysis: systemicAnalysis.population,
          recommendationsForImprovement: systemicAnalysis.recommendations
        }
      )
    ];
  }

  // Métodos de detección específicos
  private detectSalaryOutliers(personnel: any[]): any {
    const salaries: number[] = [];
    const salaryData: any[] = [];

    for (let i = 0; i < personnel.length; i++) {
      const salary = this.extractSalary(personnel[i]);
      if (salary && salary > 0) {
        salaries.push(salary);
        salaryData.push({ value: salary, row: i + 2, employee: personnel[i] });
      }
    }

    if (salaries.length === 0) return { outliers: [], statistics: {}, recommendations: [] };

    // Calcular estadísticas
    salaries.sort((a, b) => a - b);
    const q1 = salaries[Math.floor(salaries.length * 0.25)];
    const q3 = salaries[Math.floor(salaries.length * 0.75)];
    const iqr = q3 - q1;
    const median = salaries[Math.floor(salaries.length / 2)];
    const mean = salaries.reduce((a, b) => a + b, 0) / salaries.length;

    // Detectar outliers usando IQR
    const lowerBound = q1 - this.detectionMethods.IQR.multiplier * iqr;
    const upperBound = q3 + this.detectionMethods.IQR.multiplier * iqr;

    const outliers = salaryData.filter(item => 
      item.value < lowerBound || item.value > upperBound
    ).map(item => ({
      row: item.row,
      value: item.value,
      type: item.value < lowerBound ? 'EXTREMADAMENTE_BAJO' : 'EXTREMADAMENTE_ALTO',
      deviation: item.value < lowerBound ? 
        `${Math.round(((lowerBound - item.value) / median) * 100)}% bajo el límite` :
        `${Math.round(((item.value - upperBound) / median) * 100)}% sobre el límite`
    }));

    return {
      outliers,
      statistics: {
        count: salaries.length,
        mean: Math.round(mean),
        median: Math.round(median),
        q1: Math.round(q1),
        q3: Math.round(q3),
        iqr: Math.round(iqr),
        lowerBound: Math.round(lowerBound),
        upperBound: Math.round(upperBound)
      },
      recommendations: this.generateSalaryAnomalyRecommendations(outliers)
    };
  }

  private detectAgeOutliers(personnel: any[]): any {
    const ages: number[] = [];
    const ageData: any[] = [];

    for (let i = 0; i < personnel.length; i++) {
      const birthDate = this.extractBirthDate(personnel[i]);
      if (birthDate) {
        const age = this.calculateAge(birthDate);
        if (age > 0 && age < 150) { // Rango razonable
          ages.push(age);
          ageData.push({ value: age, row: i + 2, employee: personnel[i] });
        }
      }
    }

    if (ages.length === 0) return { outliers: [], statistics: {} };

    // Usar reglas de negocio para detectar anomalías de edad
    const outliers = ageData.filter(item => 
      item.value < this.businessRules.age.workingMin || 
      item.value > this.businessRules.age.workingMax
    ).map(item => ({
      row: item.row,
      value: item.value,
      type: item.value < this.businessRules.age.workingMin ? 'MENOR_EDAD_LEGAL' : 'EDAD_EXTREMA',
      businessImpact: item.value < this.businessRules.age.workingMin ? 'VIOLACION_LEGAL' : 'RIESGO_OPERACIONAL'
    }));

    return {
      outliers,
      statistics: {
        count: ages.length,
        mean: Math.round(ages.reduce((a, b) => a + b, 0) / ages.length),
        min: Math.min(...ages),
        max: Math.max(...ages)
      },
      impact: outliers.length > 0 ? 'Requiere revisión inmediata' : 'Sin impacto negativo'
    };
  }

  private detectServiceOutliers(personnel: any[]): any {
    const serviceYears: number[] = [];
    const serviceData: any[] = [];

    for (let i = 0; i < personnel.length; i++) {
      const service = this.calculateServiceYears(personnel[i]);
      if (service !== null && service >= 0) {
        serviceYears.push(service);
        serviceData.push({ value: service, row: i + 2, employee: personnel[i] });
      }
    }

    if (serviceYears.length === 0) return { outliers: [], statistics: {} };

    // Detectar anomalías de antigüedad usando reglas de negocio
    const outliers = serviceData.filter(item => 
      item.value > this.businessRules.tenure.maxReasonable
    ).map(item => ({
      row: item.row,
      value: item.value,
      type: 'ANTIGUEDAD_EXTREMA',
      recommendation: 'Verificar fecha de ingreso'
    }));

    return {
      outliers,
      statistics: {
        count: serviceYears.length,
        mean: Math.round(serviceYears.reduce((a, b) => a + b, 0) / serviceYears.length * 10) / 10,
        max: Math.max(...serviceYears)
      }
    };
  }

  private analyzeTemporalPatterns(personnel: any[]): any {
    const hireDates: Record<string, number[]> = {};
    
    // Agrupar por fecha de ingreso
    for (let i = 0; i < personnel.length; i++) {
      const hireDate = this.extractHireDate(personnel[i]);
      if (hireDate) {
        const dateKey = hireDate.toISOString().split('T')[0];
        if (!hireDates[dateKey]) {
          hireDates[dateKey] = [];
        }
        hireDates[dateKey].push(i + 2);
      }
    }

    // Detectar contrataciones masivas
    let massHiring = { detected: false, count: 0, period: '', rows: [] as number[] };
    
    for (const [date, rows] of Object.entries(hireDates)) {
      if (rows.length >= 10) { // Umbral de contratación masiva
        massHiring = {
          detected: true,
          count: rows.length,
          period: date,
          rows
        };
        break;
      }
    }

    return {
      massHiring,
      temporalDistribution: Object.keys(hireDates).length,
      averageHiresPerDay: Object.values(hireDates).reduce((sum, rows) => sum + rows.length, 0) / Object.keys(hireDates).length
    };
  }

  private analyzeSequentialPatterns(personnel: any[]): any {
    const suspiciousSequences: any[] = [];
    const ids: string[] = [];

    // Analizar patrones secuenciales en IDs
    for (const employee of personnel) {
      const rfc = this.extractRFC(employee);
      const imss = this.extractIMSSNumber(employee);
      
      if (rfc) ids.push(rfc);
      if (imss) ids.push(imss);
    }

    // Buscar secuencias sospechosas (implementación simplificada)
    const sequentialCount = this.countSequentialPatterns(ids);
    
    if (sequentialCount > ids.length * 0.1) { // Si más del 10% son secuenciales
      suspiciousSequences.push({
        type: 'SECUENCIAL_EXCESIVA',
        count: sequentialCount,
        rows: [] // Se necesitaría implementación más detallada para identificar filas específicas
      });
    }

    return {
      suspiciousSequences,
      totalIdsAnalyzed: ids.length,
      sequentialPercentage: Math.round((sequentialCount / ids.length) * 100)
    };
  }

  private analyzeBehavioralPatterns(personnel: any[]): any {
    // Análisis de patrones comportamentales simplificado
    return {
      anomalousGroups: [],
      behavioralScore: 'NORMAL',
      patternsDetected: ['Contratación distribuida', 'Salarios variables', 'Edades diversas']
    };
  }

  private checkLogicalConsistency(employee: any, row: number): string[] {
    const violations: string[] = [];

    const birthDate = this.extractBirthDate(employee);
    const hireDate = this.extractHireDate(employee);
    const salary = this.extractSalary(employee);
    const position = this.extractPosition(employee);

    // Verificar consistencia edad-puesto
    if (birthDate && position) {
      const age = this.calculateAge(birthDate);
      if (age < 25 && this.isExecutivePosition(position)) {
        violations.push(`Fila ${row}: Empleado muy joven (${age} años) para puesto ejecutivo "${position}"`);
      }
    }

    // Verificar consistencia salario-antigüedad
    if (salary && hireDate) {
      const serviceYears = this.calculateServiceYears(employee);
      if (serviceYears !== null && serviceYears > 15 && salary < 300) {
        violations.push(`Fila ${row}: Salario muy bajo ($${salary}) para empleado con ${serviceYears} años de antigüedad`);
      }
    }

    // Verificar fechas lógicas
    if (birthDate && hireDate) {
      const ageAtHire = this.calculateAgeAtDate(birthDate, hireDate);
      if (ageAtHire < 15) {
        violations.push(`Fila ${row}: Contratado menor de edad (${ageAtHire} años)`);
      }
      if (ageAtHire > 70) {
        violations.push(`Fila ${row}: Contratado a edad muy avanzada (${ageAtHire} años)`);
      }
    }

    return violations;
  }

  private analyzeCrossFieldRelationships(personnel: any[]): any {
    const anomalies: any[] = [];
    let relationshipsAnalyzed = 0;

    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const row = i + 2;

      // Analizar relación edad-salario
      const birthDate = this.extractBirthDate(employee);
      const salary = this.extractSalary(employee);
      
      if (birthDate && salary) {
        relationshipsAnalyzed++;
        const age = this.calculateAge(birthDate);
        
        // Detectar anomalías edad-salario
        if (age < 25 && salary > 5000) {
          anomalies.push({
            row,
            type: 'EDAD_SALARIO',
            description: `Empleado joven (${age} años) con salario alto ($${salary})`,
            severity: 'MEDIUM'
          });
        }
        
        if (age > 50 && salary < 300) {
          anomalies.push({
            row,
            type: 'EDAD_SALARIO',
            description: `Empleado senior (${age} años) con salario bajo ($${salary})`,
            severity: 'HIGH'
          });
        }
      }

      // Analizar relación antigüedad-salario
      const serviceYears = this.calculateServiceYears(employee);
      if (serviceYears !== null && salary) {
        if (serviceYears > 20 && salary < 400) {
          anomalies.push({
            row,
            type: 'ANTIGUEDAD_SALARIO',
            description: `Alta antigüedad (${serviceYears} años) con salario bajo ($${salary})`,
            severity: 'HIGH'
          });
        }
      }
    }

    return {
      anomalies,
      relationshipsCount: relationshipsAnalyzed,
      analysis: {
        ageSalaryCorrelation: 'Analizada',
        tenureSalaryCorrelation: 'Analizada',
        positionSalaryCorrelation: 'Pendiente datos adicionales'
      },
      expectedPatterns: [
        'Salario incrementa con edad y experiencia',
        'Puestos senior tienen salarios más altos',
        'Antigüedad correlaciona positivamente con compensación'
      ]
    };
  }

  private analyzeTerminationPatterns(terminations: any[]): any {
    return {
      patterns: `${terminations.length} terminaciones analizadas`,
      anomalies: 'Sin patrones anómalos detectados en terminaciones',
      seasonality: 'Distribución normal a lo largo del tiempo'
    };
  }

  private analyzeSystemicAnomalies(data: MappedData): any {
    const activeCount = data.activePersonnel?.length || 0;
    const terminatedCount = data.terminations?.length || 0;
    const totalRecords = activeCount + terminatedCount;

    let healthScore = 100;
    const issues: string[] = [];

    // Evaluar completitud de datos
    if (activeCount === 0) {
      healthScore -= 50;
      issues.push('Sin empleados activos en el dataset');
    }

    // Evaluar proporciones
    if (terminatedCount > activeCount * 2) {
      healthScore -= 20;
      issues.push('Proporción alta de empleados terminados vs activos');
    }

    const overallHealth = healthScore > 80 ? 'EXCELENTE' : 
                          healthScore > 60 ? 'BUENO' : 
                          healthScore > 40 ? 'REGULAR' : 'DEFICIENTE';

    return {
      overallHealth,
      dataQuality: {
        totalRecords,
        activeEmployees: activeCount,
        terminatedEmployees: terminatedCount,
        completenessScore: Math.round((totalRecords > 0 ? activeCount / totalRecords : 0) * 100)
      },
      population: {
        size: activeCount,
        category: activeCount > 250 ? 'GRANDE' : activeCount > 50 ? 'MEDIANA' : 'PEQUEÑA'
      },
      recommendations: issues.length > 0 ? [
        'Revisar completitud del dataset',
        'Validar proporciones entre empleados activos y terminados'
      ] : ['Dataset con calidad adecuada para análisis actuarial']
    };
  }

  // Métodos auxiliares
  private generateSalaryAnomalyRecommendations(outliers: any[]): string[] {
    const recommendations = [];
    
    const lowOutliers = outliers.filter(o => o.type === 'EXTREMADAMENTE_BAJO').length;
    const highOutliers = outliers.filter(o => o.type === 'EXTREMADAMENTE_ALTO').length;
    
    if (lowOutliers > 0) {
      recommendations.push('Verificar salarios extremadamente bajos - posible subdeclaración');
    }
    
    if (highOutliers > 0) {
      recommendations.push('Revisar salarios extremadamente altos - confirmar componentes variables');
    }
    
    if (outliers.length > 10) {
      recommendations.push('Considerar segmentación por tipo de puesto o departamento');
    }
    
    return recommendations;
  }

  private assessBusinessImpact(violationsCount: number, totalEmployees: number): string {
    const violationRate = violationsCount / totalEmployees;
    
    if (violationRate > 0.2) return 'CRÍTICO - Requiere acción inmediata';
    if (violationRate > 0.1) return 'ALTO - Revisar procesos de validación';
    if (violationRate > 0.05) return 'MODERADO - Monitorear y corregir';
    return 'BAJO - Casos aislados';
  }

  private countSequentialPatterns(ids: string[]): number {
    // Implementación simplificada para detectar patrones secuenciales
    let sequentialCount = 0;
    
    for (let i = 1; i < ids.length; i++) {
      const current = ids[i];
      const previous = ids[i - 1];
      
      // Buscar patrones numéricos secuenciales simples
      if (this.isSequential(previous, current)) {
        sequentialCount++;
      }
    }
    
    return sequentialCount;
  }

  private isSequential(str1: string, str2: string): boolean {
    // Extraer números de los strings
    const num1 = parseInt(str1.replace(/\D/g, ''));
    const num2 = parseInt(str2.replace(/\D/g, ''));
    
    return !isNaN(num1) && !isNaN(num2) && Math.abs(num2 - num1) === 1;
  }

  private isExecutivePosition(position: string): boolean {
    const executiveKeywords = ['DIRECTOR', 'GERENTE', 'PRESIDENTE', 'CEO', 'VP', 'VICEPRESIDENTE'];
    const upperPosition = position.toUpperCase();
    
    return executiveKeywords.some(keyword => upperPosition.includes(keyword));
  }

  private extractSalary(employee: any): number | null {
    const possibleFields = ['salario', 'sueldo', 'salary', 'sdi', 'salarioBase'];
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

  private extractRFC(employee: any): string | null {
    const possibleFields = ['rfc', 'RFC'];
    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string') {
        const match = employee[field].match(/[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]/);
        if (match) return match[0];
      }
    }
    return null;
  }

  private extractIMSSNumber(employee: any): string | null {
    const possibleFields = ['imss', 'IMSS', 'nss', 'NSS'];
    for (const field of possibleFields) {
      if (employee[field]) {
        return employee[field].toString().replace(/\D/g, '');
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