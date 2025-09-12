#!/usr/bin/env python3
"""
Test the AI Summarizer functionality
"""

import requests
import json
import time
import os

def test_ai_summarizer():
    """Test the complete AI summarization workflow"""
    
    print("🤖 Testing KMRL AI Summarizer")
    print("=" * 50)
    
    # Test backend health
    try:
        health_response = requests.get("http://127.0.0.1:8000/api/health")
        if health_response.status_code == 200:
            print("✅ Backend server is healthy")
        else:
            print("❌ Backend server not responding")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False
    
    # Upload test file
    test_file = "D:/New_SIH/malayalam_training.txt"
    
    if not os.path.exists(test_file):
        print(f"❌ Test file not found: {test_file}")
        return False
    
    print(f"\n📤 Uploading: {os.path.basename(test_file)}")
    
    try:
        with open(test_file, 'rb') as f:
            files = {'file': f}
            response = requests.post('http://127.0.0.1:8000/api/upload', files=files)
        
        if response.status_code == 200:
            result = response.json()
            task_id = result.get('id')
            print(f"✅ Upload successful! Task ID: {task_id}")
            
            # Wait for processing to complete
            print("🔄 Processing document (OCR + Translation + AI Summary)...")
            
            for i in range(30):  # Wait up to 60 seconds
                time.sleep(2)
                
                status_response = requests.get(f'http://127.0.0.1:8000/api/status/{task_id}')
                if status_response.status_code == 200:
                    status_data = status_response.json()
                    
                    status = status_data.get('status')
                    progress = status_data.get('progress', 0)
                    message = status_data.get('message', '')
                    
                    print(f"📊 Status: {status} ({progress}%) - {message}")
                    
                    if status == 'completed':
                        print("\n🎉 Processing completed with AI Summary!")
                        
                        # Display results
                        original_text = status_data.get('original_text', '')
                        translated_text = status_data.get('translated_text', '')
                        summary = status_data.get('summary', '')
                        key_points = status_data.get('key_points', [])
                        summary_type = status_data.get('summary_type', 'none')
                        
                        print(f"\n📄 Document Processing Results:")
                        print(f"   Language: {status_data.get('language', 'unknown')}")
                        print(f"   Processing time: {status_data.get('processing_time', 0):.2f}s")
                        
                        if original_text:
                            print(f"\n📝 Original Malayalam Text (first 150 chars):")
                            print(f"   {original_text[:150]}...")
                        
                        if translated_text:
                            print(f"\n🔄 English Translation (first 200 chars):")
                            print(f"   {translated_text[:200]}...")
                        
                        if summary:
                            print(f"\n🤖 AI Summary ({summary_type}):")
                            print(f"   {summary}")
                        
                        if key_points:
                            print(f"\n🎯 Key Points ({len(key_points)} points):")
                            for i, point in enumerate(key_points[:3], 1):
                                print(f"   {i}. {point}")
                            if len(key_points) > 3:
                                print(f"   ... and {len(key_points)-3} more points")
                        
                        print(f"\n🌐 Frontend Access:")
                        print(f"   Main Website: http://localhost:3001")
                        print(f"   Navigate to '🤖 AI Summarizer' tab to see full results")
                        
                        return True
                        
                    elif status == 'error':
                        print(f"❌ Processing failed: {status_data.get('error', 'Unknown error')}")
                        return False
                        
            print("⏰ Processing timeout")
            return False
            
        else:
            print(f"❌ Upload failed: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚆 KMRL Malayalam OCR + AI Summarizer Test")
    print("Testing the complete workflow from document upload to AI summary")
    print()
    
    success = test_ai_summarizer()
    
    if success:
        print(f"\n{'🎉' * 15}")
        print("  AI SUMMARIZER TEST PASSED!")
        print("  🚆 KMRL system ready for production!")
        print(f"{'🎉' * 15}")
    else:
        print("\n❌ AI Summarizer test failed")
        print("Please check the servers and try again")