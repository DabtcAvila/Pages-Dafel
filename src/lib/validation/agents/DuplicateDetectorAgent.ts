import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class DuplicateDetectorAgent extends BaseValidationAgent {
  private readonly duplicateTypes = {
    EXACT: {
      description: 'Duplicados exactos (mismo valor en campo único)',
      severity: 'CRÍTICO',
      action: 'Eliminación inmediata'
    },
    NEAR: {
      description: 'Duplicados cercanos (similitud alta)',
      severity: 'ALTO',
      action: 'Revisión manual'
    },
    PARTIAL: {
      description: 'Duplicados parciales (algunos campos coinciden)',
      severity: 'MODERADO',
      action: 'Validación cruzada'
    },
    SUSPICIOUS: {
      description: 'Patrones sospechosos de duplicación',
      severity: 'BAJO',
      action: 'Monitoreo'
    }
  };

  private readonly uniqueFields = {
    LEGAL: {
      rfc: { priority: 'CRÍTICO', description: 'Registro Federal de Contribuyentes único' },
      curp: { priority: 'CRÍTICO', description: 'Clave Única de Registro Poblacional única' },
      imss: { priority: 'CRÍTICO', description: 'Número de Seguridad Social único' }
    },
    BUSINESS: {
      empleadoId: { priority: 'ALTO', description: 'ID interno del empleado único' },
      email: { priority: 'ALTO', description: 'Correo electrónico único por empleado' },
      numeroEmpleado: { priority: 'ALTO', description: 'Número de empleado único' }
    },
    OPERATIONAL: {
      telefono: { priority: 'MEDIO', description: 'Teléfono personal único' },
      cuenta_banco: { priority: 'MEDIO', description: 'Cuenta bancaria única' }
    }
  };

  private readonly similarityThresholds = {
    NOMBRE: { exact: 1.0, high: 0.95, medium: 0.85, low: 0.75 },
    DATOS_PERSONALES: { exact: 1.0, high: 0.90, medium: 0.80, low: 0.70 },
    DIRECCION: { exact: 1.0, high: 0.85, medium: 0.75, low: 0.65 },
    COMBINADO: { exact: 1.0, high: 0.92, medium: 0.82, low: 0.72 }
  };

  private readonly detectionMethods = {
    EXACT_MATCH: 'Coincidencia exacta de valores',
    FUZZY_MATCH: 'Coincidencia aproximada (Levenshtein)',
    PHONETIC_MATCH: 'Coincidencia fonética (Soundex)',
    PATTERN_MATCH: 'Coincidencia de patrones específicos',
    COMPOSITE_MATCH: 'Combinación de múltiples campos'
  };

  constructor() {
    super({
      name: 'Detector Avanzado de Duplicados',
      description: 'Detección multi-nivel de duplicados con análisis de similitud y patrones sospechosos',
      priority: 13,
      dependencies: ['RFCMasterValidator', 'CURPExpertAgent', 'IMSSValidatorAgent'],
      timeout: 35000
    });
  }

  async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      if (data.activePersonnel && data.activePersonnel.length > 0) {
        const exactDuplicates = await this.detectExactDuplicates(data.activePersonnel);
        results.push(...exactDuplicates);

        const nearDuplicates = await this.detectNearDuplicates(data.activePersonnel);
        results.push(...nearDuplicates);

        const partialDuplicates = await this.detectPartialDuplicates(data.activePersonnel);
        results.push(...partialDuplicates);

        const suspiciousPatterns = await this.detectSuspiciousPatterns(data.activePersonnel);
        results.push(...suspiciousPatterns);
      }

      if (data.terminations && data.terminations.length > 0) {
        const crossDatasetDuplicates = await this.detectCrossDatasetDuplicates(data);
        results.push(...crossDatasetDuplicates);
      }

      const dataIntegrityAssessment = await this.assessDataIntegrity(data);
      results.push(...dataIntegrityAssessment);

    } catch (error) {
      results.push(this.createErrorResult(
        'Detección de Duplicados',
        `Error en detección de duplicados: ${error.message}`,
        'Revisar estructura de datos y campos identificadores'
      ));
    }

    return results;
  }

  private async detectExactDuplicates(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const exactMatches = this.findExactMatches(personnel);

    if (exactMatches.critical.length > 0) {
      results.push(this.createErrorResult(
        'Duplicados Exactos Críticos',
        `${exactMatches.critical.length} duplicados exactos en campos únicos detectados`,
        'Eliminar duplicados inmediatamente - violación de integridad de datos',
        exactMatches.critical.flatMap(match => match.rows),
        {
          criticalDuplicates: exactMatches.critical,
          affectedFields: exactMatches.criticalFields,
          legalRisk: 'ALTO - Duplicados en identificadores oficiales',
          businessImpact: 'CRÍTICO - Integridad de datos comprometida'
        }
      ));
    }

    if (exactMatches.business.length > 0) {
      results.push(this.createWarningResult(
        'Duplicados Exactos en Campos de Negocio',
        `${exactMatches.business.length} duplicados en campos de negocio`,
        'Revisar y consolidar registros duplicados',
        exactMatches.business.flatMap(match => match.rows),
        {
          businessDuplicates: exactMatches.business,
          operationalImpact: exactMatches.operationalImpact
        }
      ));
    }

    if (exactMatches.critical.length === 0 && exactMatches.business.length === 0) {
      results.push(this.createSuccessResult(
        'Validación de Duplicados Exactos',
        'No se detectaron duplicados exactos en campos únicos',
        {
          validationScope: 'Campos legales y de negocio únicos',
          integrityStatus: 'ÍNTEGRO',
          employeesAnalyzed: personnel.length
        }
      ));
    }

    return results;
  }

  private async detectNearDuplicates(personnel: any[]): Promise<ValidationResult[]> {
    const nearMatches = this.findNearMatches(personnel);

    if (nearMatches.length > 0) {
      return [
        this.createWarningResult(
          'Posibles Duplicados (Similitud Alta)',
          `${nearMatches.length} pares de empleados con alta similitud detectados`,
          'Revisar manualmente para confirmar o descartar duplicación',
          nearMatches.flatMap(match => match.rows),
          {
            nearDuplicates: nearMatches.slice(0, 15),
            similarityAnalysis: {
              averageSimilarity: this.calculateAverageSimilarity(nearMatches),
              detectionMethod: 'Algoritmo de similitud multi-campo',
              confidenceLevel: 'ALTO'
            },
            reviewGuidelines: this.generateReviewGuidelines(nearMatches)
          }
        )
      ];
    }

    return [
      this.createSuccessResult(
        'Análisis de Duplicados Cercanos',
        'No se detectaron empleados con similitud sospechosa',
        {
          analysisMethod: 'Similitud fuzzy multi-campo',
          threshold: 'Configurado para alta precisión',
          falsePositiveRate: 'Minimizado'
        }
      )
    ];
  }

  private async detectPartialDuplicates(personnel: any[]): Promise<ValidationResult[]> {
    const partialMatches = this.findPartialMatches(personnel);

    if (partialMatches.length > 0) {
      return [
        this.createWarningResult(
          'Duplicados Parciales Detectados',
          `${partialMatches.length} conjuntos de empleados con coincidencias parciales`,
          'Validar si representan el mismo empleado con datos inconsistentes',
          partialMatches.flatMap(match => match.rows),
          {
            partialMatches: partialMatches.slice(0, 12),
            matchPatterns: this.analyzePartialMatchPatterns(partialMatches),
            consolidationOpportunities: this.identifyConsolidationOpportunities(partialMatches)
          }
        )
      ];
    }

    return [
      this.createSuccessResult(
        'Análisis de Duplicados Parciales',
        'No se detectaron coincidencias parciales sospechosas',
        {
          partialMatchAnalysis: 'Empleados únicos confirmados',
          dataConsistency: 'ALTA'
        }
      )
    ];
  }

  private async detectSuspiciousPatterns(personnel: any[]): Promise<ValidationResult[]> {
    const suspiciousPatterns = this.findSuspiciousPatterns(personnel);

    if (suspiciousPatterns.length > 0) {
      return [
        this.createWarningResult(
          'Patrones Sospechosos de Duplicación',
          `${suspiciousPatterns.length} patrones sospechosos detectados`,
          'Investigar posibles errores sistemáticos en captura de datos',
          [],
          {
            suspiciousPatterns: suspiciousPatterns.slice(0, 10),
            patternAnalysis: this.analyzeSuspiciousPatterns(suspiciousPatterns),
            preventionRecommendations: this.generatePreventionRecommendations(suspiciousPatterns)
          }
        )
      ];
    }

    return [
      this.createSuccessResult(
        'Análisis de Patrones Sospechosos',
        'No se detectaron patrones sistemáticos de duplicación',
        {
          patternHealth: 'SALUDABLE',
          dataEntryQuality: 'CONSISTENTE'
        }
      )
    ];
  }

  private async detectCrossDatasetDuplicates(data: MappedData): Promise<ValidationResult[]> {
    if (!data.activePersonnel || !data.terminations) {
      return [
        this.createSuccessResult(
          'Validación Cruzada de Datasets',
          'Dataset único disponible - sin duplicados cruzados posibles',
          { crossValidation: 'No aplicable' }
        )
      ];
    }

    const crossMatches = this.findCrossDatasetMatches(data.activePersonnel, data.terminations);

    if (crossMatches.length > 0) {
      return [
        this.createErrorResult(
          'Empleados Duplicados Entre Activos y Terminados',
          `${crossMatches.length} empleados aparecen en ambos datasets`,
          'Corregir estado de empleados - no pueden estar activos y terminados simultáneamente',
          crossMatches.flatMap(match => match.rows),
          {
            crossMatches: crossMatches.slice(0, 10),
            dataIntegrityIssue: 'CRÍTICO',
            businessLogicViolation: 'Estado laboral contradictorio'
          }
        )
      ];
    }

    return [
      this.createSuccessResult(
        'Validación Cruzada de Datasets',
        'No se detectaron empleados duplicados entre datasets',
        {
          activeEmployees: data.activePersonnel.length,
          terminatedEmployees: data.terminations.length,
          crossIntegrity: 'ÍNTEGRO'
        }
      )
    ];
  }

  private async assessDataIntegrity(data: MappedData): Promise<ValidationResult[]> {
    const integrityAssessment = this.performDataIntegrityAssessment(data);

    return [
      this.createSuccessResult(
        'Evaluación de Integridad de Datos',
        `Integridad general: ${integrityAssessment.overallIntegrity}`,
        {
          integrityMetrics: integrityAssessment.metrics,
          duplicateRisk: integrityAssessment.duplicateRisk,
          qualityIndicators: integrityAssessment.qualityIndicators,
          maintenanceRecommendations: integrityAssessment.maintenanceRecommendations
        }
      )
    ];
  }

  // Métodos de detección especializados
  private findExactMatches(personnel: any[]): any {
    const criticalMatches: any[] = [];
    const businessMatches: any[] = [];
    const criticalFields = new Set<string>();

    // Mapas para detectar duplicados
    const fieldMaps: Record<string, Record<string, number[]>> = {};

    // Inicializar mapas para campos únicos
    const allUniqueFields = {
      ...this.uniqueFields.LEGAL,
      ...this.uniqueFields.BUSINESS,
      ...this.uniqueFields.OPERATIONAL
    };

    for (const field of Object.keys(allUniqueFields)) {
      fieldMaps[field] = {};
    }

    // Poblar mapas con valores de empleados
    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const row = i + 2;

      for (const field of Object.keys(allUniqueFields)) {
        const value = this.extractFieldValue(employee, field);
        if (value && this.isValidValue(value, field)) {
          const normalizedValue = this.normalizeValue(value, field);
          
          if (!fieldMaps[field][normalizedValue]) {
            fieldMaps[field][normalizedValue] = [];
          }
          fieldMaps[field][normalizedValue].push(row);
        }
      }
    }

    // Detectar duplicados
    for (const [field, valueMap] of Object.entries(fieldMaps)) {
      for (const [value, rows] of Object.entries(valueMap)) {
        if (rows.length > 1) {
          const duplicateInfo = {
            field,
            value,
            rows,
            count: rows.length,
            severity: this.getDuplicateSeverity(field),
            priority: allUniqueFields[field as keyof typeof allUniqueFields]?.priority || 'BAJO'
          };

          if (this.uniqueFields.LEGAL[field as keyof typeof this.uniqueFields.LEGAL]) {
            criticalMatches.push(duplicateInfo);
            criticalFields.add(field);
          } else if (this.uniqueFields.BUSINESS[field as keyof typeof this.uniqueFields.BUSINESS]) {
            businessMatches.push(duplicateInfo);
          }
        }
      }
    }

    return {
      critical: criticalMatches,
      business: businessMatches,
      criticalFields: Array.from(criticalFields),
      operationalImpact: this.assessOperationalImpact(businessMatches)
    };
  }

  private findNearMatches(personnel: any[]): any[] {
    const nearMatches: any[] = [];
    const compared = new Set<string>();

    for (let i = 0; i < personnel.length; i++) {
      for (let j = i + 1; j < personnel.length; j++) {
        const emp1 = personnel[i];
        const emp2 = personnel[j];
        const comparisonKey = `${i}-${j}`;
        
        if (compared.has(comparisonKey)) continue;
        compared.add(comparisonKey);

        const similarity = this.calculateSimilarity(emp1, emp2);
        
        if (similarity.overall >= this.similarityThresholds.COMBINADO.high) {
          nearMatches.push({
            rows: [i + 2, j + 2],
            similarity: similarity.overall,
            detailedSimilarity: similarity,
            employee1: this.createEmployeeSummary(emp1, i + 2),
            employee2: this.createEmployeeSummary(emp2, j + 2),
            riskLevel: this.assessSimilarityRisk(similarity.overall),
            recommendedAction: this.getRecommendedAction(similarity.overall)
          });
        }
      }
    }

    return nearMatches.sort((a, b) => b.similarity - a.similarity);
  }

  private findPartialMatches(personnel: any[]): any[] {
    const partialMatches: any[] = [];
    const fieldCombinations = [
      ['nombre', 'fechaNacimiento'],
      ['nombre', 'telefono'],
      ['fechaNacimiento', 'direccion'],
      ['email', 'telefono']
    ];

    for (const combination of fieldCombinations) {
      const matches = this.findMatchesByFields(personnel, combination);
      partialMatches.push(...matches);
    }

    return this.consolidatePartialMatches(partialMatches);
  }

  private findSuspiciousPatterns(personnel: any[]): any[] {
    const patterns: any[] = [];

    // Patrón 1: Nombres secuenciales
    const sequentialNames = this.detectSequentialNames(personnel);
    if (sequentialNames.length > 0) {
      patterns.push({
        type: 'NOMBRES_SECUENCIALES',
        description: 'Nombres con patrones secuenciales detectados',
        instances: sequentialNames,
        severity: 'MEDIO'
      });
    }

    // Patrón 2: Datos placeholder repetitivos
    const placeholderData = this.detectPlaceholderData(personnel);
    if (placeholderData.length > 0) {
      patterns.push({
        type: 'DATOS_PLACEHOLDER',
        description: 'Datos placeholder o de prueba detectados',
        instances: placeholderData,
        severity: 'ALTO'
      });
    }

    // Patrón 3: Fechas de ingreso masivas
    const massHireDates = this.detectMassHireDates(personnel);
    if (massHireDates.length > 0) {
      patterns.push({
        type: 'CONTRATACIONES_MASIVAS',
        description: 'Fechas de contratación masiva sospechosas',
        instances: massHireDates,
        severity: 'BAJO'
      });
    }

    return patterns;
  }

  private findCrossDatasetMatches(activePersonnel: any[], terminations: any[]): any[] {
    const crossMatches: any[] = [];
    const identifiers = ['rfc', 'curp', 'imss'];

    for (let i = 0; i < activePersonnel.length; i++) {
      const activeEmp = activePersonnel[i];
      
      for (let j = 0; j < terminations.length; j++) {
        const termEmp = terminations[j];
        
        for (const identifier of identifiers) {
          const activeValue = this.extractFieldValue(activeEmp, identifier);
          const termValue = this.extractFieldValue(termEmp, identifier);
          
          if (activeValue && termValue && 
              this.normalizeValue(activeValue, identifier) === this.normalizeValue(termValue, identifier)) {
            crossMatches.push({
              identifier,
              value: activeValue,
              rows: [`Activo:${i + 2}`, `Terminado:${j + 2}`],
              activeEmployee: this.createEmployeeSummary(activeEmp, i + 2),
              terminatedEmployee: this.createEmployeeSummary(termEmp, j + 2),
              conflictType: 'ESTADO_CONTRADICTORIO'
            });
          }
        }
      }
    }

    return this.deduplicateCrossMatches(crossMatches);
  }

  private performDataIntegrityAssessment(data: MappedData): any {
    const activeCount = data.activePersonnel?.length || 0;
    const terminatedCount = data.terminations?.length || 0;
    const totalRecords = activeCount + terminatedCount;

    // Calcular métricas de integridad
    let integrityScore = 100;
    const issues: string[] = [];

    // Evaluar duplicados exactos
    if (data.activePersonnel) {
      const exactMatches = this.findExactMatches(data.activePersonnel);
      if (exactMatches.critical.length > 0) {
        integrityScore -= 40;
        issues.push(`${exactMatches.critical.length} duplicados críticos`);
      }
      if (exactMatches.business.length > 0) {
        integrityScore -= 20;
        issues.push(`${exactMatches.business.length} duplicados de negocio`);
      }
    }

    // Evaluar ratio de duplicados
    const duplicateRatio = totalRecords > 0 ? issues.length / totalRecords : 0;

    const overallIntegrity = integrityScore > 90 ? 'EXCELENTE' :
                             integrityScore > 75 ? 'BUENO' :
                             integrityScore > 60 ? 'REGULAR' : 'DEFICIENTE';

    return {
      overallIntegrity,
      metrics: {
        integrityScore,
        totalRecords,
        duplicateRatio: Math.round(duplicateRatio * 100),
        qualityGrade: this.getQualityGrade(integrityScore)
      },
      duplicateRisk: duplicateRatio > 0.05 ? 'ALTO' : duplicateRatio > 0.02 ? 'MEDIO' : 'BAJO',
      qualityIndicators: {
        uniquenessCompliance: integrityScore > 95 ? 'COMPLETO' : 'PARCIAL',
        dataCoherence: issues.length === 0 ? 'COHERENTE' : 'INCONSISTENTE'
      },
      maintenanceRecommendations: this.generateMaintenanceRecommendations(integrityScore, issues)
    };
  }

  // Métodos auxiliares especializados
  private extractFieldValue(employee: any, fieldName: string): any {
    const fieldVariations = this.getFieldVariations(fieldName);
    
    for (const variation of fieldVariations) {
      const value = employee[variation];
      if (value !== null && value !== undefined && value !== '') {
        return value;
      }
    }
    
    return null;
  }

  private getFieldVariations(fieldName: string): string[] {
    const variations: Record<string, string[]> = {
      rfc: ['rfc', 'RFC'],
      curp: ['curp', 'CURP'],
      imss: ['imss', 'IMSS', 'nss', 'NSS'],
      empleadoId: ['empleadoId', 'employee_id', 'id_empleado', 'ID'],
      email: ['email', 'correo', 'mail'],
      numeroEmpleado: ['numeroEmpleado', 'numero_empleado', 'employee_number'],
      telefono: ['telefono', 'phone', 'celular', 'tel'],
      cuenta_banco: ['cuenta_banco', 'bank_account', 'cuenta_bancaria'],
      nombre: ['nombre', 'name', 'full_name', 'nombre_completo'],
      fechaNacimiento: ['fechaNacimiento', 'fecha_nacimiento', 'birth_date'],
      direccion: ['direccion', 'address', 'domicilio']
    };

    return variations[fieldName] || [fieldName];
  }

  private isValidValue(value: any, field: string): boolean {
    if (!value) return false;
    
    const strValue = String(value).trim().toUpperCase();
    
    // Valores inválidos comunes
    const invalidValues = ['N/A', 'NULL', 'SIN DATO', 'PENDIENTE', '---', 'XXX'];
    if (invalidValues.includes(strValue)) return false;
    
    // Validaciones específicas por campo
    switch (field) {
      case 'rfc':
        return /^[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/.test(strValue);
      case 'curp':
        return /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(strValue);
      case 'imss':
        return /^\d{10,11}$/.test(strValue.replace(/\D/g, ''));
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strValue);
      default:
        return strValue.length > 0;
    }
  }

  private normalizeValue(value: any, field: string): string {
    let normalized = String(value).trim().toUpperCase();
    
    // Normalizaciones específicas por campo
    switch (field) {
      case 'telefono':
        normalized = normalized.replace(/\D/g, ''); // Solo dígitos
        break;
      case 'nombre':
        normalized = normalized.replace(/\s+/g, ' '); // Espacios únicos
        break;
      case 'email':
        normalized = normalized.toLowerCase();
        break;
    }
    
    return normalized;
  }

  private getDuplicateSeverity(field: string): string {
    if (this.uniqueFields.LEGAL[field as keyof typeof this.uniqueFields.LEGAL]) {
      return 'CRÍTICO';
    }
    if (this.uniqueFields.BUSINESS[field as keyof typeof this.uniqueFields.BUSINESS]) {
      return 'ALTO';
    }
    return 'MODERADO';
  }

  private assessOperationalImpact(businessMatches: any[]): string {
    if (businessMatches.length === 0) return 'Sin impacto operacional';
    
    const impactAreas = businessMatches.map(match => {
      switch (match.field) {
        case 'empleadoId': return 'Identificación interna duplicada';
        case 'email': return 'Comunicaciones comprometidas';
        case 'numeroEmpleado': return 'Control de nómina afectado';
        default: return 'Operaciones menores afectadas';
      }
    });
    
    return impactAreas.slice(0, 3).join(', ');
  }

  private calculateSimilarity(emp1: any, emp2: any): any {
    const similarities = {
      nombre: this.calculateStringSimilarity(
        this.extractFieldValue(emp1, 'nombre'),
        this.extractFieldValue(emp2, 'nombre')
      ),
      fechaNacimiento: this.calculateDateSimilarity(
        this.extractFieldValue(emp1, 'fechaNacimiento'),
        this.extractFieldValue(emp2, 'fechaNacimiento')
      ),
      direccion: this.calculateStringSimilarity(
        this.extractFieldValue(emp1, 'direccion'),
        this.extractFieldValue(emp2, 'direccion')
      ),
      telefono: this.calculatePhoneSimilarity(
        this.extractFieldValue(emp1, 'telefono'),
        this.extractFieldValue(emp2, 'telefono')
      )
    };

    // Calcular similitud global ponderada
    const weights = { nombre: 0.4, fechaNacimiento: 0.3, direccion: 0.2, telefono: 0.1 };
    const overall = Object.entries(similarities).reduce((sum, [field, similarity]) => {
      return sum + (similarity * weights[field as keyof typeof weights]);
    }, 0);

    return {
      overall: Math.round(overall * 100) / 100,
      ...similarities
    };
  }

  private calculateStringSimilarity(str1: any, str2: any): number {
    if (!str1 || !str2) return 0;
    
    const s1 = String(str1).trim().toUpperCase();
    const s2 = String(str2).trim().toUpperCase();
    
    if (s1 === s2) return 1;
    
    // Levenshtein distance simplificado
    const maxLength = Math.max(s1.length, s2.length);
    if (maxLength === 0) return 1;
    
    const distance = this.levenshteinDistance(s1, s2);
    return 1 - (distance / maxLength);
  }

  private calculateDateSimilarity(date1: any, date2: any): number {
    if (!date1 || !date2) return 0;
    
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
    if (d1.getTime() === d2.getTime()) return 1;
    
    // Similitud basada en diferencia de días
    const daysDiff = Math.abs(d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff <= 1) return 0.9; // Muy cercanas
    if (daysDiff <= 7) return 0.7; // Misma semana
    if (daysDiff <= 30) return 0.5; // Mismo mes aproximado
    
    return 0;
  }

  private calculatePhoneSimilarity(phone1: any, phone2: any): number {
    if (!phone1 || !phone2) return 0;
    
    const p1 = String(phone1).replace(/\D/g, '');
    const p2 = String(phone2).replace(/\D/g, '');
    
    if (p1 === p2) return 1;
    if (p1.length === 0 || p2.length === 0) return 0;
    
    // Comparar últimos 10 dígitos (número local)
    const localP1 = p1.slice(-10);
    const localP2 = p2.slice(-10);
    
    return localP1 === localP2 ? 0.9 : 0;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private createEmployeeSummary(employee: any, row: number): any {
    return {
      row,
      nombre: this.extractFieldValue(employee, 'nombre') || 'N/A',
      rfc: this.extractFieldValue(employee, 'rfc') || 'N/A',
      curp: this.extractFieldValue(employee, 'curp') || 'N/A',
      fechaNacimiento: this.extractFieldValue(employee, 'fechaNacimiento') || 'N/A'
    };
  }

  private assessSimilarityRisk(similarity: number): string {
    if (similarity >= 0.95) return 'MUY_ALTO';
    if (similarity >= 0.90) return 'ALTO';
    if (similarity >= 0.85) return 'MEDIO';
    return 'BAJO';
  }

  private getRecommendedAction(similarity: number): string {
    if (similarity >= 0.95) return 'Revisión inmediata - Muy probable duplicado';
    if (similarity >= 0.90) return 'Revisión prioritaria - Probable duplicado';
    if (similarity >= 0.85) return 'Revisión rutinaria - Posible duplicado';
    return 'Monitoreo - Similitud moderada';
  }

  private calculateAverageSimilarity(nearMatches: any[]): number {
    if (nearMatches.length === 0) return 0;
    
    const totalSimilarity = nearMatches.reduce((sum, match) => sum + match.similarity, 0);
    return Math.round((totalSimilarity / nearMatches.length) * 100) / 100;
  }

  private generateReviewGuidelines(nearMatches: any[]): string[] {
    return [
      'Comparar RFC y CURP para confirmación definitiva',
      'Verificar fechas de nacimiento y direcciones',
      'Revisar números de teléfono y contactos',
      'Considerar entrevista con empleados si es necesario',
      'Documentar decisión de consolidación o mantenimiento'
    ];
  }

  private findMatchesByFields(personnel: any[], fields: string[]): any[] {
    const matches: any[] = [];
    const combinations: Record<string, number[]> = {};
    
    for (let i = 0; i < personnel.length; i++) {
      const values = fields.map(field => 
        this.normalizeValue(this.extractFieldValue(personnel[i], field) || '', field)
      ).filter(v => v.length > 0);
      
      if (values.length === fields.length) {
        const key = values.join('|');
        if (!combinations[key]) {
          combinations[key] = [];
        }
        combinations[key].push(i + 2);
      }
    }
    
    for (const [combination, rows] of Object.entries(combinations)) {
      if (rows.length > 1) {
        matches.push({
          fields,
          combination,
          rows,
          count: rows.length
        });
      }
    }
    
    return matches;
  }

  private consolidatePartialMatches(partialMatches: any[]): any[] {
    // Consolidar matches que involucran las mismas filas
    const consolidated: any[] = [];
    const processed = new Set<string>();
    
    for (const match of partialMatches) {
      const key = match.rows.sort().join('-');
      if (!processed.has(key)) {
        processed.add(key);
        consolidated.push(match);
      }
    }
    
    return consolidated;
  }

  private analyzePartialMatchPatterns(partialMatches: any[]): any {
    const fieldCombinations: Record<string, number> = {};
    
    for (const match of partialMatches) {
      const key = match.fields.sort().join('+');
      fieldCombinations[key] = (fieldCombinations[key] || 0) + 1;
    }
    
    return {
      mostCommonCombination: Object.entries(fieldCombinations)
        .sort(([,a], [,b]) => b - a)[0],
      totalPatterns: Object.keys(fieldCombinations).length
    };
  }

  private identifyConsolidationOpportunities(partialMatches: any[]): string[] {
    const opportunities = [];
    
    if (partialMatches.some(match => match.fields.includes('nombre') && match.fields.includes('fechaNacimiento'))) {
      opportunities.push('Consolidar empleados con mismo nombre y fecha de nacimiento');
    }
    
    if (partialMatches.some(match => match.fields.includes('email'))) {
      opportunities.push('Revisar empleados con mismo email');
    }
    
    return opportunities;
  }

  private detectSequentialNames(personnel: any[]): any[] {
    const names = personnel.map((emp, i) => ({
      name: this.extractFieldValue(emp, 'nombre') || '',
      row: i + 2
    })).filter(item => item.name.length > 0);
    
    const sequential: any[] = [];
    const pattern = /(\w+)(\d+)$/;
    
    for (const item of names) {
      const match = item.name.match(pattern);
      if (match) {
        sequential.push({
          name: item.name,
          row: item.row,
          base: match[1],
          number: match[2]
        });
      }
    }
    
    return sequential.length > 3 ? sequential : []; // Solo si hay varios
  }

  private detectPlaceholderData(personnel: any[]): any[] {
    const placeholders = ['TEST', 'PRUEBA', 'EJEMPLO', 'DEMO', 'SAMPLE', 'XXX', 'AAA'];
    const detected: any[] = [];
    
    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const row = i + 2;
      
      for (const placeholder of placeholders) {
        for (const field of ['nombre', 'rfc', 'email']) {
          const value = this.extractFieldValue(employee, field);
          if (value && String(value).toUpperCase().includes(placeholder)) {
            detected.push({
              row,
              field,
              value,
              placeholder
            });
          }
        }
      }
    }
    
    return detected;
  }

  private detectMassHireDates(personnel: any[]): any[] {
    const hireDates: Record<string, number[]> = {};
    
    for (let i = 0; i < personnel.length; i++) {
      const hireDate = this.extractFieldValue(personnel[i], 'fechaIngreso');
      if (hireDate) {
        const dateStr = new Date(hireDate).toISOString().split('T')[0];
        if (!hireDates[dateStr]) {
          hireDates[dateStr] = [];
        }
        hireDates[dateStr].push(i + 2);
      }
    }
    
    return Object.entries(hireDates)
      .filter(([, rows]) => rows.length >= 15) // 15+ contrataciones mismo día
      .map(([date, rows]) => ({ date, count: rows.length, rows }));
  }

  private deduplicateCrossMatches(crossMatches: any[]): any[] {
    const seen = new Set<string>();
    return crossMatches.filter(match => {
      const key = `${match.identifier}-${match.value}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private analyzeSuspiciousPatterns(patterns: any[]): any {
    const analysis: Record<string, number> = {};
    
    for (const pattern of patterns) {
      analysis[pattern.type] = (analysis[pattern.type] || 0) + pattern.instances.length;
    }
    
    return {
      patternFrequency: analysis,
      overallRisk: patterns.length > 5 ? 'ALTO' : patterns.length > 2 ? 'MEDIO' : 'BAJO'
    };
  }

  private generatePreventionRecommendations(patterns: any[]): string[] {
    const recommendations = [];
    
    if (patterns.some(p => p.type === 'NOMBRES_SECUENCIALES')) {
      recommendations.push('Implementar validación de nombres en captura');
    }
    
    if (patterns.some(p => p.type === 'DATOS_PLACEHOLDER')) {
      recommendations.push('Prohibir valores placeholder en campos críticos');
    }
    
    if (patterns.some(p => p.type === 'CONTRATACIONES_MASIVAS')) {
      recommendations.push('Validar contrataciones masivas con procesos especiales');
    }
    
    return recommendations;
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

  private generateMaintenanceRecommendations(integrityScore: number, issues: string[]): string[] {
    const recommendations = [];
    
    if (integrityScore < 80) {
      recommendations.push('Implementar proceso de limpieza de duplicados');
    }
    
    if (issues.length > 0) {
      recommendations.push('Establecer validaciones de unicidad en captura');
    }
    
    recommendations.push('Realizar auditorías regulares de duplicados');
    recommendations.push('Implementar IDs únicos automáticos');
    
    return recommendations;
  }
}