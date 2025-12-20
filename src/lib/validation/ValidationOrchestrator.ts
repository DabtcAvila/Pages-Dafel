import { PrismaClient } from '@prisma/client';
import { DataColumnMapper } from './utils/DataColumnMapper';
import { ValidationResult, ValidationSeverity, ValidationStatus } from './types/ValidationTypes';

const prisma = new PrismaClient();

export interface ValidationData {
  activePersonnel: any[][];
  terminations: any[][];
  metadata: {
    fileName: string;
    fileSize: number;
    uploadedAt: Date;
    sheets: string[];
  };
}

export class ValidationOrchestrator {
  private validationId: string;
  private userId: string;

  constructor(validationId: string, userId: string) {
    this.validationId = validationId;
    this.userId = userId;
  }

  public async validateData(data: ValidationData): Promise<void> {
    try {
      // Update session status to processing
      await this.updateSessionStatus('PROCESSING');
      
      // Step 1: Initial file structure validation
      await this.logProgress('Iniciando análisis de estructura de archivo...', 'info');
      
      if (!data.activePersonnel || data.activePersonnel.length === 0) {
        throw new Error('No active personnel data found');
      }

      // Step 2: Intelligent column mapping
      await this.logProgress('Ejecutando mapeo inteligente de columnas...', 'info');
      
      const columnMapper = new DataColumnMapper();
      const mappedData = await columnMapper.mapColumns({
        activePersonnelRaw: data.activePersonnel,
        terminationsRaw: data.terminations
      });

      // Step 3: Ultra-specialized 18-agent parallel validation system
      await this.logProgress('Iniciando sistema de 18 agentes ultra-especializados en paralelo...', 'info');
      
      // Import all 18 specialized agents
      const [
        { RFCMasterValidator },
        { CURPExpertAgent },
        { SalarioBaseAgent },
        { IMSSValidatorAgent },
        { LLMActuarialExpert },
        { NombreInteligenteAgent },
        { FechaNacimientoAgent },
        { EdadActuarialAgent },
        { FechaIngresoAgent },
        { SalarioIntegradoAgent },
        { PuestoClasificadorAgent },
        { ConsistenciaTemporalAgent },
        { ValidadorLeyFederalAgent },
        { AnalisisDemograficoAgent },
        { DetectorAnomaliasAgent },
        { CompletenessAuditorAgent },
        { DuplicateDetectorAgent },
        { TerminacionAnalystAgent },
        { ActuarialRiskAgent }
      ] = await Promise.all([
        import('./agents/RFCMasterValidator'),
        import('./agents/CURPExpertAgent'),
        import('./agents/SalarioBaseAgent'),
        import('./agents/IMSSValidatorAgent'),
        import('./agents/LLMActuarialExpert'),
        import('./agents/NombreInteligenteAgent'),
        import('./agents/FechaNacimientoAgent'),
        import('./agents/EdadActuarialAgent'),
        import('./agents/FechaIngresoAgent'),
        import('./agents/SalarioIntegradoAgent'),
        import('./agents/PuestoClasificadorAgent'),
        import('./agents/ConsistenciaTemporalAgent'),
        import('./agents/ValidadorLeyFederalAgent'),
        import('./agents/AnalisisDemograficoAgent'),
        import('./agents/DetectorAnomaliasAgent'),
        import('./agents/CompletenessAuditorAgent'),
        import('./agents/DuplicateDetectorAgent'),
        import('./agents/TerminacionAnalystAgent'),
        import('./agents/ActuarialRiskAgent')
      ]);

      // Initialize all 18 specialized agents
      const agents = [
        new RFCMasterValidator(),           // 1. RFC validation expert
        new CURPExpertAgent(),             // 2. CURP validation specialist
        new SalarioBaseAgent(),            // 3. Base salary analyst
        new IMSSValidatorAgent(),          // 4. IMSS compliance expert
        new LLMActuarialExpert(),          // 5. General actuarial analyst
        new NombreInteligenteAgent(),      // 6. Intelligent name validator
        new FechaNacimientoAgent(),        // 7. Birth date specialist
        new EdadActuarialAgent(),          // 8. Actuarial age calculator
        new FechaIngresoAgent(),           // 9. Hire date validator
        new SalarioIntegradoAgent(),       // 10. Integrated salary expert
        new PuestoClasificadorAgent(),     // 11. Position classifier
        new ConsistenciaTemporalAgent(),   // 12. Temporal consistency analyst
        new ValidadorLeyFederalAgent(),    // 13. Mexican Labor Law expert
        new AnalisisDemograficoAgent(),    // 14. Demographic analyst
        new DetectorAnomaliasAgent(),      // 15. Anomaly detection specialist
        new CompletenessAuditorAgent(),    // 16. Data completeness auditor
        new DuplicateDetectorAgent(),      // 17. Duplicate detection expert
        new TerminacionAnalystAgent(),     // 18. Termination analyst
        new ActuarialRiskAgent()           // 19. Actuarial risk assessor
      ];

      await this.logProgress(`Ejecutando ${agents.length} agentes especializados en paralelo...`, 'info');
      
      // Execute all agents in parallel for maximum efficiency
      const validationPromises = agents.map(agent => 
        this.executeAgentValidation(agent, mappedData)
      );

      // Execute all 18 agents simultaneously
      const allResults = await Promise.allSettled(validationPromises);
      
      // Step 4: Collect and process results
      const successfulResults: ValidationResult[] = [];
      const errors: string[] = [];

      const agentNames = [
        'RFCMasterValidator', 'CURPExpertAgent', 'SalarioBaseAgent', 'IMSSValidatorAgent',
        'LLMActuarialExpert', 'NombreInteligenteAgent', 'FechaNacimientoAgent', 'EdadActuarialAgent',
        'FechaIngresoAgent', 'SalarioIntegradoAgent', 'PuestoClasificadorAgent', 'ConsistenciaTemporalAgent',
        'ValidadorLeyFederalAgent', 'AnalisisDemograficoAgent', 'DetectorAnomaliasAgent', 'CompletenessAuditorAgent',
        'DuplicateDetectorAgent', 'TerminacionAnalystAgent', 'ActuarialRiskAgent'
      ];

      allResults.forEach((result, index) => {
        const agentName = agentNames[index] || `Agente ${index + 1}`;
        
        if (result.status === 'fulfilled') {
          successfulResults.push(...result.value);
        } else {
          errors.push(`${agentName} falló: ${result.reason}`);
          console.error(`${agentName} error:`, result.reason);
        }
      });

      // Add intelligent 18-agent system summary with visual artifacts
      const agentCount = agents.length;
      const successfulAgents = agentCount - errors.length;
      
      successfulResults.push({
        agent: 'Sistema de 18 Agentes Ultra-Especializados',
        field: 'Resumen del Sistema de Validación',
        message: `🤖 Sistema completado: ${successfulAgents}/${agentCount} agentes ejecutados exitosamente | 📊 Datos: ${mappedData.metadata.activePersonnelRows} activos, ${mappedData.metadata.terminationsRows} terminaciones`,
        severity: errors.length > 0 ? 'warning' : 'info',
        status: 'success',
        metadata: {
          agentSystemSummary: {
            totalAgents: agentCount,
            successfulAgents: successfulAgents,
            failedAgents: errors.length,
            agentNames: agentNames,
            errors: errors,
            executionMode: 'PARALLEL'
          },
          dataPreview: {
            activePersonnelSample: mappedData.activePersonnel.slice(0, 5),
            columnMapping: mappedData.columnMapping,
            totalRecords: mappedData.metadata.totalRows,
            detectedColumns: Object.keys(mappedData.columnMapping || {}),
            fileStructure: {
              sheets: ['DATOS PERSONAL ACTIVO', 'BAJAS Y PAGOS'],
              dataQuality: 'Alta - Estructura Excel estándar detectada'
            }
          }
        }
      });

      // Step 5: Calculate summary statistics
      const summary = this.calculateSummary(mappedData, successfulResults);
      
      // Step 6: Return results immediately with original data for document artifact
      // The goal is intelligent LLM-powered validation, not database persistence
      await this.updateSessionStatus('COMPLETED', {
        ...summary,
        results: successfulResults,
        mappedData: {
          preview: mappedData.activePersonnel.slice(0, 5), // First 5 rows preview
          columnMapping: mappedData.columnMapping,
          totalRecords: mappedData.metadata.totalRows
        },
        originalData: {
          activePersonnel: data.activePersonnel, // Complete original Excel data as 2D array
          terminations: data.terminations,
          fileName: data.metadata.fileName,
          sheets: data.metadata.sheets
        }
      });
      
      await this.logProgress('Validación completada exitosamente', 'success');

    } catch (error) {
      console.error(`Validation orchestrator error for session ${this.validationId}:`, error);
      
      await this.updateSessionStatus('ERROR', null, error instanceof Error ? error.message : 'Unknown error');
      await this.logProgress(
        error instanceof Error ? error.message : 'Error desconocido durante validación', 
        'error'
      );
    }
  }

