'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon,
  ServerIcon,
  ClockIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  TrashIcon,
  PencilIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { DataSourceStatus } from '@prisma/client';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface DataSourcePanelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSource: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: (id: string) => void;
}

export default function DataSourcePanel({ 
  dataSource, 
  isOpen, 
  onClose, 
  onUpdate,
  onDelete 
}: DataSourcePanelProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (dataSource && isOpen) {
      fetchSyncLogs();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource, isOpen]);

  const fetchSyncLogs = async () => {
    if (!dataSource) return;
    
    setIsLoadingLogs(true);
    try {
      const response = await fetch(`/api/data-sources/${dataSource.id}`);
      const data = await response.json();
      setSyncLogs(data.syncLogs || []);
    } catch (error) {
      console.error('Error fetching sync logs:', error);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const response = await fetch(`/api/data-sources/${dataSource.id}/test`, {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Connection test successful!');
      } else {
        toast.error(`Connection test failed: ${result.message}`);
      }
      
      onUpdate();
    } catch (error) {
      toast.error('Failed to test connection');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/data-sources/${dataSource.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Data source deleted successfully');
        onDelete(dataSource.id);
        setShowDeleteDialog(false);
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete data source');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusIcon = (status: DataSourceStatus) => {
    switch (status) {
      case DataSourceStatus.CONNECTED:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case DataSourceStatus.ERROR:
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      case DataSourceStatus.TESTING:
        return <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <ExclamationCircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: DataSourceStatus) => {
    switch (status) {
      case DataSourceStatus.CONNECTED:
        return 'bg-green-100 text-green-800 border-green-200';
      case DataSourceStatus.ERROR:
        return 'bg-red-100 text-red-800 border-red-200';
      case DataSourceStatus.TESTING:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  if (!dataSource || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-screen w-[480px] bg-white shadow-2xl z-[60] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{dataSource.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                {getStatusIcon(dataSource.status)}
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(dataSource.status)}`}>
                  {dataSource.status}
                </span>
                <span className="text-sm text-gray-500">{dataSource.type}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-4 border-b -mb-px">
            {['overview', 'logs', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              {/* Quick Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTestingConnection ? (
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  ) : (
                    <ServerIcon className="h-4 w-4" />
                  )}
                  Test Connection
                </button>
                <button className="flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button className="flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <DocumentDuplicateIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Connection Details */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Connection Details</h3>
                <div className="space-y-2 text-sm">
                  {dataSource.host && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Host</span>
                      <span className="text-gray-900 font-mono">{dataSource.host}</span>
                    </div>
                  )}
                  {dataSource.database && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Database</span>
                      <span className="text-gray-900 font-mono">{dataSource.database}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created</span>
                    <span className="text-gray-900">{formatDate(dataSource.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Updated</span>
                    <span className="text-gray-900">{formatDate(dataSource.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Performance Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <ChartBarIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-500">Total Records</span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dataSource.totalRecords.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <ClockIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-500">Avg Response</span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dataSource.avgResponseTime ? formatDuration(dataSource.avgResponseTime) : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircleIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-500">Successful Syncs</span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dataSource.totalSyncs}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <ExclamationCircleIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-500">Failed Syncs</span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dataSource.failedSyncs}
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {dataSource.connectionError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex gap-2">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Connection Error</p>
                      <p className="text-sm text-red-600 mt-1">{dataSource.connectionError}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Sync History</h3>
              {isLoadingLogs ? (
                <div className="text-center py-8">
                  <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">Loading logs...</p>
                </div>
              ) : syncLogs.length > 0 ? (
                <div className="space-y-2">
                  {syncLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border border-gray-200 rounded-lg p-3 text-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {log.success ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          ) : (
                            <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
                          )}
                          <span className={log.success ? 'text-green-700' : 'text-red-700'}>
                            {log.success ? 'Success' : 'Failed'}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {formatDate(log.createdAt)}
                        </span>
                      </div>
                      {log.recordsSync > 0 && (
                        <p className="text-gray-600 mt-1">
                          {log.recordsSync} records synced
                        </p>
                      )}
                      {log.duration && (
                        <p className="text-gray-500 text-xs mt-1">
                          Duration: {formatDuration(log.duration)}
                        </p>
                      )}
                      {log.errorMessage && (
                        <p className="text-red-600 text-xs mt-1">{log.errorMessage}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClockIcon className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">No sync logs available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Configuration</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Edit Connection</span>
                      <PencilIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                  <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Duplicate Source</span>
                      <DocumentDuplicateIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Description</h3>
                <p className="text-sm text-gray-600">
                  {dataSource.description || 'No description provided'}
                </p>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-red-600 mb-3">Danger Zone</h3>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete Data Source
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Data Source"
        message={`Are you sure you want to delete "${dataSource?.name}"? This action cannot be undone and will remove all associated sync logs and configurations.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </AnimatePresence>
  );
}