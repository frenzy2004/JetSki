"""Quick test to verify JetSki setup"""

print("Testing JetSki setup...\n")

# Test 1: Environment variables
print("1. Testing environment variables...")
from dotenv import load_dotenv
import os

load_dotenv()
openai_key = os.getenv("OPENAI_API_KEY")
google_key = os.getenv("GOOGLE_API_KEY")

if openai_key:
    print(f"   ✅ OPENAI_API_KEY found: {openai_key[:20]}...")
else:
    print("   ❌ OPENAI_API_KEY not found!")

if google_key:
    print(f"   ✅ GOOGLE_API_KEY found: {google_key[:20]}...")
else:
    print("   ❌ GOOGLE_API_KEY not found!")

# Test 2: Import agents
print("\n2. Testing agent imports...")
try:
    import sys
    sys.path.insert(0, 'src')
    from agents import get_transcript, find_viral_moments, generate_storyboard
    print("   ✅ All agents imported successfully!")
except Exception as e:
    print(f"   ❌ Error importing agents: {e}")

print("\n✨ Setup test complete!")
print("\nTo start the server:")
print("   python run.py")
print("\nOr manually:")
print("   uvicorn src.main:app --host 0.0.0.0 --port 8000")
