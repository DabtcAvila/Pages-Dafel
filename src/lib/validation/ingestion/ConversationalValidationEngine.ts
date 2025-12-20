import { DetectedColumn, ProcessedFileData } from './UniversalFileProcessor';
import { AdaptiveColumnMapper, MappingResult } from './AdaptiveColumnMapper';

export interface ValidationConversation {
  sessionId: string;
  clientId: string;
  fileName: string;
  currentStep: 'format_confirmation' | 'column_mapping' | 'data_validation' | 'final_confirmation';
  processedData: ProcessedFileData;
  mappingResult?: MappingResult;
  validationIssues: ValidationIssue[];
  resolvedQuestions: Record<string, any>;
  pendingQuestions: ConversationalQuestion[];
  finalApproval?: boolean;
  timestamp: Date;
}

export interface ConversationalQuestion {
  id: string;
  type: 'column_mapping' | 'data_validation' | 'format_clarification' | 'confirmation';
  severity: 'CRITICAL' | 'RECOMMENDED' | 'OPTIONAL';
  title: string;
  description: string;
  context: {
    affectedRows?: number[];
    affectedColumns?: string[];
    sampleData?: any[];
    suggestedValue?: any;
    confidence?: number;
  };
  options: QuestionOption[];
  requiresExplicitConfirmation: boolean;
  businessImpact?: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  description: string;
  action: 'accept_suggestion' | 'reject_suggestion' | 'manual_override' | 'skip_validation' | 'request_clarification';
  consequences?: string[];
  isRecommended?: boolean;
}

export interface ValidationIssue {
  id: string;
  type: 'missing_data' | 'invalid_format' | 'duplicate_entry' | 'inconsistent_data' | 'regulatory_violation';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  field: string;
  message: string;
  businessMessage: string;
  affectedRows: number[];
  suggestions: string[];
  autoFixAvailable: boolean;
  regulatoryImplications?: string;
}

export class ConversationalValidationEngine {
  private columnMapper: AdaptiveColumnMapper;
  private activeConversations: Map<string, ValidationConversation> = new Map();

  constructor() {
    this.columnMapper = new AdaptiveColumnMapper();
  }

  /**
   * Inicia una nueva conversación de validación
   */
  public async startValidationConversation(
    clientId: string,
    fileName: string,
    processedData: ProcessedFileData
  ): Promise<ValidationConversation> {
    const sessionId = `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🗣️ INICIANDO CONVERSACIÓN: Sesión ${sessionId} para cliente ${clientId}`);

    // Realizar mapeo inicial de columnas
    const mappingResult = await this.columnMapper.mapColumns(
      processedData.detectedStructure.tables[0]?.columns || [],
      'PASIVOS_LABORALES'
    );

    // Generar preguntas conversacionales iniciales
    const initialQuestions = await this.generateInitialQuestions(processedData, mappingResult);

    const conversation: ValidationConversation = {
      sessionId,
      clientId,
      fileName,
      currentStep: 'format_confirmation',
      processedData,
      mappingResult,
      validationIssues: [],
      resolvedQuestions: {},
      pendingQuestions: initialQuestions,
      timestamp: new Date()
    };

    this.activeConversations.set(sessionId, conversation);
    
