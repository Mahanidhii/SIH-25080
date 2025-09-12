export interface ProcessingResult {
  id: string;
  filename: string;
  status: 'processing' | 'completed' | 'error';
  created_at: string;
  completed_at?: string;
  progress: number;
  message: string;
  original_text?: string;
  translated_text?: string;
  language?: string;
  confidence?: number;
  processing_time?: number;
  error?: string;
  // AI Summarization fields
  summary?: string;
  key_points?: string[];
  summary_type?: 'ai_generated' | 'extractive' | 'error' | 'none';
  summary_generated_at?: string;
}

export interface DashboardData {
  total_documents: number;
  completed: number;
  processing: number;
  errors: number;
  malayalam_documents: number;
  success_rate: number;
  recent_results: ProcessingResult[];
}

export interface UploadResponse {
  id: string;
  filename: string;
  status: string;
  message: string;
}

export interface HealthCheck {
  status: string;
  timestamp: string;
  tesseract_ready: boolean;
  malayalam_ocr_enabled: boolean;
  upload_dir: string;
  active_tasks: number;
  total_processed: number;
}