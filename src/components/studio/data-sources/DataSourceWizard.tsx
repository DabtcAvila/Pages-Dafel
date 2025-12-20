'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CloudIcon,
  ServerIcon,
  DocumentTextIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';
import { DataSourceType } from '@prisma/client';
import { toast } from 'react-hot-toast';

interface DataSourceWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

const sourceTypes = [
  {
    type: DataSourceType.POSTGRESQL,
    name: 'PostgreSQL',
    icon: CircleStackIcon,
    description: 'Connect to PostgreSQL databases',
    color: 'bg-blue-500',
  },
  {
    type: DataSourceType.MYSQL,
    name: 'MySQL',
    icon: CircleStackIcon,
    description: 'Connect to MySQL databases',
    color: 'bg-orange-500',
  },
  {
    type: DataSourceType.MONGODB,
    name: 'MongoDB',
    icon: CircleStackIcon,
    description: 'Connect to MongoDB collections',
    color: 'bg-green-500',
  },
  {
    type: DataSourceType.REST_API,
    name: 'REST API',
    icon: CloudIcon,
    description: 'Connect to RESTful APIs',
    color: 'bg-purple-500',
  },
  {
    type: DataSourceType.GRAPHQL,
    name: 'GraphQL',
    icon: CloudIcon,
    description: 'Connect to GraphQL endpoints',
    color: 'bg-pink-500',
  },
  {
    type: DataSourceType.S3,
    name: 'Amazon S3',
    icon: ServerIcon,
    description: 'Connect to S3 buckets',
    color: 'bg-yellow-500',
  },
  {
    type: DataSourceType.GOOGLE_SHEETS,
    name: 'Google Sheets',
    icon: DocumentTextIcon,
    description: 'Connect to Google Sheets',
    color: 'bg-teal-500',
  },
  {
    type: DataSourceType.CSV_FILE,
    name: 'CSV File',
    icon: DocumentTextIcon,
    description: 'Upload CSV files',
    color: 'bg-gray-500',
  },
];

