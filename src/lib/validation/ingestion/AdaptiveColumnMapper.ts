import { DetectedTable, DetectedColumn, ConversationalQuestion } from './UniversalFileProcessor';

export interface AdaptiveMappingResult {
  mappedData: {
    activePersonnel: any[];
    terminations: any[];
  };
  columnMapping: {
    detected: DetectedColumnMapping[];
    suggested: StandardFieldMapping[];
    ambiguous: AmbiguousMapping[];
  };
  confidence: {
    overall: number;
    byTable: Record<string, number>;
    byField: Record<string, number>;
  };
  conversationalQuestions: ConversationalQuestion[];
  suggestedActions: SuggestedAction[];
}

export interface DetectedColumnMapping {
  originalName: string;
  originalIndex: number;
  detectedType: 'employee_name' | 'employee_code' | 'rfc' | 'curp' | 'nss' | 'birth_date' | 'hire_date' | 'termination_date' | 'gender' | 'base_salary' | 'integrated_salary' | 'position' | 'department' | 'contract_type' | 'termination_cause' | 'seniority_payment' | 'indemnification' | 'unknown';
  confidence: number;
  sampleValues: any[];
  issues: string[];
  standardName: string;
}

export interface StandardFieldMapping {
  standardField: string;
  mappedColumns: DetectedColumnMapping[];
  isRequired: boolean;
  isMapped: boolean;
  confidence: number;
  alternatives: DetectedColumnMapping[];
}

export interface AmbiguousMapping {
  columns: DetectedColumnMapping[];
  possibleMappings: string[];
  reason: string;
  needsUserInput: boolean;
}

export interface SuggestedAction {
  type: 'auto_map' | 'user_confirm' | 'user_select' | 'data_correction' | 'format_conversion';
  priority: 'high' | 'medium' | 'low';
  description: string;
  targetColumns?: string[];
  suggestedMapping?: Record<string, string>;
  rationale: string;
}

export class AdaptiveColumnMapper {
  // Campos estándar requeridos para estudios actuariales
  private readonly STANDARD_FIELDS = {
    // Campos obligatorios para empleados activos
    active_personnel_required: {
      employee_name: { priority: 10, alternatives: ['nombre', 'name', 'empleado', 'worker_name'] },
      employee_code: { priority: 9, alternatives: ['codigo', 'clave', 'id', 'employee_id', 'emp_code'] },
      hire_date: { priority: 10, alternatives: ['fecha_ingreso', 'hire_date', 'start_date', 'fecha_entrada'] },
      birth_date: { priority: 8, alternatives: ['fecha_nacimiento', 'birth_date', 'birthday', 'nacimiento'] },
      base_salary: { priority: 10, alternatives: ['sueldo_base', 'base_salary', 'salary_base', 'salario_base'] }
    },
    
    // Campos opcionales pero recomendados
    active_personnel_optional: {
      rfc: { priority: 7, alternatives: ['rfc', 'clave_rfc', 'registro_federal'] },
      curp: { priority: 6, alternatives: ['curp', 'clave_curp', 'registro_poblacion'] },
      nss: { priority: 6, alternatives: ['nss', 'imss', 'seguro_social', 'numero_seguridad'] },
      gender: { priority: 5, alternatives: ['sexo', 'genero', 'gender', 'sex'] },
      integrated_salary: { priority: 8, alternatives: ['sueldo_integrado', 'integrated_salary', 'total_salary'] },
      position: { priority: 4, alternatives: ['puesto', 'position', 'job_title', 'cargo'] },
      department: { priority: 3, alternatives: ['departamento', 'area', 'department', 'division'] },
      contract_type: { priority: 3, alternatives: ['tipo_contrato', 'contract_type', 'employment_type'] }
    },
    
    // Campos para terminaciones
    terminations_required: {
      employee_name: { priority: 10, alternatives: ['nombre', 'name', 'empleado'] },
      employee_code: { priority: 9, alternatives: ['codigo', 'clave', 'id'] },
      hire_date: { priority: 9, alternatives: ['fecha_ingreso', 'hire_date'] },
      termination_date: { priority: 10, alternatives: ['fecha_baja', 'termination_date', 'exit_date'] },
      termination_cause: { priority: 8, alternatives: ['causa_baja', 'termination_cause', 'exit_reason'] }
    },
    
    terminations_optional: {
      birth_date: { priority: 7, alternatives: ['fecha_nacimiento', 'birth_date'] },
      last_base_salary: { priority: 8, alternatives: ['ultimo_sueldo_base', 'final_base_salary'] },
      last_integrated_salary: { priority: 7, alternatives: ['ultimo_sueldo_integrado', 'final_integrated_salary'] },
      seniority_payment: { priority: 6, alternatives: ['prima_antiguedad', 'seniority_payment'] },
      indemnification: { priority: 6, alternatives: ['indemnizacion', 'indemnification', 'severance'] }
    }
  };

