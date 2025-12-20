import { MappedData, EmployeeRecord, TerminationRecord } from '../types/ValidationTypes';

interface RawData {
  activePersonnelRaw: any[][];
  terminationsRaw: any[][];
}

export class DataColumnMapper {
  // Column mapping patterns for intelligent detection
  private activePersonnelPatterns = {
    employeeCode: [
      'clave', 'num de empleado', 'numero empleado', 'id empleado', 'codigo empleado',
      'employee code', 'employee id', 'emp code', 'emp id'
    ],
    employeeName: [
      'identificador', 'nombre', 'name', 'empleado', 'employee name'
    ],
    gender: [
      'sexo', 'gender', 'genero', 's', 'sex', 'm o f', 'h o m'
    ],
    hireDate: [
      'fecha de ingreso', 'fecha ingreso', 'hire date', 'fecha entrada',
      'ingreso empresa', 'fecha de entrada', 'start date'
    ],
    birthDate: [
      'fecha de nacimiento', 'fecha nacimiento', 'birth date', 'rfc', 
      'nacimiento', 'fecha nac', 'f. nacimiento'
    ],
    nss: [
      'nss', 'numero seguro social', 'imss', 'seguro social', 'social security'
    ],
    employeeType: [
      'tipo de empleado', 'tipo empleado', 'employee type', 'categoria',
      'clasificacion', 'tipo'
    ],
    baseSalary: [
      'sueldo base', 'sueldo base mensual', 'salario base', 'base salary',
      'basic salary', 'sueldo basico'
    ],
    integratedSalary: [
      'sueldo integrado', 'sueldo integrado mensual', 'salario integrado',
      'integrated salary', 'sueldo total'
    ],
    position: [
      'puesto', 'position', 'job title', 'cargo', 'plaza'
    ],
    plant: [
      'planta', 'plant', 'sucursal', 'ubicacion', 'centro trabajo'
    ],
    contractType: [
      'tipo de contrato', 'tipo contrato', 'contract type', 'contrato'
    ]
  };

  private terminationPatterns = {
    employeeCode: [
      'clave', 'num de empleado', 'numero empleado', 'id empleado', 'codigo empleado'
    ],
    employeeName: [
      'nombre del empleado', 'nombre empleado', 'nombre', 'employee name'
    ],
    birthDate: [
      'fecha de nacimiento', 'fecha nacimiento', 'birth date', 'rfc', 'nacimiento'
    ],
    hireDate: [
      'fecha de ingreso', 'fecha ingreso empresa', 'hire date', 'fecha entrada'
    ],
    terminationDate: [
      'fecha de baja', 'fecha baja', 'fecha salida', 'termination date',
      'fecha de salida', 'exit date'
    ],
    terminationCause: [
      'causa de la baja', 'causa baja', 'motivo baja', 'termination cause',
      'razon salida', 'causa'
    ],
    lastBaseSalary: [
      'ultimo sueldo base', 'ultimo salario base', 'last base salary',
      'sueldo base final', 'ultimo sueldo mensual base'
    ],
    lastIntegratedSalary: [
      'ultimo sueldo integrado', 'ultimo salario integrado', 'last integrated salary',
      'ultimo sueldo mensual integrado', 'sueldo integrado final'
    ],
    seniorityPayment: [
      'monto pagado por prima de antiguedad', 'prima antiguedad', 'seniority payment',
      'pago prima', 'prima pagada'
    ],
    indemnificationPayment: [
      'monto pagado por indemnizacion', 'indemnizacion', 'indemnification',
      'pago indemnizacion', 'indemnizacion pagada'
    ]
  };

  public async mapColumns(rawData: RawData): Promise<MappedData> {
    // Map active personnel
    const activePersonnelMapping = this.detectColumnMapping(
      rawData.activePersonnelRaw, 
      this.activePersonnelPatterns
    );
    
    const activePersonnelData = this.convertActivePersonnelData(
      rawData.activePersonnelRaw,
      activePersonnelMapping
    );

    // Map terminations
    const terminationsMapping = this.detectColumnMapping(
      rawData.terminationsRaw,
      this.terminationPatterns
    );
    
    const terminationsData = this.convertTerminationsData(
      rawData.terminationsRaw,
      terminationsMapping
    );

    return {
      activePersonnel: activePersonnelData,
      terminations: terminationsData,
      columnMapping: {
        activePersonnel: activePersonnelMapping,
        terminations: terminationsMapping
      },
      metadata: {
        totalRows: activePersonnelData.length + terminationsData.length,
        activePersonnelRows: activePersonnelData.length,
        terminationsRows: terminationsData.length,
        detectedColumns: {
          activePersonnel: Object.keys(activePersonnelMapping),
          terminations: Object.keys(terminationsMapping)
        }
      }
    };
  }

