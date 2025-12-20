'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ValidationResult {
  agent: string;
  field: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  status: string;
  suggestion?: string;
  affectedRows?: number[];
  metadata?: any;
}

interface DataVisualizationPanelProps {
  results: ValidationResult[];
  summary: any;
  mappedData?: any;
}

export default function DataVisualizationPanel({ 
  results, 
  summary, 
  mappedData 
}: DataVisualizationPanelProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'mapping' | 'validation'>('preview');
  const [highlightedCell, setHighlightedCell] = useState<{row: number, col: number} | null>(null);

  // Extract data preview from results
  const dataPreview = results.find(r => r.metadata?.dataPreview)?.metadata?.dataPreview;
  const activePersonnelSample = dataPreview?.activePersonnelSample || [];
  const columnMapping = dataPreview?.columnMapping || mappedData?.columnMapping || {};

  // Convert column mapping to readable format
  const detectedColumns = Object.entries(columnMapping).map(([detected, standard]) => ({
    detected: detected,
    standard: standard as string,
    found: true
  }));

  // Get validation issues with exact positions
  const validationIssues = results.filter(r => 
    r.severity === 'warning' || r.severity === 'critical'
  ).map(issue => ({
    ...issue,
    positions: issue.affectedRows ? issue.affectedRows.map(row => ({ row, issue: issue.message })) : []
  }));

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCellValidationStatus = (rowIndex: number, colKey: string): {status: string, issues: string[]} => {
    const cellIssues: string[] = [];
    let status = 'valid';

    validationIssues.forEach(issue => {
      if (issue.affectedRows?.includes(rowIndex + 2)) { // +2 because Excel rows start at 1 and we have headers
        cellIssues.push(issue.message);
        if (issue.severity === 'critical') status = 'critical';
        else if (issue.severity === 'warning' && status !== 'critical') status = 'warning';
      }
    });

    return { status, issues: cellIssues };
  };

  const renderDataPreview = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">📊 Vista Previa de Datos Detectados</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="text-sm text-gray-600">Total Empleados</div>
            <div className="text-2xl font-bold text-blue-900">{summary?.activePersonnelCount || 0}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="text-sm text-gray-600">Terminaciones</div>
            <div className="text-2xl font-bold text-blue-900">{summary?.terminationsCount || 0}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="text-sm text-gray-600">Errores Críticos</div>
            <div className={`text-2xl font-bold ${summary?.criticalErrors > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {summary?.criticalErrors || 0}
            </div>
          </div>
        </div>
      </div>

      {activePersonnelSample.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Primeras 5 filas detectadas (Personal Activo)</h4>
            <p className="text-sm text-gray-600 mt-1">
              Datos tal como fueron interpretados por nuestro sistema inteligente
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fila</th>
                  {Object.keys(activePersonnelSample[0] || {}).slice(0, 8).map((key, index) => (
                    <th 
                      key={key} 
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      <div className="flex flex-col">
                        <span className="truncate max-w-24">{key}</span>
                        {columnMapping[key] && (
                          <span className="text-blue-600 text-[10px] mt-1">
                            → {columnMapping[key]}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activePersonnelSample.slice(0, 5).map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-600 font-medium">
                      {rowIndex + 2} {/* Excel row number */}
                    </td>
                    {Object.entries(row).slice(0, 8).map(([key, value], colIndex) => {
                      const cellValidation = getCellValidationStatus(rowIndex, key);
                      return (
                        <td 
                          key={`${rowIndex}-${colIndex}`}
                          className={`px-3 py-2 text-sm relative group cursor-pointer transition-colors duration-200 ${
                            cellValidation.status === 'critical' ? 'bg-red-50 border-l-2 border-red-400' :
                            cellValidation.status === 'warning' ? 'bg-amber-50 border-l-2 border-amber-400' :
                            'bg-white hover:bg-blue-50'
                          }`}
                          onMouseEnter={() => setHighlightedCell({row: rowIndex, col: colIndex})}
                          onMouseLeave={() => setHighlightedCell(null)}
                        >
                          <div className="truncate max-w-32" title={String(value || '')}>
                            {String(value || '').length > 20 ? String(value || '').substring(0, 20) + '...' : String(value || '')}
                            {!value && <span className="text-gray-400 italic">vacío</span>}
                          </div>
                          
                          {cellValidation.issues.length > 0 && (
                            <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                              cellValidation.status === 'critical' ? 'bg-red-500' : 'bg-amber-500'
                            }`} />
                          )}

                          {/* Tooltip for validation issues */}
                          {cellValidation.issues.length > 0 && highlightedCell?.row === rowIndex && highlightedCell?.col === colIndex && (
                            <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                              <div className="font-medium mb-2">Problemas detectados:</div>
                              {cellValidation.issues.map((issue, i) => (
                                <div key={i} className="mb-1 last:mb-0">• {issue}</div>
                              ))}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderColumnMapping = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 mb-2">🔍 Mapeo Inteligente de Columnas</h3>
        <p className="text-green-700">
          Nuestro sistema detectó automáticamente estas correspondencias en tu archivo:
        </p>
      </div>

      <div className="grid gap-3">
        {detectedColumns.map((column, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  "{column.detected}"
                </div>
                <div className="text-sm text-gray-500">
                  Columna detectada en tu archivo
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              
              <div className="text-right">
                <div className="font-medium text-green-700">
                  {column.standard}
                </div>
                <div className="text-sm text-green-600">
                  Campo actuarial estándar
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {detectedColumns.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p>No se detectaron mapeos de columnas automáticos</p>
        </div>
      )}
    </div>
  );

  const renderValidationResults = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">🔍 Resultados de Validación Profesional</h3>
        <p className="text-purple-700">
          Análisis actuarial realizado por nuestro agente experto LLM
        </p>
      </div>

      <div className="space-y-3">
        {results.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border rounded-lg p-4 ${getSeverityColor(result.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(result.severity)}`}>
                    {result.severity === 'critical' ? '🚨' : result.severity === 'warning' ? '⚠️' : 'ℹ️'} {result.agent}
                  </span>
                  <span className="text-sm font-medium text-gray-700">{result.field}</span>
                </div>
                
                <p className="text-sm mb-3">{result.message}</p>
                
                {result.suggestion && (
                  <div className="bg-white bg-opacity-50 rounded-lg p-3 mb-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">💡 Recomendación:</div>
                    <div className="text-sm text-gray-600">{result.suggestion}</div>
                  </div>
                )}

                {result.affectedRows && result.affectedRows.length > 0 && (
                  <div className="bg-white bg-opacity-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">📍 Filas afectadas:</div>
                    <div className="flex flex-wrap gap-1">
                      {result.affectedRows.slice(0, 10).map((row, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-1 rounded bg-white text-xs font-medium text-gray-700 border">
                          Fila {row}
                        </span>
                      ))}
                      {result.affectedRows.length > 10 && (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-white text-xs font-medium text-gray-500 border">
                          +{result.affectedRows.length - 10} más
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {result.metadata && (
                  <details className="mt-3">
                    <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
                      📋 Detalles técnicos
                    </summary>
                    <div className="mt-2 bg-white bg-opacity-50 rounded-lg p-3">
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(result.metadata, null, 2)}
                      </pre>
                    </div>
                  </details>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No hay resultados de validación disponibles</p>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'preview', label: 'Vista Previa', icon: '📊' },
    { id: 'mapping', label: 'Mapeo de Columnas', icon: '🔍' },
    { id: 'validation', label: 'Validación', icon: '✅' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'preview' && renderDataPreview()}
            {activeTab === 'mapping' && renderColumnMapping()}
            {activeTab === 'validation' && renderValidationResults()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}