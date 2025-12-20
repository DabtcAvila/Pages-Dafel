import * as XLSX from 'xlsx';
import { FileStructureAnalyzer } from './FileStructureAnalyzer';
import { IntelligentFormatDetector } from './IntelligentFormatDetector';

export interface ProcessedFileData {
  fileType: 'excel' | 'pdf' | 'csv' | 'image' | 'text' | 'unknown';
  detectedStructure: {
    tables: DetectedTable[];
    confidence: number;
    suggestedMapping: Record<string, string>;
    anomalies: string[];
  };
  rawData: any[][];
  extractedText?: string;
  metadata: {
    fileName: string;
    fileSize: number;
    format: string;
    processingTime: number;
    extractionMethod: string;
  };
  conversationalQuestions: ConversationalQuestion[];
}

export interface DetectedTable {
  name: string;
  confidence: number;
  columns: DetectedColumn[];
  rowCount: number;
  dataPreview: any[][];
  suggestedType: 'active_personnel' | 'terminations' | 'other';
}

export interface DetectedColumn {
  name: string;
  index: number;
  detectedType: 'name' | 'salary' | 'date' | 'id' | 'number' | 'text' | 'unknown';
  confidence: number;
  suggestedStandardName: string;
  sampleValues: any[];
  dataQualityIssues: string[];
}

export interface ConversationalQuestion {
  id: string;
  type: 'clarification' | 'confirmation' | 'choice' | 'correction';
  priority: 'high' | 'medium' | 'low';
  question: string;
  context: string;
  suggestedAnswer?: any;
  options?: any[];
  relatedData?: {
    columns?: string[];
    rows?: number[];
    values?: any[];
  };
}

export class UniversalFileProcessor {
  private formatDetector: IntelligentFormatDetector;
  private structureAnalyzer: FileStructureAnalyzer;

  constructor() {
    this.formatDetector = new IntelligentFormatDetector();
    this.structureAnalyzer = new FileStructureAnalyzer();
  }

