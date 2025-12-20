import { DetectedColumn } from './UniversalFileProcessor';
import { ConversationalQuestion, ValidationIssue, QuestionOption } from './ConversationalValidationEngine';

export interface QuestionContext {
  sessionId: string;
  clientId: string;
  fileName: string;
  fileType: string;
  currentStep: string;
  previousAnswers: Record<string, any>;
  detectedIssues: ValidationIssue[];
  businessContext: 'PASIVOS_LABORALES' | 'PRECIOS_TRANSFERENCIA' | 'OTROS_SERVICIOS';
}

export interface IntelligentSuggestion {
  suggestion: string;
  confidence: number;
  reasoning: string;
  businessJustification: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  regulatoryCompliance: boolean;
}

export class IntelligentQuestionGenerator {
  private readonly ACTUARIAL_KNOWLEDGE = {
    PASIVOS_LABORALES: {
      criticalFields: ['nombre', 'rfc', 'curp', 'nss', 'sueldo_base', 'fecha_ingreso', 'fecha_nacimiento'],
      regulatoryRequirements: {
        rfc: 'Debe cumplir con formato RFC mexicano (13 caracteres)',
        curp: 'Debe cumplir con formato CURP mexicano (18 caracteres)',
        nss: 'Número de Seguridad Social válido',
        sueldo_base: 'Debe ser numérico y mayor a salario mínimo',
        fecha_ingreso: 'Formato fecha válido, no futura',
        fecha_nacimiento: 'Formato fecha válido, edad laboral válida'
      },
      businessRules: {
        edad_maxima: 65,
        salario_minimo_diario: 248.93,
        antiguedad_minima_pension: 24 // semanas mínimas
      }
    }
  };

  private readonly CONVERSATION_TEMPLATES = {
    GREETING: [
      '¡Hola! He analizado su archivo "{fileName}" y estoy listo para ayudarle.',
      'Perfecto, he recibido "{fileName}". Vamos a revisar los datos juntos.',
      'Excelente, "{fileName}" está cargado. Le haré algunas preguntas para asegurar la precisión.'
    ],
    DATA_CLARIFICATION: [
      'He notado algo en sus datos que me gustaría confirmar.',
      'Tengo una pregunta sobre la información que proporcionó.',
      'Hay un detalle que necesito verificar para continuar correctamente.'
    ],
    SUGGESTION: [
      'Basándome en mi experiencia actuarial, le sugiero:',
      'Mi recomendación profesional sería:',
      'Para obtener los mejores resultados, considere:'
    ],
    CONFIRMATION: [
      '¿Está de acuerdo con proceder de esta manera?',
      '¿Le parece correcta esta interpretación?',
      '¿Confirma que debo continuar con este enfoque?'
    ]
  };

  /**
   * Genera pregunta inteligente contextual
   */
  public generateContextualQuestion(
    issue: ValidationIssue,
    context: QuestionContext
  ): ConversationalQuestion {
    const suggestion = this.generateIntelligentSuggestion(issue, context);
    
    console.log(`🧠 GENERANDO PREGUNTA CONTEXTUAL: ${issue.type} para ${issue.field}`);

    // Determinar tipo de pregunta basado en el issue y contexto
    const questionType = this.determineQuestionType(issue, context);
    
    return {
      id: `intelligent_${issue.id}_${Date.now()}`,
      type: questionType,
      severity: this.adjustSeverityByContext(issue.severity, context),
      title: this.generateContextualTitle(issue, context),
      description: this.generateContextualDescription(issue, suggestion, context),
      context: {
        affectedRows: issue.affectedRows,
        affectedColumns: [issue.field],
        sampleData: this.extractRelevantSamples(issue, context),
        suggestedValue: suggestion.suggestion,
        confidence: suggestion.confidence
      },
      options: this.generateIntelligentOptions(issue, suggestion, context),
      requiresExplicitConfirmation: this.requiresConfirmation(issue, suggestion),
      businessImpact: this.generateBusinessImpact(issue, suggestion, context)
    };
  }