  /**
   * Mapeo inteligente y adaptativo de columnas
   */
  public async performAdaptiveMapping(tables: DetectedTable[]): Promise<AdaptiveMappingResult> {
    console.log('🧠 MAPEO ADAPTATIVO: Iniciando análisis inteligente de columnas...');
    
    if (!tables || tables.length === 0) {
      throw new Error('No hay tablas para mapear');
    }

    // Clasificar tablas por tipo
    const activePersonnelTables = tables.filter(t => t.suggestedType === 'active_personnel');
    const terminationTables = tables.filter(t => t.suggestedType === 'terminations');
    const otherTables = tables.filter(t => t.suggestedType === 'other');

    console.log(`📊 Tablas clasificadas: ${activePersonnelTables.length} activos, ${terminationTables.length} terminaciones, ${otherTables.length} otras`);

    // Mapear cada tipo de tabla
    const activeMapping = await this.mapActivePersonnelTables(activePersonnelTables);
    const terminationMapping = await this.mapTerminationTables(terminationTables);
    
    // Si hay tablas no clasificadas, intentar determinar su propósito
    const otherMapping = await this.mapOtherTables(otherTables);

    // Combinar resultados
    const combinedMapping = this.combineTableMappings([activeMapping, terminationMapping, otherMapping]);

    // Generar preguntas conversacionales
    const questions = this.generateMappingQuestions(combinedMapping);

    // Generar acciones sugeridas
    const actions = this.generateSuggestedActions(combinedMapping);

    // Calcular confianza general
    const confidence = this.calculateMappingConfidence(combinedMapping);

    console.log(`✅ Mapeo completado: confianza ${confidence.overall}%, ${questions.length} preguntas, ${actions.length} acciones sugeridas`);

    return {
      mappedData: {
        activePersonnel: activeMapping.mappedData || [],
        terminations: terminationMapping.mappedData || []
      },
      columnMapping: {
        detected: combinedMapping.detectedColumns,
        suggested: combinedMapping.standardMappings,
        ambiguous: combinedMapping.ambiguousMappings
      },
      confidence,
      conversationalQuestions: questions,
      suggestedActions: actions
    };
  }

  /**
   * Mapea tablas de empleados activos
   */
  private async mapActivePersonnelTables(tables: DetectedTable[]): Promise<any> {
    if (tables.length === 0) {
      return { detectedColumns: [], standardMappings: [], ambiguousMappings: [], mappedData: [] };
    }

    // Usar la tabla con mejor confianza
    const bestTable = tables.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );

    console.log(`👥 Mapeando empleados activos: tabla "${bestTable.name}" (${bestTable.rowCount} registros)`);

    // Mapear columnas a campos estándar
    const mappingResult = await this.performIntelligentColumnMapping(
      bestTable.columns,
      { ...this.STANDARD_FIELDS.active_personnel_required, ...this.STANDARD_FIELDS.active_personnel_optional },
      'active_personnel'
    );

    // Convertir datos usando el mapeo
    const mappedData = this.convertDataWithMapping(bestTable.dataPreview, mappingResult.detectedColumns);

