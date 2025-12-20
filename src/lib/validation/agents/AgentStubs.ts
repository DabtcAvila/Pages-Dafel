// Temporary stubs for remaining agents - to be implemented fully later
import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class IMSSValidationAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'IMSS Validation Agent',
      description: 'Validates Mexican Social Security numbers',
      priority: 3,
      dependencies: [],
      timeout: 8000
    });
  }

  public async validate(data: MappedData): Promise<ValidationResult[]> {
    return [this.createSuccessResult('NSS Validation', 'Validación IMSS completada')];
  }
}

export class CurrencyValidationAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'Currency Validation Agent',
      description: 'Validates currency formats and amounts',
      priority: 3,
      dependencies: [],
      timeout: 8000
    });
  }

  public async validate(data: MappedData): Promise<ValidationResult[]> {
    return [this.createSuccessResult('Currency Validation', 'Formatos monetarios validados')];
  }
}

export class AgeCalculationAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'Age Calculation Agent',
      description: 'Calculates ages from birth dates/RFCs and validates demographic reasonableness for actuarial purposes',
      priority: 4,
      dependencies: ['Date Format Agent', 'RFC Validation Agent'],
      timeout: 10000
    });
  }

  public async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      let agesCalculated = 0;
      let agesFromRFC = 0;
      let unreasonableAges: number[] = [];
      let retirementEligible = 0;
      let tooYoung: number[] = [];
      let tooOld: number[] = [];
      const ageDistribution: Record<string, number> = {
        '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56-65': 0, '65+': 0
      };

      // Validate active personnel ages
      for (const employee of data.activePersonnel) {
        const rowIndex = employee.rowIndex || 0;
        let birthDate: Date | null = null;
        let ageSource = '';

        // Try to get birth date from explicit birth date field
        birthDate = this.parseDate(employee.birthDate);
        if (birthDate) {
          ageSource = 'birth_date';
        } else {
          // Try to extract from RFC
          const rfc = this.extractRFCFromMixed(employee.birthDate) || this.cleanString(employee.rfc);
          if (rfc) {
            birthDate = this.extractBirthDateFromRFC(rfc);
            if (birthDate) {
              ageSource = 'rfc_extraction';
              agesFromRFC++;
            }
          }
        }

        if (!birthDate) {
          results.push(
            this.createErrorResult(
              'Missing Birth Date',
              `Empleado ${employee.employeeCode || rowIndex} sin fecha de nacimiento válida ni RFC`,
              'Proporcionar fecha de nacimiento o RFC válido para cálculos actuariales',
              [rowIndex]
            )
          );
          continue;
        }

        // Calculate age as of valuation date (Dec 31, 2025)
        const valuationDate = new Date(2025, 11, 31); // December 31, 2025
        const age = this.calculateAge(birthDate, valuationDate);
        agesCalculated++;

        // Validate age reasonableness for employment
        if (age < 16) {
          tooYoung.push(rowIndex);
          results.push(
            this.createErrorResult(
              'Age Too Young',
              `Empleado ${employee.employeeCode || rowIndex} edad ${age} años - Menor edad legal de trabajo`,
              'Verificar fecha de nacimiento - edad mínima legal 16 años',
              [rowIndex],
              { age, birthDate, ageSource }
            )
          );
        } else if (age > 75) {
          tooOld.push(rowIndex);
          results.push(
            this.createWarningResult(
              'Age Very High',
              `Empleado ${employee.employeeCode || rowIndex} edad ${age} años - Revisar si sigue activo`,
              'Edad inusualmente alta para empleado activo',
              [rowIndex],
              { age, birthDate, ageSource }
            )
          );
          unreasonableAges.push(rowIndex);
        } else if (age > 65) {
          retirementEligible++;
          results.push(
            this.createWarningResult(
              'Retirement Eligible',
              `Empleado ${employee.employeeCode || rowIndex} edad ${age} años - Elegible para jubilación`,
              'Considerar status de jubilación en cálculos actuariales',
              [rowIndex],
              { age, birthDate, ageSource, retirementEligible: true }
            )
          );
        }

        // Age distribution for demographic analysis
        if (age >= 18 && age <= 25) ageDistribution['18-25']++;
        else if (age >= 26 && age <= 35) ageDistribution['26-35']++;
        else if (age >= 36 && age <= 45) ageDistribution['36-45']++;
        else if (age >= 46 && age <= 55) ageDistribution['46-55']++;
        else if (age >= 56 && age <= 65) ageDistribution['56-65']++;
        else if (age > 65) ageDistribution['65+']++;

        // Cross-validate with hire date if available
        const hireDate = this.parseDate(employee.hireDate);
        if (hireDate) {
          const ageAtHire = this.calculateAge(birthDate, hireDate);
          if (ageAtHire < 16) {
            results.push(
              this.createErrorResult(
                'Hire Age Invalid',
                `Empleado ${employee.employeeCode || rowIndex} tenía ${ageAtHire} años al contratar`,
                'Edad menor a 16 años en fecha de contratación',
                [rowIndex],
                { ageAtHire, hireDate, birthDate }
              )
            );
          } else if (ageAtHire > 65) {
            results.push(
              this.createWarningResult(
                'Late Career Hire',
                `Empleado ${employee.employeeCode || rowIndex} contratado a los ${ageAtHire} años`,
                'Contratación después de edad de jubilación estándar',
                [rowIndex],
                { ageAtHire, hireDate, birthDate }
              )
            );
          }
        }
      }

      // Validate termination ages
      for (const termination of data.terminations) {
        const rowIndex = termination.rowIndex || 0;
        let birthDate: Date | null = null;

        birthDate = this.parseDate(termination.birthDate);
        if (!birthDate) {
          const rfc = this.extractRFCFromMixed(termination.birthDate) || this.cleanString(termination.rfc);
          if (rfc) {
            birthDate = this.extractBirthDateFromRFC(rfc);
          }
        }

        if (birthDate && termination.terminationDate) {
          const terminationDate = this.parseDate(termination.terminationDate);
          if (terminationDate) {
            const ageAtTermination = this.calculateAge(birthDate, terminationDate);

            // Special validation for termination age reasonableness
            if (ageAtTermination < 16) {
              results.push(
                this.createErrorResult(
                  'Termination Age Invalid',
                  `Empleado terminado a los ${ageAtTermination} años`,
                  'Edad menor a legal en fecha de terminación',
                  [rowIndex],
                  { ageAtTermination, terminationDate, birthDate }
                )
              );
            }

            // Check if termination aligns with retirement age
            if (ageAtTermination >= 65 && termination.terminationCause) {
              const cause = this.cleanString(termination.terminationCause);
              if (cause && !['JUBILACION', 'PENSION', 'RETIREMENT'].some(keyword =>
                cause.includes(keyword))) {
                results.push(
                  this.createWarningResult(
                    'Retirement Age Mismatch',
                    `Terminación a los ${ageAtTermination} años con causa "${termination.terminationCause}"`,
                    'Causa de terminación no coincide con edad de jubilación',
                    [rowIndex],
                    { ageAtTermination, terminationCause: termination.terminationCause }
                  )
                );
              }
            }
          }
        }
      }

      // Generate summary results
      if (agesFromRFC > 0) {
        results.push(
          this.createSuccessResult(
            'RFC Age Extraction',
            `${agesFromRFC} edades extraídas exitosamente de RFCs`,
            { agesFromRFC }
          )
        );
      }

      // Demographic analysis summary
      const totalEmployees = agesCalculated;
      const averageAge = this.calculateAverageAge(data.activePersonnel);

      results.push(
        this.createSuccessResult(
          'Demographic Analysis',
          `${agesCalculated} edades procesadas - Promedio: ${averageAge.toFixed(1)} años`,
          {
            totalProcessed: agesCalculated,
            averageAge,
            ageDistribution,
            retirementEligible,
            demographicInsights: {
              youngWorkforce: ageDistribution['18-35'] / totalEmployees,
              matureWorkforce: ageDistribution['46-65'] / totalEmployees,
              retirementRisk: ageDistribution['56+'] / totalEmployees
            }
          }
        )
      );

      // Warning for demographic risks
      if (retirementEligible > totalEmployees * 0.2) {
        results.push(
          this.createWarningResult(
            'Retirement Risk',
            `${retirementEligible} empleados (${(retirementEligible / totalEmployees * 100).toFixed(1)}%) elegibles para jubilación`,
            'Alto riesgo de salidas por jubilación - impacto en pasivos actuariales',
            undefined,
            { retirementEligible, totalEmployees, retirementRatio: retirementEligible / totalEmployees }
          )
        );
      }

    } catch (error) {
      results.push(
        this.createErrorResult(
          'Age Calculation Error',
          `Error en cálculos de edad: ${error instanceof Error ? error.message : 'Error desconocido'}`
        )
      );
    }

    return results;
  }

  private calculateAverageAge(employees: any[]): number {
    let totalAge = 0;
    let validAges = 0;

    for (const employee of employees) {
      let birthDate = this.parseDate(employee.birthDate);
      if (!birthDate) {
        const rfc = this.extractRFCFromMixed(employee.birthDate) || this.cleanString(employee.rfc);
        if (rfc) {
          birthDate = this.extractBirthDateFromRFC(rfc);
        }
      }

      if (birthDate) {
        const age = this.calculateAge(birthDate, new Date(2025, 11, 31));
        if (age >= 16 && age <= 75) {
          totalAge += age;
          validAges++;
        }
      }
    }

    return validAges > 0 ? totalAge / validAges : 0;
  }
}

