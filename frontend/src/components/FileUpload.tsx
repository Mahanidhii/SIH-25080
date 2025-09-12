import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ProcessingResult } from '../types';
import { uploadDocument } from '../services/api';

interface FileUploadProps {
  onUploadComplete: (result: ProcessingResult) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(10);
      setMessage('Uploading file...');

      // Upload the file
      setUploadProgress(50);
      const result = await uploadDocument(file);
      
      setUploadProgress(100);
      setMessage('File uploaded successfully! Processing started...');
      
      // Call the completion handler with initial result
      onUploadComplete({
        ...result,
        progress: 10,
        created_at: new Date().toISOString()
      } as ProcessingResult);
      
      // Reset after a short delay
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setMessage('');
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Upload failed. Please try again.');
      setUploading(false);
      setUploadProgress(0);
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  }, [onUploadComplete]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.tiff'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          upload-zone relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? 'drag-active border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${uploading ? 'pointer-events-none opacity-50' : 'hover:border-blue-400 hover:bg-gray-50'}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          {!uploading ? (
            <>
              <div className="mx-auto w-12 h-12 text-gray-400">
                📄
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive
                    ? 'Drop the document here...'
                    : 'Upload Malayalam Documents'
                  }
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Drag and drop or click to select files
                </p>
              </div>
              
              <div className="text-xs text-gray-400 space-y-1">
                <p>Supported formats: PDF, PNG, JPG, TXT</p>
                <p>Maximum file size: 10MB</p>
                <p>Malayalam OCR processing with auto-translation</p>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto w-12 h-12 text-blue-500">
                <div className="loading-spinner mx-auto"></div>
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Processing Document...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {message}
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full max-w-xs mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="progress-bar h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{uploadProgress}% complete</p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Success/Error Messages */}
      {message && !uploading && (
        <div className={`mt-4 p-3 rounded-md ${
          message.includes('failed') || message.includes('error')
            ? 'bg-red-100 text-red-700 border border-red-300'
            : 'bg-green-100 text-green-700 border border-green-300'
        }`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}
      
      {/* File Requirements */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          📋 Document Processing Features:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ Malayalam text recognition (OCR)</li>
          <li>✅ Automatic language detection</li>
          <li>✅ English translation</li>
          <li>✅ Real-time processing status</li>
          <li>✅ High accuracy Malayalam character recognition</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;