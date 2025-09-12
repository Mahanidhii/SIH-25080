#!/usr/bin/env python3
"""
Test script to upload Malayalam document to KMRL system
"""

import requests
import json
import time

def test_upload_malayalam():
    """Test uploading the Malayalam test document"""
    
    # API endpoint
    upload_url = "http://127.0.0.1:8000/api/upload"
    
    # Test file
    test_file = r"D:\New_SIH\test_malayalam.txt"
    
    print("🚀 Testing KMRL Malayalam OCR System...")
    print(f"📁 Uploading: {test_file}")
    
    try:
        # Upload the file
        with open(test_file, 'rb') as f:
            files = {'file': f}
            response = requests.post(upload_url, files=files)
        
        if response.status_code == 200:
            result = response.json()
            task_id = result.get('id')
            filename = result.get('filename')
            
            print(f"✅ Upload successful!")
            print(f"📋 Task ID: {task_id}")
            print(f"📄 Filename: {filename}")
            print(f"💬 Message: {result.get('message')}")
            
            # Monitor processing status
            status_url = f"http://127.0.0.1:8000/api/status/{task_id}"
            
            print("\n🔄 Monitoring processing status...")
            
            for i in range(30):  # Check for up to 30 seconds
                time.sleep(2)
                
                try:
                    status_response = requests.get(status_url)
                    if status_response.status_code == 200:
                        status_data = status_response.json()
                        
                        status = status_data.get('status')
                        progress = status_data.get('progress', 0)
                        message = status_data.get('message', '')
                        
                        print(f"📊 Status: {status} ({progress}%) - {message}")
                        
                        if status == 'completed':
                            print("\n🎉 Processing completed successfully!")
                            
                            # Display results
                            original_text = status_data.get('original_text', '')
                            translated_text = status_data.get('translated_text', '')
                            language = status_data.get('language', '')
                            confidence = status_data.get('confidence', 0)
                            processing_time = status_data.get('processing_time', 0)
                            
                            print(f"\n📝 Results Summary:")
                            print(f"   Language detected: {language}")
                            print(f"   Confidence: {confidence:.2%}")
                            print(f"   Processing time: {processing_time:.2f}s")
                            
                            if original_text:
                                print(f"\n🔤 Original Malayalam Text:")
                                print(f"   {original_text[:200]}...")
                            
                            if translated_text:
                                print(f"\n🔄 English Translation:")
                                print(f"   {translated_text[:200]}...")
                            
                            return True
                            
                        elif status == 'error':
                            error_msg = status_data.get('error', 'Unknown error')
                            print(f"\n❌ Processing failed: {error_msg}")
                            return False
                            
                except requests.RequestException as e:
                    print(f"⚠️ Status check error: {e}")
                    
            print("\n⏰ Processing timeout - check manually")
            return False
            
        else:
            print(f"❌ Upload failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error during upload: {e}")
        return False

if __name__ == "__main__":
    success = test_upload_malayalam()
    
    if success:
        print("\n✅ Test completed successfully!")
        print("🌟 KMRL Malayalam OCR system is working perfectly!")
    else:
        print("\n❌ Test failed. Please check the system logs.")