    return {
      ...mappingResult,
      mappedData
    };
  }

  /**
   * Mapea tablas de terminaciones
   */
  private async mapTerminationTables(tables: DetectedTable[]): Promise<any> {
    if (tables.length === 0) {
      return { detectedColumns: [], standardMappings: [], ambiguousMappings: [], mappedData: [] };
    }

    const bestTable = tables.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );

    console.log(`📋 Mapeando terminaciones: tabla "${bestTable.name}" (${bestTable.rowCount} registros)`);

    const mappingResult = await this.performIntelligentColumnMapping(
      bestTable.columns,
      { ...this.STANDARD_FIELDS.terminations_required, ...this.STANDARD_FIELDS.terminations_optional },
      'terminations'
    );

    const mappedData = this.convertDataWithMapping(bestTable.dataPreview, mappingResult.detectedColumns);

    return {
      ...mappingResult,
      mappedData
    };
  }

  /**
   * Mapea tablas no clasificadas intentando determinar su contenido
   */
  private async mapOtherTables(tables: DetectedTable[]): Promise<any> {
    const results: any[] = [];

    for (const table of tables) {
      console.log(`❓ Analizando tabla no clasificada: "${table.name}"`);
      
      // Intentar determinar si contiene datos de empleados
      const hasEmployeeData = this.detectEmployeeDataPatterns(table.columns);
      
      if (hasEmployeeData.confidence > 0.6) {
        console.log(`✅ Tabla "${table.name}" parece contener datos de empleados (${hasEmployeeData.confidence}% confianza)`);
        
        // Mapear como empleados activos por defecto
        const mappingResult = await this.performIntelligentColumnMapping(
          table.columns,
          this.STANDARD_FIELDS.active_personnel_required,
          'unknown_employee_data'
        );
        
        results.push(mappingResult);
      } else {
        console.log(`⚠️ Tabla "${table.name}" no contiene datos reconocibles de empleados`);
      }
    }

    // Combinar resultados de tablas múltiples si existen
    return this.combineTableMappings(results);
  }

  /**
   * Mapeo inteligente de columnas usando IA
   */
  private async performIntelligentColumnMapping(
    detectedColumns: DetectedColumn[],
    standardFields: Record<string, any>,
    context: string
  ): Promise<any> {
    
    const detectedMappings: DetectedColumnMapping[] = [];
    const standardMappings: StandardFieldMapping[] = [];
    const ambiguousMappings: AmbiguousMapping[] = [];

    console.log(`🤖 Iniciando mapeo inteligente: ${detectedColumns.length} columnas, ${Object.keys(standardFields).length} campos estándar`);

    // Paso 1: Mapear columnas detectadas a tipos específicos
    for (const column of detectedColumns) {
      const mapping = await this.mapColumnToStandardType(column, standardFields, context);
      detectedMappings.push(mapping);
    }

    // Paso 2: Crear mapeos para campos estándar
    for (const [fieldName, fieldConfig] of Object.entries(standardFields)) {
      const mapping = this.createStandardFieldMapping(fieldName, fieldConfig, detectedMappings);
      standardMappings.push(mapping);
    }

    // Paso 3: Detectar mapeos ambiguos
    const ambiguous = this.detectAmbiguousMappings(detectedMappings, standardMappings);
    ambiguousMappings.push(...ambiguous);

    return {
      detectedColumns: detectedMappings,
      standardMappings,
      ambiguousMappings
    };
  }

  /**
   * Mapea una columna individual a un tipo estándar usando IA
   */
  private async mapColumnToStandardType(
    column: DetectedColumn,
    standardFields: Record<string, any>,
    context: string
  ): Promise<DetectedColumnMapping> {
    
    console.log(`🔍 Analizando columna "${column.name}" (${column.detectedType})`);

    let bestMatch: string = 'unknown';
    let bestScore = 0;
    let confidence = 0;

    // Calcular puntuación para cada campo estándar
    for (const [fieldName, fieldConfig] of Object.entries(standardFields)) {
      const score = this.calculateFieldMatchScore(column, fieldName, fieldConfig, context);
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = fieldName;
        confidence = score;
      }
    }

    // Detectar problemas específicos de la columna
    const issues = this.detectColumnIssues(column, bestMatch);

    console.log(`  → Mejor coincidencia: ${bestMatch} (${(confidence * 100).toFixed(1)}% confianza)`);

    return {
      originalName: column.name,
      originalIndex: column.index,
      detectedType: this.mapToStandardType(bestMatch),
      confidence: confidence,
      sampleValues: column.sampleValues,
      issues,
      standardName: bestMatch
    };
  }

  /**
   * Calcula puntuación de coincidencia entre columna y campo estándar
   */
  private calculateFieldMatchScore(
    column: DetectedColumn,
    fieldName: string,
    fieldConfig: any,
    context: string
  ): number {
    let score = 0;
    
    // Puntuación por nombre (40%)
    const nameScore = this.calculateNameSimilarity(column.name, fieldConfig.alternatives || [fieldName]);
    score += nameScore * 0.4;
    
    // Puntuación por tipo de datos detectado (30%)
    const typeScore = this.calculateTypeCompatibility(column.detectedType, fieldName);
    score += typeScore * 0.3;
    
    // Puntuación por contenido de valores (20%)
    const contentScore = this.calculateContentScore(column.sampleValues, fieldName);
    score += contentScore * 0.2;
    
    // Puntuación por contexto (10%)
    const contextScore = this.calculateContextScore(fieldName, context);
    score += contextScore * 0.1;
    
    console.log(`    ${fieldName}: ${score.toFixed(3)} (nombre: ${nameScore.toFixed(3)}, tipo: ${typeScore.toFixed(3)}, contenido: ${contentScore.toFixed(3)}, contexto: ${contextScore.toFixed(3)})`);
    
    return score;
  }

  private calculateNameSimilarity(columnName: string, alternatives: string[]): number {
    const normalized = columnName.toLowerCase().replace(/[^a-z0-9]/g, '');
    let bestScore = 0;
    
    for (const alt of alternatives) {
      const altNormalized = alt.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Coincidencia exacta
      if (normalized === altNormalized) return 1.0;
      
      // Contiene la palabra clave
      if (normalized.includes(altNormalized) || altNormalized.includes(normalized)) {
        bestScore = Math.max(bestScore, 0.8);
      }
      
      // Similitud de palabras
      const words1 = normalized.split(/[_\s]/);
      const words2 = altNormalized.split(/[_\s]/);
      
      for (const word1 of words1) {
        for (const word2 of words2) {
          if (word1 === word2 && word1.length > 2) {
            bestScore = Math.max(bestScore, 0.6);
          }
        }
      }
    }
    
    return bestScore;
  }

  private calculateTypeCompatibility(detectedType: string, fieldName: string): number {
    const typeMapping: Record<string, string[]> = {
      'name': ['employee_name'],
      'id': ['employee_code', 'rfc', 'curp', 'nss'],
      'date': ['birth_date', 'hire_date', 'termination_date'],
      'number': ['base_salary', 'integrated_salary', 'seniority_payment', 'indemnification'],
      'text': ['gender', 'position', 'department', 'contract_type', 'termination_cause']
    };
    
    for (const [type, fields] of Object.entries(typeMapping)) {
      if (type === detectedType && fields.includes(fieldName)) {
        return 1.0;
      }
    }
    
    return 0.2; // Puntuación mínima para tipos no coincidentes
  }

  private calculateContentScore(sampleValues: any[], fieldName: string): number {
    if (!sampleValues || sampleValues.length === 0) return 0;
    
    let score = 0;
    const sampleCount = sampleValues.length;
    
    for (const value of sampleValues) {
      if (this.valueMatchesField(value, fieldName)) {
        score += 1;
      }
    }
    
    return score / sampleCount;
  }

  private valueMatchesField(value: any, fieldName: string): boolean {
    if (!value) return false;
    
    const str = value.toString().trim();
    
    switch (fieldName) {
      case 'employee_name':
        return /^[A-Za-zÀ-ÿ\s\.]+$/.test(str) && str.length > 5 && str.includes(' ');
      
      case 'rfc':
        return /^[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/.test(str);
      
      case 'curp':
        return /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A]\d$/.test(str);
      
      case 'nss':
        return /^\d{10,11}$/.test(str.replace(/\D/g, ''));
      
      case 'base_salary':
      case 'integrated_salary':
      case 'seniority_payment':
      case 'indemnification':
        const num = parseFloat(str.replace(/[$,\s]/g, ''));
        return !isNaN(num) && num > 1000 && num < 1000000;
      
      case 'birth_date':
      case 'hire_date':
      case 'termination_date':
        return /\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(str) || 
               /\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}/.test(str);
      
      case 'gender':
        return /^[MHF]$/i.test(str) || /^(MASCULINO|FEMENINO|HOMBRE|MUJER)$/i.test(str);
      
      default:
        return true; // Para campos de texto genéricos
    }
  }

  private calculateContextScore(fieldName: string, context: string): number {
    // Ajustar puntuación basada en el contexto
    if (context === 'terminations') {
      const terminationFields = ['termination_date', 'termination_cause', 'seniority_payment', 'indemnification'];
      return terminationFields.includes(fieldName) ? 1.0 : 0.8;
    }
    
    if (context === 'active_personnel') {
      const activeFields = ['hire_date', 'base_salary', 'integrated_salary', 'position', 'department'];
      return activeFields.includes(fieldName) ? 1.0 : 0.8;
    }
    
    return 0.9; // Puntuación neutral
  }

  private mapToStandardType(standardName: string): DetectedColumnMapping['detectedType'] {
    const mapping: Record<string, DetectedColumnMapping['detectedType']> = {
      'employee_name': 'employee_name',
      'employee_code': 'employee_code',
      'rfc': 'rfc',
      'curp': 'curp',
      'nss': 'nss',
      'birth_date': 'birth_date',
      'hire_date': 'hire_date',
      'termination_date': 'termination_date',
      'gender': 'gender',
      'base_salary': 'base_salary',
      'integrated_salary': 'integrated_salary',
      'position': 'position',
      'department': 'department',
      'contract_type': 'contract_type',
      'termination_cause': 'termination_cause',
      'seniority_payment': 'seniority_payment',
      'indemnification': 'indemnification'
    };
    
    return mapping[standardName] || 'unknown';
  }

  private detectColumnIssues(column: DetectedColumn, mappedFieldName: string): string[] {
    const issues: string[] = [];
    
    // Problemas de calidad de datos existentes
    issues.push(...column.dataQualityIssues);
    
    // Problemas específicos del mapeo
    if (column.confidence < 0.7) {
      issues.push(`Baja confianza en detección de tipo (${(column.confidence * 100).toFixed(1)}%)`);
    }
    
    // Verificar compatibilidad de contenido
    let validContentCount = 0;
    for (const value of column.sampleValues) {
      if (this.valueMatchesField(value, mappedFieldName)) {
        validContentCount++;
      }
    }
    
    const contentValidationRate = validContentCount / column.sampleValues.length;
    if (contentValidationRate < 0.5) {
      issues.push(`Contenido no coincide con tipo esperado (${(contentValidationRate * 100).toFixed(1)}% válido)`);
    }
    
    return issues;
  }

  private createStandardFieldMapping(
    fieldName: string,
    fieldConfig: any,
    detectedMappings: DetectedColumnMapping[]
  ): StandardFieldMapping {
    
    // Encontrar columnas que mapean a este campo
    const mappedColumns = detectedMappings.filter(m => m.standardName === fieldName);
    const alternatives = detectedMappings.filter(m => 
      m.standardName !== fieldName && m.confidence > 0.3 && 
      fieldConfig.alternatives?.some((alt: string) => m.originalName.toLowerCase().includes(alt.toLowerCase()))
    );
    
    const isMapped = mappedColumns.length > 0;
    const confidence = isMapped ? Math.max(...mappedColumns.map(m => m.confidence)) : 0;
    const isRequired = fieldConfig.priority >= 8;
    
    return {
      standardField: fieldName,
      mappedColumns,
      isRequired,
      isMapped,
      confidence,
      alternatives
    };
  }

  private detectAmbiguousMappings(
    detectedMappings: DetectedColumnMapping[],
    standardMappings: StandardFieldMapping[]
  ): AmbiguousMapping[] {
    const ambiguous: AmbiguousMapping[] = [];
    
    // Detectar múltiples columnas mapeadas al mismo campo
    for (const standard of standardMappings) {
      if (standard.mappedColumns.length > 1) {
        ambiguous.push({
          columns: standard.mappedColumns,
          possibleMappings: [standard.standardField],
          reason: `Múltiples columnas mapeadas al campo "${standard.standardField}"`,
          needsUserInput: true
        });
      }
    }
    
    // Detectar columnas con múltiples mapeos posibles
    for (const detected of detectedMappings) {
      if (detected.confidence < 0.6 && detected.issues.length === 0) {
        const possibleFields = standardMappings
          .filter(s => s.alternatives.some(alt => alt.originalIndex === detected.originalIndex))
          .map(s => s.standardField);
        
        if (possibleFields.length > 1) {
          ambiguous.push({
            columns: [detected],
            possibleMappings: possibleFields,
            reason: `Columna "${detected.originalName}" podría ser cualquiera de estos campos`,
            needsUserInput: true
          });
        }
      }
    }
    
    return ambiguous;
  }

  private detectEmployeeDataPatterns(columns: DetectedColumn[]): {confidence: number, reasons: string[]} {
    let score = 0;
    const reasons: string[] = [];
    const maxScore = columns.length * 2;
    
    for (const column of columns) {
      // Buscar patrones típicos de datos de empleados
      if (column.detectedType === 'name') {
        score += 2;
        reasons.push(`Columna de nombres detectada: ${column.name}`);
      } else if (column.detectedType === 'id') {
        score += 1.5;
        reasons.push(`Columna de identificador detectada: ${column.name}`);
      } else if (column.detectedType === 'number' && column.name.toLowerCase().includes('sueldo')) {
        score += 1.5;
        reasons.push(`Columna de salario detectada: ${column.name}`);
      } else if (column.detectedType === 'date') {
        score += 1;
        reasons.push(`Columna de fecha detectada: ${column.name}`);
      }
    }
    
    const confidence = maxScore > 0 ? Math.min(score / maxScore, 1.0) : 0;
    
    return { confidence, reasons };
  }

  private combineTableMappings(mappings: any[]): any {
    // Combinar mapeos de múltiples tablas
    const combined = {
      detectedColumns: [] as DetectedColumnMapping[],
      standardMappings: [] as StandardFieldMapping[],
      ambiguousMappings: [] as AmbiguousMapping[]
    };
    
    for (const mapping of mappings) {
      if (mapping.detectedColumns) combined.detectedColumns.push(...mapping.detectedColumns);
      if (mapping.standardMappings) combined.standardMappings.push(...mapping.standardMappings);
      if (mapping.ambiguousMappings) combined.ambiguousMappings.push(...mapping.ambiguousMappings);
    }
    
    return combined;
  }

  private convertDataWithMapping(dataRows: any[][], columnMappings: DetectedColumnMapping[]): any[] {
    if (!dataRows || dataRows.length === 0) return [];
    
    const convertedData: any[] = [];
    
    for (const row of dataRows) {
      const convertedRow: any = {};
      
      for (const mapping of columnMappings) {
        if (mapping.originalIndex < row.length) {
          const value = row[mapping.originalIndex];
          convertedRow[mapping.standardName] = value;
          convertedRow[mapping.originalName] = value; // Mantener nombre original también
        }
      }
      
      convertedData.push(convertedRow);
    }
    
    return convertedData;
  }

  private generateMappingQuestions(mapping: any): ConversationalQuestion[] {
    const questions: ConversationalQuestion[] = [];
    
    // Preguntas sobre mapeos ambiguos
    for (const ambiguous of mapping.ambiguousMappings) {
      if (ambiguous.needsUserInput) {
        questions.push({
          id: `ambiguous_${ambiguous.columns[0]?.originalIndex}`,
          type: 'choice',
          priority: 'high',
          question: `¿Qué contiene la columna "${ambiguous.columns[0]?.originalName}"?`,
          context: ambiguous.reason,
          options: ambiguous.possibleMappings.map(field => ({
            id: field,
            label: this.getFieldDisplayName(field),
            description: this.getFieldDescription(field)
          })),
          relatedData: {
            columns: [ambiguous.columns[0]?.originalName],
            values: ambiguous.columns[0]?.sampleValues
          }
        });
      }
    }
    
    // Preguntas sobre campos faltantes críticos
    for (const standard of mapping.standardMappings) {
      if (standard.isRequired && !standard.isMapped) {
        questions.push({
          id: `missing_${standard.standardField}`,
          type: 'clarification',
          priority: 'high',
          question: `¿Dónde está el campo "${this.getFieldDisplayName(standard.standardField)}"?`,
          context: `Este campo es obligatorio para el estudio actuarial pero no fue detectado automáticamente.`,
          relatedData: {
            columns: standard.alternatives.map(alt => alt.originalName)
          }
        });
      }
    }
    
    return questions;
  }

  private generateSuggestedActions(mapping: any): SuggestedAction[] {
    const actions: SuggestedAction[] = [];
    
    // Acciones para mapeos automáticos de alta confianza
    const highConfidenceMappings = mapping.detectedColumns.filter((m: DetectedColumnMapping) => 
      m.confidence > 0.9 && m.issues.length === 0
    );
    
    if (highConfidenceMappings.length > 0) {
      actions.push({
        type: 'auto_map',
        priority: 'high',
        description: `Mapear automáticamente ${highConfidenceMappings.length} columnas con alta confianza`,
        targetColumns: highConfidenceMappings.map(m => m.originalName),
        suggestedMapping: Object.fromEntries(
          highConfidenceMappings.map(m => [m.originalName, m.standardName])
        ),
        rationale: 'Estas columnas tienen mapeos claros y sin ambigüedades'
      });
    }
    
    // Acciones para corrección de datos
    const columnsWithIssues = mapping.detectedColumns.filter((m: DetectedColumnMapping) => 
      m.issues.length > 0
    );
    
    if (columnsWithIssues.length > 0) {
      actions.push({
        type: 'data_correction',
        priority: 'medium',
        description: `Revisar ${columnsWithIssues.length} columnas con problemas de calidad`,
        targetColumns: columnsWithIssues.map(m => m.originalName),
        rationale: 'Estas columnas tienen problemas que pueden afectar la precisión del análisis'
      });
    }
    
    return actions;
  }

  private calculateMappingConfidence(mapping: any): AdaptiveMappingResult['confidence'] {
    const detectedColumns = mapping.detectedColumns as DetectedColumnMapping[];
    const standardMappings = mapping.standardMappings as StandardFieldMapping[];
    
    // Confianza general
    const avgColumnConfidence = detectedColumns.length > 0 
      ? detectedColumns.reduce((sum, col) => sum + col.confidence, 0) / detectedColumns.length
      : 0;
    
    // Penalizar por campos requeridos no mapeados
    const requiredFields = standardMappings.filter(s => s.isRequired);
    const mappedRequiredFields = requiredFields.filter(s => s.isMapped);
    const requiredFieldsRatio = requiredFields.length > 0 
      ? mappedRequiredFields.length / requiredFields.length 
      : 1;
    
    const overall = (avgColumnConfidence * 0.7) + (requiredFieldsRatio * 0.3);
    
    // Confianza por tabla
    const byTable: Record<string, number> = {
      'main_data': overall
    };
    
    // Confianza por campo
    const byField: Record<string, number> = {};
    for (const mapping of standardMappings) {
      byField[mapping.standardField] = mapping.confidence;
    }
    
    return {
      overall: Math.round(overall * 100) / 100,
      byTable,
      byField
    };
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: Record<string, string> = {
      'employee_name': 'Nombre del Empleado',
      'employee_code': 'Código de Empleado',
      'rfc': 'RFC',
      'curp': 'CURP',
      'nss': 'Número de Seguro Social',
      'birth_date': 'Fecha de Nacimiento',
      'hire_date': 'Fecha de Ingreso',
      'termination_date': 'Fecha de Baja',
      'gender': 'Sexo',
      'base_salary': 'Sueldo Base',
      'integrated_salary': 'Sueldo Integrado',
      'position': 'Puesto',
      'department': 'Departamento',
      'contract_type': 'Tipo de Contrato',
      'termination_cause': 'Causa de Baja',
      'seniority_payment': 'Prima de Antigüedad',
      'indemnification': 'Indemnización'
    };
    
    return displayNames[fieldName] || fieldName;
  }

  private getFieldDescription(fieldName: string): string {
    const descriptions: Record<string, string> = {
      'employee_name': 'Nombre completo del trabajador',
      'employee_code': 'Identificador único del empleado',
      'rfc': 'Registro Federal de Contribuyentes',
      'curp': 'Clave Única de Registro de Población',
      'nss': 'Número de afiliación al IMSS',
      'birth_date': 'Fecha de nacimiento para calcular edad',
      'hire_date': 'Fecha de ingreso para calcular antigüedad',
      'base_salary': 'Salario base mensual para cálculos actuariales'
    };
    
    return descriptions[fieldName] || 'Campo estándar del estudio actuarial';
  }
}