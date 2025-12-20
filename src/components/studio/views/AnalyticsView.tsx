'use client';

import { motion } from 'framer-motion';
import { ChartBarIcon } from '@heroicons/react/24/outline';

export default function AnalyticsView() {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <h2 className="text-2xl font-semibold text-gray-900">Analytics</h2>
        <p className="text-sm text-gray-500 mt-1">Monitor performance and insights from your workflows</p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 p-6 bg-gray-50"
      >
        <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg border-2 border-dashed border-gray-300">
          <ChartBarIcon className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
          <p className="text-sm text-gray-500">Monitor performance and insights from your workflows</p>
        </div>
      </motion.div>
    </div>
  );
}