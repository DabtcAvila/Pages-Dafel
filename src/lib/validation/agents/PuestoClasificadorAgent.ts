import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class PuestoClasificadorAgent extends BaseValidationAgent {
  private readonly categoriasLaborales = {
    'DIRECTIVO': {
      keywords: ['DIRECTOR', 'GERENTE', 'PRESIDENTE', 'CEO', 'VP', 'VICEPRESIDENTE'],
      salaryRange: { min: 3000, max: 15000 },
      riskLevel: 'HIGH',
      description: 'Personal directivo y alta gerencia'
    },
    'GERENCIAL': {
      keywords: ['GERENTE', 'MANAGER', 'COORDINADOR', 'JEFE', 'SUPERVISOR'],
      salaryRange: { min: 1500, max: 8000 },
      riskLevel: 'MEDIUM',
      description: 'Mandos medios y supervisión'
    },
    'PROFESIONAL': {
      keywords: ['INGENIERO', 'CONTADOR', 'ANALISTA', 'ESPECIALISTA', 'CONSULTOR', 'ABOGADO'],
      salaryRange: { min: 800, max: 5000 },
      riskLevel: 'MEDIUM',
      description: 'Personal técnico profesional'
    },
    'TÉCNICO': {
      keywords: ['TÉCNICO', 'OPERADOR', 'MECÁNICO', 'ELECTRICISTA', 'SOLDADOR'],
      salaryRange: { min: 400, max: 2500 },
      riskLevel: 'LOW',
      description: 'Personal técnico especializado'
    },
    'ADMINISTRATIVO': {
      keywords: ['AUXILIAR', 'SECRETARIA', 'ASISTENTE', 'RECEPCIONISTA', 'CAPTURISTA'],
      salaryRange: { min: 250, max: 1500 },
      riskLevel: 'LOW',
      description: 'Personal administrativo y apoyo'
    },
    'OPERATIVO': {
      keywords: ['OBRERO', 'OPERARIO', 'ALMACENISTA', 'CHOFER', 'VIGILANTE', 'CONSERJE'],
      salaryRange: { min: 200, max: 1000 },
      riskLevel: 'LOW',
      description: 'Personal operativo y servicios'
    },
    'VENTAS': {
      keywords: ['VENDEDOR', 'PROMOTOR', 'EJECUTIVO DE VENTAS', 'REPRESENTANTE'],
      salaryRange: { min: 300, max: 5000 },
      riskLevel: 'HIGH',
      description: 'Personal de ventas (salario variable)'
    }
  };

  private readonly nivelесJerarquicos = {
    'C_LEVEL': { level: 1, keywords: ['CEO', 'CFO', 'CTO', 'PRESIDENTE', 'DIRECTOR GENERAL'] },
    'DIRECTOR': { level: 2, keywords: ['DIRECTOR', 'VP', 'VICEPRESIDENTE'] },
    'GERENTE': { level: 3, keywords: ['GERENTE', 'MANAGER'] },
    'JEFE': { level: 4, keywords: ['JEFE', 'COORDINADOR', 'SUPERVISOR'] },
    'ESPECIALISTA': { level: 5, keywords: ['ESPECIALISTA', 'SENIOR', 'LEAD'] },
    'EJECUTIVO': { level: 6, keywords: ['EJECUTIVO', 'ANALISTA'] },
    'AUXILIAR': { level: 7, keywords: ['AUXILIAR', 'JUNIOR', 'ASISTENTE'] },
    'OPERATIVO': { level: 8, keywords: ['OPERARIO', 'TÉCNICO', 'OBRERO'] }
  };

  private readonly riesgosPorPuesto = {
    'ALTA_ROTACIÓN': ['VENDEDOR', 'PROMOTOR', 'AUXILIAR', 'RECEPCIONISTA'],
    'CONOCIMIENTO_CRÍTICO': ['DIRECTOR', 'GERENTE', 'ESPECIALISTA', 'INGENIERO'],
    'DIFÍCIL_REEMPLAZO': ['CEO', 'CTO', 'DIRECTOR', 'ESPECIALISTA'],
    'COMPENSACIÓN_VARIABLE': ['VENDEDOR', 'GERENTE', 'DIRECTOR', 'EJECUTIVO'],
    'ALTO_IMPACTO': ['DIRECTOR', 'GERENTE', 'CEO', 'CFO']
  };

  private readonly inconsistenciasComunes = {
    'TÍTULO_VS_SALARIO': 'Puesto no corresponde con rango salarial',
    'JERARQUÍA_INVERTIDA': 'Subordinado gana más que supervisor',
    'CLASIFICACIÓN_AMBIGUA': 'Título de puesto poco claro',
    'PUESTO_DUPLICADO': 'Múltiples personas con mismo puesto',
    'SALARIO_ATÍPICO': 'Salario fuera del rango para el puesto'
  };

  constructor() {
    super({
      name: 'Clasificador Inteligente de Puestos',
      description: 'Análisis avanzado de puestos con clasificación automática y detección de inconsistencias',
      priority: 7,
      dependencies: ['SalarioBaseAgent', 'SalarioIntegradoAgent'],
      timeout: 25000
    });
  }

  async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      if (data.activePersonnel && data.activePersonnel.length > 0) {
        const positionValidation = await this.validatePositions(data.activePersonnel);
        results.push(...positionValidation);

        const classificationAnalysis = await this.performClassificationAnalysis(data.activePersonnel);
        results.push(...classificationAnalysis);

        const hierarchyAnalysis = await this.analyzeHierarchy(data.activePersonnel);
        results.push(...hierarchyAnalysis);

        const compensationAnalysis = await this.analyzeCompensationConsistency(data.activePersonnel);
        results.push(...compensationAnalysis);
      }

      if (data.terminations && data.terminations.length > 0) {
        const turnoverAnalysis = await this.analyzeTurnoverByPosition(data.terminations);
        results.push(...turnoverAnalysis);
      }

      const organizationalAnalysis = await this.performOrganizationalAnalysis(data);
      results.push(...organizationalAnalysis);

    } catch (error) {
      results.push(this.createErrorResult(
        'Análisis de Puestos',
        `Error en clasificación de puestos: ${error.message}`,
        'Revisar nombres de puestos y estructura organizacional'
      ));
    }

    return results;
  }

  private async validatePositions(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const issues: string[] = [];
    const warnings: string[] = [];
    const affectedRows: number[] = [];

    let validPositions = 0;
    let missingPositions = 0;
    let ambiguousPositions = 0;
    let inconsistentClassifications = 0;

    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const row = i + 2;

      const puesto = this.extractPosition(employee);
      if (!puesto) {
        issues.push(`Fila ${row}: Puesto faltante`);
        affectedRows.push(row);
        missingPositions++;
        continue;
      }

      const cleanPosition = this.cleanPositionTitle(puesto);

      // Validación de formato
      const formatValidation = this.validatePositionFormat(cleanPosition, row);
      if (!formatValidation.isValid) {
        issues.push(formatValidation.error!);
        affectedRows.push(row);
        continue;
      }

      validPositions++;

      // Clasificación automática
      const classification = this.classifyPosition(cleanPosition);
      if (classification.confidence < 0.7) {
        warnings.push(`Fila ${row}: Puesto ambiguo "${cleanPosition}" - Clasificación: ${classification.category}`);
        ambiguousPositions++;
      }

      // Validación de consistencia salarial
      const salaryValidation = this.validateSalaryConsistency(employee, classification, row);
      if (!salaryValidation.isConsistent) {
        warnings.push(salaryValidation.warning!);
        inconsistentClassifications++;
      }

      // Detección de duplicados exactos
      const duplicateCheck = this.checkForDuplicates(cleanPosition, personnel, i);
      if (duplicateCheck.count > 1) {
        warnings.push(`Fila ${row}: ${duplicateCheck.count} personas con puesto "${cleanPosition}" - Verificar si es normal`);
      }
    }

    // Reportar problemas críticos
    if (issues.length > 0) {
      results.push(this.createErrorResult(
        'Puestos Inválidos',
        `${issues.length} puestos con problemas críticos`,
        'Revisar puestos faltantes o con formato inválido',
        affectedRows,
        {
          criticalIssues: issues.slice(0, 10),
          statistics: {
            missingPositions,
            totalErrors: issues.length
          }
        }
      ));
    }

    // Reportar advertencias
    if (warnings.length > 0) {
      results.push(this.createWarningResult(
        'Inconsistencias en Puestos',
        `${warnings.length} inconsistencias detectadas en clasificación`,
        'Revisar puestos ambiguos y consistencia salarial',
        affectedRows.filter((_, index) => index < warnings.length),
        {
          warnings: warnings.slice(0, 10),
          statistics: {
            ambiguousPositions,
            inconsistentClassifications,
            totalWarnings: warnings.length
          }
        }
      ));
    }

    // Reporte exitoso
    if (validPositions > 0) {
      const classificationRate = Math.round(((validPositions - ambiguousPositions) / validPositions) * 100);
      
      results.push(this.createSuccessResult(
        'Validación de Puestos',
        `${validPositions} puestos validados con ${classificationRate}% de clasificación clara`,
        {
          validPositions,
          classificationSuccess: classificationRate,
          positionMetrics: {
            uniquePositions: this.countUniquePositions(personnel),
            averageTeamSize: this.calculateAverageTeamSize(personnel),
            organizationalComplexity: this.assessOrganizationalComplexity(personnel)
          }
        }
      ));
    }

    return results;
  }

  private async performClassificationAnalysis(personnel: any[]): Promise<ValidationResult[]> {
    const classifications = this.analyzePositionClassifications(personnel);
    
    return [
      this.createSuccessResult(
        'Análisis de Clasificación de Puestos',
        `${personnel.length} puestos clasificados en ${Object.keys(classifications.distribution).length} categorías`,
        {
          categoryDistribution: classifications.distribution,
          hierarchicalLevels: classifications.hierarchicalAnalysis,
          riskProfile: classifications.riskProfile,
          classificationInsights: classifications.insights
        }
      )
    ];
  }

  private async analyzeHierarchy(personnel: any[]): Promise<ValidationResult[]> {
    const hierarchy = this.analyzeOrganizationalHierarchy(personnel);
    const inconsistencies = this.detectHierarchicalInconsistencies(personnel);
    
    return [
      this.createSuccessResult(
        'Análisis de Jerarquía Organizacional',
        `Estructura de ${hierarchy.levels} niveles jerárquicos identificada`,
        {
          hierarchicalStructure: hierarchy,
          inconsistencies: inconsistencies,
          organizationalHealth: this.assessOrganizationalHealth(hierarchy, inconsistencies)
        }
      )
    ];
  }

  private async analyzeCompensationConsistency(personnel: any[]): Promise<ValidationResult[]> {
    const analysis = this.analyzeCompensationByPosition(personnel);
    
    return [
      this.createSuccessResult(
        'Consistencia de Compensación por Puesto',
        `Análisis de equidad salarial completado`,
        {
          salaryAnalysisByCategory: analysis.byCategory,
          equityAssessment: analysis.equity,
          outlierPositions: analysis.outliers,
          recommendations: analysis.recommendations
        }
      )
    ];
  }

  private async analyzeTurnoverByPosition(terminations: any[]): Promise<ValidationResult[]> {
    const turnoverAnalysis = this.calculateTurnoverByPosition(terminations);
    
    return [
      this.createSuccessResult(
        'Análisis de Rotación por Puesto',
        `${terminations.length} terminaciones analizadas por posición`,
        {
          turnoverByPosition: turnoverAnalysis.byPosition,
          riskPositions: turnoverAnalysis.highRisk,
          patterns: turnoverAnalysis.patterns
        }
      )
    ];
  }

  private async performOrganizationalAnalysis(data: MappedData): Promise<ValidationResult[]> {
    if (!data.activePersonnel) return [];
    
    const orgAnalysis = this.performOrganizationalStructureAnalysis(data.activePersonnel);
    
    return [
      this.createSuccessResult(
        'Análisis Organizacional',
        `Estructura organizacional de ${data.activePersonnel.length} empleados analizada`,
        {
          organizationalMetrics: orgAnalysis.metrics,
          structuralHealth: orgAnalysis.health,
          recommendations: orgAnalysis.recommendations
        }
      )
    ];
  }

  // Métodos de validación especializados
  private validatePositionFormat(position: string, row: number): { isValid: boolean; error?: string } {
    // Verificar longitud
    if (position.length < 2) {
      return { isValid: false, error: `Fila ${row}: Puesto demasiado corto: "${position}"` };
    }

    if (position.length > 100) {
      return { isValid: false, error: `Fila ${row}: Puesto excesivamente largo (${position.length} caracteres)` };
    }

    // Verificar caracteres válidos
    if (!/^[A-ZÁÉÍÓÚÑÜ0-9\s\-\(\)\/\&\.\,]+$/i.test(position)) {
      return { isValid: false, error: `Fila ${row}: Puesto contiene caracteres inválidos: "${position}"` };
    }

    // Verificar patrones sospechosos
    if (/^(XXX|AAA|TEST|PRUEBA|SIN|NO|NA|N\/A)$/i.test(position)) {
      return { isValid: false, error: `Fila ${row}: Puesto placeholder detectado: "${position}"` };
    }

    return { isValid: true };
  }

  private classifyPosition(position: string): any {
    const upperPosition = position.toUpperCase();
    let bestMatch = { category: 'INDEFINIDO', confidence: 0, matches: [] as string[] };

    for (const [category, info] of Object.entries(this.categoriasLaborales)) {
      let confidence = 0;
      const matches: string[] = [];

      for (const keyword of info.keywords) {
        if (upperPosition.includes(keyword)) {
          confidence += 1;
          matches.push(keyword);
        }
      }

      // Normalizar confianza por número de keywords
      const normalizedConfidence = confidence / info.keywords.length;

      if (normalizedConfidence > bestMatch.confidence) {
        bestMatch = {
          category,
          confidence: normalizedConfidence,
          matches
        };
      }
    }

    // Si no hay match claro, intentar clasificación por palabras clave adicionales
    if (bestMatch.confidence < 0.3) {
      bestMatch = this.performSecondaryClassification(upperPosition);
    }

    return bestMatch;
  }

  private validateSalaryConsistency(employee: any, classification: any, row: number): any {
    const salary = this.extractSalary(employee);
    if (!salary || classification.category === 'INDEFINIDO') {
      return { isConsistent: true };
    }

    const expectedRange = this.categoriasLaborales[classification.category as keyof typeof this.categoriasLaborales]?.salaryRange;
    if (!expectedRange) {
      return { isConsistent: true };
    }

    const isInRange = salary >= expectedRange.min && salary <= expectedRange.max * 1.5; // 50% tolerancia

    if (!isInRange) {
      const warning = salary < expectedRange.min 
        ? `Fila ${row}: Salario bajo para ${classification.category} ($${salary} < $${expectedRange.min})`
        : `Fila ${row}: Salario alto para ${classification.category} ($${salary} > $${expectedRange.max})`;
      
      return { isConsistent: false, warning };
    }

    return { isConsistent: true };
  }

  private analyzePositionClassifications(personnel: any[]): any {
    const distribution: Record<string, number> = {};
    const hierarchicalLevels: Record<string, number> = {};
    const riskProfiles: Record<string, number> = {};

    for (const employee of personnel) {
      const position = this.extractPosition(employee);
      if (!position) continue;

      const cleanPosition = this.cleanPositionTitle(position);
      const classification = this.classifyPosition(cleanPosition);
      const hierarchicalLevel = this.getHierarchicalLevel(cleanPosition);
      
      // Distribución por categoría
      distribution[classification.category] = (distribution[classification.category] || 0) + 1;
      
      // Distribución jerárquica
      hierarchicalLevels[hierarchicalLevel] = (hierarchicalLevels[hierarchicalLevel] || 0) + 1;
      
      // Perfil de riesgo
      const riskLevel = this.categoriasLaborales[classification.category as keyof typeof this.categoriasLaborales]?.riskLevel || 'UNKNOWN';
      riskProfiles[riskLevel] = (riskProfiles[riskLevel] || 0) + 1;
    }

    return {
      distribution,
      hierarchicalAnalysis: hierarchicalLevels,
      riskProfile: riskProfiles,
      insights: this.generateClassificationInsights(distribution, hierarchicalLevels, personnel.length)
    };
  }

  private analyzeOrganizationalHierarchy(personnel: any[]): any {
    const hierarchyCount: Record<string, number> = {};
    let totalLevels = 0;

    for (const employee of personnel) {
      const position = this.extractPosition(employee);
      if (!position) continue;

      const level = this.getHierarchicalLevel(this.cleanPositionTitle(position));
      hierarchyCount[level] = (hierarchyCount[level] || 0) + 1;
      
      const levelNum = this.nivelесJerarquicos[level as keyof typeof this.nivelесJerarquicos]?.level || 8;
      if (levelNum > totalLevels) totalLevels = levelNum;
    }

    return {
      levels: Object.keys(hierarchyCount).length,
      distribution: hierarchyCount,
      maxDepth: totalLevels,
      spanOfControl: this.calculateSpanOfControl(hierarchyCount)
    };
  }

  private detectHierarchicalInconsistencies(personnel: any[]): string[] {
    const inconsistencies: string[] = [];
    
    // Agrupar por salario para detectar inversiones jerárquicas
    const employeesByLevel = this.groupEmployeesByHierarchicalLevel(personnel);
    
    for (const [level, employees] of Object.entries(employeesByLevel)) {
      const levelSalaries = employees
        .map(emp => this.extractSalary(emp))
        .filter(salary => salary !== null) as number[];
      
      if (levelSalaries.length < 2) continue;
      
      const avgSalary = levelSalaries.reduce((a, b) => a + b, 0) / levelSalaries.length;
      
      // Comparar con niveles inferiores
      const lowerLevels = this.getLowerHierarchicalLevels(level);
      for (const lowerLevel of lowerLevels) {
        if (employeesByLevel[lowerLevel]) {
          const lowerSalaries = employeesByLevel[lowerLevel]
            .map(emp => this.extractSalary(emp))
            .filter(salary => salary !== null) as number[];
          
          if (lowerSalaries.length > 0) {
            const avgLowerSalary = lowerSalaries.reduce((a, b) => a + b, 0) / lowerSalaries.length;
            
            if (avgLowerSalary > avgSalary * 1.1) { // 10% tolerancia
              inconsistencies.push(`Inversión jerárquica: ${lowerLevel} gana más que ${level}`);
            }
          }
        }
      }
    }

    return inconsistencies.slice(0, 5); // Limitar a 5 inconsistencias principales
  }

  private analyzeCompensationByPosition(personnel: any[]): any {
    const salaryByPosition: Record<string, number[]> = {};
    const equityIssues: string[] = [];
    const outliers: any[] = [];

    // Agrupar salarios por posición
    for (const employee of personnel) {
      const position = this.extractPosition(employee);
      const salary = this.extractSalary(employee);
      
      if (!position || !salary) continue;
      
      const cleanPosition = this.cleanPositionTitle(position);
      if (!salaryByPosition[cleanPosition]) {
        salaryByPosition[cleanPosition] = [];
      }
      salaryByPosition[cleanPosition].push(salary);
    }

    // Analizar equidad por posición
    for (const [position, salaries] of Object.entries(salaryByPosition)) {
      if (salaries.length < 2) continue;
      
      const sorted = [...salaries].sort((a, b) => a - b);
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const median = sorted[Math.floor(sorted.length / 2)];
      
      // Detectar inequidad excesiva
      const range = max - min;
      const inequityRatio = range / median;
      
      if (inequityRatio > 0.5 && salaries.length > 2) { // 50% variación
        equityIssues.push(`${position}: Inequidad salarial (rango: $${range.toLocaleString()})`);
      }
      
      // Detectar outliers
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      const iqr = q3 - q1;
      
      const lowOutliers = salaries.filter(s => s < q1 - 1.5 * iqr);
      const highOutliers = salaries.filter(s => s > q3 + 1.5 * iqr);
      
      if (lowOutliers.length > 0 || highOutliers.length > 0) {
        outliers.push({
          position,
          lowOutliers: lowOutliers.length,
          highOutliers: highOutliers.length,
          median
        });
      }
    }

    return {
      byCategory: this.summarizeByCategory(salaryByPosition),
      equity: {
        issues: equityIssues.slice(0, 8),
        totalIssues: equityIssues.length
      },
      outliers: outliers.slice(0, 5),
      recommendations: this.generateCompensationRecommendations(equityIssues.length, outliers.length)
    };
  }

  private calculateTurnoverByPosition(terminations: any[]): any {
    const turnoverByPosition: Record<string, number> = {};
    
    for (const termination of terminations) {
      const position = this.extractPosition(termination);
      if (!position) continue;
      
      const cleanPosition = this.cleanPositionTitle(position);
      turnoverByPosition[cleanPosition] = (turnoverByPosition[cleanPosition] || 0) + 1;
    }

    const sortedPositions = Object.entries(turnoverByPosition)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    return {
      byPosition: Object.fromEntries(sortedPositions),
      highRisk: sortedPositions.filter(([, count]) => count >= 3).map(([position]) => position),
      patterns: this.identifyTurnoverPatterns(turnoverByPosition)
    };
  }

  private performOrganizationalStructureAnalysis(personnel: any[]): any {
    const totalEmployees = personnel.length;
    const uniquePositions = this.countUniquePositions(personnel);
    const hierarchicalLevels = this.analyzeOrganizationalHierarchy(personnel);
    
    const metrics = {
      totalEmployees,
      uniquePositions,
      positionDiversityRatio: Math.round((uniquePositions / totalEmployees) * 100) / 100,
      hierarchicalDepth: hierarchicalLevels.levels,
      averageSpanOfControl: hierarchicalLevels.spanOfControl
    };

    const health = this.assessStructuralHealth(metrics);
    const recommendations = this.generateStructuralRecommendations(metrics, health);

    return {
      metrics,
      health,
      recommendations
    };
  }

  // Métodos auxiliares
  private extractPosition(employee: any): string | null {
    const possibleFields = [
      'puesto', 'position', 'cargo', 'job_title', 'titulo',
      'PUESTO', 'POSITION', 'CARGO', 'JOB_TITLE'
    ];
    
    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string') {
        return employee[field].trim();
      }
    }
    return null;
  }

  private extractSalary(employee: any): number | null {
    const possibleFields = [
      'salario', 'sueldo', 'salary', 'sdi', 'salarioBase',
      'SALARIO', 'SUELDO', 'SALARY', 'SDI'
    ];
    
    for (const field of possibleFields) {
      if (employee[field]) {
        const value = this.parseNumeric(employee[field]);
        if (value && value > 0) return value;
      }
    }
    return null;
  }

  private cleanPositionTitle(position: string): string {
    return position
      .toUpperCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-]/g, '')
      .trim();
  }

  private performSecondaryClassification(position: string): any {
    // Clasificación secundaria para puestos no identificados
    const secondaryKeywords = {
      'ADMINISTRATIVO': ['ADMIN', 'OFICINA', 'SECRETAR', 'RECEP'],
      'TÉCNICO': ['TEC', 'MANT', 'REP', 'INST'],
      'OPERATIVO': ['OPE', 'PROD', 'FABRIC', 'ALMA'],
      'PROFESIONAL': ['ING', 'LIC', 'PROF', 'ESP']
    };

    for (const [category, keywords] of Object.entries(secondaryKeywords)) {
      for (const keyword of keywords) {
        if (position.includes(keyword)) {
          return { category, confidence: 0.5, matches: [keyword] };
        }
      }
    }

    return { category: 'INDEFINIDO', confidence: 0, matches: [] };
  }

  private getHierarchicalLevel(position: string): string {
    for (const [level, info] of Object.entries(this.nivelесJerarquicos)) {
      for (const keyword of info.keywords) {
        if (position.includes(keyword)) {
          return level;
        }
      }
    }
    return 'OPERATIVO';
  }

  private checkForDuplicates(position: string, personnel: any[], currentIndex: number): any {
    let count = 0;
    for (let i = 0; i < personnel.length; i++) {
      const otherPosition = this.extractPosition(personnel[i]);
      if (otherPosition && this.cleanPositionTitle(otherPosition) === position) {
        count++;
      }
    }
    return { count };
  }

  private countUniquePositions(personnel: any[]): number {
    const uniquePositions = new Set();
    for (const employee of personnel) {
      const position = this.extractPosition(employee);
      if (position) {
        uniquePositions.add(this.cleanPositionTitle(position));
      }
    }
    return uniquePositions.size;
  }

  private calculateAverageTeamSize(personnel: any[]): number {
    const uniquePositions = this.countUniquePositions(personnel);
    return uniquePositions > 0 ? Math.round(personnel.length / uniquePositions * 10) / 10 : 0;
  }

  private assessOrganizationalComplexity(personnel: any[]): string {
    const ratio = this.countUniquePositions(personnel) / personnel.length;
    
    if (ratio > 0.8) return 'ALTA';
    if (ratio > 0.4) return 'MEDIA';
    return 'BAJA';
  }

  private generateClassificationInsights(distribution: any, hierarchical: any, total: number): string[] {
    const insights = [];
    
    const topCategory = Object.entries(distribution)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0];
    
    if (topCategory) {
      insights.push(`Categoría predominante: ${topCategory[0]} (${Math.round((topCategory[1] as number) / total * 100)}%)`);
    }
    
    const managementCount = (hierarchical['DIRECTOR'] || 0) + (hierarchical['GERENTE'] || 0) + (hierarchical['JEFE'] || 0);
    const managementRatio = managementCount / total;
    
    if (managementRatio > 0.2) {
      insights.push('Alta concentración de mandos medios');
    } else if (managementRatio < 0.05) {
      insights.push('Estructura organizacional muy plana');
    }
    
    return insights;
  }

  private calculateSpanOfControl(hierarchyCount: Record<string, number>): number {
    const management = (hierarchyCount['DIRECTOR'] || 0) + (hierarchyCount['GERENTE'] || 0) + (hierarchyCount['JEFE'] || 0);
    const total = Object.values(hierarchyCount).reduce((sum, count) => sum + count, 0);
    
    return management > 0 ? Math.round((total - management) / management * 10) / 10 : total;
  }

  private groupEmployeesByHierarchicalLevel(personnel: any[]): Record<string, any[]> {
    const groups: Record<string, any[]> = {};
    
    for (const employee of personnel) {
      const position = this.extractPosition(employee);
      if (!position) continue;
      
      const level = this.getHierarchicalLevel(this.cleanPositionTitle(position));
      if (!groups[level]) groups[level] = [];
      groups[level].push(employee);
    }
    
    return groups;
  }

  private getLowerHierarchicalLevels(currentLevel: string): string[] {
    const currentLevelNum = this.nivelесJerarquicos[currentLevel as keyof typeof this.nivelесJerarquicos]?.level || 8;
    
    return Object.entries(this.nivelесJerarquicos)
      .filter(([, info]) => info.level > currentLevelNum)
      .map(([level]) => level);
  }

  private assessOrganizationalHealth(hierarchy: any, inconsistencies: string[]): string {
    let healthScore = 100;
    
    // Penalizar por inconsistencias
    healthScore -= inconsistencies.length * 10;
    
    // Penalizar estructura muy plana o muy profunda
    if (hierarchy.levels < 3) healthScore -= 15;
    if (hierarchy.levels > 8) healthScore -= 20;
    
    // Penalizar span of control extremo
    if (hierarchy.spanOfControl > 15) healthScore -= 15;
    if (hierarchy.spanOfControl < 3) healthScore -= 10;
    
    if (healthScore >= 80) return 'EXCELENTE';
    if (healthScore >= 60) return 'BUENO';
    if (healthScore >= 40) return 'REGULAR';
    return 'DEFICIENTE';
  }

  private summarizeByCategory(salaryByPosition: Record<string, number[]>): any {
    const categoryStats: Record<string, any> = {};
    
    for (const [position, salaries] of Object.entries(salaryByPosition)) {
      const classification = this.classifyPosition(position);
      const category = classification.category;
      
      if (!categoryStats[category]) {
        categoryStats[category] = { positions: 0, totalEmployees: 0, salaries: [] };
      }
      
      categoryStats[category].positions++;
      categoryStats[category].totalEmployees += salaries.length;
      categoryStats[category].salaries.push(...salaries);
    }
    
    // Calcular estadísticas por categoría
    for (const stats of Object.values(categoryStats)) {
      if (stats.salaries.length > 0) {
        stats.averageSalary = Math.round(stats.salaries.reduce((a: number, b: number) => a + b, 0) / stats.salaries.length);
        stats.salaryRange = {
          min: Math.min(...stats.salaries),
          max: Math.max(...stats.salaries)
        };
      }
    }
    
    return categoryStats;
  }

  private generateCompensationRecommendations(equityIssues: number, outliers: number): string[] {
    const recommendations = [];
    
    if (equityIssues > 0) {
      recommendations.push('Revisar rangos salariales por puesto para garantizar equidad');
    }
    
    if (outliers > 0) {
      recommendations.push('Investigar salarios atípicos que podrían indicar errores de clasificación');
    }
    
    recommendations.push('Establecer bandas salariales claras por categoría de puesto');
    
    return recommendations;
  }

  private identifyTurnoverPatterns(turnoverByPosition: Record<string, number>): string[] {
    const patterns = [];
    
    // Identificar puestos de alta rotación
    const highTurnover = Object.entries(turnoverByPosition)
      .filter(([, count]) => count >= 3)
      .map(([position]) => position);
    
    if (highTurnover.length > 0) {
      patterns.push(`Alta rotación en: ${highTurnover.slice(0, 3).join(', ')}`);
    }
    
    // Identificar categorías de riesgo
    const riskCategories = highTurnover
      .map(position => this.classifyPosition(position).category)
      .reduce((acc: Record<string, number>, category) => {
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});
    
    const topRiskCategory = Object.entries(riskCategories)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (topRiskCategory) {
      patterns.push(`Categoría más afectada: ${topRiskCategory[0]}`);
    }
    
    return patterns;
  }

  private assessStructuralHealth(metrics: any): any {
    const health = {
      diversityScore: metrics.positionDiversityRatio < 0.3 ? 'BAJO' : metrics.positionDiversityRatio > 0.7 ? 'ALTO' : 'MEDIO',
      spanScore: metrics.averageSpanOfControl < 5 ? 'ESTRECHO' : metrics.averageSpanOfControl > 12 ? 'AMPLIO' : 'ADECUADO',
      hierarchyScore: metrics.hierarchicalDepth < 4 ? 'PLANO' : metrics.hierarchicalDepth > 7 ? 'PROFUNDO' : 'BALANCEADO'
    };
    
    return health;
  }

  private generateStructuralRecommendations(metrics: any, health: any): string[] {
    const recommendations = [];
    
    if (health.diversityScore === 'ALTO') {
      recommendations.push('Considerar consolidación de puestos similares');
    }
    
    if (health.spanScore === 'AMPLIO') {
      recommendations.push('Evaluar necesidad de niveles gerenciales adicionales');
    }
    
    if (health.hierarchyScore === 'PROFUNDO') {
      recommendations.push('Considerar aplanar la estructura organizacional');
    }
    
    return recommendations;
  }
}