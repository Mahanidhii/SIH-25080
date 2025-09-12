import React, { useState } from 'react';
import { ProcessingResult } from '../types';

interface SummarizerProps {
  results: ProcessingResult[];
  onRefresh: () => void;
}

const Summarizer: React.FC<SummarizerProps> = ({ results, onRefresh }) => {
  const [selectedResult, setSelectedResult] = useState<ProcessingResult | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Filter completed results that have translated text
  const completedResults = results.filter(
    result => result.status === 'completed' && result.translated_text && result.translated_text.length > 50
  );

  const generateSummary = async (taskId: string) => {
    setIsGeneratingSummary(true);
    setSummaryError(null);
    
    try {
      const response = await fetch(`/api/summarize/${taskId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate summary: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Refresh the data to get updated result with summary
      onRefresh();
      
      // Update selected result if it's the same
      if (selectedResult && selectedResult.id === taskId) {
        setSelectedResult(prev => prev ? {
          ...prev,
          summary: data.summary,
          key_points: data.key_points,
          summary_type: data.summary_type
        } : null);
      }
      
    } catch (error) {
      setSummaryError(`Summary generation failed: ${error}`);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString();
  };

  const getSummaryTypeIcon = (type?: string) => {
    switch (type) {
      case 'ai_generated': return '🤖';
      case 'extractive': return '📄';
      case 'error': return '❌';
      default: return '📝';
    }
  };

  const getSummaryTypeName = (type?: string) => {
    switch (type) {
      case 'ai_generated': return 'AI Generated';
      case 'extractive': return 'Extractive';
      case 'error': return 'Error';
      default: return 'Basic';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🤖 AI Document Summarizer</h1>
        <p className="mt-2 text-sm text-gray-600">
          Generate intelligent summaries from your processed Malayalam documents using advanced AI.
        </p>
      </div>

      {completedResults.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Ready for Summarization</h3>
          <p className="text-gray-500">
            Upload and process some Malayalam documents first to generate AI summaries.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document List */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Processed Documents ({completedResults.length})
            </h2>
            <div className="space-y-3">
              {completedResults.map((result) => (
                <div
                  key={result.id}
                  onClick={() => setSelectedResult(result)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedResult?.id === result.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {result.filename}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(result.completed_at)}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Language: {result.language} | Confidence: {((result.confidence || 0) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="flex flex-col items-end ml-2">
                      {result.summary ? (
                        <div className="flex items-center">
                          <span className="text-sm mr-1">{getSummaryTypeIcon(result.summary_type)}</span>
                          <span className="text-xs text-green-600">Summarized</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No summary</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-2">
            {selectedResult ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedResult.filename}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Processed: {formatDate(selectedResult.completed_at)} | 
                        Text Length: {selectedResult.translated_text?.length || 0} characters
                      </p>
                    </div>
                    <button
                      onClick={() => generateSummary(selectedResult.id)}
                      disabled={isGeneratingSummary}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isGeneratingSummary
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isGeneratingSummary ? '🔄 Generating...' : '🤖 Generate Summary'}
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Summary Section */}
                  {selectedResult.summary ? (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {getSummaryTypeIcon(selectedResult.summary_type)} AI Summary
                        </h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {getSummaryTypeName(selectedResult.summary_type)}
                        </span>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-gray-800 leading-relaxed">
                          {selectedResult.summary}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <div className="text-4xl mb-3">🤖</div>
                      <p className="text-gray-600">
                        Click "Generate Summary" to create an AI-powered summary of this document.
                      </p>
                    </div>
                  )}

                  {/* Key Points Section */}
                  {selectedResult.key_points && selectedResult.key_points.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        🎯 Key Points
                      </h3>
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <ul className="space-y-2">
                          {selectedResult.key_points.map((point, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-yellow-600 mr-2 font-medium">•</span>
                              <span className="text-gray-800">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Original Content Preview */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      📄 Original Content (Preview)
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto border">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedResult.translated_text?.substring(0, 500)}
                        {selectedResult.translated_text && selectedResult.translated_text.length > 500 && '...'}
                      </p>
                    </div>
                  </div>

                  {/* Error Display */}
                  {summaryError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex">
                        <div className="text-red-400 mr-3">❌</div>
                        <div>
                          <h3 className="text-sm font-medium text-red-800">
                            Summary Generation Failed
                          </h3>
                          <p className="text-sm text-red-700 mt-1">{summaryError}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Document to Summarize
                </h3>
                <p className="text-gray-500">
                  Choose a processed document from the list to generate or view its AI summary.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Summarizer;