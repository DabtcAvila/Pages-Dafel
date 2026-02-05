'use client';

import { motion } from 'framer-motion';
import { DocumentTextIcon, ArrowDownTrayIcon, PrinterIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

export default function ReportesView() {
  const { data: session } = useSession();

  const reportes = [
    {
      id: 'RPT-2024-001',
      titulo: 'Reporte Actuarial - Prima de Antigüedad',
      empresa: 'Empresa ABC S.A. de C.V.',
      fecha: '2024-10-15',
      tipo: 'Valuación NIF D-3',
      tamaño: '2.5 MB',
      formato: 'PDF'
    },
    {
      id: 'RPT-2024-002',
      titulo: 'Análisis de Sensibilidad - Indemnizaciones',
      empresa: 'Corporativo XYZ',
      fecha: '2024-10-20',
      tipo: 'Análisis IAS-19',
      tamaño: '1.8 MB',
      formato: 'PDF'
    },
    {
      id: 'RPT-2024-003',
      titulo: 'Proyecciones Demográficas',
      empresa: 'Grupo Industrial 123',
      fecha: '2024-10-25',
      tipo: 'Estudio Demográfico',
      tamaño: '3.2 MB',
      formato: 'PDF'
    },
    {
      id: 'RPT-2024-004',
      titulo: 'Resumen Ejecutivo - Plan de Pensiones',
      empresa: 'Corporativo XYZ',
      fecha: '2024-10-28',
      tipo: 'Resumen USGAAP',
      tamaño: '985 KB',
      formato: 'PDF'
    }
  ];

  const getTipoColor = (tipo: string) => {
    if (tipo.includes('NIF')) return 'bg-blue-100 text-blue-800';
    if (tipo.includes('IFRS')) return 'bg-green-100 text-green-800';
    if (tipo.includes('USGAAP')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="h-full p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reportes Actuariales</h1>
          <p className="text-gray-600">Documentos técnicos y reportes de valuación generados</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reportes</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Este Mes</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ArrowDownTrayIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Descargas</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <PrinterIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tamaño Total</p>
                <p className="text-2xl font-bold text-gray-900">48.2 MB</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reportes Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Reportes Disponibles</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reporte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamaño
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportes.map((reporte, index) => (
                  <motion.tr
                    key={reporte.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{reporte.titulo}</div>
                        <div className="text-sm text-gray-500">ID: {reporte.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reporte.empresa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reporte.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(reporte.tipo)}`}>
                        {reporte.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reporte.tamaño}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded-lg hover:bg-indigo-50">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1 rounded-lg hover:bg-green-50">
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-50">
                          <PrinterIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}