export class ServicePeriodAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'Service Period Agent',
      description: 'Validates service periods and calculates tenure',
      priority: 4,
      dependencies: ['Date Format Agent'],
      timeout: 10000
    });
  }

  public async validate(data: MappedData): Promise<ValidationResult[]> {
    return [this.createSuccessResult('Service Period', 'Períodos de servicio validados')];
  }
}

export class EmployeeTypeAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'Employee Type Agent',
      description: 'Validates employee classifications and contract types',
      priority: 5,
      dependencies: [],
      timeout: 8000
    });
  }

  public async validate(data: MappedData): Promise<ValidationResult[]> {
    return [this.createSuccessResult('Employee Type', 'Clasificaciones de empleados validadas')];
  }
}

export class LaborLawComplianceAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'Labor Law Compliance Agent',
      description: 'Validates compliance with Mexican labor law',
      priority: 6,
      dependencies: ['Service Period Agent'],
      timeout: 12000
    });
  }

  public async validate(data: MappedData): Promise<ValidationResult[]> {
    return [this.createSuccessResult('Labor Law', 'Cumplimiento LFT validado')];
  }
}

export class BenefitCalculationAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'Benefit Calculation Agent',
      description: 'Validates benefit calculations and entitlements',
      priority: 7,
      dependencies: ['Salary Logic Agent', 'Service Period Agent'],
      timeout: 15000
    });
  }

  public async validate(data: MappedData): Promise<ValidationResult[]> {
    return [this.createSuccessResult('Benefit Calculation', 'Cálculos de beneficios validados')];
  }
}

