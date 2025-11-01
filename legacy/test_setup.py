"""Test JetSki setup - no emojis version"""

import sys
import io

# Fix Windows encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("Testing JetSki setup...\n")

# Test 1: Environment variables
print("1. Testing environment variables...")
from dotenv import load_dotenv
import os

load_dotenv()
openai_key = os.getenv("OPENAI_API_KEY")
google_key = os.getenv("GOOGLE_API_KEY")

if openai_key:
    print(f"   [OK] OPENAI_API_KEY found: {openai_key[:20]}...")
else:
    print("   [FAIL] OPENAI_API_KEY not found!")

if google_key:
    print(f"   [OK] GOOGLE_API_KEY found: {google_key[:20]}...")
else:
    print("   [FAIL] GOOGLE_API_KEY not found!")

# Test 2: Import agents
print("\n2. Testing agent imports...")
try:
    sys.path.insert(0, 'src')
    from agents import get_transcript, find_viral_moments, generate_storyboard
    print("   [OK] All agents imported successfully!")
except Exception as e:
    print(f"   [FAIL] Error importing agents: {e}")
    import traceback
    traceback.print_exc()

print("\n[DONE] Setup test complete!")
print("\nJetSki is ready! Start the server with:")
print("   python run.py")
