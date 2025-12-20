export interface FormatDetectionResult {
  primaryFormat: 'structured_excel' | 'unstructured_excel' | 'pdf_table' | 'pdf_text' | 'csv' | 'tsv' | 'image_table' | 'free_text';
  confidence: number;
  characteristics: {
    hasHeaders: boolean;
    hasMultipleTables: boolean;
    dataQuality: 'high' | 'medium' | 'low';
    structureConsistency: number;
    estimatedRecords: number;
  };
  processingStrategy: {
    method: string;
    priority: number;
    expectedChallenges: string[];
    suggestions: string[];
  };
}

export class IntelligentFormatDetector {
  /**
   * Detecta y clasifica el formato de datos de manera inteligente
   */
  public async detectFormat(fileType: string, data: any[][], metadata?: any): Promise<FormatDetectionResult> {
    console.log(`🔍 DETECCIÓN INTELIGENTE: Analizando formato de ${fileType}...`);
    
    if (!data || data.length === 0) {
      throw new Error('No hay datos para analizar formato');
    }

    // Análisis por tipo de archivo
    switch (fileType) {
      case 'excel':
        return this.analyzeExcelFormat(data);
      case 'pdf':
        return this.analyzePDFFormat(data, metadata?.extractedText);
      case 'csv':
        return this.analyzeCSVFormat(data);
      case 'image':
        return this.analyzeImageFormat(data, metadata?.extractedText);
      case 'text':
        return this.analyzeTextFormat(data, metadata?.extractedText);
      default:
        return this.analyzeUnknownFormat(data);
    }
  }

  /**
   * Analiza formato de archivos Excel
   */
  private async analyzeExcelFormat(data: any[][]): Promise<FormatDetectionResult> {
    const analysis = {
      hasHeaders: this.detectHeaders(data),
      structureConsistency: this.analyzeStructureConsistency(data),
      dataQuality: this.assessDataQuality(data),
      hasMultipleTables: this.detectMultipleTables(data),
      estimatedRecords: this.estimateRecordCount(data)
    };

    console.log('📊 Excel Analysis:', analysis);

    // Determinar si es estructurado o desestructurado
    const isStructured = analysis.structureConsistency > 0.8 && 
                        analysis.hasHeaders && 
                        analysis.dataQuality !== 'low';

    const confidence = this.calculateConfidence([
      analysis.structureConsistency,
      analysis.hasHeaders ? 0.9 : 0.3,
      analysis.dataQuality === 'high' ? 0.9 : analysis.dataQuality === 'medium' ? 0.6 : 0.2
    ]);

    return {
      primaryFormat: isStructured ? 'structured_excel' : 'unstructured_excel',
      confidence,
      characteristics: {
        hasHeaders: analysis.hasHeaders,
        hasMultipleTables: analysis.hasMultipleTables,
        dataQuality: analysis.dataQuality,
        structureConsistency: analysis.structureConsistency,
        estimatedRecords: analysis.estimatedRecords
      },
      processingStrategy: this.generateExcelStrategy(isStructured, analysis)
    };
  }

  /**
   * Analiza formato de PDFs
   */
  private async analyzePDFFormat(data: any[][], extractedText?: string): Promise<FormatDetectionResult> {
    const hasTabularData = data.length > 1 && data.some(row => row.length > 2);
    const textAnalysis = extractedText ? this.analyzeTextStructure(extractedText) : null;
    
    const confidence = hasTabularData ? 0.8 : (textAnalysis?.hasStructure ? 0.6 : 0.3);
    const format = hasTabularData ? 'pdf_table' : 'pdf_text';

    return {
      primaryFormat: format,
      confidence,
      characteristics: {
        hasHeaders: hasTabularData ? this.detectHeaders(data) : false,
        hasMultipleTables: hasTabularData ? this.detectMultipleTables(data) : false,
        dataQuality: hasTabularData ? this.assessDataQuality(data) : 'medium',
        structureConsistency: hasTabularData ? this.analyzeStructureConsistency(data) : 0.5,
        estimatedRecords: hasTabularData ? this.estimateRecordCount(data) : 0
      },
      processingStrategy: {
        method: format === 'pdf_table' ? 'table_extraction' : 'text_parsing',
        priority: hasTabularData ? 8 : 5,
        expectedChallenges: [
          'Posible OCR imperfecto',
          'Formato de tabla inconsistente',
          'Texto mezclado con datos'
        ],
        suggestions: [
          'Verificar extracción de datos',
          'Confirmar estructura de tabla',
          'Validar OCR de números críticos'
        ]
      }
    };
  }

