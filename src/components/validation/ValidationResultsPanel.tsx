'use client';

import React, { useState } from 'react';
import { 
  ExclamationTriangleIcon, 
  XCircleIcon, 
  InformationCircleIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  LightBulbIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface ValidationResult {
  agent: string;
  field: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'error' | 'warning' | 'success';
  metadata?: {
    actionType?: 'CRITICAL' | 'RECOMMENDED' | 'OPTIONAL';
    blocksProccess?: boolean;
    canProceed?: boolean;
    employeeName?: string;
    solutions?: string[];
    suggestions?: string[];
    recommendations?: string[];
    impact?: string;
    nextSteps?: string;
    defaultAction?: string;
  };
  affectedRows?: number[];
}

interface ValidationSummary {
  totalRecords: number;
  criticalErrors: number;
  warnings: number;
  infos: number;
  canProceed: boolean;
}

interface ValidationResultsPanelProps {
  results: ValidationResult[];
  summary: ValidationSummary;
  isProcessing: boolean;
}

export default function ValidationResultsPanel({ 
  results, 
  summary, 
  isProcessing 
}: ValidationResultsPanelProps) {
  const [expandedResults, setExpandedResults] = useState<Set<number>>(new Set());
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedResults(newExpanded);
  };

  const filteredResults = results.filter(result => {
    if (filterType === 'all') return true;
    return result.severity === filterType;
  });

  const getResultIcon = (result: ValidationResult) => {
    if (result.metadata?.actionType === 'CRITICAL' || result.severity === 'critical') {
      return <XCircleIcon className="w-5 h-5 text-red-500" />;
    }
    if (result.metadata?.actionType === 'RECOMMENDED' || result.severity === 'warning') {
      return <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />;
    }
    return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
  };

  const getResultBorderColor = (result: ValidationResult) => {
    if (result.metadata?.actionType === 'CRITICAL' || result.severity === 'critical') {
      return 'border-l-red-500 bg-red-50';
    }
    if (result.metadata?.actionType === 'RECOMMENDED' || result.severity === 'warning') {
      return 'border-l-amber-500 bg-amber-50';
    }
    return 'border-l-blue-500 bg-blue-50';
  };

  const getActionTypeLabel = (actionType?: string) => {
    switch (actionType) {
      case 'CRITICAL':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">🚫 CRÍTICO</span>;
      case 'RECOMMENDED':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">⚠️ RECOMENDADO</span>;
      case 'OPTIONAL':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">💡 OPCIONAL</span>;
      default:
        return null;
    }
  };

  const handleAutoFix = (result: ValidationResult, index: number) => {
    console.log('🤖 Aplicando corrección automática:', {
      field: result.field,
      action: result.metadata?.defaultAction,
      employeeName: result.metadata?.employeeName,
      affectedRows: result.affectedRows
    });
    
    // Aquí iría la lógica para aplicar la corrección automática
    alert(`✅ Aplicando corrección automática: ${result.metadata?.defaultAction}`);
  };

  const handleManualReview = (result: ValidationResult, index: number) => {
    console.log('👤 Marcando para revisión manual:', {
      field: result.field,
      employeeName: result.metadata?.employeeName,
      affectedRows: result.affectedRows
    });
    
    // Aquí iría la lógica para marcar como "para revisar manualmente"
    alert(`📝 Marcado para revisión manual en filas: ${result.affectedRows?.join(', ')}`);
  };

  const handleGoToFix = (result: ValidationResult, index: number) => {
    console.log('🔧 Ir a corregir error crítico:', {
      field: result.field,
      employeeName: result.metadata?.employeeName,
      affectedRows: result.affectedRows,
      solutions: result.metadata?.solutions
    });
    
    // Aquí iría la lógica para ir directamente a editar los datos
    const firstRow = result.affectedRows?.[0];
    if (firstRow) {
      alert(`🎯 Ir a fila ${firstRow} para corregir: ${result.field}`);
      // Podríamos abrir un modal de edición o navegar a la fila específica
    }
  };

  if (isProcessing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <h3 className="text-lg font-semibold text-gray-900">
            🤖 Ejecutando 18 Agentes Ultra-Especializados...
          </h3>
        </div>
        <p className="text-gray-600 mt-2">
          Analizando datos con inteligencia artificial especializada en actuaría mexicana
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Panel */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            📊 Resumen de Validación
          </h3>
          <div className={`px-4 py-2 rounded-lg font-semibold ${
            summary.canProceed 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {summary.canProceed ? '✅ PUEDE PROCEDER' : '🚫 REQUIERE CORRECCIONES'}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-gray-900">{summary.totalRecords}</div>
            <div className="text-sm text-gray-600">Total de Empleados</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-red-600">{summary.criticalErrors}</div>
            <div className="text-sm text-gray-600">Errores Críticos</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-amber-600">{summary.warnings}</div>
            <div className="text-sm text-gray-600">Advertencias</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{summary.infos}</div>
            <div className="text-sm text-gray-600">Información</div>
          </div>
        </div>

        {!summary.canProceed && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800">Acción Requerida</h4>
                <p className="text-red-700 text-sm">
                  Se encontraron {summary.criticalErrors} errores críticos que deben corregirse antes de continuar con el estudio actuarial.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'all', label: 'Todos', count: results.length },
          { key: 'critical', label: 'Críticos', count: summary.criticalErrors },
          { key: 'warning', label: 'Advertencias', count: summary.warnings },
          { key: 'info', label: 'Info', count: summary.infos }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key as any)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filterType === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {filterType === 'all' ? 'Sin resultados de validación' : `Sin ${filterType === 'critical' ? 'errores críticos' : filterType === 'warning' ? 'advertencias' : 'información adicional'}`}
            </h3>
          </div>
        ) : (
          filteredResults.map((result, index) => (
            <div
              key={index}
              className={`border-l-4 ${getResultBorderColor(result)} border border-gray-200 rounded-lg overflow-hidden`}
            >
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpanded(index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getResultIcon(result)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{result.field}</h4>
                        {getActionTypeLabel(result.metadata?.actionType)}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{result.message}</p>
                      {result.metadata?.employeeName && (
                        <p className="text-sm text-gray-600 mt-1">
                          👤 Empleado: <span className="font-medium">{result.metadata.employeeName}</span>
                        </p>
                      )}
                      {result.affectedRows && result.affectedRows.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          📍 Filas afectadas: {result.affectedRows.slice(0, 10).join(', ')}
                          {result.affectedRows.length > 10 && ` y ${result.affectedRows.length - 10} más...`}
                        </p>
                      )}
                    </div>
                  </div>
                  <ArrowRightIcon 
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
                      expandedResults.has(index) ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Expanded Content */}
              {expandedResults.has(index) && result.metadata && (
                <div className="px-4 pb-4 border-t border-gray-200 bg-white">
                  {/* Impact */}
                  {result.metadata.impact && (
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <InformationCircleIcon className="w-4 h-4 mr-2" />
                        Impacto
                      </h5>
                      <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                        {result.metadata.impact}
                      </p>
                    </div>
                  )}

                  {/* Solutions */}
                  {result.metadata.solutions && result.metadata.solutions.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <WrenchScrewdriverIcon className="w-4 h-4 mr-2" />
                        Soluciones Recomendadas
                      </h5>
                      <ul className="space-y-2">
                        {result.metadata.solutions.map((solution, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-blue-600">•</span>
                            <span className="text-gray-700">{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggestions */}
                  {result.metadata.suggestions && result.metadata.suggestions.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <LightBulbIcon className="w-4 h-4 mr-2" />
                        Sugerencias
                      </h5>
                      <ul className="space-y-2">
                        {result.metadata.suggestions.map((suggestion, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-amber-600">•</span>
                            <span className="text-gray-700">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Next Steps */}
                  {result.metadata.nextSteps && (
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2">Próximos Pasos</h5>
                      <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        {result.metadata.nextSteps}
                      </p>
                    </div>
                  )}

                  {/* Default Action */}
                  {result.metadata.defaultAction && (
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2">Acción por Defecto</h5>
                      <p className="text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
                        💡 {result.metadata.defaultAction}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {result.metadata.actionType === 'OPTIONAL' && result.metadata.defaultAction && (
                    <div className="flex space-x-3 mt-4">
                      <button 
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        onClick={() => handleAutoFix(result, index)}
                      >
                        ✅ Aplicar Sugerencia Automática
                      </button>
                      <button 
                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        onClick={() => handleManualReview(result, index)}
                      >
                        👤 Revisar Manualmente
                      </button>
                    </div>
                  )}

                  {/* Critical Error Actions */}
                  {result.metadata.actionType === 'CRITICAL' && (
                    <div className="mt-4">
                      <button 
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        onClick={() => handleGoToFix(result, index)}
                      >
                        🔧 Ir a Corregir Este Error
                      </button>
                    </div>
                  )}

                  {/* Can Proceed Status */}
                  {result.metadata.canProceed !== undefined && (
                    <div className="text-center mt-4">
                      <div className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${
                        result.metadata.canProceed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.metadata.canProceed ? '✅ Puede continuar' : '🚫 Requiere corrección'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}