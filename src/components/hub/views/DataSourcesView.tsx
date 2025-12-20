'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CircleStackIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ServerIcon,
  CloudIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { DataSourceType, DataSourceStatus } from '@prisma/client';
import { toast } from 'react-hot-toast';
import DataSourceWizard from '@/components/studio/data-sources/DataSourceWizard';
import DataSourcePanel from '@/components/studio/data-sources/DataSourcePanel';

interface DataSource {
  id: string;
  name: string;
  description?: string;
  type: DataSourceType;
  status: DataSourceStatus;
  host?: string;
  database?: string;
  lastConnectionTest?: string;
  lastSuccessfulSync?: string;
  connectionError?: string;
  totalRecords: number;
  totalSyncs: number;
  failedSyncs: number;
  avgResponseTime?: number;
  createdAt: string;
  updatedAt: string;
}

export default function DataSourcesView() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<DataSourceType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<DataSourceStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchDataSources();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filterType, filterStatus]);

  const fetchDataSources = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterType !== 'all') params.append('type', filterType);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`/api/data-sources?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setDataSources(data);
      } else {
        toast.error('Failed to fetch data sources');
      }
    } catch (error) {
      console.error('Error fetching data sources:', error);
      toast.error('An error occurred while fetching data sources');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSourceClick = (source: DataSource) => {
    setSelectedSource(source);
    setShowPanel(true);
  };

  const handleDeleteSource = (id: string) => {
    setDataSources(dataSources.filter(s => s.id !== id));
  };

  const getSourceIcon = (type: DataSourceType) => {
    switch (type) {
      case DataSourceType.POSTGRESQL:
      case DataSourceType.MYSQL:
      case DataSourceType.MONGODB:
        return ServerIcon;
      case DataSourceType.REST_API:
      case DataSourceType.GRAPHQL:
        return CloudIcon;
      case DataSourceType.S3:
        return ServerIcon;
      case DataSourceType.GOOGLE_SHEETS:
      case DataSourceType.CSV_FILE:
        return DocumentTextIcon;
      default:
        return CircleStackIcon;
    }
  };

  const getStatusIcon = (status: DataSourceStatus) => {
    switch (status) {
      case DataSourceStatus.CONNECTED:
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case DataSourceStatus.ERROR:
        return <ExclamationCircleIcon className="h-4 w-4 text-red-500" />;
      case DataSourceStatus.TESTING:
        return <ArrowPathIcon className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: DataSourceStatus) => {
    switch (status) {
      case DataSourceStatus.CONNECTED:
        return 'bg-green-50 text-green-700 border-green-200';
      case DataSourceStatus.ERROR:
        return 'bg-red-50 text-red-700 border-red-200';
      case DataSourceStatus.TESTING:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sourceTypes = [
    'all',
    DataSourceType.POSTGRESQL,
    DataSourceType.MYSQL,
    DataSourceType.MONGODB,
    DataSourceType.REST_API,
    DataSourceType.GRAPHQL,
    DataSourceType.S3,
    DataSourceType.GOOGLE_SHEETS,
    DataSourceType.CSV_FILE,
  ];

  const statusTypes = [
    'all',
    DataSourceStatus.CONNECTED,
    DataSourceStatus.DISCONNECTED,
    DataSourceStatus.ERROR,
    DataSourceStatus.TESTING,
    DataSourceStatus.CONFIGURING,
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Data Sources</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor your data connections
            </p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add New Source
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search data sources..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters 
                ? 'border-gray-900 bg-gray-900 text-white' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
            {(filterType !== 'all' || filterStatus !== 'all') && (
              <span className="bg-white text-gray-900 text-xs px-1.5 py-0.5 rounded-full">
                {(filterType !== 'all' ? 1 : 0) + (filterStatus !== 'all' ? 1 : 0)}
              </span>
            )}
          </button>

          <button
            onClick={fetchDataSources}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Filter Dropdowns */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex gap-3 mt-3 overflow-hidden"
            >
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as DataSourceType | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  {sourceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as DataSourceStatus | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  {statusTypes.map((status) => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Statuses' : status}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              className="h-12 w-12 border-4 border-gray-300 border-t-gray-900 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : dataSources.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px] h-full bg-white rounded-lg border-2 border-dashed border-gray-300 p-8"
          >
            <CircleStackIcon className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                ? 'No matching data sources found'
                : 'No data sources connected'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add a data source to start building your workflow'}
            </p>
            {!searchQuery && filterType === 'all' && filterStatus === 'all' && (
              <button
                onClick={() => setShowWizard(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Add Your First Source
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 auto-rows-min">
            <AnimatePresence mode="popLayout">
              {dataSources.map((source, index) => {
                const Icon = getSourceIcon(source.type);
                return (
                  <motion.div
                    key={source.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSourceClick(source)}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Icon className="h-6 w-6 text-gray-700" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 line-clamp-1">
                            {source.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {source.type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusIcon(source.status)}
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(source.status)}`}>
                        {source.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Records</span>
                        <span className="text-gray-900 font-medium">
                          {source.totalRecords.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Syncs</span>
                        <span className="text-gray-900 font-medium">
                          {source.totalSyncs}
                        </span>
                      </div>
                      {source.lastSuccessfulSync && (
                        <div className="pt-2 border-t border-gray-100">
                          <span className="text-gray-500">Last sync: </span>
                          <span className="text-gray-700">
                            {formatDate(source.lastSuccessfulSync)}
                          </span>
                        </div>
                      )}
                    </div>

                    {source.connectionError && (
                      <div className="mt-3 p-2 bg-red-50 rounded text-xs text-red-600">
                        {source.connectionError}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Wizard Modal */}
      <DataSourceWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onComplete={() => {
          setShowWizard(false);
          fetchDataSources();
        }}
      />

      {/* Side Panel */}
      <DataSourcePanel
        dataSource={selectedSource}
        isOpen={showPanel}
        onClose={() => {
          setShowPanel(false);
          setSelectedSource(null);
        }}
        onUpdate={fetchDataSources}
        onDelete={handleDeleteSource}
      />
    </div>
  );
}