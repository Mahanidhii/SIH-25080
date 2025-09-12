"""
KMRL Train Induction Planning - FastAPI Backend
Integration with Malayalam OCR from sih.ipynb
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os
import uuid
from typing import List, Dict, Optional
import aiofiles
from datetime import datetime
import logging

# Import your proven Malayalam OCR approach
import pytesseract
from PIL import Image
from deep_translator import GoogleTranslator
import langdetect
import time
import PyPDF2

# Import LLM libraries for summarization
from transformers import pipeline
import torch

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="KMRL Train Induction Planning System",
    description="AI-Driven document processing with Malayalam OCR for KMRL",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (for production build)
import os
STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "build")
if os.path.exists(STATIC_DIR):
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")

# Configure Tesseract OCR (your approach)
try:
    # Point to Tesseract OCR exe
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    logger.info("✅ Tesseract OCR configured")
except Exception as e:
    logger.warning(f"⚠️ Tesseract configuration issue: {e}")

# Ensure upload directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# In-memory storage for demo (replace with database in production)
processing_results: Dict[str, Dict] = {}

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "KMRL Train Induction Planning API",
        "version": "1.0.0",
        "status": "active",
        "features": ["Malayalam OCR", "Auto Translation", "Document Processing"]
    }

def extract_and_translate(file_path: str) -> Dict:
    """
    Your proven extract_and_translate method from sih.ipynb
    """
    try:
        start_time = time.time()
        
        # Determine file type
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension in ['.jpg', '.jpeg', '.png', '.tiff']:
            # Image processing (your approach)
            img = Image.open(file_path)
            mal_text = pytesseract.image_to_string(img, lang="mal")
            
            print(f"\n🔹 Extracted Malayalam Text from {file_path}:")
            print(mal_text if mal_text else "[No text found]")
            
        elif file_extension == '.pdf':
            # Enhanced PDF processing with PyPDF2
            mal_text = ""
            try:
                # First, try to extract text directly from PDF
                with open(file_path, 'rb') as pdf_file:
                    pdf_reader = PyPDF2.PdfReader(pdf_file)
                    for page in pdf_reader.pages:
                        page_text = page.extract_text()
                        if page_text.strip():
                            mal_text += page_text + "\n"
                
                print(f"\n🔹 Extracted text from PDF {file_path}:")
                print(mal_text if mal_text else "[No text found in PDF]")
                
                # If no text found or very little text, it might be a scanned PDF
                if not mal_text.strip() or len(mal_text.strip()) < 10:
                    print("📄 PDF appears to be scanned, trying OCR...")
                    try:
                        # Try to open as image for OCR (some PDFs can be opened as images)
                        img = Image.open(file_path)
                        mal_text = pytesseract.image_to_string(img, lang="mal")
                        print(f"🔍 OCR result: {mal_text[:100]}...")
                    except:
                        mal_text = "Unable to extract text from this PDF. Please try converting to an image format."
            except Exception as e:
                print(f"❌ PDF processing error: {str(e)}")
                mal_text = f"Error processing PDF: {str(e)}"
                
        else:
            # Text files
            with open(file_path, 'r', encoding='utf-8') as f:
                mal_text = f.read()
        
        if not mal_text.strip():
            return {
                "original_text": "",
                "language": "unknown", 
                "translated_text": "",
                "processing_time": time.time() - start_time,
                "confidence": 0.0
            }
        
        # Language detection (your approach)
        try:
            detected_lang = langdetect.detect(mal_text)
        except:
            detected_lang = "unknown"
        
        print(f"\n📝 Detected Language: {detected_lang}")
        
        # Translation (your approach)
        if detected_lang == "ml" or detected_lang == "unknown":
            translated = GoogleTranslator(source="ml", target="en").translate(mal_text)
            print(f"\n✅ Translated Text (English):")
            print(translated)
        else:
            translated = mal_text  # Already in English
            print(f"\n✅ Text is already in English")
        
        processing_time = time.time() - start_time
        
        return {
            "original_text": mal_text,
            "language": detected_lang,
            "translated_text": translated,
            "processing_time": processing_time,
            "confidence": 0.9 if detected_lang in ["ml", "en"] else 0.5
        }
        
    except Exception as e:
        logger.error(f"❌ OCR Processing error: {str(e)}")
        return {
            "original_text": "",
            "language": "error",
            "translated_text": f"Processing error: {str(e)}",
            "processing_time": 0,
            "confidence": 0.0,
            "error": str(e)
        }

# Initialize summarization pipeline
summarizer = None

def initialize_summarizer():
    """Initialize the summarization pipeline"""
    global summarizer
    try:
        if summarizer is None:
            logger.info("🤖 Initializing AI summarizer...")
            # Using a lightweight summarization model
            summarizer = pipeline(
                "summarization", 
                model="facebook/bart-large-cnn",
                device=0 if torch.cuda.is_available() else -1
            )
            logger.info("✅ AI summarizer initialized")
    except Exception as e:
        logger.warning(f"⚠️ Summarizer initialization failed: {e}")
        # Fallback to a simpler approach
        summarizer = "fallback"

def generate_summary(text: str, max_length: int = 150) -> Dict:
    """
    Generate AI-powered summary from extracted text
    """
    try:
        if not text or len(text.strip()) < 50:
            return {
                "summary": "Text too short to summarize effectively.",
                "key_points": [],
                "summary_type": "insufficient_content"
            }
        
        # Initialize summarizer if not already done
        if summarizer is None:
            initialize_summarizer()
        
        # Generate summary
        if summarizer == "fallback":
            # Simple extractive summarization fallback
            sentences = text.split('. ')
            if len(sentences) <= 3:
                summary_text = text[:max_length*2] + "..."
            else:
                # Take first and important middle sentences
                summary_text = '. '.join(sentences[:2] + sentences[len(sentences)//2:len(sentences)//2+1])
                if len(summary_text) > max_length*2:
                    summary_text = summary_text[:max_length*2] + "..."
            
            key_points = [s.strip() for s in sentences[:5] if len(s.strip()) > 20]
            
        else:
            # AI-powered summarization
            # Chunk text if too long
            max_input_length = 1000
            if len(text) > max_input_length:
                text_chunk = text[:max_input_length]
            else:
                text_chunk = text
            
            summary_result = summarizer(
                text_chunk, 
                max_length=max_length, 
                min_length=30, 
                do_sample=False
            )
            summary_text = summary_result[0]['summary_text']
            
            # Extract key points (simple sentence splitting)
            sentences = text.split('. ')
            key_points = [s.strip() + '.' for s in sentences[:5] if len(s.strip()) > 20]
        
        return {
            "summary": summary_text,
            "key_points": key_points,
            "summary_type": "ai_generated" if summarizer != "fallback" else "extractive",
            "original_length": len(text),
            "summary_length": len(summary_text)
        }
        
    except Exception as e:
        logger.error(f"❌ Summarization error: {str(e)}")
        return {
            "summary": f"Summary generation failed: {str(e)}",
            "key_points": [],
            "summary_type": "error",
            "error": str(e)
        }

@app.post("/api/upload")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Upload and process Malayalam documents using your proven OCR approach
    """
    try:
        # Validate file type - more flexible approach
        allowed_extensions = ['.pdf', '.jpg', '.jpeg', '.png', '.tiff', '.txt']
        file_extension = os.path.splitext(file.filename)[1].lower() if file.filename else ''
        
        # Allow text files even if content_type is None or not detected properly
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file extension: {file_extension}. Supported: {', '.join(allowed_extensions)}"
            )
            
        logger.info(f"📁 File upload: {file.filename} (type: {file.content_type}, ext: {file_extension})")
        
        # Generate unique ID for this processing task
        task_id = str(uuid.uuid4())
        
        # Save uploaded file
        file_path = os.path.join(UPLOAD_DIR, f"{task_id}{file_extension}")
        
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Initialize processing result
        processing_results[task_id] = {
            "id": task_id,
            "filename": file.filename,
            "status": "processing",
            "created_at": datetime.now().isoformat(),
            "progress": 10,
            "message": "File uploaded, starting OCR processing..."
        }
        
        # Start background processing with your OCR approach
        background_tasks.add_task(process_document_async, task_id, file_path, file.filename)
        
        logger.info(f"📤 File uploaded: {file.filename} -> {task_id}")
        
        return JSONResponse({
            "id": task_id,
            "filename": file.filename,
            "status": "processing",
            "message": "File uploaded successfully. Malayalam OCR processing started."
        })
        
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