export default function DataSourceWizard({ isOpen, onClose, onComplete }: DataSourceWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    type: null,
    name: '',
    description: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    apiKey: '',
    endpoint: '',
    ssl: false,
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    responseTime?: number;
    serverInfo?: any;
    metrics?: any;
  } | null>(null);
  const [schemaPreview, setSchemaPreview] = useState<any>(null);
  const [isLoadingSchema, setIsLoadingSchema] = useState(false);

  const steps = [
    { id: 'type', title: 'Select Source Type' },
    { id: 'configure', title: 'Configure Connection' },
    { id: 'test', title: 'Test Connection' },
    { id: 'finalize', title: 'Finalize Setup' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTestResult(null);
    }
  };

  const handleSelectType = (type: DataSourceType) => {
    setFormData({ ...formData, type });
    handleNext();
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    setTestResult(null);
    setSchemaPreview(null);

    try {
      // First create the data source
      const createResponse = await fetch('/api/data-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin', // Include cookies
        body: JSON.stringify({
          ...formData,
          port: formData.port ? parseInt(formData.port) : undefined,
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({ error: 'Failed to create data source' }));
        throw new Error(errorData.error || 'Failed to create data source');
      }

      const dataSource = await createResponse.json();
      setFormData({ ...formData, id: dataSource.id });

      // Then test the connection
      const testResponse = await fetch(`/api/data-sources/${dataSource.id}/test`, {
        method: 'POST',
        credentials: 'same-origin', // Include cookies
      });

      const result = await testResponse.json();
      setTestResult({
        ...result,
        message: result.message || (result.success ? 'Connection successful' : 'Connection failed'),
      });
      
      if (result.success) {
        // Load schema preview for SQL databases
        if (['POSTGRESQL', 'MYSQL'].includes(formData.type)) {
          loadSchemaPreview(dataSource.id);
        }
        handleNext();
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Connection test failed. Please check your configuration.',
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const loadSchemaPreview = async (dataSourceId: string) => {
    setIsLoadingSchema(true);
    try {
      const response = await fetch(`/api/data-sources/${dataSourceId}/schema`, {
        credentials: 'same-origin', // Include cookies
      });
      if (response.ok) {
        const data = await response.json();
        setSchemaPreview(data.schema);
      }
    } catch (error) {
      console.error('Failed to load schema:', error);
    } finally {
      setIsLoadingSchema(false);
    }
  };

  const useDemoConfig = () => {
    // Fill with local PostgreSQL demo configuration
    setFormData({
      ...formData,
      type: DataSourceType.POSTGRESQL,
      name: 'Demo PostgreSQL',
      description: 'Local PostgreSQL database for testing',
      host: 'localhost',
      port: '5432',
      database: 'dafel_db',
      username: 'dafel_user',
      password: 'DafelSecure2025!',
      ssl: false,
    });
    toast.success('Demo configuration loaded!');
    setCurrentStep(1); // Skip to configuration step
  };

  const handleComplete = () => {
    onComplete(formData);
    toast.success('Data source added successfully!');
    onClose();
    setCurrentStep(0);
    setFormData({
      type: null,
      name: '',
      description: '',
      host: '',
      port: '',
      database: '',
      username: '',
      password: '',
      apiKey: '',
      endpoint: '',
      ssl: false,
    });
    setTestResult(null);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Select Type
        return (
          <div>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-blue-900">Quick Start</p>
                  <p className="text-xs text-blue-700">Use our demo PostgreSQL to test the connection</p>
                </div>
                <button
                  onClick={useDemoConfig}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Use Demo Database
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {sourceTypes.map((source) => {
                const Icon = source.icon;
                return (
                  <motion.button
                    key={source.type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectType(source.type)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-900 hover:shadow-lg transition-all text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 ${source.color} rounded-lg`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-medium text-gray-900">{source.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500">{source.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      case 1: { // Configure
        const selectedType = formData.type;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Connection Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="My Database"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Optional description..."
                rows={2}
              />
            </div>

            {(selectedType === DataSourceType.POSTGRESQL || 
              selectedType === DataSourceType.MYSQL || 
              selectedType === DataSourceType.MONGODB) && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Host *
                    </label>
                    <input
                      type="text"
                      value={formData.host}
                      onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="localhost"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Port *
                    </label>
                    <input
                      type="number"
                      value={formData.port}
                      onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder={selectedType === DataSourceType.POSTGRESQL ? '5432' : '3306'}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Database *
                  </label>
                  <input
                    type="text"
                    value={formData.database}
                    onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="mydb"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="user"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ssl"
                    checked={formData.ssl}
                    onChange={(e) => setFormData({ ...formData, ssl: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="ssl" className="text-sm text-gray-700">
                    Use SSL connection
                  </label>
                </div>
              </>
            )}

            {(selectedType === DataSourceType.REST_API || 
              selectedType === DataSourceType.GRAPHQL) && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Endpoint *
                  </label>
                  <input
                    type="text"
                    value={formData.endpoint}
                    onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="https://api.example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Optional API key"
                  />
                </div>
              </>
            )}
          </div>
        );
      }

      case 2: // Test Connection
        return (
          <div className="text-center py-8">
            {isTestingConnection ? (
              <div>
                <motion.div
                  className="h-16 w-16 border-4 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-gray-600">Testing connection...</p>
              </div>
            ) : testResult ? (
              <div>
                {testResult.success ? (
                  <>
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Connection Successful!</h3>
                    <p className="text-gray-600">{testResult.message}</p>
                    
                    {/* Connection Metrics */}
                    {testResult.responseTime && (
                      <div className="mt-4 bg-green-50 rounded-lg p-3">
                        <p className="text-sm text-green-800">
                          Response Time: <span className="font-semibold">{testResult.responseTime}ms</span>
                        </p>
                      </div>
                    )}
                    
                    {/* Server Info */}
                    {testResult.serverInfo && (
                      <div className="mt-4 bg-gray-50 rounded-lg p-4 text-left">
                        <h4 className="font-medium text-gray-900 mb-2 text-sm">Server Information</h4>
                        <div className="space-y-1 text-xs text-gray-600">
                          {testResult.serverInfo.version && (
                            <p>Version: <span className="font-mono">{testResult.serverInfo.version.split(' ').slice(0, 2).join(' ')}</span></p>
                          )}
                          {testResult.serverInfo.database && (
                            <p>Database: <span className="font-mono">{testResult.serverInfo.database}</span></p>
                          )}
                          {testResult.serverInfo.user && (
                            <p>User: <span className="font-mono">{testResult.serverInfo.user}</span></p>
                          )}
                          {testResult.serverInfo.timezone && (
                            <p>Timezone: <span className="font-mono">{testResult.serverInfo.timezone}</span></p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Schema Preview */}
                    {isLoadingSchema && (
                      <div className="mt-4 text-sm text-gray-600">
                        <div className="animate-pulse">Loading schema preview...</div>
                      </div>
                    )}
                    
                    {schemaPreview && schemaPreview.tables && (
                      <div className="mt-4 bg-gray-50 rounded-lg p-4 text-left">
                        <h4 className="font-medium text-gray-900 mb-2 text-sm">Database Schema</h4>
                        <p className="text-xs text-gray-600 mb-3">
                          Found {schemaPreview.tables.length} table{schemaPreview.tables.length !== 1 ? 's' : ''} in the database
                        </p>
                        <div className="max-h-32 overflow-y-auto space-y-2">
                          {schemaPreview.tables.slice(0, 10).map((table: any, index: number) => (
                            <div key={table.name} className="flex items-center justify-between text-xs border-l-2 border-green-300 pl-3 py-1">
                              <span className="font-mono font-medium text-gray-900">{table.name}</span>
                              <span className="text-gray-500">
                                {table.columns?.length || 0} columns
                                {table.rowCount !== undefined && ` • ${table.rowCount.toLocaleString()} rows`}
                              </span>
                            </div>
                          ))}
                          {schemaPreview.tables.length > 10 && (
                            <p className="text-xs text-gray-500 italic pl-3 pt-2">
                              ...and {schemaPreview.tables.length - 10} more tables
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <ExclamationCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Connection Failed</h3>
                    <div className="bg-red-50 rounded-lg p-4 mb-4">
                      <p className="text-red-800 text-sm font-medium mb-1">Error Details:</p>
                      <p className="text-red-700 text-sm">{testResult.message}</p>
                      {testResult.responseTime && (
                        <p className="text-red-600 text-xs mt-2">
                          Failed after {testResult.responseTime}ms
                        </p>
                      )}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-left text-sm">
                      <p className="font-medium text-gray-900 mb-2">Common issues:</p>
                      <ul className="space-y-1 text-xs text-gray-600">
                        <li>• Check if the host and port are correct</li>
                        <li>• Verify your username and password</li>
                        <li>• Ensure the database server is running</li>
                        <li>• Check firewall settings</li>
                        <li>• For local connections, use "localhost" or "host.docker.internal"</li>
                      </ul>
                    </div>
                    <button
                      onClick={testConnection}
                      className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                    >
                      Retry Test
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div>
                <ServerIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Test</h3>
                <p className="text-gray-600 mb-4">Click the button below to test your connection</p>
                <button
                  onClick={testConnection}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  Test Connection
                </button>
              </div>
            )}
          </div>
        );

      case 3: // Finalize
        return (
          <div className="text-center py-8">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Setup Complete!</h3>
            <p className="text-gray-600 mb-6">
              Your data source &quot;{formData.name}&quot; has been successfully configured and is ready to use.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Type:</span> {formData.type}</p>
                <p><span className="text-gray-500">Name:</span> {formData.name}</p>
                {formData.host && <p><span className="text-gray-500">Host:</span> {formData.host}</p>}
                {formData.database && <p><span className="text-gray-500">Database:</span> {formData.database}</p>}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Add Data Source</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Progress Steps */}
            <div className="mt-4 flex items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      index <= currentStep
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm ${
                      index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-4 h-0.5 w-12 ${
                        index < currentStep ? 'bg-gray-900' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 px-6 py-6 min-h-[400px] overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between flex-shrink-0">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Previous
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Complete Setup
                <CheckCircleIcon className="h-4 w-4" />
              </button>
            ) : currentStep === 2 ? null : (
              <button
                onClick={handleNext}
                disabled={currentStep === 0 && !formData.type}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentStep === 0 && !formData.type
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Next
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}