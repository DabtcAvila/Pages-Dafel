import { DetectedTable, DetectedColumn } from './UniversalFileProcessor';

export interface StructureAnalysis {
  tables: DetectedTable[];
  confidence: number;
  suggestedMapping: Record<string, string>;
  anomalies: string[];
}

export class FileStructureAnalyzer {
  // Patrones avanzados para detectar tipos de datos actuariales
  private readonly ACTUARIAL_PATTERNS = {
    // Nombres de personas
    names: {
      patterns: [
        /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+$/,
        /^[A-Z]+(\s+[A-Z]+)+$/
      ],
      keywords: ['nombre', 'name', 'empleado', 'trabajador', 'persona'],
      validator: (value: any) => this.validateName(value)
    },

    // RFC mexicano
    rfc: {
      patterns: [
        /^[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/,
        /^[A-Z]{4}\d{6}[A-Z0-9]{3}$/
      ],
      keywords: ['rfc', 'clave rfc', 'registro federal'],
      validator: (value: any) => this.validateRFC(value)
    },

    // CURP mexicana
    curp: {
      patterns: [
        /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A]\d$/
      ],
      keywords: ['curp', 'clave unica', 'registro poblacion'],
      validator: (value: any) => this.validateCURP(value)
    },

    // Números de Seguro Social
    nss: {
      patterns: [
        /^\d{10,11}$/,
        /^\d{2}-\d{2}-\d{2}-\d{5}$/
      ],
      keywords: ['nss', 'imss', 'seguro social', 'numero seguridad'],
      validator: (value: any) => this.validateNSS(value)
    },

    // Salarios
    salary: {
      patterns: [
        /^\$?\d{1,3}(,\d{3})*(\.\d{2})?$/,
        /^\d{4,7}(\.\d{2})?$/
      ],
      keywords: ['sueldo', 'salario', 'salary', 'wage', 'pago', 'remuneracion', 'base', 'integrado'],
      validator: (value: any) => this.validateSalary(value)
    },

    // Fechas
    dates: {
      patterns: [
        /^\d{1,2}\/\d{1,2}\/\d{4}$/,
        /^\d{4}-\d{2}-\d{2}$/,
        /^\d{1,2}-\d{1,2}-\d{4}$/,
        /^\d{1,2}\.\d{1,2}\.\d{4}$/
      ],
      keywords: ['fecha', 'date', 'ingreso', 'nacimiento', 'baja', 'terminacion'],
      validator: (value: any) => this.validateDate(value)
    },

    // Géneros
    gender: {
      patterns: [
        /^[MHF]$/i,
        /^(MASCULINO|FEMENINO|HOMBRE|MUJER)$/i
      ],
      keywords: ['sexo', 'genero', 'gender', 'sex'],
      validator: (value: any) => this.validateGender(value)
    },

    // Códigos de empleado
    employeeCode: {
      patterns: [
        /^[A-Z0-9]{3,10}$/,
        /^\d{3,8}$/
      ],
      keywords: ['codigo', 'clave', 'id', 'numero empleado', 'employee id'],
      validator: (value: any) => this.validateEmployeeCode(value)
    }
  };

  /**
   * Analiza la estructura de datos con IA para detectar tablas y columnas
   */
  public async analyzeDataStructure(rawData: any[][]): Promise<StructureAnalysis> {
    console.log('🧠 ANÁLISIS INTELIGENTE: Iniciando análisis de estructura...');
    
    if (!rawData || rawData.length === 0) {
      throw new Error('No hay datos para analizar');
    }

    // Detectar tablas dentro de los datos
    const tables = this.detectTables(rawData);
    
    // Analizar cada tabla detectada
    const analyzedTables: DetectedTable[] = [];
    for (const table of tables) {
      const analyzed = await this.analyzeTable(table.data, table.startRow, table.name);
      analyzedTables.push(analyzed);
    }

    // Calcular confianza general
    const confidence = this.calculateOverallConfidence(analyzedTables);
    
    // Generar mapeo sugerido
    const suggestedMapping = this.generateMapping(analyzedTables);
    
    // Detectar anomalías
    const anomalies = this.detectAnomalies(analyzedTables, rawData);

    console.log(`✅ Análisis completado: ${analyzedTables.length} tablas, confianza: ${confidence}%`);
    
    return {
      tables: analyzedTables,
      confidence,
      suggestedMapping,
      anomalies
    };
  }