async def process_document_async(task_id: str, file_path: str, filename: str):
    """
    Background task to process document using your extract_and_translate approach
    """
    try:
        logger.info(f"🔄 Starting Malayalam OCR processing for {filename}")
        
        # Update status
        processing_results[task_id].update({
            "status": "processing",
            "progress": 30,
            "message": "Running Malayalam OCR extraction..."
        })
        
        # Use your proven extract_and_translate method
        result = extract_and_translate(file_path)
        
        # Generate AI summary if text extraction was successful
        summary_result = {}
        if result.get("translated_text") and len(result.get("translated_text", "").strip()) > 50:
            processing_results[task_id].update({
                "progress": 80,
                "message": "Generating AI summary..."
            })
            summary_result = generate_summary(result.get("translated_text", ""))
        
        # Update final result
        processing_results[task_id].update({
            "status": "completed",
            "progress": 100,
            "original_text": result.get("original_text", ""),
            "translated_text": result.get("translated_text", ""),
            "language": result.get("language", "unknown"),
            "confidence": result.get("confidence", 0.0),
            "processing_time": result.get("processing_time", 0),
            "summary": summary_result.get("summary", ""),
            "key_points": summary_result.get("key_points", []),
            "summary_type": summary_result.get("summary_type", "none"),
            "completed_at": datetime.now().isoformat(),
            "message": "Malayalam OCR processing and AI summarization completed successfully"
        })
        
        if "error" in result:
            processing_results[task_id].update({
                "status": "error",
                "error": result["error"]
            })
        
        logger.info(f"✅ Malayalam OCR processing completed for {filename}")
        
    except Exception as e:
        logger.error(f"❌ Processing error for {filename}: {str(e)}")
        processing_results[task_id].update({
            "status": "error",
            "progress": 0,
            "error": str(e),
            "message": f"Processing failed: {str(e)}"
        })