  /**
   * Genera pregunta de seguimiento inteligente
   */
  public generateFollowUpQuestion(
    previousQuestion: ConversationalQuestion,
    answer: any,
    context: QuestionContext
  ): ConversationalQuestion | null {
    console.log(`🔄 GENERANDO PREGUNTA DE SEGUIMIENTO: ${previousQuestion.id}`);

    // Analizar la respuesta para determinar próximos pasos
    if (answer.action === 'request_clarification') {
      return this.generateClarificationQuestion(previousQuestion, context);
    }

    if (answer.action === 'manual_override') {
      return this.generateManualOverrideQuestion(previousQuestion, answer, context);
    }

    if (answer.action === 'accept_suggestion' && previousQuestion.type === 'column_mapping') {
      return this.generateDataValidationQuestion(previousQuestion, context);
    }

    return null; // No se requiere pregunta de seguimiento
  }

  /**
   * Genera pregunta de confirmación final inteligente
   */
  public generateFinalConfirmationQuestion(
    processedData: any,
    context: QuestionContext
  ): ConversationalQuestion {
    const summary = this.generateProcessingSummary(processedData, context);
    
    return {
      id: `final_confirmation_${Date.now()}`,
      type: 'confirmation',
      severity: 'CRITICAL',
      title: 'Confirmación Final de Procesamiento',
      description: this.generateFinalConfirmationMessage(summary, context),
      context: {
        estimatedRecords: processedData.estimatedRecords || 0,
        confirmedMappings: Object.keys(processedData.confirmedMappings || {}).length,
        confidence: summary.overallConfidence
      },
      options: [
        {
          id: 'proceed_with_calculation',
          label: 'Proceder con el Cálculo Actuarial',
          description: `Continuar con ${summary.recordCount} registros validados`,
          action: 'accept_suggestion',
          isRecommended: summary.overallConfidence > 0.8
        },
        {
          id: 'review_before_calculation',
          label: 'Revisar Datos Antes de Proceder',
          description: 'Hacer ajustes adicionales antes del cálculo',
          action: 'request_clarification',
          consequences: ['Requerirá tiempo adicional de revisión']
        },
        {
          id: 'export_for_external_review',
          label: 'Exportar para Revisión Externa',
          description: 'Descargar datos validados para revisión offline',
          action: 'skip_validation'
        }
      ],
      requiresExplicitConfirmation: true,
      businessImpact: 'La confirmación final autoriza el inicio del cálculo actuarial con los datos validados.'
    };
  }

  /**
   * Genera sugerencia inteligente basada en conocimiento actuarial
   */
  private generateIntelligentSuggestion(
    issue: ValidationIssue,
    context: QuestionContext
  ): IntelligentSuggestion {
    const knowledge = this.ACTUARIAL_KNOWLEDGE[context.businessContext];
    
    let suggestion = '';
    let confidence = 0.5;
    let reasoning = '';
    let businessJustification = '';
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
    let regulatoryCompliance = true;

    switch (issue.type) {
      case 'missing_data':
        if (knowledge.criticalFields.includes(issue.field)) {
          suggestion = 'Solicitar información faltante al cliente';
          confidence = 0.9;
          reasoning = `El campo "${issue.field}" es crítico para cálculos actuariales precisos`;
          businessJustification = 'Datos faltantes en campos críticos pueden resultar en errores significativos en las valuaciones';
          riskLevel = 'HIGH';
          regulatoryCompliance = false;
        } else {
          suggestion = 'Proceder con valores por defecto o estimaciones conservadoras';
          confidence = 0.6;
          reasoning = `El campo "${issue.field}" es opcional y puede manejarse con valores estándar`;
          businessJustification = 'Campos opcionales pueden estimarse sin afectar significativamente los resultados';
          riskLevel = 'LOW';
        }
        break;

      case 'invalid_format':
        const regRequirement = knowledge.regulatoryRequirements[issue.field];
        if (regRequirement) {
          suggestion = `Corregir formato para cumplir: ${regRequirement}`;
          confidence = 0.85;
          reasoning = 'El formato actual no cumple con regulaciones mexicanas';
          businessJustification = 'El cumplimiento normativo es obligatorio para valuaciones actuariales oficiales';
          riskLevel = 'HIGH';
          regulatoryCompliance = false;
        } else {
          suggestion = 'Intentar conversión automática con validación manual posterior';
          confidence = 0.7;
          reasoning = 'El formato puede ser convertido manteniendo la integridad de los datos';
          businessJustification = 'La conversión inteligente puede resolver problemas de formato sin pérdida de información';
          riskLevel = 'MEDIUM';
        }
        break;

      case 'duplicate_entry':
        suggestion = 'Identificar y consolidar registros duplicados';
        confidence = 0.8;
        reasoning = 'Los duplicados pueden causar sobreestimaciones en las valuaciones';
        businessJustification = 'Eliminar duplicados es esencial para cálculos actuariales precisos';
        riskLevel = 'MEDIUM';
        break;

      case 'regulatory_violation':
        suggestion = 'Corregir para cumplir con normativa mexicana';
        confidence = 0.95;
        reasoning = 'El incumplimiento normativo invalidaría la valuación actuarial';
        businessJustification = 'Las valuaciones deben cumplir estrictamente con regulaciones CONSAR y otras aplicables';
        riskLevel = 'HIGH';
        regulatoryCompliance = false;
        break;

      default:
        suggestion = 'Revisar manualmente y aplicar criterio profesional';
        confidence = 0.4;
        reasoning = 'Situación compleja que requiere análisis detallado';
        businessJustification = 'El criterio actuarial profesional es necesario para casos complejos';
        riskLevel = 'MEDIUM';
    }

    return {
      suggestion,
      confidence,
      reasoning,
      businessJustification,
      riskLevel,
      regulatoryCompliance
    };
  }

