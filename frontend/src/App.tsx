import React, { useState, useEffect } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import ResultsPanel from './components/ResultsPanel';
import Dashboard from './components/Dashboard';
import Summarizer from './components/Summarizer';
import Header from './components/Header';
import { ProcessingResult, DashboardData } from './types';
import { getResults, getDashboard } from './services/api';

function App() {
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'results' | 'dashboard' | 'summarizer'>('upload');
  const [loading, setLoading] = useState(false);

  // Fetch results and dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resultsData, dashboardData] = await Promise.all([
        getResults(),
        getDashboard()
      ]);
      setResults(resultsData);
      setDashboard(dashboardData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh data every 5 seconds when there are processing tasks
  useEffect(() => {
    const hasProcessing = results.some(r => r.status === 'processing');
    
    if (hasProcessing) {
      const interval = setInterval(fetchData, 2000);
      return () => clearInterval(interval);
    }
  }, [results]);

  const handleUploadComplete = (newResult: ProcessingResult) => {
    setResults(prev => [newResult, ...prev]);
    fetchData(); // Refresh to get latest data
  };

  const handleDeleteResult = (taskId: string) => {
    setResults(prev => prev.filter(r => r.id !== taskId));
    fetchData(); // Refresh dashboard
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📤 Document Upload
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'results'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Processing Results ({results.length})
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('summarizer')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'summarizer'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🤖 AI Summarizer
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {loading && activeTab !== 'upload' && (
          <div className="flex justify-center items-center py-8">
            <div className="loading-spinner"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🚆 KMRL Train Induction Planning
              </h2>
              <p className="text-gray-600 mb-6">
                Upload Malayalam documents (PDF, Images, Text) for automatic OCR processing and translation.
                Our AI-powered system extracts Malayalam text and provides English translations for train induction planning.
              </p>
              <FileUpload onUploadComplete={handleUploadComplete} />
            </div>

            {/* Recent Results Preview */}
            {results.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Processing Results</h3>
                  <button
                    onClick={() => setActiveTab('results')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {results.slice(0, 4).map((result) => (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm truncate">{result.filename}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          result.status === 'completed' ? 'status-completed' :
                          result.status === 'processing' ? 'status-processing' : 'status-error'
                        }`}>
                          {result.status}
                        </span>
                      </div>
                      {result.status === 'processing' && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="progress-bar h-2 rounded-full" 
                            style={{ width: `${result.progress || 0}%` }}
                          ></div>
                        </div>
                      )}
                      {result.translated_text && (
                        <p className="text-gray-600 text-sm mt-2">
                          {result.translated_text.length > 150 
                            ? result.translated_text.substring(0, 150) + '...'
                            : result.translated_text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'results' && !loading && (
          <ResultsPanel 
            results={results} 
            onRefresh={fetchData}
            onDelete={handleDeleteResult}
          />
        )}

        {activeTab === 'dashboard' && !loading && dashboard && (
          <Dashboard data={dashboard} onRefresh={fetchData} />
        )}

        {activeTab === 'summarizer' && !loading && (
          <Summarizer 
            results={results} 
            onRefresh={fetchData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 KMRL Train Induction Planning System
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-400">
                Malayalam OCR • AI Translation • Document Processing
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;