  /**
   * Analiza formato CSV/TSV
   */
  private async analyzeCSVFormat(data: any[][]): Promise<FormatDetectionResult> {
    const analysis = {
      hasHeaders: this.detectHeaders(data),
      structureConsistency: this.analyzeStructureConsistency(data),
      dataQuality: this.assessDataQuality(data),
      estimatedRecords: this.estimateRecordCount(data)
    };

    const confidence = this.calculateConfidence([
      analysis.structureConsistency,
      analysis.hasHeaders ? 0.9 : 0.6,
      analysis.dataQuality === 'high' ? 0.9 : 0.7
    ]);

    return {
      primaryFormat: 'csv',
      confidence,
      characteristics: {
        hasHeaders: analysis.hasHeaders,
        hasMultipleTables: false,
        dataQuality: analysis.dataQuality,
        structureConsistency: analysis.structureConsistency,
        estimatedRecords: analysis.estimatedRecords
      },
      processingStrategy: {
        method: 'delimited_parsing',
        priority: 9,
        expectedChallenges: [
          'Delimitadores inconsistentes',
          'Campos con comillas',
          'Caracteres especiales'
        ],
        suggestions: [
          'Verificar delimitador detectado',
          'Revisar encoding de caracteres',
          'Confirmar formato de fechas'
        ]
      }
    };
  }

  /**
   * Analiza formato de imágenes
   */
  private async analyzeImageFormat(data: any[][], extractedText?: string): Promise<FormatDetectionResult> {
    const hasTabularData = data.length > 1;
    const confidence = hasTabularData ? 0.6 : 0.3;

    return {
      primaryFormat: 'image_table',
      confidence,
      characteristics: {
        hasHeaders: hasTabularData ? this.detectHeaders(data) : false,
        hasMultipleTables: false,
        dataQuality: 'medium',
        structureConsistency: hasTabularData ? 0.6 : 0,
        estimatedRecords: hasTabularData ? this.estimateRecordCount(data) : 0
      },
      processingStrategy: {
        method: 'ocr_table_extraction',
        priority: 4,
        expectedChallenges: [
          'Calidad de OCR variable',
          'Texto borroso o rotado',
          'Tablas mal alineadas',
          'Números mal interpretados'
        ],
        suggestions: [
          'Verificar todos los números críticos',
          'Confirmar nombres extraídos',
          'Revisar fechas interpretadas',
          'Validar estructura detectada'
        ]
      }
    };
  }

  /**
   * Analiza formato de texto libre
   */
  private async analyzeTextFormat(data: any[][], extractedText?: string): Promise<FormatDetectionResult> {
    const textAnalysis = extractedText ? this.analyzeTextStructure(extractedText) : null;
    const hasTabularData = data.length > 1;
    
    const confidence = hasTabularData ? 0.5 : (textAnalysis?.hasStructure ? 0.4 : 0.2);

    return {
      primaryFormat: 'free_text',
      confidence,
      characteristics: {
        hasHeaders: false,
        hasMultipleTables: false,
        dataQuality: 'low',
        structureConsistency: textAnalysis?.structureScore || 0,
        estimatedRecords: hasTabularData ? data.length : 0
      },
      processingStrategy: {
        method: 'text_pattern_extraction',
        priority: 2,
        expectedChallenges: [
          'Datos no estructurados',
          'Formato libre variable',
          'Información mezclada',
          'Extractores de patrones complejos'
        ],
        suggestions: [
          'Identificar patrones de datos',
          'Extraer información clave manualmente',
          'Convertir a formato estructurado',
          'Solicitar archivo en formato estándar'
        ]
      }
    };
  }

  /**
   * Analiza formatos desconocidos
   */
  private async analyzeUnknownFormat(data: any[][]): Promise<FormatDetectionResult> {
    return {
      primaryFormat: 'free_text',
      confidence: 0.1,
      characteristics: {
        hasHeaders: false,
        hasMultipleTables: false,
        dataQuality: 'low',
        structureConsistency: 0,
        estimatedRecords: 0
      },
      processingStrategy: {
        method: 'manual_analysis',
        priority: 1,
        expectedChallenges: [
          'Formato no reconocido',
          'Estructura desconocida',
          'Datos potencialmente corruptos'
        ],
        suggestions: [
          'Solicitar archivo en formato Excel o CSV',
          'Proporcionar layout estándar',
          'Verificar integridad del archivo'
        ]
      }
    };
  }

  // Métodos de análisis auxiliares

  private detectHeaders(data: any[][]): boolean {
    if (!data || data.length === 0) return false;
    
    const firstRow = data[0];
    if (!firstRow) return false;

    // Características típicas de encabezados
    let headerScore = 0;
    
    for (const cell of firstRow) {
      if (!cell) continue;
      
      const str = cell.toString().trim();
      
      // Texto no numérico
      if (isNaN(Number(str)) && str.length > 0) headerScore += 1;
      
      // Palabras clave de columnas actuariales
      const headerKeywords = ['nombre', 'rfc', 'sueldo', 'fecha', 'codigo', 'curp', 'salary', 'name'];
      if (headerKeywords.some(keyword => str.toLowerCase().includes(keyword))) {
        headerScore += 2;
      }
      
      // Capitalización típica de encabezado
      if (/^[A-Z]/.test(str)) headerScore += 0.5;
    }
    
    return headerScore >= firstRow.length * 0.6;
  }