  /**
   * Determina el tipo de pregunta basado en el contexto
   */
  private determineQuestionType(issue: ValidationIssue, context: QuestionContext): string {
    if (issue.type === 'missing_data' && context.currentStep === 'data_validation') {
      return 'data_validation';
    }
    if (issue.field && context.currentStep === 'column_mapping') {
      return 'column_mapping';
    }
    if (issue.type === 'regulatory_violation') {
      return 'confirmation';
    }
    return 'data_validation';
  }

  /**
   * Ajusta la severidad basada en el contexto
   */
  private adjustSeverityByContext(
    originalSeverity: 'CRITICAL' | 'WARNING' | 'INFO',
    context: QuestionContext
  ): 'CRITICAL' | 'RECOMMENDED' | 'OPTIONAL' {
    const knowledge = this.ACTUARIAL_KNOWLEDGE[context.businessContext];
    
    if (originalSeverity === 'CRITICAL') return 'CRITICAL';
    if (originalSeverity === 'WARNING') return 'RECOMMENDED';
    return 'OPTIONAL';
  }

  /**
   * Genera título contextual inteligente
   */
  private generateContextualTitle(issue: ValidationIssue, context: QuestionContext): string {
    const fieldName = issue.field.charAt(0).toUpperCase() + issue.field.slice(1).replace(/_/g, ' ');
    
    const titles = {
      missing_data: `Información Faltante: ${fieldName}`,
      invalid_format: `Formato Incorrecto: ${fieldName}`,
      duplicate_entry: `Duplicados Detectados: ${fieldName}`,
      regulatory_violation: `Incumplimiento Normativo: ${fieldName}`,
      inconsistent_data: `Inconsistencia: ${fieldName}`
    };

    return titles[issue.type] || `Validación Requerida: ${fieldName}`;
  }

  /**
   * Genera descripción contextual inteligente
   */
  private generateContextualDescription(
    issue: ValidationIssue,
    suggestion: IntelligentSuggestion,
    context: QuestionContext
  ): string {
    const greeting = this.getRandomTemplate('DATA_CLARIFICATION');
    const suggestionText = this.getRandomTemplate('SUGGESTION');
    const confirmation = this.getRandomTemplate('CONFIRMATION');

    return `${greeting}\n\n${issue.businessMessage}\n\n${suggestionText} ${suggestion.suggestion}\n\n${suggestion.businessJustification}\n\n${confirmation}`;
  }

