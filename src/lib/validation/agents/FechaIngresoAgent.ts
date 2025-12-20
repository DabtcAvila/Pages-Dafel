import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class FechaIngresoAgent extends BaseValidationAgent {
  private readonly legalWorkingAge = 15;
  private readonly minimumWorkingDays = 1; // Mínimo 1 día trabajado
  private readonly maximumServiceYears = 50; // Máximo servicio razonable

  private readonly temporalValidations = {
    futureDates: 'No permitidas',
    weekends: 'Válidas pero inusuales',
    holidays: 'Válidas pero inusuales',
    massHiring: 'Revisar si es normal para la empresa'
  };

  private readonly mexicanHolidays = [
    { month: 1, day: 1 },   // Año Nuevo
    { month: 2, day: 5 },   // Día de la Constitución (primer lunes)
    { month: 3, day: 21 },  // Natalicio de Benito Juárez (tercer lunes)
    { month: 5, day: 1 },   // Día del Trabajo
    { month: 9, day: 16 },  // Independencia
    { month: 11, day: 20 }, // Revolución Mexicana (tercer lunes)
    { month: 12, day: 1 },  // Transmisión del Poder Ejecutivo (cada 6 años)
    { month: 12, day: 25 }  // Navidad
  ];

  private readonly suspiciousPatterns = {
    sameDay: { threshold: 10, description: 'Contrataciones masivas mismo día' },
    sameMonth: { threshold: 30, description: 'Contrataciones masivas mismo mes' },
    roundDates: { pattern: /01$|15$/, description: 'Fechas redondas sospechosas' },
    sequential: { gap: 1, description: 'Fechas consecutivas sospechosas' }
  };

  constructor() {
    super({
      name: 'Validador Especialista en Fechas de Ingreso',
      description: 'Validación exhaustiva de fechas de ingreso con análisis temporal y patrones de contratación',
      priority: 5,
      dependencies: ['FechaNacimientoAgent'],
      timeout: 25000
    });
  }

  async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      if (data.activePersonnel && data.activePersonnel.length > 0) {
        const hireDateValidation = await this.validateHireDates(data.activePersonnel);
        results.push(...hireDateValidation);

        const temporalAnalysis = await this.performTemporalAnalysis(data.activePersonnel);
        results.push(...temporalAnalysis);

        const patternAnalysis = await this.analyzeHiringPatterns(data.activePersonnel);
        results.push(...patternAnalysis);
      }

      if (data.terminations && data.terminations.length > 0) {
        const serviceAnalysis = await this.analyzeServicePeriods(data);
        results.push(...serviceAnalysis);
      }

      const consistencyCheck = await this.performConsistencyValidation(data);
      results.push(...consistencyCheck);

    } catch (error) {
      results.push(this.createErrorResult(
        'Análisis Fechas de Ingreso',
        `Error en validación de fechas de ingreso: ${error.message}`,
        'Revisar formato y consistencia de fechas'
      ));
    }

    return results;
  }

  private async validateHireDates(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const criticalIssues: string[] = [];
    const warnings: string[] = [];
    const affectedRows: number[] = [];
    
    let validHireDates = 0;
    let missingDates = 0;
    let futureDates = 0;
    let underageHires = 0;
    let weekendHires = 0;
    let holidayHires = 0;

    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const row = i + 2;

      const hireDate = this.extractHireDate(employee);
      if (!hireDate) {
        const employeeName = this.getEmployeeName(employee);
        criticalIssues.push(`❌ "${employeeName}" (Fila ${row}): Fecha de ingreso obligatoria faltante`);
        affectedRows.push(row);
        missingDates++;
        continue;
      }

      // Validación de fecha futura
      const today = new Date();
      if (hireDate > today) {
        criticalIssues.push(`Fila ${row}: Fecha de ingreso futura (${hireDate.toLocaleDateString()})`);
        affectedRows.push(row);
        futureDates++;
        continue;
      }

      // Validación de rango temporal razonable
      const yearsAgo = this.calculateYearsFromDate(hireDate);
      if (yearsAgo > this.maximumServiceYears) {
        criticalIssues.push(`Fila ${row}: Fecha de ingreso demasiado antigua (${yearsAgo} años) - Verificar fecha`);
        affectedRows.push(row);
        continue;
      }

      validHireDates++;

      // Validación de edad al momento de contratación
      const birthDate = this.extractBirthDate(employee);
      if (birthDate) {
        const ageAtHire = this.calculateAgeAtDate(birthDate, hireDate);
        if (ageAtHire < this.legalWorkingAge) {
          criticalIssues.push(`Fila ${row}: Contratado menor de edad (${ageAtHire} años el ${hireDate.toLocaleDateString()})`);
          affectedRows.push(row);
          underageHires++;
        }
      }

      // Análisis de patrones temporales
      if (this.isWeekend(hireDate)) {
        warnings.push(`Fila ${row}: Contratación en fin de semana (${this.getDayName(hireDate)})`);
        weekendHires++;
      }

      if (this.isHoliday(hireDate)) {
        warnings.push(`Fila ${row}: Contratación en día festivo (${hireDate.toLocaleDateString()})`);
        holidayHires++;
      }

      // Validación de días laborables extremos
      if (this.isExtremeWorkingDay(hireDate)) {
        warnings.push(`Fila ${row}: Contratación en fecha inusual (${hireDate.toLocaleDateString()})`);
      }
    }

    // Reportar problemas críticos
    if (criticalIssues.length > 0) {
      results.push(this.createErrorResult(
        'Fechas de Ingreso Obligatorias Faltantes',
        `❌ ${criticalIssues.length} empleados sin fecha de ingreso válida`,
        `🚫 NO PODEMOS PROCEDER: Las fechas de ingreso son obligatorias para calcular antigüedad y beneficios actuariales`,
        affectedRows,
        {
          actionType: 'CRITICAL',
          blocksProccess: true,
          criticalErrors: criticalIssues.slice(0, 10),
          statistics: {
            missingDates: missingDates,
            futureDates: futureDates,
            underageHires: underageHires,
            totalErrors: criticalIssues.length
          },
          solutions: [
            'Solicitar fechas exactas a área de RRHH',
            'Revisar contratos de trabajo originales',
            'Verificar expedientes laborales',
            'Confirmar fechas en sistema de nómina'
          ],
          impact: 'Sin fechas de ingreso no se pueden calcular: antigüedad, prima de antigüedad, proyecciones de jubilación',
          nextSteps: 'Completar TODAS las fechas faltantes antes de continuar'
        }
      ));
    }

    // Reportar advertencias
    if (warnings.length > 0) {
      results.push(this.createWarningResult(
        'Contrataciones en Fechas Inusuales',
        `⚠️ ${warnings.length} empleados contratados en fines de semana o días festivos`,
        `💡 PODEMOS PROCEDER: Son fechas válidas pero poco comunes. Recomendamos verificar que sean correctas`,
        affectedRows.filter((_, index) => index < warnings.length),
        {
          actionType: 'RECOMMENDED',
          canProceed: true,
          warnings: warnings.slice(0, 8),
          patterns: {
            weekendHires: weekendHires,
            holidayHires: holidayHires,
            totalWarnings: warnings.length
          },
          recommendations: [
            'Verificar que las fechas en fines de semana sean correctas',
            'Confirmar contrataciones en días festivos',
            'Revisar si hay convenios especiales de trabajo en esas fechas'
          ],
          impact: 'Sin impacto en cálculos actuariales - Solo verificación de precisión'
        }
      ));
    }

    // Reporte de validación exitosa
    if (validHireDates > 0) {
      const successRate = Math.round((validHireDates / personnel.length) * 100);
      
      results.push(this.createSuccessResult(
        'Validación de Fechas de Ingreso',
        `${validHireDates} fechas de ingreso validadas correctamente (${successRate}%)`,
        {
          validDates: validHireDates,
          totalProcessed: personnel.length,
          successRate,
          temporalMetrics: {
            weekendHires,
            holidayHires,
            averageServiceYears: this.calculateAverageService(personnel)
          }
        }
      ));
    }

    return results;
  }

  private async performTemporalAnalysis(personnel: any[]): Promise<ValidationResult[]> {
    const hireDates = personnel
      .map(emp => this.extractHireDate(emp))
      .filter(date => date !== null)
      .sort((a, b) => a!.getTime() - b!.getTime());

    if (hireDates.length === 0) {
      return [];
    }

    const analysis = {
      timeRange: {
        earliest: hireDates[0],
        latest: hireDates[hireDates.length - 1],
        span: this.calculateYearsFromDate(hireDates[0]!)
      },
      patterns: this.identifyTemporalPatterns(hireDates),
      distribution: this.analyzeYearlyDistribution(hireDates),
      seasonality: this.analyzeSeasonality(hireDates)
    };

    return [
      this.createSuccessResult(
        'Análisis Temporal de Contrataciones',
        `Análisis de ${hireDates.length} fechas de ingreso completado`,
        {
          temporalRange: analysis.timeRange,
          hiringPatterns: analysis.patterns,
          yearlyDistribution: analysis.distribution,
          seasonalityInsights: analysis.seasonality,
          recommendations: this.generateTemporalRecommendations(analysis)
        }
      )
    ];
  }

  private async analyzeHiringPatterns(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const hireDateCounts: Record<string, number> = {};
    const suspiciousPatterns: string[] = [];

    // Contar contrataciones por fecha
    for (let i = 0; i < personnel.length; i++) {
      const hireDate = this.extractHireDate(personnel[i]);
      if (!hireDate) continue;

      const dateKey = hireDate.toISOString().split('T')[0];
      hireDateCounts[dateKey] = (hireDateCounts[dateKey] || 0) + 1;
    }

    // Detectar patrones sospechosos
    for (const [date, count] of Object.entries(hireDateCounts)) {
      if (count >= this.suspiciousPatterns.sameDay.threshold) {
        suspiciousPatterns.push(`${count} contrataciones el ${date} (posible contratación masiva)`);
      }
    }

    // Analizar fechas redondas sospechosas
    const roundDatePattern = this.analyzeRoundDatePatterns(personnel);
    if (roundDatePattern.suspiciousCount > 0) {
      suspiciousPatterns.push(`${roundDatePattern.suspiciousCount} contrataciones en fechas "redondas" (día 1 o 15)`);
    }

    // Reportar patrones detectados
    if (suspiciousPatterns.length > 0) {
      results.push(this.createWarningResult(
        'Patrones de Contratación Sospechosos',
        `${suspiciousPatterns.length} patrones inusuales detectados`,
        'Revisar si las contrataciones masivas corresponden a expansiones reales del negocio',
        [],
        {
          patterns: suspiciousPatterns,
          massHiringDates: Object.entries(hireDateCounts)
            .filter(([, count]) => count >= this.suspiciousPatterns.sameDay.threshold)
            .slice(0, 5),
          recommendations: [
            'Verificar documentación de contrataciones masivas',
            'Confirmar que las fechas redondas no sean estimaciones',
            'Validar procesos de onboarding para grupos grandes'
          ]
        }
      ));
    } else {
      results.push(this.createSuccessResult(
        'Patrones de Contratación',
        'No se detectaron patrones de contratación sospechosos',
        {
          analysis: 'Distribución normal de fechas de ingreso',
          patternsSummary: 'Contrataciones distribuidas naturalmente a lo largo del tiempo'
        }
      ));
    }

    return results;
  }

  private async analyzeServicePeriods(data: MappedData): Promise<ValidationResult[]> {
    if (!data.activePersonnel || !data.terminations) {
      return [];
    }

    const servicePeriods = this.calculateServicePeriods(data.terminations);
    const analysis = this.analyzeServiceDistribution(servicePeriods);

    return [
      this.createSuccessResult(
        'Análisis de Períodos de Servicio',
        `Análisis de ${servicePeriods.length} períodos de servicio completado`,
        {
          averageService: analysis.average,
          serviceDistribution: analysis.distribution,
          retentionInsights: analysis.insights,
          turnoverIndicators: analysis.turnover
        }
      )
    ];
  }

  private async performConsistencyValidation(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const consistencyIssues: string[] = [];

    if (data.activePersonnel) {
      for (let i = 0; i < data.activePersonnel.length; i++) {
        const employee = data.activePersonnel[i];
        const row = i + 2;

        const birthDate = this.extractBirthDate(employee);
        const hireDate = this.extractHireDate(employee);

        if (birthDate && hireDate) {
          // Validar que fecha de ingreso sea posterior a nacimiento
          if (hireDate <= birthDate) {
            consistencyIssues.push(`Fila ${row}: Fecha de ingreso anterior o igual a fecha de nacimiento`);
          }

          // Validar edad mínima al contratar
          const ageAtHire = this.calculateAgeAtDate(birthDate, hireDate);
          if (ageAtHire < this.legalWorkingAge) {
            consistencyIssues.push(`Fila ${row}: Empleado contratado menor de edad (${ageAtHire} años)`);
          }
        }

        // Validar consistencia con IMSS (si disponible)
        const imssNumber = this.extractIMSSNumber(employee);
        if (imssNumber && hireDate) {
          const imssYear = this.extractYearFromIMSS(imssNumber);
          const hireYear = hireDate.getFullYear();
          
          if (imssYear && Math.abs(imssYear - hireYear) > 2) {
            consistencyIssues.push(`Fila ${row}: Inconsistencia entre año de registro IMSS (${imssYear}) y año de ingreso (${hireYear})`);
          }
        }
      }
    }

    if (consistencyIssues.length > 0) {
      results.push(this.createWarningResult(
        'Inconsistencias de Fechas',
        `${consistencyIssues.length} inconsistencias temporales detectadas`,
        'Revisar la coherencia entre fechas de nacimiento, ingreso y otros datos',
        [],
        {
          inconsistencies: consistencyIssues.slice(0, 10),
          totalIssues: consistencyIssues.length
        }
      ));
    } else {
      results.push(this.createSuccessResult(
        'Consistencia Temporal',
        'Todas las fechas son consistentes entre sí',
        {
          validation: 'Fechas de nacimiento e ingreso coherentes',
          crossValidation: 'Sin inconsistencias detectadas'
        }
      ));
    }

    return results;
  }

  // Métodos auxiliares especializados
  private isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // Domingo o Sábado
  }

  private isHoliday(date: Date): boolean {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return this.mexicanHolidays.some(holiday => 
      holiday.month === month && holiday.day === day
    );
  }

  private isExtremeWorkingDay(date: Date): boolean {
    const day = date.getDate();
    // Días 31, o muy cerca de fin/inicio de año en fechas inusuales
    return day === 31 || (date.getMonth() === 11 && day > 28) || (date.getMonth() === 0 && day === 1);
  }

  private getDayName(date: Date): string {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[date.getDay()];
  }

  private calculateYearsFromDate(date: Date): number {
    const today = new Date();
    return today.getFullYear() - date.getFullYear();
  }

  private identifyTemporalPatterns(hireDates: Date[]): any {
    // Identificar clusters temporales y patrones
    const patterns = {
      clusters: this.findTemporalClusters(hireDates),
      gaps: this.findTemporalGaps(hireDates),
      trends: this.analyzeTrends(hireDates)
    };

    return patterns;
  }

  private analyzeYearlyDistribution(hireDates: Date[]): any {
    const yearCounts: Record<number, number> = {};
    
    for (const date of hireDates) {
      const year = date.getFullYear();
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    }

    const years = Object.keys(yearCounts).map(Number).sort();
    const mostActiveYear = Object.entries(yearCounts)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      byYear: yearCounts,
      yearRange: { start: years[0], end: years[years.length - 1] },
      mostActiveYear: mostActiveYear ? {
        year: parseInt(mostActiveYear[0]),
        hires: mostActiveYear[1]
      } : null
    };
  }

  private analyzeSeasonality(hireDates: Date[]): any {
    const monthCounts: Record<number, number> = {};
    const quarterCounts: Record<number, number> = {};

    for (const date of hireDates) {
      const month = date.getMonth() + 1;
      const quarter = Math.ceil(month / 3);
      
      monthCounts[month] = (monthCounts[month] || 0) + 1;
      quarterCounts[quarter] = (quarterCounts[quarter] || 0) + 1;
    }

    const peakMonth = Object.entries(monthCounts)
      .sort(([,a], [,b]) => b - a)[0];
    const peakQuarter = Object.entries(quarterCounts)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      monthlyPattern: monthCounts,
      quarterlyPattern: quarterCounts,
      peakHiringPeriod: {
        month: peakMonth ? parseInt(peakMonth[0]) : null,
        quarter: peakQuarter ? parseInt(peakQuarter[0]) : null
      },
      seasonalityInsight: this.interpretSeasonality(monthCounts)
    };
  }

  private analyzeRoundDatePatterns(personnel: any[]): any {
    let roundDateCount = 0;
    let totalDates = 0;

    for (const employee of personnel) {
      const hireDate = this.extractHireDate(employee);
      if (!hireDate) continue;

      totalDates++;
      const day = hireDate.getDate();
      
      if (day === 1 || day === 15) {
        roundDateCount++;
      }
    }

    return {
      suspiciousCount: roundDateCount,
      percentage: totalDates > 0 ? Math.round((roundDateCount / totalDates) * 100) : 0,
      threshold: 30 // Si más del 30% son fechas redondas, es sospechoso
    };
  }

  private calculateServicePeriods(terminations: any[]): number[] {
    const periods: number[] = [];

    for (const termination of terminations) {
      const hireDate = this.extractHireDate(termination);
      const termDate = this.extractTerminationDate(termination);

      if (hireDate && termDate) {
        const serviceDays = (termDate.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24);
        const serviceYears = serviceDays / 365.25;
        if (serviceYears >= 0) {
          periods.push(serviceYears);
        }
      }
    }

    return periods;
  }

  private analyzeServiceDistribution(servicePeriods: number[]): any {
    if (servicePeriods.length === 0) {
      return { average: 0, distribution: {}, insights: [], turnover: {} };
    }

    const average = servicePeriods.reduce((a, b) => a + b, 0) / servicePeriods.length;
    const distribution = {
      'less1year': servicePeriods.filter(p => p < 1).length,
      '1to5years': servicePeriods.filter(p => p >= 1 && p < 5).length,
      '5to15years': servicePeriods.filter(p => p >= 5 && p < 15).length,
      'over15years': servicePeriods.filter(p => p >= 15).length
    };

    const insights = [];
    if (distribution.less1year > servicePeriods.length * 0.3) {
      insights.push('Alta rotación temprana - Considerar mejoras en proceso de onboarding');
    }
    if (average > 10) {
      insights.push('Alta retención - Empleados tienden a permanecer largo tiempo');
    }

    return {
      average: Math.round(average * 10) / 10,
      distribution,
      insights,
      turnover: {
        earlyTurnover: distribution.less1year,
        retention: servicePeriods.filter(p => p >= 5).length
      }
    };
  }

  private calculateAverageService(personnel: any[]): number {
    let totalService = 0;
    let validCount = 0;

    for (const employee of personnel) {
      const serviceYears = this.calculateServiceYears(employee);
      if (serviceYears !== null && serviceYears >= 0) {
        totalService += serviceYears;
        validCount++;
      }
    }

    return validCount > 0 ? Math.round(totalService / validCount * 10) / 10 : 0;
  }

  private findTemporalClusters(hireDates: Date[]): any[] {
    // Algoritmo simplificado para encontrar clusters de contrataciones
    const clusters = [];
    const threshold = 30; // 30 días
    
    for (let i = 0; i < hireDates.length - 1; i++) {
      const current = hireDates[i];
      const next = hireDates[i + 1];
      const daysDiff = (next.getTime() - current.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff <= threshold) {
        clusters.push({
          start: current,
          end: next,
          gap: daysDiff
        });
      }
    }

    return clusters.slice(0, 5); // Top 5 clusters
  }

  private findTemporalGaps(hireDates: Date[]): any[] {
    const gaps = [];
    const longGapThreshold = 365; // 1 año

    for (let i = 0; i < hireDates.length - 1; i++) {
      const current = hireDates[i];
      const next = hireDates[i + 1];
      const daysDiff = (next.getTime() - current.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff > longGapThreshold) {
        gaps.push({
          start: current,
          end: next,
          daysGap: Math.round(daysDiff)
        });
      }
    }

    return gaps.slice(0, 3); // Top 3 gaps
  }

  private analyzeTrends(hireDates: Date[]): string {
    if (hireDates.length < 2) return 'Insuficientes datos para análisis de tendencia';

    const years = hireDates.map(date => date.getFullYear());
    const yearCounts: Record<number, number> = {};
    
    for (const year of years) {
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    }

    const sortedYears = Object.keys(yearCounts).map(Number).sort();
    if (sortedYears.length < 3) return 'Crecimiento estable';

    const recent = sortedYears.slice(-3);
    const recentGrowth = yearCounts[recent[2]] - yearCounts[recent[0]];

    if (recentGrowth > 0) return 'Tendencia de crecimiento en contrataciones';
    if (recentGrowth < 0) return 'Tendencia de reducción en contrataciones';
    return 'Contrataciones estables en años recientes';
  }

  private interpretSeasonality(monthCounts: Record<number, number>): string {
    const monthNames = [
      '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const peakMonth = Object.entries(monthCounts)
      .sort(([,a], [,b]) => b - a)[0];

    if (!peakMonth) return 'Sin datos suficientes';

    const month = parseInt(peakMonth[0]);
    return `Pico de contrataciones en ${monthNames[month]}`;
  }

  private generateTemporalRecommendations(analysis: any): string[] {
    const recommendations = [];

    if (analysis.patterns.clusters.length > 3) {
      recommendations.push('Evaluar capacidad de onboarding para contrataciones masivas');
    }

    if (analysis.patterns.gaps.length > 1) {
      recommendations.push('Investigar períodos sin contrataciones - posibles problemas operativos');
    }

    if (analysis.distribution.mostActiveYear?.hires > 50) {
      recommendations.push('Documentar eventos de expansión para análisis futuro');
    }

    return recommendations;
  }

  private extractTerminationDate(employee: any): Date | null {
    const possibleFields = ['fechaTerminacion', 'fecha_terminacion', 'termination_date', 'baja', 'fecha_baja'];
    for (const field of possibleFields) {
      if (employee[field]) {
        const date = this.parseDate(employee[field]);
        if (date) return date;
      }
    }
    return null;
  }

  private extractIMSSNumber(employee: any): string | null {
    const possibleFields = ['imss', 'IMSS', 'nss', 'NSS', 'numeroImss'];
    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string') {
        return employee[field].toString().replace(/\D/g, '');
      }
    }
    return null;
  }

  private extractYearFromIMSS(imssNumber: string): number | null {
    if (imssNumber.length >= 10) {
      const yearPart = imssNumber.substring(2, 4);
      const year = parseInt(yearPart);
      // Asumir que 00-30 son 2000s, 31-99 son 1900s
      return year <= 30 ? 2000 + year : 1900 + year;
    }
    return null;
  }

  private calculateAgeAtDate(birthDate: Date, targetDate: Date): number {
    const age = targetDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = targetDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && targetDate.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    
    return age;
  }

  private getEmployeeName(employee: any): string {
    const possibleFields = [
      'nombre_completo', 'nombreCompleto', 'nombre', 'name',
      'empleado', 'employee', 'trabajador', 'persona'
    ];

    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string' && employee[field].trim()) {
        return employee[field].trim();
      }
    }

    // Try to construct name from parts
    const firstName = employee['nombre'] || employee['primer_nombre'] || '';
    const lastName = employee['apellido'] || employee['apellido_paterno'] || employee['apellidos'] || '';
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }

    return 'Empleado sin nombre';
  }
}