  private analyzeStructureConsistency(data: any[][]): number {
    if (!data || data.length < 2) return 0;
    
    const expectedColumns = data[0]?.length || 0;
    if (expectedColumns === 0) return 0;
    
    let consistentRows = 0;
    let totalRows = 0;
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row) continue;
      
      totalRows++;
      
      // Verificar que tenga el número esperado de columnas (±1)
      if (Math.abs(row.length - expectedColumns) <= 1) {
        consistentRows++;
      }
      
      // Verificar que no esté completamente vacía
      if (row.some(cell => cell && cell.toString().trim())) {
        // Bonus por tener contenido
      }
    }
    
    return totalRows > 0 ? consistentRows / totalRows : 0;
  }

  private assessDataQuality(data: any[][]): 'high' | 'medium' | 'low' {
    if (!data || data.length < 2) return 'low';
    
    let qualityScore = 0;
    let totalCells = 0;
    let filledCells = 0;
    let suspiciousCells = 0;
    
    // Analizar muestra de datos
    const sampleSize = Math.min(10, data.length);
    
    for (let i = 1; i < sampleSize; i++) {
      const row = data[i];
      if (!row) continue;
      
      for (const cell of row) {
        totalCells++;
        
        if (cell && cell.toString().trim()) {
          filledCells++;
          
          // Detectar datos sospechosos
          const str = cell.toString();
          if (str.includes('###') || str.includes('ERROR') || str === '#N/A') {
            suspiciousCells++;
          }
        }
      }
    }
    
    const fillRate = filledCells / totalCells;
    const errorRate = suspiciousCells / totalCells;
    
    if (fillRate > 0.8 && errorRate < 0.05) return 'high';
    if (fillRate > 0.5 && errorRate < 0.15) return 'medium';
    return 'low';
  }

  private detectMultipleTables(data: any[][]): boolean {
    if (!data || data.length < 10) return false;
    
    let emptyRowCount = 0;
    let maxConsecutiveEmpty = 0;
    let currentConsecutiveEmpty = 0;
    
    for (const row of data) {
      const isEmpty = !row || row.every(cell => !cell || cell.toString().trim() === '');
      
      if (isEmpty) {
        emptyRowCount++;
        currentConsecutiveEmpty++;
        maxConsecutiveEmpty = Math.max(maxConsecutiveEmpty, currentConsecutiveEmpty);
      } else {
        currentConsecutiveEmpty = 0;
      }
    }
    
    // Si hay 3+ filas vacías consecutivas, probablemente hay múltiples tablas
    return maxConsecutiveEmpty >= 3;
  }

  private estimateRecordCount(data: any[][]): number {
    if (!data) return 0;
    
    let recordCount = 0;
    
    for (const row of data) {
      // Contar filas que no están vacías y no parecen encabezados
      if (row && row.some(cell => cell && cell.toString().trim())) {
        // Si la mayoría de celdas son números o fechas, probablemente es un registro
        const dataLikeCells = row.filter(cell => {
          if (!cell) return false;
          const str = cell.toString().trim();
          return !isNaN(Number(str)) || this.looksLikeDate(str) || this.looksLikeRFC(str);
        });
        
        if (dataLikeCells.length >= row.length * 0.3) {
          recordCount++;
        }
      }
    }
    
    return Math.max(0, recordCount - 1); // Restar posible encabezado
  }

  private analyzeTextStructure(text: string): {hasStructure: boolean, structureScore: number} {
    const lines = text.split('\n');
    let structuredLines = 0;
    
    for (const line of lines) {
      // Buscar patrones estructurados
      if (line.includes('\t') || 
          line.split(/\s{2,}/).length > 3 ||
          /\|\s*.+\s*\|/.test(line)) {
        structuredLines++;
      }
    }
    
    const structureScore = structuredLines / lines.length;
    return {
      hasStructure: structureScore > 0.3,
      structureScore
    };
  }

  private calculateConfidence(scores: number[]): number {
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(average * 100) / 100;
  }

  private generateExcelStrategy(isStructured: boolean, analysis: any): any {
    if (isStructured) {
      return {
        method: 'structured_excel_processing',
        priority: 10,
        expectedChallenges: [
          'Validación de tipos de datos',
          'Manejo de celdas vacías',
          'Formato de fechas variables'
        ],
        suggestions: [
          'Mapeo automático de columnas disponible',
          'Validación estándar aplicable',
          'Procesamiento rápido esperado'
        ]
      };
    } else {
      return {
        method: 'intelligent_excel_parsing',
        priority: 6,
        expectedChallenges: [
          'Estructura inconsistente',
          'Múltiples formatos en columnas',
          'Datos mezclados',
          'Encabezados ambiguos'
        ],
        suggestions: [
          'Requerirá mapeo manual de columnas',
          'Validación interactiva necesaria',
          'Tiempo de procesamiento extendido',
          'Confirmación de estructura requerida'
        ]
      };
    }
  }

  private looksLikeDate(str: string): boolean {
    return /\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(str) ||
           /\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}/.test(str);
  }

  private looksLikeRFC(str: string): boolean {
    return /^[A-Z]{3,4}\d{6}[A-Z0-9]{3}$/.test(str);
  }
}