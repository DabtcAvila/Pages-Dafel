'use client';

import { motion } from 'framer-motion';
import { BeakerIcon } from '@heroicons/react/24/outline';

export default function TestingView() {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <h2 className="text-2xl font-semibold text-gray-900">Testing</h2>
        <p className="text-sm text-gray-500 mt-1">Test and validate your workflows before deployment</p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 p-6 bg-gray-50"
      >
        <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg border-2 border-dashed border-gray-300">
          <BeakerIcon className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Testing Environment</h3>
          <p className="text-sm text-gray-500">Test and validate your workflows before deployment</p>
        </div>
      </motion.div>
    </div>
  );
}