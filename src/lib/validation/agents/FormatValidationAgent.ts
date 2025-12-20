import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class FormatValidationAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'Format Validation Agent',
      description: 'Validates file structure, sheet presence, and basic format requirements',
      priority: 1,
      dependencies: [],
      timeout: 5000
    });
  }

  public async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    try {
      // Validate data structure exists
      if (!data.activePersonnel || !Array.isArray(data.activePersonnel)) {
        results.push(
          this.createErrorResult(
            'File Structure',
            'Estructura de datos de personal activo inválida o faltante',
            'Verificar que el archivo Excel contenga la hoja de datos de empleados'
          )
        );
        return results;
      }

      // Validate minimum data requirements
      if (data.activePersonnel.length === 0) {
        results.push(
          this.createErrorResult(
            'Data Volume',
            'No se encontraron registros de empleados activos',
            'El archivo debe contener al menos un empleado activo'
          )
        );
        return results;
      }

      // Success - basic structure is valid
      results.push(
        this.createSuccessResult(
          'File Structure',
          `Archivo Excel válido procesado - ${data.activePersonnel.length} empleados activos`,
          {
            activePersonnelCount: data.activePersonnel.length,
            terminationsCount: data.terminations?.length || 0,
            totalRecords: data.metadata.totalRows
          }
        )
      );

      // Validate column mapping success
      if (data.columnMapping?.activePersonnel) {
        const mappedColumns = Object.keys(data.columnMapping.activePersonnel).length;
        results.push(
          this.createSuccessResult(
            'Column Mapping',
            `Mapeo inteligente completado - ${mappedColumns} columnas identificadas`,
            { mappedColumns, columnMapping: data.columnMapping.activePersonnel }
          )
        );
      }

    } catch (error) {
      results.push(
        this.createErrorResult(
          'Format Validation',
          `Error durante validación de formato: ${error instanceof Error ? error.message : 'Error desconocido'}`
        )
      );
    }

    return results;
  }
}