'use client';

import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, PaperClipIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function MensajesView() {
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  const conversaciones = [
    {
      id: 1,
      participante: 'Act. María González',
      ultimoMensaje: 'El reporte de prima de antigüedad está listo para revisión.',
      fecha: '2024-10-28 14:30',
      noLeidos: 2,
      activo: true
    },
    {
      id: 2,
      participante: 'Soporte Técnico',
      ultimoMensaje: 'Hemos actualizado el sistema. Por favor, revisa los cambios.',
      fecha: '2024-10-27 16:45',
      noLeidos: 0,
      activo: false
    },
    {
      id: 3,
      participante: 'Contador General',
      ultimoMensaje: 'Necesito una aclaración sobre los cálculos de indemnización.',
      fecha: '2024-10-26 09:15',
      noLeidos: 1,
      activo: false
    }
  ];

  const mensajes = [
    {
      id: 1,
      remitente: 'Act. María González',
      mensaje: 'Buenos días, he terminado de revisar el censo de empleados y los datos parecen estar completos.',
      fecha: '2024-10-28 09:15',
      esPropio: false
    },
    {
      id: 2,
      remitente: 'Tú',
      mensaje: 'Perfecto, ¿podemos proceder con el cálculo de la prima de antigüedad?',
      fecha: '2024-10-28 09:30',
      esPropio: true
    },
    {
      id: 3,
      remitente: 'Act. María González',
      mensaje: 'Sí, ya comencé con los cálculos. Te envío el reporte preliminar en una hora.',
      fecha: '2024-10-28 10:45',
      esPropio: false
    },
    {
      id: 4,
      remitente: 'Act. María González',
      mensaje: 'El reporte de prima de antigüedad está listo para revisión. He adjuntado el archivo PDF con todos los detalles.',
      fecha: '2024-10-28 14:30',
      esPropio: false
    }
  ];

  const enviarMensaje = () => {
    if (nuevoMensaje.trim()) {
      // Aquí iría la lógica para enviar el mensaje
      setNuevoMensaje('');
    }
  };

  return (
    <div className="h-full flex bg-white">
      {/* Lista de conversaciones */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mensajes</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversaciones.map((conversacion, index) => (
            <motion.div
              key={conversacion.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                conversacion.activo ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{conversacion.participante}</h3>
                {conversacion.noLeidos > 0 && (
                  <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                    {conversacion.noLeidos}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 truncate mb-1">{conversacion.ultimoMensaje}</p>
              <p className="text-xs text-gray-400">{conversacion.fecha}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Área de chat */}
      <div className="flex-1 flex flex-col">
        {/* Header del chat */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm font-medium">MG</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Act. María González</h3>
              <p className="text-sm text-green-600">En línea</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mensajes.map((mensaje, index) => (
            <motion.div
              key={mensaje.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`flex ${mensaje.esPropio ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                mensaje.esPropio 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{mensaje.mensaje}</p>
                <p className={`text-xs mt-1 ${
                  mensaje.esPropio ? 'text-indigo-200' : 'text-gray-500'
                }`}>
                  {mensaje.fecha}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input de mensaje */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <PaperClipIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
                placeholder="Escribe un mensaje..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={enviarMensaje}
              disabled={!nuevoMensaje.trim()}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}