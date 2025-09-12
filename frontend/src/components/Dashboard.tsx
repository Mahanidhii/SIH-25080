import React from 'react';
import { DashboardData } from '../types';

interface DashboardProps {
  data: DashboardData;
  onRefresh: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onRefresh }) => {
  const formatPercentage = (value: number) => {
    return Math.round(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          📊 KMRL Dashboard
        </h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {data.total_documents}
          </div>
          <div className="text-sm text-gray-600">Total Documents</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {data.completed}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {data.processing}
          </div>
          <div className="text-sm text-gray-600">Processing</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {data.errors}
          </div>
          <div className="text-sm text-gray-600">Errors</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {data.malayalam_documents}
          </div>
          <div className="text-sm text-gray-600">Malayalam Docs</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-3xl font-bold text-indigo-600 mb-2">
            {formatPercentage(data.success_rate)}%
          </div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
      </div>

      {/* Success Rate Visualization */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Processing Success Rate
        </h3>
        
        <div className="space-y-4">
          {/* Success Rate Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Overall Success Rate</span>
              <span className="font-medium text-gray-900">{formatPercentage(data.success_rate)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  data.success_rate >= 80 ? 'bg-green-500' :
                  data.success_rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${data.success_rate}%` }}
              ></div>
            </div>
          </div>

          {/* Malayalam Processing Rate */}
          {data.total_documents > 0 && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Malayalam Document Rate</span>
                <span className="font-medium text-gray-900">
                  {formatPercentage((data.malayalam_documents / data.total_documents) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(data.malayalam_documents / data.total_documents) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Processing Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📈 Processing Statistics
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Processed:</span>
              <span className="font-medium">{data.total_documents}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Malayalam Documents:</span>
              <span className="font-medium text-purple-600">{data.malayalam_documents}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Currently Processing:</span>
              <span className={`font-medium ${data.processing > 0 ? 'text-yellow-600' : 'text-gray-400'}`}>
                {data.processing}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Failed Processing:</span>
              <span className={`font-medium ${data.errors > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                {data.errors}
              </span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ⚡ System Health
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Malayalam OCR:</span>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Translation Service:</span>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">File Processing:</span>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  data.processing > 0 ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span className={`text-sm font-medium ${
                  data.processing > 0 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {data.processing > 0 ? `${data.processing} Active` : 'Ready'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Results Preview */}
      {data.recent_results && data.recent_results.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🕐 Recent Processing Results
          </h3>
          
          <div className="space-y-3">
            {data.recent_results.slice(0, 5).map((result, index) => (
              <div key={result.id || index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center min-w-0 flex-1">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {result.filename}
                  </span>
                  <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                    result.status === 'completed' ? 'status-completed' :
                    result.status === 'processing' ? 'status-processing' : 'status-error'
                  }`}>
                    {result.status}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 ml-4">
                  {result.created_at ? new Date(result.created_at).toLocaleTimeString() : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🚆 KMRL Train Induction Planning Features
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span className="text-sm text-gray-700">Malayalam OCR Processing</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span className="text-sm text-gray-700">Automatic Language Detection</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span className="text-sm text-gray-700">Real-time Translation</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span className="text-sm text-gray-700">Multi-format Support (PDF, Images)</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span className="text-sm text-gray-700">Background Processing</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span className="text-sm text-gray-700">Confidence Scoring</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;