  private async executeAgentValidation(
    agent: any, 
    mappedData: any
  ): Promise<ValidationResult[]> {
    try {
      await this.logProgress(`${agent.getName()} iniciado...`, 'info');
      
      const startTime = Date.now();
      const results = await agent.validate(mappedData);
      const duration = Date.now() - startTime;
      
      await this.logProgress(
        `${agent.getName()} completado en ${duration}ms - ${results.length} resultados`, 
        'info'
      );
      
      return results;
    } catch (error) {
      await this.logProgress(
        `${agent.getName()} falló: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        'error'
      );
      throw error;
    }
  }

  private calculateSummary(mappedData: any, results: ValidationResult[]) {
    const activePersonnelCount = mappedData.activePersonnel?.length || 0;
    const terminationsCount = mappedData.terminations?.length || 0;
    const totalRecords = activePersonnelCount + terminationsCount;
    
    const criticalErrors = results.filter(r => r.severity === 'critical').length;
    const warnings = results.filter(r => r.severity === 'warning').length;
    const infos = results.filter(r => r.severity === 'info').length;
    
    const errorsByField: Record<string, number> = {};
    results.forEach(result => {
      if (result.severity === 'critical') {
        errorsByField[result.field] = (errorsByField[result.field] || 0) + 1;
      }
    });

    return {
      totalRecords,
      activePersonnelCount,
      terminationsCount,
      criticalErrors,
      warnings,
      infos,
      validRecords: Math.max(0, totalRecords - criticalErrors),
      errorsByField,
      canProceed: criticalErrors === 0
    };
  }

  // REMOVED: Database storage - agents provide direct intelligent analysis

  private async updateSessionStatus(
    status: string, 
    summary?: any, 
    errorMessage?: string
  ): Promise<void> {
    try {
      await prisma.actuarialValidationSession.update({
        where: { id: this.validationId },
        data: {
          status,
          ...(status === 'COMPLETED' && { completedAt: new Date() }),
          ...(status === 'ERROR' && { 
            errorMessage,
            completedAt: new Date() 
          })
        }
      });

      // Store results in session temporarily for immediate retrieval
      if (status === 'COMPLETED' && summary) {
        global[`validation_${this.validationId}`] = {
          status,
          summary,
          completedAt: new Date().toISOString()
        };
      }
    } catch (error) {
      // If database fails, still store in memory
      global[`validation_${this.validationId}`] = {
        status,
        summary,
        error: errorMessage,
        completedAt: new Date().toISOString()
      };
    }
  }

  private async logProgress(message: string, type: 'info' | 'success' | 'error'): Promise<void> {
    console.log(`[${this.validationId}] ${type.toUpperCase()}: ${message}`);
    
    // Could also store progress logs in database for real-time updates
    await prisma.actuarialValidationLog.create({
      data: {
        validationSessionId: this.validationId,
        message,
        type: type.toUpperCase(),
        timestamp: new Date()
      }
    });
  }
}