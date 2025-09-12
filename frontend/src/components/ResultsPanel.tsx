import React, { useState } from 'react';
import { ProcessingResult } from '../types';
import { deleteResult } from '../services/api';

interface ResultsPanelProps {
  results: ProcessingResult[];
  onRefresh: () => void;
  onDelete: (taskId: string) => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, onRefresh, onDelete }) => {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDelete = async (taskId: string) => {
    try {
      setDeletingIds(prev => new Set(prev).add(taskId));
      await deleteResult(taskId);
      onDelete(taskId);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  const formatProcessingTime = (seconds: number) => {
    if (seconds < 1) return '< 1s';
    return `${seconds.toFixed(1)}s`;
  };

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <div className="text-4xl mb-4">📄</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Documents Processed</h3>
        <p className="text-gray-500 mb-6">
          Upload Malayalam documents to see processing results here.
        </p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh Results
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Processing Results ({results.length})
        </h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Results Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {results.map((result) => (
          <div key={result.id} className="result-card bg-white rounded-lg shadow-sm border p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  📄 {result.filename}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatTime(result.created_at)}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  result.status === 'completed' ? 'status-completed' :
                  result.status === 'processing' ? 'status-processing' : 'status-error'
                }`}>
                  {result.status === 'processing' ? '🔄' : result.status === 'completed' ? '✅' : '❌'}
                  {result.status}
                </span>
                
                <button
                  onClick={() => handleDelete(result.id)}
                  disabled={deletingIds.has(result.id)}
                  className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-50"
                  title="Delete result"
                >
                  {deletingIds.has(result.id) ? '⏳' : '🗑️'}
                </button>
              </div>
            </div>

            {/* Progress Bar for Processing */}
            {result.status === 'processing' && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{result.message}</span>
                  <span className="text-gray-500">{result.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="progress-bar h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${result.progress || 0}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Processing Details */}
            {result.status === 'completed' && (
              <div className="space-y-4">
                {/* Language & Confidence */}
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Language:</span>
                    <span className="ml-2 text-gray-600">
                      {result.language === 'ml' ? '🇮🇳 Malayalam' : 
                       result.language === 'en' ? '🇺🇸 English' : result.language || 'Unknown'}
                    </span>
                  </div>
                  
                  {result.confidence && (
                    <div>
                      <span className="font-medium text-gray-700">Confidence:</span>
                      <span className={`ml-2 font-medium ${
                        result.confidence > 0.8 ? 'text-green-600' : 
                        result.confidence > 0.5 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {(result.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Original Text */}
                {result.original_text && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Original Text:</h4>
                    <div className="bg-gray-50 rounded-md p-3 max-h-64 overflow-y-auto">
                      <p className="text-sm text-gray-800 malayalam-text whitespace-pre-wrap">
                        {result.original_text}
                      </p>
                    </div>
                  </div>
                )}

                {/* Translated Text */}
                {result.translated_text && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">English Translation:</h4>
                    <div className="bg-blue-50 rounded-md p-3 max-h-64 overflow-y-auto">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {result.translated_text}
                      </p>
                    </div>
                  </div>
                )}

                {/* Processing Time */}
                {result.processing_time && (
                  <div className="text-xs text-gray-500">
                    ⏱️ Processing time: {formatProcessingTime(result.processing_time)}
                  </div>
                )}
              </div>
            )}

            {/* Error State */}
            {result.status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-700">
                  <span className="font-medium">Error:</span> {result.error || result.message}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {results.length}
            </div>
            <div className="text-sm text-gray-500">Total Documents</div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-green-600">
              {results.filter(r => r.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {results.filter(r => r.status === 'processing').length}
            </div>
            <div className="text-sm text-gray-500">Processing</div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-red-600">
              {results.filter(r => r.status === 'error').length}
            </div>
            <div className="text-sm text-gray-500">Errors</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;