  /**
   * Genera opciones inteligentes basadas en el contexto
   */
  private generateIntelligentOptions(
    issue: ValidationIssue,
    suggestion: IntelligentSuggestion,
    context: QuestionContext
  ): QuestionOption[] {
    const options: QuestionOption[] = [];

    // Opción principal basada en la sugerencia
    options.push({
      id: 'follow_suggestion',
      label: `Aplicar Sugerencia (Confianza: ${(suggestion.confidence * 100).toFixed(0)}%)`,
      description: suggestion.suggestion,
      action: suggestion.riskLevel === 'HIGH' ? 'request_clarification' : 'accept_suggestion',
      isRecommended: suggestion.confidence > 0.7,
      consequences: suggestion.riskLevel === 'HIGH' ? [
        'Requerirá validación adicional',
        'Puede afectar cumplimiento normativo'
      ] : undefined
    });

    // Opciones alternativas basadas en el tipo de issue
    if (issue.type === 'missing_data') {
      options.push(
        {
          id: 'provide_missing_data',
          label: 'Proporcionar Datos Faltantes',
          description: 'Completar manualmente la información requerida',
          action: 'manual_override',
          consequences: ['Requerirá tiempo adicional para completar']
        },
        {
          id: 'proceed_without_data',
          label: 'Continuar Sin Estos Datos',
          description: 'Proceder con los datos disponibles',
          action: 'skip_validation',
          consequences: [
            'Puede reducir precisión de los cálculos',
            'Algunos análisis podrían no estar disponibles'
          ]
        }
      );
    }

    if (issue.type === 'invalid_format') {
      options.push(
        {
          id: 'manual_correction',
          label: 'Corregir Manualmente',
          description: 'Proporcionar el formato correcto',
          action: 'manual_override'
        },
        {
          id: 'auto_conversion',
          label: 'Conversión Automática',
          description: 'Permitir conversión automática con revisión posterior',
          action: 'accept_suggestion',
          consequences: ['Requiere validación posterior de los datos convertidos']
        }
      );
    }

    // Opción universal de revisión detallada
    options.push({
      id: 'detailed_review',
      label: 'Revisión Detallada',
      description: 'Analizar este problema en detalle antes de decidir',
      action: 'request_clarification'
    });

    return options;
  }

  /**
   * Determina si se requiere confirmación explícita
   */
  private requiresConfirmation(issue: ValidationIssue, suggestion: IntelligentSuggestion): boolean {
    return suggestion.riskLevel === 'HIGH' || 
           !suggestion.regulatoryCompliance || 
           issue.severity === 'CRITICAL';
  }

  /**
   * Genera mensaje de impacto de negocio
   */
  private generateBusinessImpact(
    issue: ValidationIssue,
    suggestion: IntelligentSuggestion,
    context: QuestionContext
  ): string {
    let impact = suggestion.businessJustification;
    
    if (!suggestion.regulatoryCompliance) {
      impact += ' IMPORTANTE: Esta situación podría afectar el cumplimiento normativo.';
    }
    
    if (suggestion.riskLevel === 'HIGH') {
      impact += ' ATENCIÓN: Decisión crítica que requiere consideración cuidadosa.';
    }
    
    return impact;
  }

  /**
   * Genera pregunta de clarificación
   */
  private generateClarificationQuestion(
    originalQuestion: ConversationalQuestion,
    context: QuestionContext
  ): ConversationalQuestion {
    return {
      id: `clarification_${originalQuestion.id}`,
      type: 'format_clarification',
      severity: 'RECOMMENDED',
      title: `Clarificación Adicional: ${originalQuestion.title}`,
      description: '¿Podría proporcionar más detalles sobre cómo prefiere manejar esta situación?',
      context: originalQuestion.context,
      options: [
        {
          id: 'provide_details',
          label: 'Proporcionar Detalles Específicos',
          description: 'Explicar exactamente qué debería hacer el sistema',
          action: 'manual_override',
          isRecommended: true
        },
        {
          id: 'accept_default',
          label: 'Usar Enfoque Estándar',
          description: 'Aplicar el procedimiento estándar para este tipo de situación',
          action: 'accept_suggestion'
        }
      ],
      requiresExplicitConfirmation: false
    };
  }

