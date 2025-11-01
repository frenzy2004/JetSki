"""
JetSki API Server Runner

Usage:
    python run.py

Then visit: http://localhost:8000
API Docs: http://localhost:8000/docs
"""

import uvicorn

if __name__ == "__main__":
    print("🚤 Starting JetSki API Server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📚 API Documentation at: http://localhost:8000/docs")
    print("\nPress CTRL+C to stop the server\n")
    
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload on code changes
        log_level="info"
    )

