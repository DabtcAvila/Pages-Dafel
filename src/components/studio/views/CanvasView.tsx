'use client';

import { motion } from 'framer-motion';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CanvasView() {
  const { messages } = useLanguage();

  const workflowNodes = [
    { id: 'data', label: messages.studio?.data || 'Data', x: 100, y: 250 },
    { id: 'process', label: messages.studio?.process || 'Process', x: 300, y: 250 },
    { id: 'ai', label: messages.studio?.ai || 'AI', x: 500, y: 250 },
    { id: 'output', label: messages.studio?.output || 'Output', x: 700, y: 250 }
  ];

  return (
    <div className="h-full bg-white rounded-lg border border-gray-200 relative overflow-hidden">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3, 0 6"
              fill="#9ca3af"
            />
          </marker>
        </defs>
        <line
          x1="180"
          y1="250"
          x2="220"
          y2="250"
          stroke="#9ca3af"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        <line
          x1="380"
          y1="250"
          x2="420"
          y2="250"
          stroke="#9ca3af"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        <line
          x1="580"
          y1="250"
          x2="620"
          y2="250"
          stroke="#9ca3af"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      </svg>

      {workflowNodes.map((node, index) => (
        <motion.div
          key={node.id}
          className="absolute"
          style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.3,
            ease: "easeOut"
          }}
        >
          <div className="bg-white border-2 border-gray-900 rounded-lg px-6 py-4 cursor-move hover:shadow-lg transition-shadow">
            <span className="text-sm font-mono font-medium text-gray-900">
              {node.label}
            </span>
          </div>
        </motion.div>
      ))}

      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <p className="text-sm font-sans text-gray-500">
          {messages.studio?.dragPrompt || 'Drag components to build your workflow'}
        </p>
      </motion.div>

      <motion.div
        className="absolute top-4 right-4 flex items-center gap-2 text-xs text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <ShieldCheckIcon className="h-4 w-4 text-green-500" />
        <span>Secure Session Active</span>
      </motion.div>
    </div>
  );
}