  /**
   * Genera pregunta de override manual
   */
  private generateManualOverrideQuestion(
    originalQuestion: ConversationalQuestion,
    answer: any,
    context: QuestionContext
  ): ConversationalQuestion {
    return {
      id: `manual_override_${originalQuestion.id}`,
      type: 'data_validation',
      severity: 'CRITICAL',
      title: 'Especificación Manual Requerida',
      description: 'Por favor, proporcione el valor o enfoque específico que debería aplicarse.',
      context: originalQuestion.context,
      options: [
        {
          id: 'provide_specific_value',
          label: 'Proporcionar Valor Específico',
          description: 'Ingresar el valor exacto que debería usarse',
          action: 'manual_override',
          isRecommended: true
        },
        {
          id: 'provide_rule',
          label: 'Especificar Regla',
          description: 'Definir la regla que debería aplicarse en casos similares',
          action: 'manual_override'
        }
      ],
      requiresExplicitConfirmation: true,
      businessImpact: 'La especificación manual asegura que el procesamiento siga exactamente sus preferencias.'
    };
  }

  /**
   * Genera pregunta de validación de datos
   */
  private generateDataValidationQuestion(
    mappingQuestion: ConversationalQuestion,
    context: QuestionContext
  ): ConversationalQuestion {
    return {
      id: `data_validation_${mappingQuestion.id}`,
      type: 'data_validation',
      severity: 'RECOMMENDED',
      title: 'Validación de Datos Mapeados',
      description: 'Ahora que hemos confirmado el mapeo, ¿los datos en esta columna se ven correctos?',
      context: {
        ...mappingQuestion.context,
        sampleData: mappingQuestion.context?.sampleData?.slice(0, 5)
      },
      options: [
        {
          id: 'data_looks_correct',
          label: 'Los Datos Se Ven Correctos',
          description: 'Continuar con este mapeo y datos',
          action: 'accept_suggestion',
          isRecommended: true
        },
        {
          id: 'data_needs_review',
          label: 'Los Datos Necesitan Revisión',
          description: 'Hay algo en los datos que requiere atención',
          action: 'request_clarification',
          consequences: ['Requerirá análisis adicional de los datos']
        }
      ],
      requiresExplicitConfirmation: false
    };
  }

  /**
   * Genera resumen de procesamiento
   */
  private generateProcessingSummary(processedData: any, context: QuestionContext): any {
    const recordCount = processedData.rawData?.length || 0;
    const mappedFields = Object.keys(processedData.confirmedMappings || {}).length;
    const totalFields = this.ACTUARIAL_KNOWLEDGE[context.businessContext].criticalFields.length;
    
    const overallConfidence = mappedFields / totalFields;
    
    return {
      recordCount,
      mappedFields,
      totalFields,
      overallConfidence,
      completeness: (mappedFields / totalFields) * 100
    };
  }

  /**
   * Genera mensaje de confirmación final
   */
  private generateFinalConfirmationMessage(summary: any, context: QuestionContext): string {
    const greeting = this.getRandomTemplate('GREETING').replace('{fileName}', context.fileName);
    
    return `${greeting}\n\n` +
           `📊 **Resumen de Validación:**\n` +
           `• ${summary.recordCount} registros procesados\n` +
           `• ${summary.mappedFields}/${summary.totalFields} campos críticos mapeados (${summary.completeness.toFixed(0)}%)\n` +
           `• Confianza general: ${(summary.overallConfidence * 100).toFixed(0)}%\n\n` +
           `Los datos han sido validados y están listos para el cálculo actuarial. ` +
           `${this.getRandomTemplate('CONFIRMATION')}`;
  }

  /**
   * Extrae muestras relevantes para el contexto
   */
  private extractRelevantSamples(issue: ValidationIssue, context: QuestionContext): any[] {
    // Por ahora retornar datos básicos, en el futuro podríamos hacer muestreo inteligente
    return [];
  }

  /**
   * Obtiene template aleatorio para variar el lenguaje
   */
  private getRandomTemplate(type: keyof typeof this.CONVERSATION_TEMPLATES): string {
    const templates = this.CONVERSATION_TEMPLATES[type];
    return templates[Math.floor(Math.random() * templates.length)];
  }
}