  /**
   * Detecta tablas separadas dentro de los datos
   */
  private detectTables(rawData: any[][]): Array<{name: string, data: any[][], startRow: number}> {
    const tables: Array<{name: string, data: any[][], startRow: number}> = [];
    
    let currentTable: any[][] = [];
    let currentStartRow = 0;
    let emptyRowCount = 0;
    
    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const isEmptyRow = !row || row.every(cell => !cell || cell.toString().trim() === '');
      
      if (isEmptyRow) {
        emptyRowCount++;
        
        // Si encontramos 2+ filas vacías y tenemos datos, terminar tabla actual
        if (emptyRowCount >= 2 && currentTable.length > 0) {
          tables.push({
            name: this.generateTableName(currentTable, tables.length),
            data: currentTable,
            startRow: currentStartRow
          });
          
          currentTable = [];
          currentStartRow = i + 1;
        }
      } else {
        emptyRowCount = 0;
        
        // Si iniciamos nueva tabla después de vacío
        if (currentTable.length === 0) {
          currentStartRow = i;
        }
        
        currentTable.push(row);
      }
    }
    
    // Agregar última tabla si existe
    if (currentTable.length > 0) {
      tables.push({
        name: this.generateTableName(currentTable, tables.length),
        data: currentTable,
        startRow: currentStartRow
      });
    }
    
    // Si no detectamos tablas múltiples, usar todos los datos como una tabla
    if (tables.length === 0) {
      tables.push({
        name: 'Datos Principales',
        data: rawData,
        startRow: 0
      });
    }
    
