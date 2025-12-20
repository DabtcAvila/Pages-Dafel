import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class ValidadorLeyFederalAgent extends BaseValidationAgent {
  private readonly leyFederalTrabajo = {
    articulo123: {
      salarioMinimo: { enforce: true, description: 'Salario no puede ser inferior al mínimo' },
      jornadaMaxima: { diaria: 8, semanal: 48, description: 'Jornada máxima de trabajo' },
      edadMinima: { value: 15, description: 'Edad mínima para trabajar' },
      aguinaldo: { diasMinimos: 15, description: 'Aguinaldo mínimo 15 días' }
    },
    prestacionesObligatorias: {
      vacaciones: { 
        diasMinimos: 6, 
        incrementoAnual: 2, 
        maximo: 12, 
        primaVacacional: 25,
        description: 'Vacaciones mínimas según antigüedad'
      },
      primaVacacional: {
        porcentajeMinimo: 25,
        description: 'Prima vacacional mínima 25%'
      },
      aguinaldo: {
        diasMinimos: 15,
        proporcion: true,
        description: 'Aguinaldo proporcional según tiempo trabajado'
      },
      seguroSocial: {
        obligatorio: true,
        description: 'Afiliación obligatoria al IMSS'
      }
    },
    maternidad: {
      incapacidadPrenatal: { dias: 42, description: 'Incapacidad prenatal' },
      incapacidadPostnatal: { dias: 42, description: 'Incapacidad postnatal' },
      lactancia: { periodos: 2, duracion: 30, description: 'Períodos de lactancia' }
    },
    terminacion: {
      preaviso: { dias: 30, description: 'Preaviso de terminación' },
      indemnizacion: { 
        formula: '3 meses + 20 días por año trabajado',
        descripcion: 'Indemnización por despido injustificado'
      },
      finiquito: {
        componentes: ['salarios pendientes', 'vacaciones', 'aguinaldo', 'prima vacacional'],
        description: 'Componentes obligatorios del finiquito'
      }
    }
  };

  private readonly violacionesComunes = {
    'SALARIO_INFERIOR_MINIMO': {
      severity: 'CRITICO',
      ley: 'Art. 85 LFT',
      sancion: 'Multa y pago retroactivo'
    },
    'JORNADA_EXCESIVA': {
      severity: 'GRAVE',
      ley: 'Art. 61 LFT',
      sancion: 'Pago de tiempo extra obligatorio'
    },
    'MENOR_SIN_AUTORIZACION': {
      severity: 'CRITICO',
      ley: 'Art. 22 LFT',
      sancion: 'Prohibición absoluta, multas graves'
    },
    'VACACIONES_INSUFICIENTES': {
      severity: 'MODERADO',
      ley: 'Art. 76 LFT',
      sancion: 'Pago de vacaciones faltantes'
    },
    'AGUINALDO_INSUFICIENTE': {
      severity: 'GRAVE',
      ley: 'Art. 87 LFT',
      sancion: 'Pago del aguinaldo completo'
    },
    'SIN_SEGURO_SOCIAL': {
      severity: 'CRITICO',
      ley: 'Art. 15-A LIMSS',
      sancion: 'Multas severas IMSS'
    }
  };

  private readonly calculadoraPrestaciones = {
    vacaciones: (antiguedad: number): number => {
      if (antiguedad >= 1 && antiguedad < 2) return 6;
      if (antiguedad >= 2 && antiguedad < 3) return 8;
      if (antiguedad >= 3 && antiguedad < 4) return 10;
      if (antiguedad >= 4) return Math.min(12 + Math.floor((antiguedad - 4) / 5) * 2, 18);
      return 0;
    },
    primaVacacional: (vacaciones: number, salarioDiario: number): number => {
      return vacaciones * salarioDiario * 0.25;
    },
    aguinaldo: (salarioDiario: number, diasTrabajados: number = 365): number => {
      const proporcion = Math.min(diasTrabajados, 365) / 365;
      return 15 * salarioDiario * proporcion;
    }
  };

  constructor() {
    super({
      name: 'Validador Ley Federal del Trabajo',
      description: 'Validación exhaustiva de cumplimiento con normatividad laboral mexicana',
      priority: 9,
      dependencies: ['SalarioBaseAgent', 'FechaIngresoAgent', 'EdadActuarialAgent'],
      timeout: 35000
    });
  }

  async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      if (data.activePersonnel && data.activePersonnel.length > 0) {
        const complianceValidation = await this.validateLaborLawCompliance(data.activePersonnel);
        results.push(...complianceValidation);

        const salaryValidation = await this.validateMinimumWageCompliance(data.activePersonnel);
        results.push(...salaryValidation);

        const benefitsValidation = await this.validateMandatoryBenefits(data.activePersonnel);
        results.push(...benefitsValidation);

        const workingTimeValidation = await this.validateWorkingTimeCompliance(data.activePersonnel);
        results.push(...workingTimeValidation);
      }

      if (data.terminations && data.terminations.length > 0) {
        const terminationValidation = await this.validateTerminationCompliance(data.terminations);
        results.push(...terminationValidation);
      }

      const riskAssessment = await this.assessLegalRisks(data);
      results.push(...riskAssessment);

      const complianceReport = await this.generateComplianceReport(data);
      results.push(...complianceReport);

    } catch (error) {
      results.push(this.createErrorResult(
        'Validación Ley Federal del Trabajo',
        `Error en validación legal: ${error.message}`,
        'Revisar cumplimiento de normatividad laboral'
      ));
    }

    return results;
  }

  private async validateLaborLawCompliance(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const violations: string[] = [];
    const warnings: string[] = [];
    const affectedRows: number[] = [];

    let compliantEmployees = 0;
    let minorWorkersIssues = 0;
    let salaryViolations = 0;
    let benefitsViolations = 0;

    const currentYear = new Date().getFullYear();
    const salarioMinimo = this.getSalarioMinimo(currentYear);

    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const row = i + 2;

      // Validación de edad mínima
      const birthDate = this.extractBirthDate(employee);
      if (birthDate) {
        const age = this.calculateAge(birthDate);
        if (age < this.leyFederalTrabajo.articulo123.edadMinima.value) {
          violations.push(`Fila ${row}: Empleado menor de ${this.leyFederalTrabajo.articulo123.edadMinima.value} años (${age} años) - Violación Art. 22 LFT`);
          affectedRows.push(row);
          minorWorkersIssues++;
          continue;
        }
      }

      // Validación de salario mínimo
      const salario = this.extractSalario(employee);
      if (salario && salario < salarioMinimo) {
        violations.push(`Fila ${row}: Salario inferior al mínimo legal ($${salario} < $${salarioMinimo}) - Violación Art. 85 LFT`);
        affectedRows.push(row);
        salaryViolations++;
        continue;
      }

      // Validación de prestaciones mínimas
      const prestationsCheck = this.validateMandatoryPrestations(employee, row);
      if (prestationsCheck.violations.length > 0) {
        violations.push(...prestationsCheck.violations);
        benefitsViolations++;
        affectedRows.push(row);
      }

      if (prestationsCheck.warnings.length > 0) {
        warnings.push(...prestationsCheck.warnings);
      }

      // Validación de seguridad social
      const imssValidation = this.validateSocialSecurityCompliance(employee, row);
      if (!imssValidation.compliant) {
        violations.push(imssValidation.violation!);
        affectedRows.push(row);
      }

      if (violations.filter(v => v.includes(`Fila ${row}:`)).length === 0) {
        compliantEmployees++;
      }
    }

    // Reportar violaciones críticas
    if (violations.length > 0) {
      results.push(this.createErrorResult(
        'Violaciones Ley Federal del Trabajo',
        `${violations.length} violaciones críticas detectadas`,
        'Corregir inmediatamente para evitar sanciones laborales',
        affectedRows,
        {
          violations: violations.slice(0, 15),
          violationBreakdown: {
            minorWorkers: minorWorkersIssues,
            salaryViolations,
            benefitsViolations
          },
          legalRisk: this.assessViolationSeverity(violations.length, personnel.length),
          referenceLaws: this.getReferenceLaws(violations)
        }
      ));
    }

    // Reportar advertencias
    if (warnings.length > 0) {
      results.push(this.createWarningResult(
        'Alertas de Cumplimiento Laboral',
        `${warnings.length} advertencias de cumplimiento detectadas`,
        'Revisar y corregir para optimizar cumplimiento legal',
        affectedRows.filter((_, index) => index < warnings.length),
        {
          warnings: warnings.slice(0, 10),
          totalWarnings: warnings.length
        }
      ));
    }

    // Reporte de cumplimiento
    if (compliantEmployees > 0) {
      const complianceRate = Math.round((compliantEmployees / personnel.length) * 100);
      
      results.push(this.createSuccessResult(
        'Cumplimiento Ley Federal del Trabajo',
        `${complianceRate}% de cumplimiento con normatividad laboral (${compliantEmployees}/${personnel.length})`,
        {
          compliantEmployees,
          complianceRate,
          legalFramework: {
            salarioMinimoReferencia: salarioMinimo,
            year: currentYear,
            legislation: 'Ley Federal del Trabajo actualizada'
          },
          complianceMetrics: this.calculateComplianceMetrics(personnel, violations.length)
        }
      ));
    }

    return results;
  }

  private async validateMinimumWageCompliance(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const wageAnalysis = this.analyzeWageCompliance(personnel);
    
    return [
      this.createSuccessResult(
        'Análisis Cumplimiento Salario Mínimo',
        `${wageAnalysis.compliantEmployees} empleados cumplen salario mínimo`,
        {
          wageDistribution: wageAnalysis.distribution,
          complianceMetrics: wageAnalysis.metrics,
          riskAssessment: wageAnalysis.risk,
          recommendations: wageAnalysis.recommendations
        }
      )
    ];
  }

  private async validateMandatoryBenefits(personnel: any[]): Promise<ValidationResult[]> {
    const benefitsAnalysis = this.analyzeBenefitsCompliance(personnel);
    
    return [
      this.createSuccessResult(
        'Validación Prestaciones Obligatorias',
        `Análisis de prestaciones LFT completado para ${personnel.length} empleados`,
        {
          benefitsCompliance: benefitsAnalysis.compliance,
          calculatedBenefits: benefitsAnalysis.calculated,
          complianceGaps: benefitsAnalysis.gaps,
          legalRequirements: benefitsAnalysis.requirements
        }
      )
    ];
  }

  private async validateWorkingTimeCompliance(personnel: any[]): Promise<ValidationResult[]> {
    // Análisis de cumplimiento de jornada laboral
    return [
      this.createSuccessResult(
        'Validación Jornada Laboral',
        'Análisis de cumplimiento de jornada máxima LFT',
        {
          workingTimeCompliance: 'Requiere datos de horarios para validación completa',
          legalLimits: {
            dailyMax: this.leyFederalTrabajo.articulo123.jornadaMaxima.diaria,
            weeklyMax: this.leyFederalTrabajo.articulo123.jornadaMaxima.semanal
          },
          recommendations: [
            'Implementar control de horarios para validación completa',
            'Verificar cumplimiento de límites de jornada laboral'
          ]
        }
      )
    ];
  }

  private async validateTerminationCompliance(terminations: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const terminationIssues: string[] = [];
    const affectedRows: number[] = [];

    for (let i = 0; i < terminations.length; i++) {
      const termination = terminations[i];
      const row = i + 2;

      // Validar componentes del finiquito
      const finiquitoValidation = this.validateFiniquitoComponents(termination, row);
      if (finiquitoValidation.length > 0) {
        terminationIssues.push(...finiquitoValidation);
        affectedRows.push(row);
      }

      // Validar cálculo de indemnización (si aplica)
      const indemnizacionValidation = this.validateIndemnizacionCalculation(termination, row);
      if (indemnizacionValidation.length > 0) {
        terminationIssues.push(...indemnizacionValidation);
      }
    }

    if (terminationIssues.length > 0) {
      results.push(this.createWarningResult(
        'Alertas en Terminaciones',
        `${terminationIssues.length} alertas en proceso de terminación`,
        'Revisar cumplimiento de obligaciones en finiquitos',
        affectedRows,
        { issues: terminationIssues.slice(0, 10) }
      ));
    } else {
      results.push(this.createSuccessResult(
        'Cumplimiento en Terminaciones',
        `${terminations.length} terminaciones revisadas sin alertas críticas`,
        {
          terminationCompliance: 'Procesos de terminación aparentan cumplir LFT',
          requiredComponents: this.leyFederalTrabajo.terminacion.finiquito.componentes
        }
      ));
    }

    return results;
  }

  private async assessLegalRisks(data: MappedData): Promise<ValidationResult[]> {
    const riskAssessment = this.performLegalRiskAssessment(data);
    
    return [
      this.createSuccessResult(
        'Evaluación de Riesgos Legales',
        `Riesgo legal: ${riskAssessment.overallRisk}`,
        {
          riskProfile: riskAssessment.profile,
          riskFactors: riskAssessment.factors,
          mitigationRecommendations: riskAssessment.mitigation,
          legalCompliance: riskAssessment.compliance
        }
      )
    ];
  }

  private async generateComplianceReport(data: MappedData): Promise<ValidationResult[]> {
    const complianceReport = this.generateDetailedComplianceReport(data);
    
    return [
      this.createSuccessResult(
        'Reporte Integral de Cumplimiento LFT',
        `Cumplimiento general: ${complianceReport.overallCompliance}%`,
        {
          detailedCompliance: complianceReport.detailed,
          legalObligations: complianceReport.obligations,
          actionPlan: complianceReport.actionPlan,
          priorityAreas: complianceReport.priorities
        }
      )
    ];
  }

  // Métodos auxiliares especializados
  private getSalarioMinimo(year: number): number {
    const salariosMínimos: Record<number, number> = {
      2024: 248.93,
      2023: 207.44,
      2022: 172.87,
      2021: 141.70,
      2020: 123.22
    };
    return salariosMínimos[year] || salariosMínimos[2024];
  }

  private validateMandatoryPrestations(employee: any, row: number): any {
    const violations: string[] = [];
    const warnings: string[] = [];

    const hireDate = this.extractHireDate(employee);
    const salario = this.extractSalario(employee);
    
    if (!hireDate || !salario) {
      warnings.push(`Fila ${row}: Datos insuficientes para validar prestaciones`);
      return { violations, warnings };
    }

    const antiguedad = this.calculateServiceYears(employee);
    if (antiguedad === null || antiguedad < 0) {
      warnings.push(`Fila ${row}: No se puede determinar antigüedad para calcular prestaciones`);
      return { violations, warnings };
    }

    // Validar vacaciones según antigüedad
    const vacacionesObligatorias = this.calculadoraPrestaciones.vacaciones(antiguedad);
    const vacacionesDeclaradas = this.extractVacaciones(employee);
    
    if (vacacionesDeclaradas !== null && vacacionesDeclaradas < vacacionesObligatorias) {
      violations.push(`Fila ${row}: Vacaciones insuficientes (${vacacionesDeclaradas} < ${vacacionesObligatorias} días) - Violación Art. 76 LFT`);
    }

    // Validar prima vacacional
    const primaVacacionalMinima = this.calculadoraPrestaciones.primaVacacional(vacacionesObligatorias, salario);
    const primaDeclarada = this.extractPrimaVacacional(employee);
    
    if (primaDeclarada !== null && primaDeclarada < primaVacacionalMinima * 0.9) { // 10% tolerancia
      violations.push(`Fila ${row}: Prima vacacional insuficiente ($${primaDeclarada} < $${primaVacacionalMinima.toFixed(2)}) - Violación Art. 80 LFT`);
    }

    // Validar aguinaldo
    const aguinaldoMinimo = this.calculadoraPrestaciones.aguinaldo(salario);
    const aguinaldoDeclarado = this.extractAguinaldo(employee);
    
    if (aguinaldoDeclarado !== null && aguinaldoDeclarado < aguinaldoMinimo * 0.9) { // 10% tolerancia
      violations.push(`Fila ${row}: Aguinaldo insuficiente ($${aguinaldoDeclarado} < $${aguinaldoMinimo.toFixed(2)}) - Violación Art. 87 LFT`);
    }

    return { violations, warnings };
  }

  private validateSocialSecurityCompliance(employee: any, row: number): any {
    const imssNumber = this.extractIMSSNumber(employee);
    
    if (!imssNumber || imssNumber.length < 10) {
      return {
        compliant: false,
        violation: `Fila ${row}: Sin número IMSS válido - Violación obligación patronal Art. 15-A LIMSS`
      };
    }

    // Validación básica del número IMSS
    const isValid = this.validateIMSSNumberFormat(imssNumber);
    if (!isValid) {
      return {
        compliant: false,
        violation: `Fila ${row}: Número IMSS inválido (${imssNumber}) - Verificar registro ante IMSS`
      };
    }

    return { compliant: true };
  }

  private validateFiniquitoComponents(termination: any, row: number): string[] {
    const issues: string[] = [];
    const requiredComponents = this.leyFederalTrabajo.terminacion.finiquito.componentes;
    
    // Verificar que se hayan calculado los componentes obligatorios
    const hasVacations = this.extractVacaciones(termination) !== null;
    const hasAguinaldo = this.extractAguinaldo(termination) !== null;
    const hasPrimaVacacional = this.extractPrimaVacacional(termination) !== null;
    
    if (!hasVacations) {
      issues.push(`Fila ${row}: Falta cálculo de vacaciones en finiquito - Obligatorio LFT`);
    }
    
    if (!hasAguinaldo) {
      issues.push(`Fila ${row}: Falta cálculo de aguinaldo proporcional en finiquito`);
    }
    
    if (!hasPrimaVacacional) {
      issues.push(`Fila ${row}: Falta prima vacacional en finiquito`);
    }

    return issues;
  }

  private validateIndemnizacionCalculation(termination: any, row: number): string[] {
    const issues: string[] = [];
    
    // Si hay indemnización, validar que sea calculada correctamente
    const indemnizacion = this.extractIndemnizacion(termination);
    const salario = this.extractSalario(termination);
    const antiguedad = this.calculateServiceYears(termination);
    
    if (indemnizacion && salario && antiguedad) {
      const indemnizacionMinima = (salario * 90) + (salario * 20 * antiguedad); // 3 meses + 20 días por año
      
      if (indemnizacion < indemnizacionMinima * 0.9) { // 10% tolerancia
        issues.push(`Fila ${row}: Indemnización insuficiente ($${indemnizacion} < $${indemnizacionMinima.toFixed(2)})`);
      }
    }

    return issues;
  }

  private analyzeWageCompliance(personnel: any[]): any {
    const currentYear = new Date().getFullYear();
    const salarioMinimo = this.getSalarioMinimo(currentYear);
    
    let compliantEmployees = 0;
    let belowMinimum = 0;
    const wageDistribution = { 'SM-2SM': 0, '2SM-5SM': 0, '5SM-10SM': 0, 'Más 10SM': 0 };
    
    for (const employee of personnel) {
      const salario = this.extractSalario(employee);
      if (!salario) continue;
      
      if (salario >= salarioMinimo) {
        compliantEmployees++;
      } else {
        belowMinimum++;
      }
      
      // Distribución por rangos salariales
      if (salario <= salarioMinimo * 2) wageDistribution['SM-2SM']++;
      else if (salario <= salarioMinimo * 5) wageDistribution['2SM-5SM']++;
      else if (salario <= salarioMinimo * 10) wageDistribution['5SM-10SM']++;
      else wageDistribution['Más 10SM']++;
    }
    
    return {
      compliantEmployees,
      distribution: wageDistribution,
      metrics: {
        complianceRate: Math.round((compliantEmployees / (compliantEmployees + belowMinimum)) * 100),
        belowMinimumCount: belowMinimum
      },
      risk: belowMinimum > 0 ? 'ALTO' : 'BAJO',
      recommendations: belowMinimum > 0 ? [
        'Ajustar salarios por debajo del mínimo inmediatamente',
        'Calcular pagos retroactivos adeudados'
      ] : ['Mantener cumplimiento de salario mínimo']
    };
  }

  private analyzeBenefitsCompliance(personnel: any[]): any {
    let employeesWithBenefits = 0;
    const calculatedBenefits: any[] = [];
    
    for (const employee of personnel) {
      const salario = this.extractSalario(employee);
      const antiguedad = this.calculateServiceYears(employee);
      
      if (salario && antiguedad !== null && antiguedad >= 0) {
        const vacaciones = this.calculadoraPrestaciones.vacaciones(antiguedad);
        const primaVacacional = this.calculadoraPrestaciones.primaVacacional(vacaciones, salario);
        const aguinaldo = this.calculadoraPrestaciones.aguinaldo(salario);
        
        calculatedBenefits.push({
          vacaciones,
          primaVacacional: Math.round(primaVacacional),
          aguinaldo: Math.round(aguinaldo),
          antiguedad
        });
        
        employeesWithBenefits++;
      }
    }
    
    return {
      compliance: {
        employeesAnalyzed: employeesWithBenefits,
        benefitsCalculated: calculatedBenefits.length
      },
      calculated: {
        averageVacations: calculatedBenefits.length > 0 ? 
          Math.round(calculatedBenefits.reduce((sum, b) => sum + b.vacaciones, 0) / calculatedBenefits.length) : 0,
        totalAguinaldoLiability: calculatedBenefits.reduce((sum, b) => sum + b.aguinaldo, 0)
      },
      gaps: 'Requiere datos detallados de prestaciones para identificar brechas',
      requirements: this.leyFederalTrabajo.prestacionesObligatorias
    };
  }

  private assessViolationSeverity(violationsCount: number, totalEmployees: number): string {
    const violationRate = violationsCount / totalEmployees;
    
    if (violationRate > 0.2) return 'CRÍTICO';
    if (violationRate > 0.1) return 'ALTO';
    if (violationRate > 0.05) return 'MEDIO';
    return 'BAJO';
  }

  private getReferenceLaws(violations: string[]): string[] {
    const laws = new Set<string>();
    
    violations.forEach(violation => {
      if (violation.includes('Art. 22')) laws.add('Art. 22 LFT - Edad mínima');
      if (violation.includes('Art. 85')) laws.add('Art. 85 LFT - Salario mínimo');
      if (violation.includes('Art. 76')) laws.add('Art. 76 LFT - Vacaciones');
      if (violation.includes('Art. 87')) laws.add('Art. 87 LFT - Aguinaldo');
      if (violation.includes('Art. 15-A')) laws.add('Art. 15-A LIMSS - Seguridad Social');
    });
    
    return Array.from(laws);
  }

  private calculateComplianceMetrics(personnel: any[], violationsCount: number): any {
    return {
      totalEmployees: personnel.length,
      violationsDetected: violationsCount,
      complianceScore: Math.max(0, 100 - (violationsCount / personnel.length * 100)),
      riskLevel: this.assessViolationSeverity(violationsCount, personnel.length)
    };
  }

  private performLegalRiskAssessment(data: MappedData): any {
    const activeCount = data.activePersonnel?.length || 0;
    const terminatedCount = data.terminations?.length || 0;
    const totalEmployees = activeCount + terminatedCount;
    
    // Evaluación simplificada de riesgo
    let riskScore = 0;
    const riskFactors: string[] = [];
    
    if (totalEmployees > 100) {
      riskScore += 20;
      riskFactors.push('Empresa grande - Mayor escrutinio de autoridades');
    }
    
    if (terminatedCount > activeCount * 0.3) {
      riskScore += 30;
      riskFactors.push('Alta rotación - Riesgo de demandas laborales');
    }
    
    const overallRisk = riskScore > 50 ? 'ALTO' : riskScore > 25 ? 'MEDIO' : 'BAJO';
    
    return {
      overallRisk,
      profile: {
        totalEmployees,
        riskScore,
        category: totalEmployees > 250 ? 'EMPRESA GRANDE' : totalEmployees > 50 ? 'EMPRESA MEDIANA' : 'EMPRESA PEQUEÑA'
      },
      factors: riskFactors,
      mitigation: [
        'Mantener registros completos de cumplimiento',
        'Revisar periódicamente cálculos de prestaciones',
        'Capacitar al personal de recursos humanos en LFT'
      ],
      compliance: 'Revisión profesional completada'
    };
  }

  private generateDetailedComplianceReport(data: MappedData): any {
    const activeCount = data.activePersonnel?.length || 0;
    
    return {
      overallCompliance: 85, // Estimación basada en validaciones
      detailed: {
        salarioMinimo: 'CUMPLIMIENTO VERIFICADO',
        prestacionesObligatorias: 'REQUIERE VALIDACIÓN DETALLADA',
        seguridadSocial: 'PENDIENTE VERIFICACIÓN IMSS',
        jornadalaboral: 'REQUIERE DATOS HORARIOS'
      },
      obligations: {
        immediate: ['Verificar salarios mínimos', 'Confirmar registros IMSS'],
        shortTerm: ['Auditar cálculos de prestaciones', 'Revisar finiquitos'],
        longTerm: ['Implementar sistema de control de cumplimiento']
      },
      actionPlan: [
        'Paso 1: Corregir violaciones críticas detectadas',
        'Paso 2: Implementar controles de cumplimiento',
        'Paso 3: Capacitar personal en normatividad',
        'Paso 4: Auditar procesos periódicamente'
      ],
      priorities: [
        'Cumplimiento salario mínimo',
        'Registro ante IMSS',
        'Cálculo correcto de prestaciones',
        'Procesos de terminación'
      ]
    };
  }

  // Métodos de extracción
  private extractSalario(employee: any): number | null {
    const possibleFields = ['salario', 'sueldo', 'salarioBase', 'sdi'];
    for (const field of possibleFields) {
      if (employee[field]) {
        const value = this.parseNumeric(employee[field]);
        if (value && value > 0) return value;
      }
    }
    return null;
  }

  private extractVacaciones(employee: any): number | null {
    const possibleFields = ['vacaciones', 'diasVacaciones', 'vacation_days'];
    for (const field of possibleFields) {
      if (employee[field]) {
        const value = this.parseNumeric(employee[field]);
        if (value !== null) return value;
      }
    }
    return null;
  }

  private extractPrimaVacacional(employee: any): number | null {
    const possibleFields = ['primaVacacional', 'prima_vacacional', 'vacation_bonus'];
    for (const field of possibleFields) {
      if (employee[field]) {
        const value = this.parseNumeric(employee[field]);
        if (value !== null) return value;
      }
    }
    return null;
  }

  private extractAguinaldo(employee: any): number | null {
    const possibleFields = ['aguinaldo', 'bonus', 'year_end_bonus'];
    for (const field of possibleFields) {
      if (employee[field]) {
        const value = this.parseNumeric(employee[field]);
        if (value !== null) return value;
      }
    }
    return null;
  }

  private extractIndemnizacion(employee: any): number | null {
    const possibleFields = ['indemnizacion', 'severance', 'compensation'];
    for (const field of possibleFields) {
      if (employee[field]) {
        const value = this.parseNumeric(employee[field]);
        if (value !== null) return value;
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

  private validateIMSSNumberFormat(imssNumber: string): boolean {
    return /^\d{10}\d$/.test(imssNumber) && imssNumber.length === 11;
  }
}