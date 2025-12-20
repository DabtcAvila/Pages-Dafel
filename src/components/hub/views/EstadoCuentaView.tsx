'use client';

import { motion } from 'framer-motion';
import { CurrencyDollarIcon, DocumentIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

export default function EstadoCuentaView() {
  const { data: session } = useSession();

  const transacciones = [
    {
      id: 'TXN-2024-001',
      fecha: '2024-10-28',
      descripcion: 'Estudio Actuarial - Prima de Antigüedad ABC',
      tipo: 'cargo',
      monto: 45000.00,
      estado: 'Pagado'
    },
    {
      id: 'TXN-2024-002',
      fecha: '2024-10-25',
      descripcion: 'Pago recibido - Transferencia bancaria',
      tipo: 'abono',
      monto: 45000.00,
      estado: 'Procesado'
    },
    {
      id: 'TXN-2024-003',
      fecha: '2024-10-20',
      descripcion: 'Análisis de Sensibilidad - Corporativo XYZ',
      tipo: 'cargo',
      monto: 28500.00,
      estado: 'Pendiente'
    },
    {
      id: 'TXN-2024-004',
      fecha: '2024-10-15',
      descripcion: 'Estudio Demográfico - Grupo Industrial',
      tipo: 'cargo',
      monto: 32000.00,
      estado: 'Facturado'
    }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pagado':
        return 'bg-green-100 text-green-800';
      case 'Procesado':
        return 'bg-blue-100 text-blue-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Facturado':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === 'cargo' ? '↗️' : '↙️';
  };

  const getTipoColor = (tipo: string) => {
    return tipo === 'cargo' ? 'text-red-600' : 'text-green-600';
  };

  const saldoPendiente = 60500.00;
  const totalFacturado = 150500.00;
  const totalPagado = 90000.00;

  return (
    <div className="h-full p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Estado de Cuenta</h1>
          <p className="text-gray-600">Resumen financiero y movimientos de cuenta</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Saldo Pendiente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ${saldoPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <DocumentIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Facturado</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${totalFacturado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
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
              <div className="p-2 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pagado</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalPagado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Payment Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Estado de Pagos</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-green-600 h-4 rounded-full flex items-center justify-center text-xs text-white font-medium"
              style={{ width: `${(totalPagado / totalFacturado) * 100}%` }}
            >
              {Math.round((totalPagado / totalFacturado) * 100)}%
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Pagado: ${totalPagado.toLocaleString('es-MX')}</span>
            <span>Pendiente: ${saldoPendiente.toLocaleString('es-MX')}</span>
          </div>
        </motion.div>

        {/* Transacciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Movimientos Recientes</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              Ver todo el historial
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transacciones.map((transaccion, index) => (
                  <motion.tr
                    key={transaccion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaccion.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaccion.descripcion}</div>
                        <div className="text-sm text-gray-500">ID: {transaccion.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="flex items-center">
                        <span className="mr-1">{getTipoIcon(transaccion.tipo)}</span>
                        <span className={`capitalize ${getTipoColor(transaccion.tipo)}`}>
                          {transaccion.tipo}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={getTipoColor(transaccion.tipo)}>
                        {transaccion.tipo === 'cargo' ? '-' : '+'}
                        ${transaccion.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(transaccion.estado)}`}>
                        {transaccion.estado}
                      </span>
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