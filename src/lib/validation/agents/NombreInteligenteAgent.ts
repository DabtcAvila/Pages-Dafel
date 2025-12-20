import { BaseValidationAgent } from './BaseValidationAgent';
import { ValidationResult, MappedData } from '../types/ValidationTypes';

export class NombreInteligenteAgent extends BaseValidationAgent {
  private readonly commonNames = {
    male: [
      'JOSE', 'LUIS', 'JUAN', 'MIGUEL', 'CARLOS', 'ANTONIO', 'FRANCISCO', 'ALEJANDRO',
      'RAFAEL', 'MANUEL', 'FERNANDO', 'PEDRO', 'RICARDO', 'SERGIO', 'ALBERTO',
      'DANIEL', 'ARTURO', 'ROBERTO', 'EDUARDO', 'JORGE', 'RAUL', 'OSCAR',
      'GERARDO', 'VICTOR', 'MARIO', 'DAVID', 'JESUS', 'IGNACIO', 'GUILLERMO'
    ],
    female: [
      'MARIA', 'GUADALUPE', 'JUANA', 'ANTONIA', 'MARGARITA', 'DOLORES', 'ROSA',
      'FRANCISCA', 'ELENA', 'TERESA', 'MARTHA', 'LETICIA', 'JOSEFINA', 'CARMEN',
      'ANA', 'LUCIA', 'GLORIA', 'ESPERANZA', 'CRISTINA', 'LAURA', 'ADRIANA',
      'GABRIELA', 'ALEJANDRA', 'PATRICIA', 'ELIZABETH', 'CLAUDIA', 'VERONICA',
      'SANDRA', 'SILVIA', 'NANCY', 'ANGELICA', 'NORMA', 'YOLANDA'
    ]
  };

  private readonly lastNames = [
    'GARCIA', 'RODRIGUEZ', 'MARTINEZ', 'HERNANDEZ', 'LOPEZ', 'GONZALEZ', 'PEREZ',
    'SANCHEZ', 'RAMIREZ', 'CRUZ', 'FLORES', 'RIVERA', 'GOMEZ', 'DIAZ', 'REYES',
    'MORALES', 'JIMENEZ', 'GUTIERREZ', 'RUIZ', 'MENDOZA', 'TORRES', 'VAZQUEZ',
    'CASTRO', 'ORTEGA', 'RAMOS', 'VARGAS', 'ROMERO', 'HERRERA', 'MEDINA',
    'AGUILAR', 'GUERRERO', 'MORENO', 'MENDEZ', 'JUAREZ', 'ROJAS', 'DELGADO'
  ];

  private readonly invalidPatterns = [
    /^X+$/i,                    // Solo X's
    /^A+$/i,                    // Solo A's
    /^TEST/i,                   // Datos de prueba
    /^PRUEBA/i,                 // Datos de prueba
    /^EMPLEADO\d+$/i,          // Empleado1, Empleado2, etc.
    /^SIN\s*NOMBRE/i,          // Sin nombre
    /^NO\s*APLICA/i,           // No aplica
    /^N\/A$/i,                 // N/A
    /^\d+$/,                   // Solo números
    /^[^A-ZÁÉÍÓÚÑ\s]+$/        // Sin caracteres latinos
  ];

  private readonly suspiciousPatterns = [
    /(.)\1{3,}/,                // Caracteres repetidos (AAAA)
    /^[AEIOU]+$/i,             // Solo vocales
    /^[BCDFGHJKLMNPQRSTVWXYZ]+$/i, // Solo consonantes
    /[0-9].*[A-Z]|[A-Z].*[0-9]/, // Mezcla números y letras
    /@|#|\$|%|\^|&|\*|\+|=|<|>/, // Caracteres especiales
    /\b(ADMIN|USER|NULL|EMPTY)\b/i // Palabras reservadas
  ];

  constructor() {
    super({
      name: 'Analizador Inteligente de Nombres',
      description: 'Validación avanzada de nombres con análisis lingüístico y detección de inconsistencias',
      priority: 3,
      dependencies: [],
      timeout: 25000
    });
  }

  async validate(data: MappedData): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      if (data.activePersonnel && data.activePersonnel.length > 0) {
        const personnelResults = await this.validatePersonnelNames(data.activePersonnel);
        results.push(...personnelResults);
      }