    console.log(`💬 Conversación iniciada con ${initialQuestions.length} preguntas pendientes`);
    return conversation;
  }

  /**
   * Procesa la respuesta del cliente y genera próximas preguntas
   */
  public async processClientResponse(
    sessionId: string,
    questionId: string,
    response: any
  ): Promise<{
    success: boolean;
    nextQuestions: ConversationalQuestion[];
    isComplete: boolean;
    validationResult?: any;
  }> {
    const conversation = this.activeConversations.get(sessionId);
    if (!conversation) {
      throw new Error(`Conversación ${sessionId} no encontrada`);
    }

    console.log(`📝 PROCESANDO RESPUESTA: Pregunta ${questionId} en sesión ${sessionId}`);

    // Marcar pregunta como resuelta
    conversation.resolvedQuestions[questionId] = response;
    conversation.pendingQuestions = conversation.pendingQuestions.filter(q => q.id !== questionId);

    // Procesar la respuesta específica
    await this.processSpecificResponse(conversation, questionId, response);

    // Generar próximas preguntas basadas en la respuesta
    const nextQuestions = await this.generateFollowUpQuestions(conversation, questionId, response);
    conversation.pendingQuestions.push(...nextQuestions);

    // Verificar si la conversación está completa
    const isComplete = this.isConversationComplete(conversation);
    let validationResult;

    if (isComplete) {
      validationResult = await this.finalizeValidation(conversation);
    }

    this.activeConversations.set(sessionId, conversation);

    return {
      success: true,
      nextQuestions,
      isComplete,
      validationResult
    };
  }

  /**
   * Genera preguntas conversacionales iniciales
   */
  private async generateInitialQuestions(
    processedData: ProcessedFileData,
    mappingResult: MappingResult
  ): Promise<ConversationalQuestion[]> {
    const questions: ConversationalQuestion[] = [];

    // 1. Confirmación de formato detectado
    questions.push({
      id: 'format_confirmation',
      type: 'format_clarification',
      severity: 'CRITICAL',
      title: 'Confirmación del Formato Detectado',
      description: `He detectado que su archivo es de tipo "${processedData.fileType}" con ${processedData.detectedStructure.confidence.toFixed(1)}% de confianza. ¿Es esto correcto?`,
      context: {
        suggestedValue: processedData.fileType,
        confidence: processedData.detectedStructure.confidence
      },
      options: [
        {
          id: 'confirm_format',
          label: 'Sí, el formato es correcto',
          description: 'Continuar con el procesamiento automático',
          action: 'accept_suggestion',
          isRecommended: true
        },
        {
          id: 'correct_format',
          label: 'No, el formato no es el esperado',
          description: 'Necesito ayuda para interpretar el archivo correctamente',
          action: 'request_clarification',
          consequences: ['Requerirá análisis manual adicional']
        }
      ],
      requiresExplicitConfirmation: true,
      businessImpact: 'Una detección incorrecta del formato puede llevar a errores en el mapeo de datos.'
    });

    // 2. Preguntas de mapeo de columnas ambiguas
    for (const ambiguousMapping of mappingResult.ambiguousMappings) {
      questions.push({
        id: `mapping_${ambiguousMapping.detectedColumn.name}`,
        type: 'column_mapping',
        severity: 'RECOMMENDED',
        title: `Mapeo de Columna: "${ambiguousMapping.detectedColumn.name}"`,
        description: `He encontrado la columna "${ambiguousMapping.detectedColumn.name}" pero no estoy seguro de su función. ¿A qué campo corresponde?`,
        context: {
          sampleData: ambiguousMapping.detectedColumn.sampleValues.slice(0, 3),
          confidence: ambiguousMapping.confidence
        },
        options: ambiguousMapping.possibleMatches.map((match, index) => ({
          id: `map_to_${match.fieldName}`,
          label: `Mapear a "${match.fieldName}"`,
          description: `Confianza: ${(match.confidence * 100).toFixed(1)}%`,
          action: 'accept_suggestion',
          isRecommended: index === 0
        })).concat([
          {
            id: 'skip_column',
            label: 'Omitir esta columna',
            description: 'No es necesaria para el cálculo actuarial',
            action: 'skip_validation',
            consequences: ['Esta columna no será incluida en la validación']
          }
        ]),
        requiresExplicitConfirmation: false
      });
    }

    // 3. Preguntas de anomalías detectadas
    if (processedData.detectedStructure.anomalies.length > 0) {
      questions.push({
        id: 'anomalies_review',
        type: 'data_validation',
        severity: 'CRITICAL',
        title: 'Anomalías Detectadas en los Datos',
        description: `He encontrado ${processedData.detectedStructure.anomalies.length} anomalías que podrían afectar la calidad de los datos.`,
        context: {
          sampleData: processedData.detectedStructure.anomalies
        },
        options: [
          {
            id: 'review_anomalies',
            label: 'Revisar anomalías una por una',
            description: 'Analizar cada problema detectado individualmente',
            action: 'request_clarification',
            isRecommended: true
          },
          {
            id: 'proceed_with_anomalies',
            label: 'Continuar con los datos como están',
            description: 'Aceptar los datos con las anomalías detectadas',
            action: 'accept_suggestion',
            consequences: [
              'Puede haber errores en el cálculo actuarial',
              'Se requerirá revisión manual posterior'
            ]
          }
        ],
        requiresExplicitConfirmation: true,
        businessImpact: 'Las anomalías no corregidas pueden resultar en cálculos actuariales incorrectos.'
      });
    }

    return questions;
  }

  /**
   * Genera preguntas de seguimiento basadas en respuestas anteriores
   */
  private async generateFollowUpQuestions(
    conversation: ValidationConversation,
    answeredQuestionId: string,
    response: any
  ): Promise<ConversationalQuestion[]> {
    const questions: ConversationalQuestion[] = [];

    // Lógica específica basada en el tipo de pregunta respondida
    if (answeredQuestionId === 'format_confirmation' && response.action === 'request_clarification') {
      questions.push({
        id: 'format_manual_specification',
        type: 'format_clarification',
        severity: 'CRITICAL',
        title: 'Especificación Manual del Formato',
        description: 'Por favor, indique qué tipo de archivo es y cómo debería interpretarse.',
        context: {},
        options: [
          {
            id: 'excel_structured',
            label: 'Excel con estructura estándar',
            description: 'Datos organizados en filas y columnas con encabezados',
            action: 'manual_override'
          },
          {
            id: 'excel_unstructured',
            label: 'Excel con formato personalizado',
            description: 'Datos en formato no estándar o con múltiples tablas',
            action: 'manual_override'
          },
          {
            id: 'other_format',
            label: 'Otro formato',
            description: 'CSV, PDF, imagen u otro tipo de archivo',
            action: 'request_clarification'
          }
        ],
        requiresExplicitConfirmation: true
      });
    }

    if (answeredQuestionId === 'anomalies_review' && response.action === 'request_clarification') {
      // Generar preguntas específicas para cada anomalía
      for (let i = 0; i < conversation.processedData.detectedStructure.anomalies.length; i++) {
        const anomaly = conversation.processedData.detectedStructure.anomalies[i];
        questions.push({
          id: `anomaly_${i}`,
          type: 'data_validation',
          severity: 'WARNING',
          title: `Anomalía ${i + 1}: ${anomaly}`,
          description: `¿Cómo debería manejar esta situación?`,
          context: {
            sampleData: [anomaly]
          },
          options: [
            {
              id: 'fix_anomaly',
              label: 'Corregir manualmente',
              description: 'Proporcionar la corrección apropiada',
              action: 'manual_override',
              isRecommended: true
            },
            {
              id: 'ignore_anomaly',
              label: 'Ignorar por ahora',
              description: 'Continuar sin corregir esta anomalía',
              action: 'skip_validation',
              consequences: ['Puede afectar la precisión del cálculo']
            }
          ],
          requiresExplicitConfirmation: true
        });
      }
    }

    return questions;
  }

  /**
   * Procesa respuestas específicas y actualiza el estado
   */
  private async processSpecificResponse(
    conversation: ValidationConversation,
    questionId: string,
    response: any
  ): Promise<void> {
    if (questionId.startsWith('mapping_')) {
      // Actualizar mapeo de columnas
      const columnName = questionId.replace('mapping_', '');
      if (response.action === 'accept_suggestion' && conversation.mappingResult) {
        // Confirmar mapeo sugerido
        const ambiguous = conversation.mappingResult.ambiguousMappings.find(
          am => am.detectedColumn.name === columnName
        );
        if (ambiguous) {
          const selectedField = response.option_id.replace('map_to_', '');
          conversation.mappingResult.confirmedMappings[columnName] = selectedField;
          console.log(`✅ Columna "${columnName}" mapeada a "${selectedField}"`);
        }
      }
    }

    if (questionId === 'format_confirmation') {
      if (response.action === 'accept_suggestion') {
        conversation.currentStep = 'column_mapping';
      }
    }
  }

  /**
   * Verifica si la conversación ha sido completada
   */
  private isConversationComplete(conversation: ValidationConversation): boolean {
    // La conversación está completa cuando:
    // 1. No hay preguntas pendientes críticas
    // 2. Todas las columnas han sido mapeadas
    // 3. Las anomalías han sido revisadas o ignoradas

    const criticalQuestions = conversation.pendingQuestions.filter(q => q.severity === 'CRITICAL');
    return criticalQuestions.length === 0;
  }

  /**
   * Finaliza la validación y prepara los datos para procesamiento
   */
  private async finalizeValidation(conversation: ValidationConversation): Promise<any> {
    console.log(`🎯 FINALIZANDO VALIDACIÓN: Sesión ${conversation.sessionId}`);

    const result = {
      sessionId: conversation.sessionId,
      clientId: conversation.clientId,
      fileName: conversation.fileName,
      finalData: this.prepareFinalData(conversation),
      approvedMappings: conversation.mappingResult?.confirmedMappings || {},
      resolvedIssues: conversation.resolvedQuestions,
      pendingWarnings: conversation.pendingQuestions.filter(q => q.severity === 'WARNING'),
      validationSummary: this.generateValidationSummary(conversation),
      readyForProcessing: true,
      timestamp: new Date()
    };

    // Limpiar conversación completada
    this.activeConversations.delete(conversation.sessionId);

    return result;
  }

  /**
   * Prepara los datos finales para procesamiento
   */
  private prepareFinalData(conversation: ValidationConversation): any {
    return {
      fileType: conversation.processedData.fileType,
      detectedStructure: conversation.processedData.detectedStructure,
      rawData: conversation.processedData.rawData,
      confirmedMappings: conversation.mappingResult?.confirmedMappings || {},
      clientApprovals: conversation.resolvedQuestions
    };
  }

  /**
   * Genera resumen final de la validación
   */
  private generateValidationSummary(conversation: ValidationConversation): string {
    const totalQuestions = Object.keys(conversation.resolvedQuestions).length;
    const criticalResolved = Object.values(conversation.resolvedQuestions).filter(
      (_, index) => {
        const questionId = Object.keys(conversation.resolvedQuestions)[index];
        return conversation.pendingQuestions.concat(
          // Preguntas ya resueltas no están en pendientes
        ).find(q => q.id === questionId)?.severity === 'CRITICAL';
      }
    ).length;

    return `Validación completada exitosamente. Se resolvieron ${totalQuestions} preguntas, incluyendo ${criticalResolved} críticas. Los datos están listos para procesamiento actuarial.`;
  }

  /**
   * Obtiene el estado actual de una conversación
   */
  public getConversationState(sessionId: string): ValidationConversation | null {
    return this.activeConversations.get(sessionId) || null;
  }

  /**
   * Genera mensaje conversacional inteligente
   */
  public generateIntelligentMessage(
    issue: ValidationIssue,
    context: any
  ): ConversationalQuestion {
    const templates = {
      missing_data: {
        title: 'Datos Faltantes Detectados',
        description: `He notado que faltan datos en el campo "${issue.field}". Esto es importante para el cálculo actuarial.`,
        businessImpact: 'Los datos faltantes pueden resultar en cálculos incompletos o incorrectos.'
      },
      invalid_format: {
        title: 'Formato de Datos Incorrecto',
        description: `El formato de "${issue.field}" no coincide con lo esperado para cálculos actuariales.`,
        businessImpact: 'Formatos incorrectos pueden llevar a errores en las valuaciones.'
      },
      regulatory_violation: {
        title: 'Posible Incumplimiento Normativo',
        description: `He detectado que "${issue.field}" podría no cumplir con las regulaciones mexicanas.`,
        businessImpact: 'El incumplimiento normativo puede resultar en rechazos regulatorios.'
      }
    };

    const template = templates[issue.type] || templates.invalid_format;

    return {
      id: `issue_${issue.id}`,
      type: 'data_validation',
      severity: issue.severity,
      title: template.title,
      description: `${template.description}\n\n${issue.businessMessage}`,
      context: {
        affectedRows: issue.affectedRows,
        affectedColumns: [issue.field]
      },
      options: [
        {
          id: 'review_and_fix',
          label: 'Revisar y corregir',
          description: 'Analizar el problema y proporcionar la corrección',
          action: 'request_clarification',
          isRecommended: true
        },
        {
          id: 'accept_as_is',
          label: 'Continuar sin cambios',
          description: 'Proceder con los datos actuales',
          action: 'skip_validation',
          consequences: issue.suggestions
        }
      ],
      requiresExplicitConfirmation: issue.severity === 'CRITICAL',
      businessImpact: template.businessImpact
    };
  }
}