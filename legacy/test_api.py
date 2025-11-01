"""
Quick API test script for JetSki

Usage:
    1. Start the server: python run.py
    2. In another terminal: python test_api.py
"""

import requests

BASE_URL = "http://localhost:8000"

def test_health():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    response = requests.get(f"{BASE_URL}/")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
    print()

def test_analyze():
    """Test the analyze endpoint"""
    print("🔍 Testing /analyze endpoint...")
    
    # Example YouTube video (replace with actual video)
    test_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    
    response = requests.post(
        f"{BASE_URL}/analyze",
        params={"video_url": test_url}
    )
    
    print(f"   Status: {response.status_code}")
    print(f"   Response preview: {response.text[:200]}...")
    print()

def test_storyboard():
    """Test the storyboard endpoint"""
    print("🔍 Testing /storyboard endpoint...")
    
    test_segment = "In this moment, he realizes the power of compound interest. It's not about getting rich quick, it's about consistency over decades."
    
    response = requests.post(
        f"{BASE_URL}/storyboard",
        params={"segment_text": test_segment}
    )
    
    print(f"   Status: {response.status_code}")
    print(f"   Response preview: {response.text[:200]}...")
    print()

if __name__ == "__main__":
    print("🚤 JetSki API Test Suite\n")
    print("=" * 50)
    
    try:
        test_health()
        test_analyze()
        test_storyboard()
        
        print("=" * 50)
        print("✅ All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to server")
        print("   Make sure the server is running: python run.py")
    except Exception as e:
        print(f"❌ Error: {e}")