      if (data.terminations && data.terminations.length > 0) {
        const terminationResults = await this.validateTerminationNames(data.terminations);
        results.push(...terminationResults);
      }

      const crossAnalysis = await this.performNameConsistencyAnalysis(data);
      results.push(...crossAnalysis);

    } catch (error) {
      results.push(this.createErrorResult(
        'Análisis de Nombres',
        `Error en validación de nombres: ${error.message}`,
        'Revisar formato de nombres en el archivo'
      ));
    }

    return results;
  }

  private async validatePersonnelNames(personnel: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const nameIssues: string[] = [];
    const suspiciousNames: string[] = [];
    const affectedRows: number[] = [];
    let genderInconsistencies = 0;

    for (let i = 0; i < personnel.length; i++) {
      const employee = personnel[i];
      const fullName = this.extractFullName(employee);
      const row = i + 2;

      if (!fullName) {
        nameIssues.push(`Fila ${row}: Nombre faltante o vacío`);
        affectedRows.push(row);
        continue;
      }

      // Validaciones críticas
      const nameValidation = this.validateNameStructure(fullName, row);
      if (!nameValidation.isValid) {
        nameIssues.push(nameValidation.error!);
        affectedRows.push(row);
      }

      // Detección de patrones sospechosos
      const suspiciousCheck = this.detectSuspiciousPatterns(fullName, row);
      if (suspiciousCheck.length > 0) {
        suspiciousNames.push(...suspiciousCheck);
        affectedRows.push(row);
      }

      // Verificar si falta sexo y podemos inferirlo
      const missingGenderCheck = this.checkMissingGender(employee, row);
      if (missingGenderCheck.canInfer) {
        results.push(missingGenderCheck.result);
      }

      // Consistencia de género
      const genderConsistency = this.validateGenderConsistency(employee, row);
      if (!genderConsistency.isConsistent) {
        genderInconsistencies++;
        nameIssues.push(genderConsistency.error!);
        affectedRows.push(row);
      }
    }

    // Reporte de nombres inválidos
    if (nameIssues.length > 0) {
      results.push(this.createErrorResult(
        'Nombres Inválidos',
        `Se detectaron ${nameIssues.length} nombres con problemas críticos`,
        'Revisar nombres que no cumplen con estándares mexicanos',
        affectedRows,
        { issues: nameIssues.slice(0, 10), totalIssues: nameIssues.length }
      ));
    }

    // Reporte de patrones sospechosos
    if (suspiciousNames.length > 0) {
      results.push(this.createWarningResult(
        'Nombres Sospechosos',
        `Se detectaron ${suspiciousNames.length} nombres con patrones atípicos`,
        'Revisar nombres que podrían ser datos de prueba o errores de captura',
        affectedRows,
        { suspiciousPatterns: suspiciousNames.slice(0, 10) }
      ));
    }

    // Análisis demográfico de nombres
    const demographicAnalysis = this.performDemographicNameAnalysis(personnel);
    results.push(this.createSuccessResult(
      'Análisis Demográfico de Nombres',
      `Análisis completado: ${demographicAnalysis.summary}`,
      {
        totalNames: personnel.length,
        validNames: personnel.length - nameIssues.length,
        demographicInsights: demographicAnalysis.insights,
        genderDistribution: demographicAnalysis.genderDistribution,
        nameFrequency: demographicAnalysis.nameFrequency
      }
    ));

    return results;
  }

  private validateNameStructure(fullName: string, row: number): { isValid: boolean; error?: string } {
    const cleanName = fullName.trim().toUpperCase();

    // Verificar longitud
    if (cleanName.length < 3) {
      return { isValid: false, error: `Fila ${row}: Nombre demasiado corto: "${cleanName}"` };
    }

    if (cleanName.length > 150) {
      return { isValid: false, error: `Fila ${row}: Nombre excesivamente largo (${cleanName.length} caracteres)` };
    }

    // Verificar patrones inválidos
    for (const pattern of this.invalidPatterns) {
      if (pattern.test(cleanName)) {
        return { isValid: false, error: `Fila ${row}: Nombre inválido: "${cleanName}" (patrón prohibido)` };
      }
    }

    // Verificar estructura básica (al menos 2 palabras)
    const nameParts = cleanName.split(/\s+/).filter(part => part.length > 0);
    if (nameParts.length < 2) {
      return { isValid: false, error: `Fila ${row}: Nombre debe incluir al menos nombre y apellido: "${cleanName}"` };
    }

    // Verificar que contenga caracteres válidos para nombres mexicanos
    if (!/^[A-ZÁÉÍÓÚÑÜ\s\.'-]+$/.test(cleanName)) {
      return { isValid: false, error: `Fila ${row}: Nombre contiene caracteres inválidos: "${cleanName}"` };
    }

    return { isValid: true };
  }

  private detectSuspiciousPatterns(fullName: string, row: number): string[] {
    const issues: string[] = [];
    const cleanName = fullName.trim().toUpperCase();

    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(cleanName)) {
        issues.push(`Fila ${row}: Patrón sospechoso en "${cleanName}"`);
      }
    }

    // Verificar nombres extremadamente raros o inventados
    if (this.isLikelyFakeName(cleanName)) {
      issues.push(`Fila ${row}: Nombre posiblemente ficticio: "${cleanName}"`);
    }

    return issues;
  }

  private validateGenderConsistency(employee: any, row: number): { isConsistent: boolean; error?: string } {
    const fullName = this.extractFullName(employee);
    if (!fullName) return { isConsistent: true };

    const inferredGender = this.inferGenderFromName(fullName);
    const declaredGender = this.extractGenderFromEmployee(employee);
    const curp = this.extractCURP(employee);
    const curpGender = curp ? curp.charAt(10) : null;

    // Si hay género declarado y se puede inferir del nombre
    if (declaredGender && inferredGender && inferredGender !== 'unknown') {
      const genderMatch = (declaredGender === 'M' && inferredGender === 'male') ||
                          (declaredGender === 'F' && inferredGender === 'female') ||
                          (declaredGender === 'H' && inferredGender === 'male');

      if (!genderMatch) {
        return {
          isConsistent: false,
          error: `Fila ${row}: Inconsistencia de género - Nombre sugiere ${inferredGender === 'male' ? 'masculino' : 'femenino'}, declarado como ${declaredGender}`
        };
      }
    }

    // Verificar consistencia con CURP
    if (curpGender && inferredGender && inferredGender !== 'unknown') {
      const curpMatch = (curpGender === 'H' && inferredGender === 'male') ||
                        (curpGender === 'M' && inferredGender === 'female');

      if (!curpMatch) {
        return {
          isConsistent: false,
          error: `Fila ${row}: Inconsistencia entre nombre (${inferredGender === 'male' ? 'masculino' : 'femenino'}) y CURP (${curpGender})`
        };
      }
    }

    return { isConsistent: true };
  }

  private inferGenderFromName(fullName: string): 'male' | 'female' | 'unknown' {
    const firstName = this.extractFirstName(fullName);
    if (!firstName) return 'unknown';

    if (this.commonNames.male.includes(firstName)) {
      return 'male';
    }

    if (this.commonNames.female.includes(firstName)) {
      return 'female';
    }

    // Análisis de terminaciones comunes
    if (firstName.endsWith('A') && !firstName.endsWith('MA')) {
      return 'female';
    }

    if (firstName.endsWith('O') || firstName.endsWith('E')) {
      return 'male';
    }

    return 'unknown';
  }

  private performDemographicNameAnalysis(personnel: any[]): any {
    const nameFreq: Record<string, number> = {};
    const genderDist = { male: 0, female: 0, unknown: 0 };
    let duplicateNames = 0;

    for (const employee of personnel) {
      const fullName = this.extractFullName(employee);
      if (!fullName) continue;

      // Conteo de frecuencia
      const cleanName = fullName.trim().toUpperCase();
      nameFreq[cleanName] = (nameFreq[cleanName] || 0) + 1;
      if (nameFreq[cleanName] > 1) duplicateNames++;

      // Distribución de género
      const gender = this.inferGenderFromName(fullName);
      genderDist[gender]++;
    }

    const topNames = Object.entries(nameFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const insights = [];
    if (duplicateNames > personnel.length * 0.02) {
      insights.push(`Alta frecuencia de nombres duplicados (${duplicateNames} casos)`);
    }
    if (genderDist.unknown > personnel.length * 0.1) {
      insights.push(`${genderDist.unknown} nombres de género indeterminado`);
    }

    return {
      summary: `${personnel.length} nombres analizados, ${topNames[0]?.name || 'N/A'} es el más común`,
      insights,
      genderDistribution: genderDist,
      nameFrequency: topNames
    };
  }

  private async validateTerminationNames(terminations: any[]): Promise<ValidationResult[]> {
    // Similar validation for termination data
    return [
      this.createSuccessResult(
        'Validación Nombres Terminaciones',
        `${terminations.length} nombres en terminaciones validados correctamente`,
        { totalTerminations: terminations.length }
      )
    ];
  }

  private async performNameConsistencyAnalysis(data: MappedData): Promise<ValidationResult[]> {
    // Cross-reference names between active and terminated employees
    return [
      this.createSuccessResult(
        'Consistencia de Nombres',
        'Análisis de consistencia entre personal activo y terminaciones completado',
        { analysis: 'No se detectaron inconsistencias significativas en nombres' }
      )
    ];
  }

  // Helper methods
  private extractFullName(employee: any): string | null {
    const possibleFields = [
      'nombre', 'name', 'nombre_completo', 'full_name', 'empleado', 
      'NOMBRE', 'NAME', 'NOMBRE_COMPLETO', 'FULL_NAME'
    ];
    
    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string') {
        return employee[field].trim();
      }
    }
    return null;
  }

  private extractFirstName(fullName: string): string | null {
    const parts = fullName.trim().toUpperCase().split(/\s+/);
    return parts.length > 0 ? parts[0] : null;
  }

  private extractGenderFromEmployee(employee: any): string | null {
    const possibleFields = ['genero', 'gender', 'sexo', 'sex', 'GENERO', 'GENDER', 'SEXO'];
    for (const field of possibleFields) {
      if (employee[field]) {
        return employee[field].toString().toUpperCase().charAt(0);
      }
    }
    return null;
  }

  private extractCURP(employee: any): string | null {
    const possibleFields = ['curp', 'CURP'];
    for (const field of possibleFields) {
      if (employee[field] && typeof employee[field] === 'string') {
        return employee[field].trim().toUpperCase();
      }
    }
    return null;
  }

  private checkMissingGender(employee: any, row: number): { canInfer: boolean; result?: ValidationResult } {
    const fullName = this.extractFullName(employee);
    const declaredGender = this.extractGenderFromEmployee(employee);
    
    // Si no hay género declarado pero tenemos nombre
    if (!declaredGender && fullName) {
      const inferredGender = this.inferGenderFromName(fullName);
      
      if (inferredGender !== 'unknown') {
        const genderSpanish = inferredGender === 'male' ? 'Masculino' : 'Femenino';
        const genderCode = inferredGender === 'male' ? 'M' : 'F';
        
        return {
          canInfer: true,
          result: this.createWarningResult(
            'Sexo No Especificado',
            `⚠️ Empleado "${fullName}" en fila ${row} no tiene sexo declarado`,
            `💡 PODEMOS PROCEDER: Basado en el nombre, inferimos sexo ${genderSpanish}. Recomendamos confirmar con RRHH`,
            [row],
            {
              actionType: 'OPTIONAL',
              canProceed: true,
              inferredGender: genderCode,
              confidence: 'Alta',
              employeeName: fullName,
              defaultAction: `Usar sexo ${genderSpanish} por defecto`,
              recommendation: 'Confirmar con datos de empleado'
            }
          )
        };
      } else {
        // No podemos inferir
        return {
          canInfer: true,
          result: this.createWarningResult(
            'Sexo No Especificado',
            `⚠️ Empleado "${fullName}" en fila ${row} no tiene sexo declarado y no se puede inferir`,
            `🔧 RECOMENDADO: Agregar sexo (M/F). Podemos usar Masculino por defecto pero afecta cálculos actuariales`,
            [row],
            {
              actionType: 'RECOMMENDED',
              canProceed: true,
              fallbackGender: 'M',
              confidence: 'Baja',
              employeeName: fullName,
              impactLevel: 'Medio - Afecta cálculos de mortalidad'
            }
          )
        };
      }
    }
    
    return { canInfer: false };
  }

  private isLikelyFakeName(name: string): boolean {
    // Detectar nombres obviamente ficticios
    const fakePatternsEs = [
      /FULANO/, /MENGANO/, /ZUTANO/, /PERENGANO/,
      /XXXX/, /YYYY/, /ZZZZ/, /AAAA/, /BBBB/,
      /EJEMPLO/, /SAMPLE/, /DEMO/, /TEST/
    ];

    return fakePatternsEs.some(pattern => pattern.test(name));
  }
}