@app.get("/api/status/{task_id}")
async def get_processing_status(task_id: str):
    """
    Get processing status for a document
    """
    if task_id not in processing_results:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return JSONResponse(processing_results[task_id])

@app.get("/api/results")
async def get_all_results():
    """
    Get all processing results
    """
    return JSONResponse(list(processing_results.values()))

@app.delete("/api/results/{task_id}")
async def delete_result(task_id: str):
    """
    Delete a processing result
    """
    if task_id not in processing_results:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Clean up files
    result = processing_results[task_id]
    
    # Remove from memory
    del processing_results[task_id]
    
    return JSONResponse({"message": "Result deleted successfully"})

@app.post("/api/summarize/{task_id}")
async def generate_document_summary(task_id: str):
    """
    Generate or regenerate summary for an existing processed document
    """
    if task_id not in processing_results:
        raise HTTPException(status_code=404, detail="Task not found")
    
    result = processing_results[task_id]
    
    if result["status"] != "completed":
        raise HTTPException(status_code=400, detail="Document processing not completed yet")
    
    translated_text = result.get("translated_text", "")
    if not translated_text or len(translated_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Text too short to summarize")
    
    try:
        # Generate new summary
        summary_result = generate_summary(translated_text)
        
        # Update the result with new summary
        processing_results[task_id].update({
            "summary": summary_result.get("summary", ""),
            "key_points": summary_result.get("key_points", []),
            "summary_type": summary_result.get("summary_type", "none"),
            "summary_generated_at": datetime.now().isoformat()
        })
        
        return JSONResponse({
            "message": "Summary generated successfully",
            "summary": summary_result.get("summary", ""),
            "key_points": summary_result.get("key_points", []),
            "summary_type": summary_result.get("summary_type", "none")
        })
        
    except Exception as e:
        logger.error(f"❌ Summary generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Summary generation failed: {str(e)}")

@app.get("/api/health")
async def health_check():
    """
    Health check endpoint
    """
    # Test Tesseract availability
    tesseract_ready = False
    try:
        import subprocess
        result = subprocess.run([pytesseract.pytesseract.tesseract_cmd, "--version"], 
                              capture_output=True, text=True, timeout=5)
        tesseract_ready = result.returncode == 0
    except:
        pass
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "tesseract_ready": tesseract_ready,
        "malayalam_ocr_enabled": tesseract_ready,
        "upload_dir": UPLOAD_DIR,
        "active_tasks": len([r for r in processing_results.values() if r["status"] == "processing"]),
        "total_processed": len(processing_results)
    }

@app.get("/api/dashboard")
async def get_dashboard():
    """
    Dashboard with processing statistics
    """
    total_docs = len(processing_results)
    completed = len([r for r in processing_results.values() if r["status"] == "completed"])
    processing = len([r for r in processing_results.values() if r["status"] == "processing"])
    errors = len([r for r in processing_results.values() if r["status"] == "error"])
    
    malayalam_docs = len([r for r in processing_results.values() 
                         if r.get("language") == "ml" and r["status"] == "completed"])
    
    return {
        "total_documents": total_docs,
        "completed": completed,
        "processing": processing,
        "errors": errors,
        "malayalam_documents": malayalam_docs,
        "success_rate": (completed / total_docs * 100) if total_docs > 0 else 0,
        "recent_results": list(processing_results.values())[-5:] if processing_results else []
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)