  private detectColumnMapping(rawData: any[][], patterns: Record<string, string[]>): Record<string, number> {
    if (!rawData || rawData.length === 0) return {};
    
    const headerRow = rawData[0];
    if (!headerRow) return {};

    const mapping: Record<string, number> = {};
    
    // Normalize header row
    const normalizedHeaders = headerRow.map(header => 
      (header || '').toString().toLowerCase().trim().replace(/[^\w\s]/g, ' ')
    );

    // For each field we want to map
    for (const [fieldName, possibleNames] of Object.entries(patterns)) {
      let bestMatch = -1;
      let bestScore = 0;

      // Check each column header
      for (let colIndex = 0; colIndex < normalizedHeaders.length; colIndex++) {
        const header = normalizedHeaders[colIndex];
        
        // Calculate similarity score for each possible name
        for (const possibleName of possibleNames) {
          const normalizedPossible = possibleName.toLowerCase().replace(/[^\w\s]/g, ' ');
          const score = this.calculateSimilarity(header, normalizedPossible);
          
          if (score > bestScore && score > 0.7) { // Minimum similarity threshold
            bestScore = score;
            bestMatch = colIndex;
          }
        }
      }

      if (bestMatch >= 0) {
        mapping[fieldName] = bestMatch;
      }
    }

    return mapping;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    // Exact match gets highest score
    if (str1 === str2) return 1.0;
    
    // Check if one contains the other
    if (str1.includes(str2) || str2.includes(str1)) {
      return 0.9;
    }

    // Check for keyword matches
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    
    let matchCount = 0;
    for (const word1 of words1) {
      for (const word2 of words2) {
        if (word1.length > 2 && word2.length > 2) {
          if (word1 === word2) {
            matchCount += 2; // Exact word match
          } else if (word1.includes(word2) || word2.includes(word1)) {
            matchCount += 1; // Partial word match
          }
        }
      }
    }

    const maxWords = Math.max(words1.length, words2.length);
    return maxWords > 0 ? Math.min(matchCount / (maxWords * 2), 1.0) : 0;
  }

  private convertActivePersonnelData(rawData: any[][], mapping: Record<string, number>): EmployeeRecord[] {
    if (!rawData || rawData.length <= 1) return [];
    
    const dataRows = rawData.slice(1); // Skip header
    const records: EmployeeRecord[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (!row || this.isEmptyRow(row)) continue;

      const record: EmployeeRecord = {
        rowIndex: i + 2, // +2 for header and 1-based indexing
        employeeCode: this.extractValue(row, mapping.employeeCode, 'string'),
        employeeName: this.extractValue(row, mapping.employeeName, 'string'),
        gender: this.extractValue(row, mapping.gender, 'string'),
        hireDate: this.extractValue(row, mapping.hireDate, 'date'),
        birthDate: this.extractValue(row, mapping.birthDate, 'mixed'), // Could be date or RFC
        rfc: this.extractValue(row, mapping.rfc, 'string'),
        nss: this.extractValue(row, mapping.nss, 'string'),
        employeeType: this.extractValue(row, mapping.employeeType, 'string'),
        baseSalary: this.extractValue(row, mapping.baseSalary, 'number'),
        integratedSalary: this.extractValue(row, mapping.integratedSalary, 'number'),
        position: this.extractValue(row, mapping.position, 'string'),
        plant: this.extractValue(row, mapping.plant, 'string'),
        contractType: this.extractValue(row, mapping.contractType, 'string')
      };

      // Add any unmapped columns as additional data
      for (let j = 0; j < row.length; j++) {
        const isMapped = Object.values(mapping).includes(j);
        if (!isMapped && row[j] !== null && row[j] !== undefined && row[j] !== '') {
          record[`unmapped_col_${j}`] = row[j];
        }
      }

      records.push(record);
    }

    return records;
  }

  private convertTerminationsData(rawData: any[][], mapping: Record<string, number>): TerminationRecord[] {
    if (!rawData || rawData.length <= 1) return [];
    
    const dataRows = rawData.slice(1);
    const records: TerminationRecord[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (!row || this.isEmptyRow(row)) continue;

      const record: TerminationRecord = {
        rowIndex: i + 2,
        employeeCode: this.extractValue(row, mapping.employeeCode, 'string'),
        employeeName: this.extractValue(row, mapping.employeeName, 'string'),
        birthDate: this.extractValue(row, mapping.birthDate, 'mixed'),
        rfc: this.extractValue(row, mapping.rfc, 'string'),
        hireDate: this.extractValue(row, mapping.hireDate, 'date'),
        terminationDate: this.extractValue(row, mapping.terminationDate, 'date'),
        terminationCause: this.extractValue(row, mapping.terminationCause, 'string'),
        lastBaseSalary: this.extractValue(row, mapping.lastBaseSalary, 'number'),
        lastIntegratedSalary: this.extractValue(row, mapping.lastIntegratedSalary, 'number'),
        seniorityPayment: this.extractValue(row, mapping.seniorityPayment, 'number'),
        indemnificationPayment: this.extractValue(row, mapping.indemnificationPayment, 'number')
      };

      // Add unmapped columns
      for (let j = 0; j < row.length; j++) {
        const isMapped = Object.values(mapping).includes(j);
        if (!isMapped && row[j] !== null && row[j] !== undefined && row[j] !== '') {
          record[`unmapped_col_${j}`] = row[j];
        }
      }

      records.push(record);
    }

    return records;
  }

  private extractValue(row: any[], columnIndex: number | undefined, type: 'string' | 'number' | 'date' | 'mixed'): any {
    if (columnIndex === undefined || columnIndex < 0 || columnIndex >= row.length) {
      return null;
    }

    const value = row[columnIndex];
    
    if (value === null || value === undefined || value === '') {
      return null;
    }

    switch (type) {
      case 'string':
        return String(value).trim();
      
      case 'number':
        const numStr = String(value).replace(/[$,\s]/g, '');
        const parsed = parseFloat(numStr);
        return isNaN(parsed) ? null : parsed;
      
      case 'date':
        // Will be parsed later by validation agents
        return value;
      
      case 'mixed':
        // Could be date, RFC, or other format - return as-is for agent processing
        return value;
      
      default:
        return value;
    }
  }

  private isEmptyRow(row: any[]): boolean {
    if (!row || row.length === 0) return true;
    
    return row.every(cell => 
      cell === null || 
      cell === undefined || 
      cell === '' || 
      (typeof cell === 'string' && cell.trim() === '')
    );
  }
}