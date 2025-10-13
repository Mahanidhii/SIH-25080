# KMRL Synaptik Rail Document Translator & Summarizer

The KMRL Synaptik Rail is a web-based document translator and summarizer designed to solve Kochi Metro Rail Limited's document overloading problem. This application extracts text from Malayalam documents using Tesseract OCR, translates it to English using Google Translator, and generates AI-powered summaries, making document management more efficient.

![KMRL Document Processing System](https://via.placeholder.com/800x400?text=KMRL+Synaptik+Rail)

## Features

- **Malayalam OCR Processing**: Extract text from Malayalam documents using Tesseract OCR
- **Automatic Translation**: Convert Malayalam text to English using Google Translator
- **AI-Powered Summarization**: Generate concise summaries and key points using BART transformer models
- **Multi-Format Support**: Process various file formats including PDF, images (JPG, PNG, TIFF), and text files
- **Interactive Dashboard**: View processing statistics and document history
- **Real-time Status Updates**: Monitor document processing progress in real-time
- **Responsive UI**: Modern, user-friendly interface built with React and Tailwind CSS

## Technology Stack

### Frontend
- **React** with **TypeScript**
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Dropzone** for file uploads

### Backend
- **FastAPI** (Python)
- **Tesseract OCR** with Malayalam language support
- **Google Translator** for Malayalam to English translation
- **Hugging Face Transformers** (BART model) for AI summarization
- **PyPDF2** for PDF processing
- **Background task processing** for handling long-running operations

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- Tesseract OCR with Malayalam language data

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Install Hugging Face Transformers and PyTorch:
   ```bash
   pip install transformers torch
   ```

5. Ensure Tesseract OCR is installed with Malayalam language support
   - For Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki
   - For Linux: `sudo apt install tesseract-ocr tesseract-ocr-mal`
   - For macOS: `brew install tesseract tesseract-lang`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Start Backend Server
1. From the backend directory with the virtual environment activated:
   ```bash
   uvicorn main:app --reload
   ```
   The API server will start at http://localhost:8000

### Start Frontend Development Server
1. From the frontend directory:
   ```bash
   npm start
   ```
   The development server will start at http://localhost:3000

## Testing
You can test the application using sample Malayalam documents provided in the Test_data directory.

## Application Workflow
1. **Upload Documents**: User uploads Malayalam documents through the intuitive drag-and-drop interface.
2. **OCR Processing**: Backend extracts text from the documents using Tesseract OCR with Malayalam language support.
3. **Translation**: The extracted Malayalam text is translated to English using Google Translator.
4. **AI Summarization**: BART transformer model generates concise summaries and extracts key points.
5. **Results Display**: User can view the original text, translation, and summary in a clean interface.
6. **Dashboard Statistics**: Statistics about processed documents are displayed in the dashboard.

## Key Components

### Document Processing Pipeline
- **File Upload**: Secure upload handling with format validation
- **Text Extraction**: Advanced OCR with Malayalam language support
- **Translation Engine**: Malayalam to English translation
- **Summarization**: AI-powered text summarization and key points extraction
- **Status Tracking**: Real-time processing status updates

### User Interface
- **File Upload Zone**: Drag-and-drop interface for document upload
- **Results Panel**: View processed documents with original text, translations, and summaries
- **Dashboard**: Statistics and metrics on document processing
- **Summarizer Tab**: Generate or regenerate summaries for processed documents

## Advanced Capabilities
- **PDF Processing**: Handles both text-based and scanned PDFs
- **Language Detection**: Automatically detects document language
- **Background Processing**: Long-running tasks handled in the background
- **Fallback Mechanism**: Alternative summarization when AI model is unavailable
- **Real-time Updates**: Processing status updates without page refresh

## Future Enhancements
- Database integration for persistent storage
- User authentication and document ownership
- Support for additional Indian languages
- Enhanced AI models for better summarization
- Mobile application for on-the-go document processing

## Development
This project was developed as a solution for the Smart India Hackathon (SIH) to address Kochi Metro Rail Limited's document management challenges. It demonstrates the effective use of OCR, translation, and AI summarization technologies to streamline document processing.