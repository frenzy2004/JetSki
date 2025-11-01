"""Debug script to test transcript extraction"""

import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from dotenv import load_dotenv
load_dotenv()

# Test transcript extraction
print("Testing YouTube transcript extraction...\n")

video_url = "https://www.youtube.com/watch?v=PssKpzB0Ah0"
print(f"Video URL: {video_url}\n")

sys.path.insert(0, 'src')
from agents import get_transcript

try:
    transcript = get_transcript(video_url)
    print(f"✅ Transcript extracted successfully!")
    print(f"Length: {len(transcript)} characters")
    print(f"\nFirst 500 characters:")
    print("=" * 60)
    print(transcript[:500])
    print("=" * 60)
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
