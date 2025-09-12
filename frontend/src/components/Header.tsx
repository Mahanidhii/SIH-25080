import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">
                🚆 KMRL
              </h1>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Train Induction Planning System
              </h2>
              <p className="text-sm text-gray-500">
                AI-Powered Malayalam OCR & Document Processing
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">Malayalam OCR</div>
              <div className="text-xs text-gray-500">Ready for Processing</div>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;