  /**
   * Procesa cualquier tipo de archivo y extrae datos inteligentemente
   */
  public async processFile(file: File): Promise<ProcessedFileData> {
    const startTime = Date.now();
    
    console.log(`🤖 SISTEMA INTELIGENTE: Analizando archivo ${file.name} (${file.size} bytes)`);
    
    try {
      // Detectar tipo de archivo y formato
      const fileType = await this.detectFileType(file);
      console.log(`📁 Tipo detectado: ${fileType}`);

      let rawData: any[][] = [];
      let extractedText: string | undefined;
      let extractionMethod: string;

      // Procesar según el tipo detectado
      switch (fileType) {
        case 'excel':
          const excelResult = await this.processExcelFile(file);
          rawData = excelResult.data;
          extractionMethod = excelResult.method;
          break;
        
        case 'pdf':
          const pdfResult = await this.processPDFFile(file);
          rawData = pdfResult.data;
          extractedText = pdfResult.text;
          extractionMethod = pdfResult.method;
          break;
        
        case 'csv':
          const csvResult = await this.processCSVFile(file);
          rawData = csvResult.data;
          extractionMethod = csvResult.method;
          break;
        
        case 'image':
          const imageResult = await this.processImageFile(file);
          rawData = imageResult.data;
          extractedText = imageResult.text;
          extractionMethod = imageResult.method;
          break;
        
        case 'text':
          const textResult = await this.processTextFile(file);
          rawData = textResult.data;
          extractedText = textResult.text;
          extractionMethod = textResult.method;
          break;
        
        default:
          throw new Error(`Tipo de archivo no soportado: ${fileType}`);
      }

      // Analizar estructura inteligentemente
      const structureAnalysis = await this.structureAnalyzer.analyzeDataStructure(rawData);
      
      // Generar preguntas conversacionales
      const questions = await this.generateConversationalQuestions(structureAnalysis, rawData);

      const processingTime = Date.now() - startTime;

      const result: ProcessedFileData = {
        fileType,
        detectedStructure: structureAnalysis,
        rawData,
        extractedText,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          format: file.type || 'unknown',
          processingTime,
          extractionMethod
        },
        conversationalQuestions: questions
      };

      console.log(`✅ SISTEMA INTELIGENTE: Archivo procesado en ${processingTime}ms`);
      console.log(`📊 Datos detectados: ${structureAnalysis.tables.length} tablas, ${questions.length} preguntas generadas`);

      return result;

    } catch (error) {
      console.error('❌ Error procesando archivo:', error);
      throw new Error(`Error al procesar archivo: ${error.message}`);
    }
  }

  /**
   * Detecta el tipo de archivo de manera inteligente
   */
  private async detectFileType(file: File): Promise<ProcessedFileData['fileType']> {
    const fileName = file.name.toLowerCase();
    const mimeType = file.type.toLowerCase();
    
    // Primero verificar por extensión y MIME type
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || 
        mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return 'excel';
    }
    
    if (fileName.endsWith('.pdf') || mimeType === 'application/pdf') {
      return 'pdf';
    }
    
    if (fileName.endsWith('.csv') || mimeType === 'text/csv') {
      return 'csv';
    }
    
    if (fileName.match(/\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i) || 
        mimeType.startsWith('image/')) {
      return 'image';
    }
    
    if (fileName.endsWith('.txt') || mimeType.startsWith('text/')) {
      return 'text';
    }

    // Análisis de contenido si no se puede determinar por extensión
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    
    // Detectar Excel por firma de archivo (magic bytes)
    if (this.isExcelFile(uint8Array)) {
      return 'excel';
    }
    
    // Detectar PDF por firma
    if (this.isPDFFile(uint8Array)) {
      return 'pdf';
    }
    
    // Detectar imagen por firmas
    if (this.isImageFile(uint8Array)) {
      return 'image';
    }
    
    // Detectar CSV/texto si parece contenido de texto
    const text = new TextDecoder().decode(buffer.slice(0, 1024));
    if (this.isCSVContent(text)) {
      return 'csv';
    }
    
    if (this.isTextContent(text)) {
      return 'text';
    }
    
    return 'unknown';
  }

  /**
   * Procesa archivos Excel de manera inteligente
   */
  private async processExcelFile(file: File): Promise<{data: any[][], method: string}> {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    console.log(`📊 Excel detectado con ${workbook.SheetNames.length} hojas: ${workbook.SheetNames.join(', ')}`);
    
    // En lugar de buscar hojas específicas, analizar todas inteligentemente
    let bestSheet: XLSX.WorkSheet | null = null;
    let bestSheetName = '';
    let maxDataRows = 0;
    
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
      
      // Evaluar cuál hoja tiene más datos que parecen empleados
      const dataRows = this.estimateEmployeeDataRows(data);
      if (dataRows > maxDataRows) {
        maxDataRows = dataRows;
        bestSheet = sheet;
        bestSheetName = sheetName;
      }
    }
    
    if (!bestSheet) {
      throw new Error('No se encontraron datos válidos en el archivo Excel');
    }
    
    const data = XLSX.utils.sheet_to_json(bestSheet, { header: 1, defval: null });
    
    return {
      data,
      method: `Excel inteligente - Hoja '${bestSheetName}' seleccionada automáticamente (${maxDataRows} filas de datos)`
    };
  }

  /**
   * Procesa archivos PDF (por implementar con PDF parsing)
   */
  private async processPDFFile(file: File): Promise<{data: any[][], text: string, method: string}> {
    // Por ahora, simulamos la extracción de PDF
    // En implementación real, usaríamos pdf-parse o PDF.js
    console.log('⚠️ Procesamiento de PDF simulado - requerirá implementación de librería PDF');
    
    return {
      data: [
        ['Nombre', 'RFC', 'Sueldo', 'Fecha Ingreso'],
        ['Juan Pérez', 'PERJ800101ABC', '25000', '2020-01-15'],
        ['María García', 'GARM850615XYZ', '30000', '2019-05-20']
      ],
      text: 'Contenido extraído del PDF...',
      method: 'PDF con OCR simulado'
    };
  }

  /**
   * Procesa archivos CSV de manera inteligente
   */
  private async processCSVFile(file: File): Promise<{data: any[][], method: string}> {
    const text = await file.text();
    
    // Detectar delimitador inteligentemente
    const delimiter = this.detectCSVDelimiter(text);
    console.log(`📄 CSV detectado con delimitador: "${delimiter}"`);
    
    const lines = text.split('\n');
    const data: any[][] = [];
    
    for (const line of lines) {
      if (line.trim()) {
        const row = this.parseCSVLine(line, delimiter);
        data.push(row);
      }
    }
    
    return {
      data,
      method: `CSV inteligente - Delimitador '${delimiter}' detectado automáticamente`
    };
  }

  /**
   * Procesa imágenes con OCR (simulado)
   */
  private async processImageFile(file: File): Promise<{data: any[][], text: string, method: string}> {
    // En implementación real, usaríamos Tesseract.js u otro OCR
    console.log('⚠️ Procesamiento de imagen simulado - requerirá implementación de OCR');
    
    return {
      data: [
        ['Nombre', 'Puesto', 'Salario'],
        ['Ana López', 'Gerente', '45000'],
        ['Carlos Ruiz', 'Analista', '28000']
      ],
      text: 'Texto extraído de imagen con OCR...',
      method: 'OCR simulado en imagen'
    };
  }

  /**
   * Procesa archivos de texto
   */
  private async processTextFile(file: File): Promise<{data: any[][], text: string, method: string}> {
    const text = await file.text();
    
    // Intentar detectar si es texto estructurado
    const lines = text.split('\n');
    const data: any[][] = [];
    
    // Buscar patrones tabulares en el texto
    for (const line of lines) {
      if (line.trim()) {
        // Detectar si la línea tiene estructura tabular
        const row = this.extractDataFromTextLine(line);
        if (row.length > 1) {
          data.push(row);
        }
      }
    }
    
    return {
      data,
      text,
      method: 'Análisis inteligente de texto estructurado'
    };
  }

  // Helper methods para detección de archivos

  private isExcelFile(bytes: Uint8Array): boolean {
    // Excel XLSX signature: PK (ZIP header)
    if (bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4B) {
      return true;
    }
    // Excel XLS signature
    if (bytes.length >= 8) {
      const signature = Array.from(bytes.slice(0, 8)).map(b => b.toString(16)).join('');
      return signature.includes('d0cf11e0a1b11ae1');
    }
    return false;
  }

  private isPDFFile(bytes: Uint8Array): boolean {
    if (bytes.length >= 4) {
      const signature = String.fromCharCode(...bytes.slice(0, 4));
      return signature === '%PDF';
    }
    return false;
  }

  private isImageFile(bytes: Uint8Array): boolean {
    if (bytes.length >= 4) {
      // PNG signature
      if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
        return true;
      }
      // JPEG signature
      if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
        return true;
      }
    }
    return false;
  }

  private isCSVContent(text: string): boolean {
    // Detectar si tiene estructura CSV
    const lines = text.split('\n').slice(0, 5);
    let commaCount = 0;
    let semicolonCount = 0;
    
    for (const line of lines) {
      commaCount += (line.match(/,/g) || []).length;
      semicolonCount += (line.match(/;/g) || []).length;
    }
    
    return commaCount > 10 || semicolonCount > 10;
  }

  private isTextContent(text: string): boolean {
    // Es texto si contiene caracteres legibles
    const printableChars = text.replace(/[\x00-\x1F\x7F-\x9F]/g, '').length;
    return printableChars / text.length > 0.8;
  }

  private estimateEmployeeDataRows(data: any[][]): number {
    if (!data || data.length < 2) return 0;
    
    let employeeScore = 0;
    const sampleSize = Math.min(10, data.length - 1);
    
    for (let i = 1; i <= sampleSize; i++) {
      const row = data[i];
      if (row) {
        // Buscar patrones que sugieran datos de empleados
        for (const cell of row) {
          if (cell && typeof cell === 'string') {
            if (this.looksLikeName(cell)) employeeScore += 3;
            if (this.looksLikeRFC(cell)) employeeScore += 5;
            if (this.looksLikeSalary(cell)) employeeScore += 2;
          }
        }
      }
    }
    
    return employeeScore;
  }

  private looksLikeName(str: string): boolean {
    const cleaned = str.trim();
    return /^[A-Za-zÀ-ÿ\s]+$/.test(cleaned) && cleaned.includes(' ') && cleaned.length > 5;
  }

  private looksLikeRFC(str: string): boolean {
    return /^[A-Z]{3,4}\d{6}[A-Z0-9]{3}$/.test(str.trim());
  }

  private looksLikeSalary(value: any): boolean {
    if (typeof value === 'number') return value > 1000 && value < 1000000;
    if (typeof value === 'string') {
      const num = parseFloat(value.replace(/[$,\s]/g, ''));
      return !isNaN(num) && num > 1000 && num < 1000000;
    }
    return false;
  }

  private detectCSVDelimiter(text: string): string {
    const sample = text.slice(0, 1000);
    const delimiters = [',', ';', '\t', '|'];
    let maxCount = 0;
    let bestDelimiter = ',';
    
    for (const delimiter of delimiters) {
      const count = (sample.match(new RegExp(delimiter, 'g')) || []).length;
      if (count > maxCount) {
        maxCount = count;
        bestDelimiter = delimiter;
      }
    }
    
    return bestDelimiter;
  }

  private parseCSVLine(line: string, delimiter: string): any[] {
    // Parser CSV simple - en implementación real usaríamos csv-parser
    return line.split(delimiter).map(cell => cell.trim().replace(/^"(.*)"$/, '$1'));
  }

  private extractDataFromTextLine(line: string): any[] {
    // Detectar si la línea tiene múltiples campos separados por espacios/tabs
    const parts = line.trim().split(/\s{2,}|\t/).filter(part => part.length > 0);
    
    if (parts.length >= 3) {
      return parts;
    }
    
    // Intentar otros patrones
    const commaParts = line.split(',').map(p => p.trim()).filter(p => p.length > 0);
    if (commaParts.length >= 3) {
      return commaParts;
    }
    
    return [line.trim()];
  }

  /**
   * Genera preguntas conversacionales basadas en el análisis
   */
  private async generateConversationalQuestions(
    structure: any, 
    rawData: any[][]
  ): Promise<ConversationalQuestion[]> {
    const questions: ConversationalQuestion[] = [];
    
    // Analizar datos y generar preguntas inteligentes
    if (structure.tables.length > 1) {
      questions.push({
        id: 'multiple_tables',
        type: 'choice',
        priority: 'high',
        question: '¿Qué tabla contiene los datos de empleados activos?',
        context: `Detecté ${structure.tables.length} tablas en tu archivo. Necesito saber cuál usar para el análisis actuarial.`,
        options: structure.tables.map((t, i) => ({
          id: i,
          name: t.name,
          description: `${t.rowCount} filas, confianza: ${t.confidence}%`
        }))
      });
    }
    
    // Preguntas sobre columnas ambiguas
    for (const table of structure.tables) {
      for (const column of table.columns) {
        if (column.confidence < 0.8) {
          questions.push({
            id: `column_${column.index}`,
            type: 'clarification',
            priority: 'medium',
            question: `¿Qué contiene la columna "${column.name}"?`,
            context: `No estoy seguro del contenido de esta columna. Valores de ejemplo: ${column.sampleValues.join(', ')}`,
            suggestedAnswer: column.suggestedStandardName,
            relatedData: {
              columns: [column.name],
              values: column.sampleValues
            }
          });
        }
      }
    }
    
    return questions;
  }
}