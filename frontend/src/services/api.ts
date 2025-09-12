import axios from 'axios';
import { ProcessingResult, DashboardData, UploadResponse, HealthCheck } from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 30000,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const getProcessingStatus = async (taskId: string): Promise<ProcessingResult> => {
  const response = await api.get(`/api/status/${taskId}`);
  return response.data;
};

export const getResults = async (): Promise<ProcessingResult[]> => {
  const response = await api.get('/api/results');
  return response.data;
};

export const deleteResult = async (taskId: string): Promise<void> => {
  await api.delete(`/api/results/${taskId}`);
};

export const getDashboard = async (): Promise<DashboardData> => {
  const response = await api.get('/api/dashboard');
  return response.data;
};

export const getHealth = async (): Promise<HealthCheck> => {
  const response = await api.get('/api/health');
  return response.data;
};

export default api;