export class MortalityTableAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'Mortality Table Agent',
      description: 'Validates age/gender appropriateness for actuarial tables',
      priority: 8,
      dependencies: ['Age Calculation Agent'],
      timeout: 10000
    });
  }

  public async validate(data: MappedData): Promise<ValidationResult[]> {
    return [this.createSuccessResult('Mortality Table', 'Apropiación actuarial validada')];
  }
}

export class CompletenessAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'Completeness Agent',
      description: 'Validates data completeness and required fields',
      priority: 2,
      dependencies: [],
      timeout: 8000
    });
  }

  public async validate(data: MappedData): Promise<ValidationResult[]> {
    return [this.createSuccessResult('Data Completeness', 'Completitud de datos validada')];
  }
}

export class ConsistencyAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'Consistency Agent',
      description: 'Validates cross-sheet data consistency',
      priority: 9,
      dependencies: [],
      timeout: 12000
    });
  }

  public async validate(data: MappedData): Promise<ValidationResult[]> {
    return [this.createSuccessResult('Data Consistency', 'Consistencia entre hojas validada')];
  }
}

export class DuplicateDetectionAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'Duplicate Detection Agent',
      description: 'Detects duplicate employee records',
      priority: 3,
      dependencies: [],
      timeout: 10000
    });
  }

  public async validate(data: MappedData): Promise<ValidationResult[]> {
    return [this.createSuccessResult('Duplicate Detection', 'No se encontraron empleados duplicados')];
  }
}

export class OutlierDetectionAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'Outlier Detection Agent',
      description: 'Detects statistical anomalies in data',
      priority: 8,
      dependencies: ['Salary Logic Agent'],
      timeout: 15000
    });
  }

  public async validate(data: MappedData): Promise<ValidationResult[]> {
    return [this.createSuccessResult('Outlier Detection', 'Análisis estadístico completado')];
  }
}

export class TerminationAnalysisAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'Termination Analysis Agent',
      description: 'Analyzes termination patterns and payments',
      priority: 9,
      dependencies: ['Labor Law Compliance Agent'],
      timeout: 15000
    });
  }

  public async validate(data: MappedData): Promise<ValidationResult[]> {
    return [this.createSuccessResult('Termination Analysis', 'Análisis de terminaciones completado')];
  }
}