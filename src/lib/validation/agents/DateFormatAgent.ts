import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class DateFormatAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'Date Format Agent',
      description: 'Validates date formats and extracts dates from RFC fields',
      priority: 2,
      dependencies: [],
      timeout: 10000
    });
  }

  public async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    try {
      let extractedFromRFC = 0;
      let invalidDates = 0;
      const affectedRows: number[] = [];

      for (const employee of data.activePersonnel) {
        const birthDate = this.parseDate(employee.birthDate);
        const hireDate = this.parseDate(employee.hireDate);
        
        // Try to extract from RFC if no birth date
        if (!birthDate && employee.birthDate) {
          const rfc = this.extractRFCFromMixed(employee.birthDate);
          if (rfc) {
            const extracted = this.extractBirthDateFromRFC(rfc);
            if (extracted) {
              extractedFromRFC++;
              affectedRows.push(employee.rowIndex || 0);
            }
          }
        }

        if (!birthDate && !hireDate) {
          invalidDates++;
          affectedRows.push(employee.rowIndex || 0);
        }
      }

      if (extractedFromRFC > 0) {
        results.push(
          this.createSuccessResult(
            'RFC Date Extraction',
            `${extractedFromRFC} fechas de nacimiento extraídas de RFCs automáticamente`,
            { extractedCount: extractedFromRFC, affectedRows }
          )
        );
      }

      if (invalidDates === 0) {
        results.push(
          this.createSuccessResult(
            'Date Validation',
            'Todas las fechas procesadas exitosamente'
          )
        );
      }

    } catch (error) {
      results.push(
        this.createErrorResult(
          'Date Processing',
          `Error procesando fechas: ${error instanceof Error ? error.message : 'Error desconocido'}`
        )
      );
    }

    return results;
  }
}