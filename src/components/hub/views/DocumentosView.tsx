'use client';

import { motion } from 'framer-motion';
import { FolderIcon, DocumentIcon, PaperClipIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

export default function DocumentosView() {
  const carpetas = [
    { nombre: 'Contratos y Acuerdos', documentos: 12, icono: '📄' },
    { nombre: 'Información Demográfica', documentos: 8, icono: '👥' },
    { nombre: 'Estados Financieros', documentos: 15, icono: '💰' },
    { nombre: 'Políticas de RRHH', documentos: 6, icono: '📋' }
  ];

  const documentosRecientes = [
    {
      nombre: 'Censo_Empleados_2024.xlsx',
      tipo: 'Excel',
      tamaño: '2.1 MB',
      fecha: '2024-10-28',
      carpeta: 'Información Demográfica'
    },
    {
      nombre: 'Contrato_Colectivo_Trabajo.pdf',
      tipo: 'PDF',
      tamaño: '1.8 MB',
      fecha: '2024-10-25',
      carpeta: 'Contratos y Acuerdos'
    },
    {
      nombre: 'Balance_General_2023.pdf',
      tipo: 'PDF',
      tamaño: '956 KB',
      fecha: '2024-10-20',
      carpeta: 'Estados Financieros'
    },
    {
      nombre: 'Manual_Beneficios.docx',
      tipo: 'Word',
      tamaño: '3.2 MB',
      fecha: '2024-10-18',
      carpeta: 'Políticas de RRHH'
    }
  ];

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'PDF':
        return 'bg-red-100 text-red-800';
      case 'Excel':
        return 'bg-green-100 text-green-800';
      case 'Word':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Documentos</h1>
            <p className="text-gray-600">Gestión de documentos y archivos corporativos</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <CloudArrowUpIcon className="h-4 w-4 mr-2" />
            Subir Documento
          </button>
        </div>

        {/* Storage Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Espacio de Almacenamiento</h3>
              <p className="text-sm text-gray-600">48.2 MB de 5 GB utilizados</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">241</p>
              <p className="text-sm text-gray-600">Total de documentos</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '0.96%' }}></div>
            </div>
          </div>
        </motion.div>

        {/* Carpetas */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Carpetas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {carpetas.map((carpeta, index) => (
              <motion.div
                key={carpeta.nombre}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{carpeta.icono}</span>
                  <FolderIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">{carpeta.nombre}</h3>
                <p className="text-sm text-gray-600">{carpeta.documentos} documentos</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Documentos Recientes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Documentos Recientes</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carpeta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamaño
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documentosRecientes.map((documento, index) => (
                  <motion.tr
                    key={documento.nombre}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DocumentIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{documento.nombre}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {documento.carpeta}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(documento.tipo)}`}>
                        {documento.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {documento.tamaño}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {documento.fecha}
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