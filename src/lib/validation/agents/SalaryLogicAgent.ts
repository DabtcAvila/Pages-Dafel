import { BaseValidationAgent } from './BaseValidationAgent';
import { 
  ValidationResult, 
  MappedData, 
  MIN_SALARY_MXN,
  MAX_REASONABLE_SALARY_MXN,
  IMSS_SALARY_CAP_2025
} from '../types/ValidationTypes';

export class SalaryLogicAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'Salary Logic Agent',
      description: 'Validates salary relationships, ranges, and actuarial logic',
      priority: 3,
      dependencies: [],
      timeout: 15000
    });
  }

  public async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    try {
      // Validate active personnel salaries
      const activeResults = await this.validateActivePersonnelSalaries(data);
      results.push(...activeResults);
      
      // Validate termination salaries
      const terminationResults = await this.validateTerminationSalaries(data);
      results.push(...terminationResults);
      
      // Cross-validate salary progression patterns
      const progressionResults = await this.validateSalaryProgression(data);
      results.push(...progressionResults);
      
      // Generate summary
      const totalErrors = results.filter(r => r.severity === 'critical').length;
      const totalWarnings = results.filter(r => r.severity === 'warning').length;
      
      if (totalErrors === 0) {
        results.push(
          this.createSuccessResult(
            'Salary Validation',
            `Validación salarial completada - ${totalWarnings} advertencias menores`,
            { totalErrors, totalWarnings }
          )
        );
      }
      
    } catch (error) {
      results.push(
        this.createErrorResult(
          'Salary Validation',
          `Error en validación salarial: ${error instanceof Error ? error.message : 'Error desconocido'}`
        )
      );
    }
    
    return results;
  }

  private async validateActivePersonnelSalaries(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const invalidRelationships: number[] = [];
    const suspiciousRanges: number[] = [];
    const imssCapExceeded: number[] = [];

    for (let i = 0; i < data.activePersonnel.length; i++) {
      const employee = data.activePersonnel[i];
      const rowIndex = employee.rowIndex || i + 2;
      
      const baseSalary = this.parseNumeric(employee.baseSalary);
      const integratedSalary = this.parseNumeric(employee.integratedSalary);
      
      // Check if we have at least one salary
      if (!baseSalary && !integratedSalary) {
        results.push(
          this.createErrorResult(
            'Missing Salary Data',
            `Empleado ${employee.employeeCode || rowIndex} sin información salarial`,
            'Proporcionar al menos sueldo base o integrado',
            [rowIndex]
          )
        );
        continue;
      }

      // Validate base salary if present
      if (baseSalary !== null) {
        const baseSalaryValidation = this.validateSalaryRange(baseSalary, 'base');
        if (!baseSalaryValidation.isValid) {
          suspiciousRanges.push(rowIndex);
          results.push(
            this.createWarningResult(
              'Base Salary Range',
              `Sueldo base ${baseSalary.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} ${baseSalaryValidation.issue}`,
              baseSalaryValidation.suggestion,
              [rowIndex],
              { salary: baseSalary, type: 'base', issue: baseSalaryValidation.issue }
            )
          );
        }
      }

      // Validate integrated salary if present
      if (integratedSalary !== null) {
        const integratedSalaryValidation = this.validateSalaryRange(integratedSalary, 'integrated');
        if (!integratedSalaryValidation.isValid) {
          suspiciousRanges.push(rowIndex);
          results.push(
            this.createWarningResult(
              'Integrated Salary Range',
              `Sueldo integrado ${integratedSalary.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} ${integratedSalaryValidation.issue}`,
              integratedSalaryValidation.suggestion,
              [rowIndex],
              { salary: integratedSalary, type: 'integrated', issue: integratedSalaryValidation.issue }
            )
          );
        }

        // Check IMSS cap implications
        if (integratedSalary > IMSS_SALARY_CAP_2025) {
          imssCapExceeded.push(rowIndex);
          results.push(
            this.createSuccessResult(
              'IMSS Cap Analysis',
              `Sueldo integrado excede tope IMSS 2025 (${IMSS_SALARY_CAP_2025.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}) - Correcto para cálculos actuariales`,
              { 
                salary: integratedSalary, 
                imssCap: IMSS_SALARY_CAP_2025,
                affectedRows: [rowIndex],
                note: 'Sin límites IMSS aplicados según especificación'
              }
            )
          );
        }
      }

      // Critical validation: Integrated >= Base salary relationship
      if (baseSalary && integratedSalary) {
        if (integratedSalary < baseSalary) {
          invalidRelationships.push(rowIndex);
          results.push(
            this.createErrorResult(
              'Salary Relationship',
              `Sueldo integrado (${integratedSalary.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}) menor que base (${baseSalary.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })})`,
              'El sueldo integrado debe ser mayor o igual al base',
              [rowIndex],
              { baseSalary, integratedSalary, difference: baseSalary - integratedSalary }
            )
          );
        } else {
          // Check if the relationship seems reasonable (integrated should be 1.1x to 2x base typically)
          const ratio = integratedSalary / baseSalary;
          if (ratio > 3.0) {
            results.push(
              this.createWarningResult(
                'Salary Ratio',
                `Relación sueldo integrado/base muy alta: ${ratio.toFixed(2)}x`,
                'Verificar si incluye prestaciones extraordinarias',
                [rowIndex],
                { baseSalary, integratedSalary, ratio }
              )
            );
          } else if (ratio < 1.05) {
            results.push(
              this.createWarningResult(
                'Salary Ratio',
                `Sueldos base e integrado muy similares - ratio: ${ratio.toFixed(2)}x`,
                'Verificar si se incluyeron todas las prestaciones en integrado',
                [rowIndex],
                { baseSalary, integratedSalary, ratio }
              )
            );
          }
        }
      }

      // Validate salary consistency with employee type
      const salaryForType = baseSalary || integratedSalary;
      if (salaryForType && employee.employeeType) {
        const typeValidation = this.validateSalaryForEmployeeType(salaryForType, employee.employeeType);
        if (!typeValidation.isValid) {
          results.push(
            this.createWarningResult(
              'Salary Type Consistency',
              `Sueldo ${salaryForType.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} ${typeValidation.issue} para ${employee.employeeType}`,
              typeValidation.suggestion,
              [rowIndex],
              { salary: salaryForType, employeeType: employee.employeeType }
            )
          );
        }
      }
    }

    // Summary results for active personnel
    if (invalidRelationships.length > 0) {
      results.push(
        this.createErrorResult(
          'Critical Salary Relationships',
          `${invalidRelationships.length} empleados con sueldo integrado < base - Bloquea proceso`,
          'Corregir relaciones salariales antes de continuar',
          invalidRelationships
        )
      );
    }

    return results;
  }

  private async validateTerminationSalaries(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (let i = 0; i < data.terminations.length; i++) {
      const termination = data.terminations[i];
      const rowIndex = termination.rowIndex || i + 2;
      
      const lastBaseSalary = this.parseNumeric(termination.lastBaseSalary);
      const lastIntegratedSalary = this.parseNumeric(termination.lastIntegratedSalary);
      const seniorityPayment = this.parseNumeric(termination.seniorityPayment) || 0;
      const indemnificationPayment = this.parseNumeric(termination.indemnificationPayment) || 0;

      // Validate termination salary relationship
      if (lastBaseSalary && lastIntegratedSalary && lastIntegratedSalary < lastBaseSalary) {
        results.push(
          this.createErrorResult(
            'Termination Salary Relationship',
            `Empleado terminado: sueldo integrado < base`,
            'Corregir relación salarial',
            [rowIndex],
            { lastBaseSalary, lastIntegratedSalary }
          )
        );
      }

      // Validate payment reasonableness
      if (seniorityPayment > 0 && lastBaseSalary) {
        const maxSeniorityDays = 90; // Maximum days typically paid
        const maxSeniorityPayment = (lastBaseSalary * maxSeniorityDays) / 30;
        
        if (seniorityPayment > maxSeniorityPayment * 1.2) { // 20% tolerance
          results.push(
            this.createWarningResult(
              'Seniority Payment High',
              `Pago prima antigüedad parece alto: ${seniorityPayment.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`,
              `Máximo esperado ~${maxSeniorityPayment.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`,
              [rowIndex],
              { seniorityPayment, lastBaseSalary, maxExpected: maxSeniorityPayment }
            )
          );
        }
      }

      // Validate indemnification reasonableness
      if (indemnificationPayment > 0 && lastIntegratedSalary) {
        // Assuming maximum 20 days per year, max 20 years service
        const maxIndemnificationDays = 400;
        const maxIndemnificationPayment = (lastIntegratedSalary * maxIndemnificationDays) / 30;
        
        if (indemnificationPayment > maxIndemnificationPayment) {
          results.push(
            this.createWarningResult(
              'Indemnification High',
              `Pago indemnización parece alto: ${indemnificationPayment.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`,
              `Máximo esperado ~${maxIndemnificationPayment.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`,
              [rowIndex],
              { indemnificationPayment, lastIntegratedSalary, maxExpected: maxIndemnificationPayment }
            )
          );
        }
      }
    }

    return results;
  }

  private async validateSalaryProgression(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    // Group employees by position/type to detect outliers
    const salaryGroups: Record<string, number[]> = {};
    
    for (const employee of data.activePersonnel) {
      const salary = this.parseNumeric(employee.baseSalary) || this.parseNumeric(employee.integratedSalary);
      if (salary && employee.position) {
        const key = employee.position.toUpperCase().trim();
        if (!salaryGroups[key]) salaryGroups[key] = [];
        salaryGroups[key].push(salary);
      }
    }

    // Detect outliers within each position
    for (const [position, salaries] of Object.entries(salaryGroups)) {
      if (salaries.length < 3) continue; // Need minimum data for statistical analysis
      
      const stats = this.calculateSalaryStats(salaries);
      const outliers = this.detectSalaryOutliers(salaries, stats);
      
      if (outliers.length > 0) {
        results.push(
          this.createWarningResult(
            'Salary Outliers',
            `${outliers.length} sueldos atípicos detectados en posición "${position}"`,
            'Revisar si los sueldos son correctos o hay errores de captura',
            undefined,
            { 
              position, 
              outliers, 
              stats,
              note: 'Análisis estadístico de consistencia salarial'
            }
          )
        );
      }
    }

    return results;
  }

  private validateSalaryRange(salary: number, type: 'base' | 'integrated'): { isValid: boolean; issue?: string; suggestion?: string } {
    if (salary < MIN_SALARY_MXN) {
      return { 
        isValid: false, 
        issue: 'por debajo del salario mínimo legal',
        suggestion: `Verificar - salario mínimo 2025: ${MIN_SALARY_MXN.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`
      };
    }
    
    if (salary > MAX_REASONABLE_SALARY_MXN) {
      return { 
        isValid: false, 
        issue: 'excepcionalmente alto',
        suggestion: 'Verificar si el monto es correcto o hay error de captura'
      };
    }
    
    // Type-specific validations
    if (type === 'integrated' && salary < MIN_SALARY_MXN * 1.1) {
      return {
        isValid: false,
        issue: 'muy bajo para sueldo integrado',
        suggestion: 'Sueldo integrado debería incluir prestaciones adicionales'
      };
    }
    
    return { isValid: true };
  }

  private validateSalaryForEmployeeType(salary: number, employeeType: string): { isValid: boolean; issue?: string; suggestion?: string } {
    const type = employeeType.toUpperCase().trim();
    
    // Define expected ranges by employee type
    const expectedRanges = {
      'EJECUTIVO': { min: 50000, max: 500000 },
      'CONFIDENCIAL': { min: 30000, max: 300000 },
      'CONFIANZA': { min: 20000, max: 200000 },
      'SUPERVISOR': { min: 15000, max: 100000 },
      'ADMINISTRATIVO': { min: 8000, max: 50000 },
      'OPERATIVO': { min: 6000, max: 30000 },
      'SINDICALIZADO': { min: 6000, max: 50000 }
    };
    
    const range = expectedRanges[type];
    if (!range) return { isValid: true }; // Unknown type, skip validation
    
    if (salary < range.min) {
      return {
        isValid: false,
        issue: `bajo para tipo ${employeeType}`,
        suggestion: `Rango esperado: ${range.min.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} - ${range.max.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`
      };
    }
    
    if (salary > range.max) {
      return {
        isValid: false,
        issue: `alto para tipo ${employeeType}`,
        suggestion: `Rango esperado: ${range.min.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} - ${range.max.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`
      };
    }
    
    return { isValid: true };
  }

  private calculateSalaryStats(salaries: number[]): { mean: number; median: number; stdDev: number; q1: number; q3: number } {
    const sorted = [...salaries].sort((a, b) => a - b);
    const mean = salaries.reduce((sum, val) => sum + val, 0) / salaries.length;
    
    const median = sorted.length % 2 === 0 
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
    
    const variance = salaries.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / salaries.length;
    const stdDev = Math.sqrt(variance);
    
    const q1Index = Math.floor(sorted.length * 0.25);
    const q3Index = Math.floor(sorted.length * 0.75);
    
    return {
      mean,
      median,
      stdDev,
      q1: sorted[q1Index],
      q3: sorted[q3Index]
    };
  }

  private detectSalaryOutliers(salaries: number[], stats: any): number[] {
    const iqr = stats.q3 - stats.q1;
    const lowerBound = stats.q1 - (1.5 * iqr);
    const upperBound = stats.q3 + (1.5 * iqr);
    
    return salaries.filter(salary => salary < lowerBound || salary > upperBound);
  }
}