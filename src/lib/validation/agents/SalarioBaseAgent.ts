import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class SalarioBaseAgent extends BaseValidationAgent {
  constructor() {
    super({
      name: 'Salario Base Expert',
      description: 'Especialista en validación de salarios base según normativas mexicanas',
      priority: 8,
      dependencies: [],
      timeout: 15000
    });
  }

  // Mexican minimum wages by year (approximate values)
  private readonly minimumWages: Record<number, number> = {
    2024: 248.93,
    2023: 207.44,
    2022: 172.87,
    2021: 141.70,
    2020: 123.22,
    2019: 102.68,
    2018: 88.36,
    2017: 80.04,
    2016: 73.04,
    2015: 70.10
  };

  async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      // Validate active personnel salaries
      if (data.activePersonnel && data.activePersonnel.length > 0) {
        const personnelResults = await this.validatePersonnelSalaries(data.activePersonnel);
        results.push(...personnelResults);
      }

      // Statistical analysis of salary distribution
      const distributionResults = await this.performSalaryDistributionAnalysis(data.activePersonnel || []);
      results.push(...distributionResults);

      // Outlier detection
      const outlierResults = await this.detectSalaryOutliers(data.activePersonnel || []);
      results.push(...outlierResults);

    } catch (error) {
      results.push(this.createErrorResult(
        'Salary System Error',
        `Error crítico en validación de salarios: ${error.message}`,
        'Revisar formato de datos salariales'
      ));
    }

    return results;
  }

  private async validatePersonnelSalaries(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const rowNumber = i + 2;
      
      const salary = this.extractSalaryFromEmployee(employee);
      
      if (salary === null) {
        results.push(this.createErrorResult(
          'Salario Base Faltante',
          `Empleado sin salario base en fila ${rowNumber}`,
          'Todo empleado debe tener salario base registrado',
          [rowNumber]
        ));
        continue;
      }

      // Validate salary amount
      const salaryValidation = this.validateSalaryAmount(salary, employee, rowNumber, currentYear);
      if (salaryValidation) {
        results.push(salaryValidation);
      }

      // Validate salary vs position consistency
      const positionValidation = this.validateSalaryPositionConsistency(salary, employee, rowNumber);
      if (positionValidation) {
        results.push(positionValidation);
      }

      // Validate salary vs seniority
      const seniorityValidation = this.validateSalarySeniorityConsistency(salary, employee, rowNumber);
      if (seniorityValidation) {
        results.push(seniorityValidation);
      }
    }

    return results;
  }

  private extractSalaryFromEmployee(employee: any): number | null {
    const possibleFields = [
      'salarioBase', 'salario_base', 'SALARIO_BASE',
      'salario', 'SALARIO', 'sueldo', 'SUELDO',
      'salarioMensual', 'salario_mensual', 'SALARIO_MENSUAL',
      'sueldoBase', 'sueldo_base', 'SUELDO_BASE',
      'remuneracion', 'remuneración', 'REMUNERACION'
    ];

    for (const field of possibleFields) {
      if (employee[field] !== undefined && employee[field] !== null) {
        const numericValue = this.parseNumeric(employee[field]);
        if (numericValue !== null && numericValue > 0) {
          return numericValue;
        }
      }
    }

    return null;
  }

  private validateSalaryAmount(salary: number, employee: any, rowNumber: number, currentYear: number): ValidationResult | null {
    // 1. Check against minimum wage
    const minimumWage = this.getMinimumWage(currentYear);
    const monthlyMinimum = minimumWage * 30; // Approximate monthly minimum

    if (salary < monthlyMinimum) {
      return this.createErrorResult(
        'Salario Bajo Mínimo Legal',
        `Salario $${salary.toLocaleString()} está por debajo del mínimo legal (~$${monthlyMinimum.toLocaleString()})`,
        'Verificar que el salario cumpla con el salario mínimo vigente',
        [rowNumber],
        { salary, minimumRequired: monthlyMinimum, currentMinimumWage: minimumWage }
      );
    }

    // 2. Check for unreasonably high salaries (potential data entry errors)
    const maxReasonableSalary = 500000; // $500k monthly seems unreasonable for most cases
    if (salary > maxReasonableSalary) {
      return this.createWarningResult(
        'Salario Excepcionalmente Alto',
        `Salario $${salary.toLocaleString()} es excepcionalmente alto`,
        'Verificar que no sea error de captura o que incluya prestaciones adicionales',
        [rowNumber],
        { salary, threshold: maxReasonableSalary }
      );
    }

    // 3. Check for common data entry errors (round numbers)
    if (this.isSuspiciousRoundNumber(salary)) {
      return this.createWarningResult(
        'Salario Número Redondo Sospechoso',
        `Salario $${salary.toLocaleString()} es un número muy redondo`,
        'Verificar que sea el salario real y no un placeholder',
        [rowNumber],
        { salary, isSuspiciousRound: true }
      );
    }

    // 4. Check for decimal precision issues
    if (this.hasSuspiciousDecimals(salary)) {
      return this.createWarningResult(
        'Salario Decimales Sospechosos',
        `Salario $${salary.toLocaleString()} tiene decimales inusuales`,
        'Verificar precisión del salario registrado',
        [rowNumber],
        { salary }
      );
    }

    return null;
  }

  private validateSalaryPositionConsistency(salary: number, employee: any, rowNumber: number): ValidationResult | null {
    const position = this.extractPositionFromEmployee(employee);
    if (!position) return null;

    const expectedRange = this.getExpectedSalaryRange(position);
    if (!expectedRange) return null;

    if (salary < expectedRange.min || salary > expectedRange.max) {
      return this.createWarningResult(
        'Salario Inconsistente con Puesto',
        `Salario $${salary.toLocaleString()} parece inconsistente para puesto "${position}"`,
        `Salario esperado para este puesto: $${expectedRange.min.toLocaleString()} - $${expectedRange.max.toLocaleString()}`,
        [rowNumber],
        { 
          salary, 
          position, 
          expectedMin: expectedRange.min, 
          expectedMax: expectedRange.max,
          deviation: salary < expectedRange.min ? 'below' : 'above'
        }
      );
    }

    return null;
  }

  private validateSalarySeniorityConsistency(salary: number, employee: any, rowNumber: number): ValidationResult | null {
    const hireDate = this.extractHireDateFromEmployee(employee);
    if (!hireDate) return null;

    const yearsOfService = this.calculateServiceYears(hireDate);
    const expectedSalaryAdjustment = this.calculateExpectedSalaryBySeniority(salary, yearsOfService);

    if (expectedSalaryAdjustment.hasIssue) {
      return this.createWarningResult(
        'Salario vs Antigüedad Inconsistente',
        expectedSalaryAdjustment.message,
        'Verificar que el salario refleje adecuadamente la antigüedad del empleado',
        [rowNumber],
        { 
          salary, 
          yearsOfService, 
          expectedAdjustment: expectedSalaryAdjustment.expectedFactor 
        }
      );
    }

    return null;
  }

  private async performSalaryDistributionAnalysis(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const salaries = personnel
      .map(emp => this.extractSalaryFromEmployee(emp))
      .filter(sal => sal !== null) as number[];

    if (salaries.length === 0) {
      return [this.createErrorResult(
        'Sin Datos Salariales',
        'No se encontraron datos de salarios válidos para analizar',
        'Revisar que las columnas de salarios contengan datos válidos'
      )];
    }

    // Calculate distribution statistics
    salaries.sort((a, b) => a - b);
    const stats = this.calculateSalaryStatistics(salaries);

    // Analysis results
    results.push(this.createSuccessResult(
      'Análisis Distribución Salarial',
      `Análisis de ${salaries.length} salarios: Media $${stats.mean.toLocaleString()}, Mediana $${stats.median.toLocaleString()}`,
      {
        totalSalaries: salaries.length,
        statistics: stats,
        distribution: this.categorizeSalaryDistribution(salaries)
      }
    ));

    // Check for unusual distributions
    if (stats.skewness > 2) {
      results.push(this.createWarningResult(
        'Distribución Salarial Muy Sesgada',
        'La distribución salarial muestra sesgo extremo hacia salarios altos',
        'Revisar si hay outliers o errores en los salarios más altos',
        [],
        { skewness: stats.skewness, interpretation: 'Sesgo hacia salarios altos' }
      ));
    }

    if (stats.coefficientOfVariation > 1.5) {
      results.push(this.createWarningResult(
        'Alta Variabilidad Salarial',
        `Coeficiente de variación de ${(stats.coefficientOfVariation * 100).toFixed(1)}% indica alta dispersión`,
        'Verificar si la variabilidad salarial es apropiada para la organización',
        [],
        { coefficientOfVariation: stats.coefficientOfVariation }
      ));
    }

    return results;
  }

  private async detectSalaryOutliers(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const salaryData = personnel
      .map((emp, index) => ({ salary: this.extractSalaryFromEmployee(emp), rowNumber: index + 2, employee: emp }))
      .filter(item => item.salary !== null);

    if (salaryData.length < 5) return results; // Need enough data for outlier detection

    const salaries = salaryData.map(item => item.salary!);
    const outliers = this.detectOutliersIQR(salaries);

    for (const outlierIndex of outliers) {
      const outlierData = salaryData[outlierIndex];
      const isHigh = outlierData.salary! > this.calculatePercentile(salaries, 75);

      results.push(this.createWarningResult(
        isHigh ? 'Salario Atípico Alto' : 'Salario Atípico Bajo',
        `Salario $${outlierData.salary!.toLocaleString()} es estadísticamente atípico`,
        'Verificar que el salario sea correcto y no un error de captura',
        [outlierData.rowNumber],
        { 
          salary: outlierData.salary, 
          outlierType: isHigh ? 'high' : 'low',
          position: this.extractPositionFromEmployee(outlierData.employee)
        }
      ));
    }

    return results;
  }

  private getMinimumWage(year: number): number {
    return this.minimumWages[year] || this.minimumWages[2024]; // Default to current year
  }

  private isSuspiciousRoundNumber(salary: number): boolean {
    // Check for very round numbers that might be placeholders
    const roundNumbers = [1000, 5000, 10000, 15000, 20000, 25000, 30000, 50000, 100000];
    return roundNumbers.includes(salary) || (salary % 10000 === 0 && salary >= 10000);
  }

  private hasSuspiciousDecimals(salary: number): boolean {
    // Check for unusual decimal patterns
    const decimalPart = salary - Math.floor(salary);
    
    // Exactly .00 is normal, but .01, .99, etc. might be suspicious in salary context
    if (decimalPart > 0 && decimalPart < 0.1 && decimalPart !== 0.05) {
      return true;
    }
    
    return false;
  }

  private extractPositionFromEmployee(employee: any): string | null {
    const possibleFields = [
      'puesto', 'PUESTO', 'position', 'POSITION',
      'cargo', 'CARGO', 'title', 'TITLE',
      'nivel', 'NIVEL', 'grade', 'GRADE'
    ];

    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string') {
        return employee[field].trim();
      }
    }

    return null;
  }

  private extractHireDateFromEmployee(employee: any): Date | null {
    const possibleFields = [
      'fechaIngreso', 'fecha_ingreso', 'FECHA_INGRESO',
      'fechaAlta', 'fecha_alta', 'FECHA_ALTA',
      'ingreso', 'INGRESO', 'hire_date', 'HIRE_DATE'
    ];

    for (const field of possibleFields) {
      if (employee[field]) {
        const date = this.parseDate(employee[field]);
        if (date) return date;
      }
    }

    return null;
  }

  private getExpectedSalaryRange(position: string): { min: number; max: number } | null {
    // Simplified position-to-salary mapping
    // In a real system, this would be from a comprehensive database
    const positionRanges: Record<string, { min: number; max: number }> = {
      'GERENTE': { min: 80000, max: 200000 },
      'DIRECTOR': { min: 150000, max: 400000 },
      'JEFE': { min: 40000, max: 100000 },
      'COORDINADOR': { min: 30000, max: 80000 },
      'SUPERVISOR': { min: 25000, max: 60000 },
      'ANALISTA': { min: 20000, max: 50000 },
      'ASISTENTE': { min: 15000, max: 35000 },
      'AUXILIAR': { min: 10000, max: 25000 },
      'OPERADOR': { min: 8000, max: 20000 },
      'OBRERO': { min: 8000, max: 18000 }
    };

    const normalizedPosition = position.toUpperCase();
    
    for (const [key, range] of Object.entries(positionRanges)) {
      if (normalizedPosition.includes(key)) {
        return range;
      }
    }

    return null;
  }

  private calculateExpectedSalaryBySeniority(salary: number, yearsOfService: number): { hasIssue: boolean; message?: string; expectedFactor?: number } {
    // Very basic seniority analysis
    if (yearsOfService < 1) return { hasIssue: false };

    // Expect some salary growth with seniority
    const expectedMinimumGrowth = 1 + (yearsOfService * 0.03); // 3% per year minimum
    const expectedMaximumGrowth = 1 + (yearsOfService * 0.15); // 15% per year maximum

    // This is a simplified check - in reality, we'd need historical salary data
    // For now, we just flag unusual patterns

    if (yearsOfService > 10 && salary < 20000) {
      return {
        hasIssue: true,
        message: `Empleado con ${yearsOfService} años tiene salario muy bajo`,
        expectedFactor: expectedMinimumGrowth
      };
    }

    if (yearsOfService < 2 && salary > 100000) {
      return {
        hasIssue: true,
        message: `Empleado nuevo (${yearsOfService} años) tiene salario muy alto`,
        expectedFactor: expectedMaximumGrowth
      };
    }

    return { hasIssue: false };
  }

  private calculateSalaryStatistics(salaries: number[]): {
    mean: number;
    median: number;
    mode: number | null;
    standardDeviation: number;
    variance: number;
    skewness: number;
    coefficientOfVariation: number;
    min: number;
    max: number;
    range: number;
  } {
    const n = salaries.length;
    const mean = salaries.reduce((sum, sal) => sum + sal, 0) / n;
    const median = this.calculatePercentile(salaries, 50);
    
    const variance = salaries.reduce((sum, sal) => sum + Math.pow(sal - mean, 2), 0) / n;
    const standardDeviation = Math.sqrt(variance);
    
    const skewness = salaries.reduce((sum, sal) => sum + Math.pow((sal - mean) / standardDeviation, 3), 0) / n;
    
    const coefficientOfVariation = standardDeviation / mean;
    
    return {
      mean,
      median,
      mode: this.calculateMode(salaries),
      standardDeviation,
      variance,
      skewness,
      coefficientOfVariation,
      min: Math.min(...salaries),
      max: Math.max(...salaries),
      range: Math.max(...salaries) - Math.min(...salaries)
    };
  }

  private calculatePercentile(sortedArray: number[], percentile: number): number {
    const index = (percentile / 100) * (sortedArray.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;

    if (upper >= sortedArray.length) return sortedArray[sortedArray.length - 1];
    if (lower === upper) return sortedArray[lower];

    return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
  }

  private calculateMode(numbers: number[]): number | null {
    const frequency: Record<number, number> = {};
    let maxFreq = 0;
    let mode: number | null = null;

    for (const num of numbers) {
      frequency[num] = (frequency[num] || 0) + 1;
      if (frequency[num] > maxFreq) {
        maxFreq = frequency[num];
        mode = num;
      }
    }

    return maxFreq > 1 ? mode : null;
  }

  private detectOutliersIQR(data: number[]): number[] {
    const sortedData = [...data].sort((a, b) => a - b);
    const q1 = this.calculatePercentile(sortedData, 25);
    const q3 = this.calculatePercentile(sortedData, 75);
    const iqr = q3 - q1;
    
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    const outliers: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i] < lowerBound || data[i] > upperBound) {
        outliers.push(i);
      }
    }
    
    return outliers;
  }

  private categorizeSalaryDistribution(salaries: number[]): Record<string, number> {
    const categories = {
      'Menos de 15k': 0,
      '15k - 30k': 0,
      '30k - 50k': 0,
      '50k - 80k': 0,
      '80k - 150k': 0,
      'Más de 150k': 0
    };

    for (const salary of salaries) {
      if (salary < 15000) categories['Menos de 15k']++;
      else if (salary < 30000) categories['15k - 30k']++;
      else if (salary < 50000) categories['30k - 50k']++;
      else if (salary < 80000) categories['50k - 80k']++;
      else if (salary < 150000) categories['80k - 150k']++;
      else categories['Más de 150k']++;
    }

    return categories;
  }
}