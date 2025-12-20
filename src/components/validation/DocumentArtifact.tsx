'use client';

import React, { useState } from 'react';

interface DocumentArtifactProps {
  originalData: any[][];  
  columnMapping?: Record<string, string>;
  validationResults?: any[];
  fileName: string;
}

export default function DocumentArtifact({ 
  originalData, 
  columnMapping = {}, 
  validationResults = [],
  fileName 
}: DocumentArtifactProps) {
  const [hoveredCell, setHoveredCell] = useState<{row: number, col: number} | null>(null);

  // Get validation issues for a specific cell
  const getCellIssues = (rowIndex: number) => {
    const issues: Array<{message: string, severity: string, agent: string}> = [];
    
    validationResults.forEach(result => {
      if (result.affectedRows?.includes(rowIndex + 1)) {
        issues.push({
          message: result.message,
          severity: result.severity,
          agent: result.agent
        });
      }
    });

    return issues;
  };

  // Get cell styling based on validation
  const getCellStyle = (rowIndex: number, colIndex: number, cellValue: any) => {
    const issues = getCellIssues(rowIndex);
    const isHeader = rowIndex === 0;
    const isEmpty = !cellValue || String(cellValue).trim() === '';
    
    let baseClasses = 'border border-gray-200 px-2 py-1 text-sm relative transition-colors ';
    
    if (isHeader) {
      baseClasses += 'bg-gray-100 font-semibold text-gray-800 ';
    } else {
      baseClasses += 'bg-white hover:bg-blue-50 ';
    }

    // Add validation styling
    if (issues.length > 0 && !isHeader) {
      const hasCritical = issues.some(i => i.severity === 'critical');
      const hasWarning = issues.some(i => i.severity === 'warning');
      
      if (hasCritical) {
        baseClasses += 'bg-red-50 border-red-300 ';
      } else if (hasWarning) {
        baseClasses += 'bg-amber-50 border-amber-300 ';
      }
    }

    // Style empty cells
    if (isEmpty && !isHeader) {
      baseClasses += 'bg-gray-50 text-gray-400 italic ';
    }

    return baseClasses;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          📄 Documento Original: {fileName}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Vista exacta del archivo subido con anotaciones inteligentes
        </p>
        <div className="text-sm text-gray-500 mt-2">
          {originalData.length} filas × {originalData[0]?.length || 0} columnas
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Error Crítico</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-gray-600">Advertencia</span>
          </div>
        </div>
      </div>

      {/* Document table */}
      <div className="overflow-auto max-h-[600px]">
        <table className="min-w-full border-collapse">
          <tbody>
            {originalData.slice(0, 50).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {/* Row number */}
                <td className="sticky left-0 bg-gray-100 border border-gray-300 px-2 py-1 text-xs font-mono text-gray-600 text-center min-w-[50px]">
                  {rowIndex + 1}
                </td>
                
                {/* Data cells */}
                {row.map((cell, colIndex) => {
                  const issues = getCellIssues(rowIndex);
                  const cellStyle = getCellStyle(rowIndex, colIndex, cell);
                  
                  return (
                    <td
                      key={`${rowIndex}-${colIndex}`}
                      className={cellStyle}
                      onMouseEnter={() => setHoveredCell({row: rowIndex, col: colIndex})}
                      onMouseLeave={() => setHoveredCell(null)}
                      style={{ minWidth: '120px', maxWidth: '200px' }}
                    >
                      <div className="truncate" title={String(cell || '')}>
                        {cell ? String(cell) : <span className="text-gray-400 italic text-xs">vacío</span>}
                      </div>
                      
                      {/* Validation indicator */}
                      {issues.length > 0 && rowIndex > 0 && (
                        <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                          issues.some(i => i.severity === 'critical') ? 'bg-red-500' : 'bg-amber-500'
                        }`} />
                      )}

                      {/* Tooltip */}
                      {issues.length > 0 && hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex && (
                        <div className="absolute z-50 bottom-full right-0 mb-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-4 shadow-xl">
                          <div className="font-semibold mb-2 text-yellow-300">
                            📍 Fila {rowIndex + 1}, Columna {colIndex + 1}
                          </div>
                          <div className="space-y-2">
                            {issues.map((issue, i) => (
                              <div key={i} className="p-2 rounded bg-red-800">
                                <div className="font-medium">{issue.agent}</div>
                                <div className="text-gray-300">{issue.message}</div>
                              </div>
                            ))}
                          </div>
                          <div className="absolute top-full right-6 border-4 border-transparent border-t-gray-900"></div>
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

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            Mostrando primeras {Math.min(50, originalData.length)} filas
          </div>
          <div>
            {validationResults.filter(r => r.severity === 'critical').length} errores críticos detectados
          </div>
        </div>
      </div>
    </div>
  );
}