    console.log(`📊 Detectadas ${tables.length} tablas en los datos`);
    return tables;
  }

  /**
   * Analiza una tabla individual con IA
   */
  private async analyzeTable(tableData: any[][], startRow: number, tableName: string): Promise<DetectedTable> {
    if (!tableData || tableData.length === 0) {
      throw new Error('Datos de tabla vacíos');
    }

    console.log(`🔍 Analizando tabla "${tableName}" con ${tableData.length} filas...`);
    
    // Detectar fila de encabezados
    const headerRowIndex = this.detectHeaderRow(tableData);
    const headers = headerRowIndex >= 0 ? tableData[headerRowIndex] : [];
    const dataRows = tableData.slice(headerRowIndex + 1);
    
    console.log(`📋 Encabezados detectados en fila ${headerRowIndex}: ${headers.join(', ')}`);
    
    // Analizar cada columna
    const columns: DetectedColumn[] = [];
    for (let colIndex = 0; colIndex < (headers.length || tableData[0]?.length || 0); colIndex++) {
      const column = await this.analyzeColumn(
        headers[colIndex] || `Columna ${colIndex + 1}`,
        colIndex,
        dataRows,
        tableName
      );
      columns.push(column);
    }

    // Determinar tipo de tabla
    const suggestedType = this.determineTableType(columns);
    
    // Calcular confianza de la tabla
    const confidence = this.calculateTableConfidence(columns);

    return {
      name: tableName,
      confidence,
      columns,
      rowCount: dataRows.length,
      dataPreview: tableData.slice(0, 5),
      suggestedType
    };
  }

  /**
   * Analiza una columna individual con IA avanzada
   */
  private async analyzeColumn(
    columnName: string, 
    columnIndex: number, 
    dataRows: any[][], 
    tableName: string
  ): Promise<DetectedColumn> {
    
    // Extraer valores de la columna
    const columnValues = dataRows
      .map(row => row[columnIndex])
      .filter(value => value !== null && value !== undefined && value !== '');
    
    if (columnValues.length === 0) {
      return {
        name: columnName,
        index: columnIndex,
        detectedType: 'unknown',
        confidence: 0,
        suggestedStandardName: 'empty_column',
        sampleValues: [],
        dataQualityIssues: ['Columna vacía']
      };
    }

    // Muestrear valores para análisis
    const sampleSize = Math.min(20, columnValues.length);
    const sampleValues = this.sampleArray(columnValues, sampleSize);
    
    console.log(`🔬 Analizando columna "${columnName}": ${sampleValues.slice(0, 3).join(', ')}...`);

    // Analizar tipo de datos usando IA
    const typeAnalysis = this.analyzeDataType(columnName, sampleValues);
    
    // Detectar problemas de calidad
    const qualityIssues = this.detectDataQualityIssues(columnValues, typeAnalysis.detectedType);
    
    // Sugerir nombre estándar
    const suggestedName = this.suggestStandardColumnName(columnName, typeAnalysis.detectedType, sampleValues);

    console.log(`✅ Columna "${columnName}" -> Tipo: ${typeAnalysis.detectedType}, Confianza: ${typeAnalysis.confidence}%`);
    
    return {
      name: columnName,
      index: columnIndex,
      detectedType: typeAnalysis.detectedType,
      confidence: typeAnalysis.confidence,
      suggestedStandardName: suggestedName,
      sampleValues: sampleValues.slice(0, 5),
      dataQualityIssues: qualityIssues
    };
  }

  /**
   * Análisis inteligente de tipo de datos
   */
  private analyzeDataType(columnName: string, values: any[]): {detectedType: DetectedColumn['detectedType'], confidence: number} {
    const scores: Record<string, number> = {};
    
    // Analizar cada tipo posible
    for (const [typeName, pattern] of Object.entries(this.ACTUARIAL_PATTERNS)) {
      let score = 0;
      
      // Puntuación por nombre de columna
      const nameScore = this.calculateNameScore(columnName, pattern.keywords);
      score += nameScore * 0.3;
      
      // Puntuación por patrones en valores
      const patternScore = this.calculatePatternScore(values, pattern.patterns);
      score += patternScore * 0.4;
      
      // Puntuación por validador específico
      const validatorScore = this.calculateValidatorScore(values, pattern.validator);
      score += validatorScore * 0.3;
      
      scores[typeName] = score;
      
      console.log(`  ${typeName}: ${score.toFixed(2)} (nombre: ${nameScore.toFixed(2)}, patrón: ${patternScore.toFixed(2)}, validador: ${validatorScore.toFixed(2)})`);
    }
    
    // Encontrar el mejor tipo
    const bestType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const confidence = Math.min(scores[bestType] * 100, 100);
    
    // Mapear a tipos estándar
    const typeMapping: Record<string, DetectedColumn['detectedType']> = {
      names: 'name',
      rfc: 'id',
      curp: 'id',
      nss: 'id',
      salary: 'number',
      dates: 'date',
      gender: 'text',
      employeeCode: 'id'
    };
    
    return {
      detectedType: typeMapping[bestType] || 'unknown',
      confidence: confidence
    };
  }

  // Métodos de validación específicos
  private validateName(value: any): boolean {
    if (typeof value !== 'string') return false;
    const cleaned = value.trim();
    return cleaned.length >= 3 && cleaned.length <= 100 && 
           /^[A-Za-zÀ-ÿ\s\.]+$/.test(cleaned) &&
           cleaned.split(' ').length >= 2;
  }

  private validateRFC(value: any): boolean {
    if (typeof value !== 'string') return false;
    return /^[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/.test(value.trim());
  }

  private validateCURP(value: any): boolean {
    if (typeof value !== 'string') return false;
    return /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A]\d$/.test(value.trim());
  }

  private validateNSS(value: any): boolean {
    if (typeof value === 'number') return value.toString().length >= 10;
    if (typeof value !== 'string') return false;
    const cleaned = value.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11;
  }

  private validateSalary(value: any): boolean {
    let num: number;
    if (typeof value === 'number') {
      num = value;
    } else if (typeof value === 'string') {
      num = parseFloat(value.replace(/[$,\s]/g, ''));
    } else {
      return false;
    }
    return !isNaN(num) && num >= 1000 && num <= 1000000;
  }

  private validateDate(value: any): boolean {
    if (value instanceof Date) return !isNaN(value.getTime());
    if (typeof value !== 'string') return false;
    
    const datePatterns = [
      /^\d{1,2}\/\d{1,2}\/\d{4}$/,
      /^\d{4}-\d{2}-\d{2}$/,
      /^\d{1,2}-\d{1,2}-\d{4}$/
    ];
    
    return datePatterns.some(pattern => pattern.test(value));
  }

  private validateGender(value: any): boolean {
    if (typeof value !== 'string') return false;
    const cleaned = value.trim().toUpperCase();
    return ['M', 'F', 'H', 'MASCULINO', 'FEMENINO', 'HOMBRE', 'MUJER'].includes(cleaned);
  }

  private validateEmployeeCode(value: any): boolean {
    if (typeof value === 'number') return value.toString().length >= 3;
    if (typeof value !== 'string') return false;
    const cleaned = value.trim();
    return cleaned.length >= 3 && cleaned.length <= 15;
  }

  // Métodos auxiliares
  private calculateNameScore(columnName: string, keywords: string[]): number {
    const name = columnName.toLowerCase();
    return keywords.reduce((score, keyword) => {
      if (name.includes(keyword.toLowerCase())) return score + 1;
      return score;
    }, 0) / keywords.length;
  }

  private calculatePatternScore(values: any[], patterns: RegExp[]): number {
    if (patterns.length === 0) return 0;
    
    let matches = 0;
    const sampleSize = Math.min(10, values.length);
    
    for (let i = 0; i < sampleSize; i++) {
      const value = values[i];
      if (patterns.some(pattern => pattern.test(String(value)))) {
        matches++;
      }
    }
    
    return matches / sampleSize;
  }

  private calculateValidatorScore(values: any[], validator: (value: any) => boolean): number {
    if (!validator) return 0;
    
    let matches = 0;
    const sampleSize = Math.min(10, values.length);
    
    for (let i = 0; i < sampleSize; i++) {
      if (validator(values[i])) {
        matches++;
      }
    }
    
    return matches / sampleSize;
  }

  private detectHeaderRow(tableData: any[][]): number {
    // Buscar la fila que más parezca un encabezado
    let bestScore = -1;
    let bestRow = 0;
    
    for (let i = 0; i < Math.min(5, tableData.length); i++) {
      const row = tableData[i];
      let score = 0;
      
      for (const cell of row) {
        if (cell && typeof cell === 'string') {
          const str = cell.toString().trim();
          
          // Características de encabezado
          if (str.length > 2) score += 1;
          if (/^[A-Za-z]/.test(str)) score += 1;
          if (str.includes(' ')) score += 0.5;
          if (this.isLikelyHeaderWord(str)) score += 2;
        }
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestRow = i;
      }
    }
    
    return bestRow;
  }

  private isLikelyHeaderWord(word: string): boolean {
    const headerWords = [
      'nombre', 'name', 'rfc', 'curp', 'fecha', 'date', 'sueldo', 'salario', 
      'salary', 'codigo', 'clave', 'employee', 'empleado', 'sexo', 'gender'
    ];
    
    return headerWords.some(hw => word.toLowerCase().includes(hw));
  }

  private determineTableType(columns: DetectedColumn[]): 'active_personnel' | 'terminations' | 'other' {
    let activeScore = 0;
    let terminationScore = 0;
    
    for (const column of columns) {
      const name = column.name.toLowerCase();
      
      // Puntos para empleados activos
      if (name.includes('activo') || name.includes('active')) activeScore += 3;
      if (name.includes('ingreso') || name.includes('hire')) activeScore += 2;
      if (name.includes('sueldo') || name.includes('salary')) activeScore += 1;
      
      // Puntos para terminaciones
      if (name.includes('baja') || name.includes('termination')) terminationScore += 3;
      if (name.includes('terminacion') || name.includes('salida')) terminationScore += 3;
      if (name.includes('causa') || name.includes('reason')) terminationScore += 2;
      if (name.includes('prima') || name.includes('indemnizacion')) terminationScore += 2;
    }
    
    if (terminationScore > activeScore && terminationScore > 3) {
      return 'terminations';
    } else if (activeScore > 2) {
      return 'active_personnel';
    }
    
    return 'other';
  }

  private calculateTableConfidence(columns: DetectedColumn[]): number {
    if (columns.length === 0) return 0;
    
    const averageConfidence = columns.reduce((sum, col) => sum + col.confidence, 0) / columns.length;
    return Math.round(averageConfidence);
  }

  private calculateOverallConfidence(tables: DetectedTable[]): number {
    if (tables.length === 0) return 0;
    
    const averageConfidence = tables.reduce((sum, table) => sum + table.confidence, 0) / tables.length;
    return Math.round(averageConfidence);
  }

  private generateMapping(tables: DetectedTable[]): Record<string, string> {
    const mapping: Record<string, string> = {};
    
    for (const table of tables) {
      for (const column of tables[0].columns) {
        mapping[column.name] = column.suggestedStandardName;
      }
    }
    
    return mapping;
  }

  private detectAnomalies(tables: DetectedTable[], rawData: any[][]): string[] {
    const anomalies: string[] = [];
    
    // Detectar tablas con muy pocos datos
    for (const table of tables) {
      if (table.rowCount < 5) {
        anomalies.push(`Tabla "${table.name}" tiene muy pocos registros (${table.rowCount})`);
      }
    }
    
    // Detectar columnas con baja confianza
    for (const table of tables) {
      for (const column of table.columns) {
        if (column.confidence < 0.5) {
          anomalies.push(`Columna "${column.name}" no se pudo clasificar claramente (${column.confidence}% confianza)`);
        }
      }
    }
    
    return anomalies;
  }

  private generateTableName(tableData: any[][], tableIndex: number): string {
    if (tableData.length === 0) return `Tabla ${tableIndex + 1}`;
    
    // Buscar pistas en los primeros datos
    const headerRow = tableData[0] || [];
    const sampleData = tableData.slice(1, 3);
    
    // Buscar palabras clave
    const allText = [...headerRow, ...sampleData.flat()]
      .filter(cell => cell && typeof cell === 'string')
      .join(' ')
      .toLowerCase();
    
    if (allText.includes('activo') || allText.includes('active')) {
      return 'Empleados Activos';
    } else if (allText.includes('baja') || allText.includes('terminacion')) {
      return 'Terminaciones';
    } else if (allText.includes('nomina') || allText.includes('payroll')) {
      return 'Nómina';
    }
    
    return `Datos ${tableIndex + 1}`;
  }

  private detectDataQualityIssues(values: any[], detectedType: string): string[] {
    const issues: string[] = [];
    
    // Calcular estadísticas básicas
    const totalValues = values.length;
    const nullValues = values.filter(v => v === null || v === undefined || v === '').length;
    const nullPercentage = (nullValues / totalValues) * 100;
    
    if (nullPercentage > 20) {
      issues.push(`${nullPercentage.toFixed(1)}% valores faltantes`);
    }
    
    // Validaciones específicas por tipo
    if (detectedType === 'name') {
      const shortNames = values.filter(v => v && v.toString().trim().length < 5).length;
      if (shortNames > totalValues * 0.1) {
        issues.push('Nombres muy cortos detectados');
      }
    }
    
    if (detectedType === 'number') {
      const nonNumeric = values.filter(v => v && isNaN(parseFloat(v.toString()))).length;
      if (nonNumeric > 0) {
        issues.push(`${nonNumeric} valores no numéricos en columna numérica`);
      }
    }
    
    return issues;
  }

  private suggestStandardColumnName(columnName: string, detectedType: string, sampleValues: any[]): string {
    const name = columnName.toLowerCase();
    
    // Mapeo basado en tipo detectado y nombre
    if (detectedType === 'name') {
      if (name.includes('empleado') || name.includes('nombre')) return 'employee_name';
    }
    
    if (detectedType === 'id') {
      if (name.includes('rfc')) return 'rfc';
      if (name.includes('curp')) return 'curp';
      if (name.includes('nss') || name.includes('imss')) return 'nss';
      if (name.includes('codigo') || name.includes('clave')) return 'employee_code';
    }
    
    if (detectedType === 'date') {
      if (name.includes('nacimiento')) return 'birth_date';
      if (name.includes('ingreso')) return 'hire_date';
      if (name.includes('baja') || name.includes('terminacion')) return 'termination_date';
    }
    
    if (detectedType === 'number') {
      if (name.includes('base')) return 'base_salary';
      if (name.includes('integrado')) return 'integrated_salary';
    }
    
    return `${detectedType}_field`;
  }

  private sampleArray<T>(array: T[], sampleSize: number): T[] {
    if (array.length <= sampleSize) return array;
    
    const step = array.length / sampleSize;
    const sampled: T[] = [];
    
    for (let i = 0; i < sampleSize; i++) {
      const index = Math.floor(i * step);
      sampled.push(array[index]);
    }
    
    return sampled;
  }
}