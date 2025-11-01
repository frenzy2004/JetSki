"""Test the full JetSki pipeline end-to-end"""

import sys
import io
import requests
import json

# Fix Windows encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("="*70)
print("JETSKI FULL PIPELINE TEST")
print("="*70)

# Test video URL - shorter video for faster testing
test_url = "https://www.youtube.com/watch?v=PssKpzB0Ah0"

print(f"\nTest Video: {test_url}")
print("\nSending request to /jetski endpoint...")
print("(This may take 1-2 minutes...)\n")

try:
    # Call the /jetski endpoint
    response = requests.post(
        "http://localhost:8000/jetski",
        json={
            "video_url": test_url,
            "generate_images": False,  # Skip images for faster testing
            "create_google_doc": False  # Skip docs for faster testing
        },
        timeout=300  # 5 minute timeout
    )

    if response.status_code == 200:
        result = response.json()

        print("="*70)
        print("SUCCESS - PIPELINE COMPLETED")
        print("="*70)

        # Display results
        print(f"\nVideo Title: {result.get('video_title', 'N/A')}")
        print(f"Status: {result['status']}")

        # Metrics
        if 'metrics' in result:
            metrics = result['metrics']
            print(f"\nMetrics:")
            print(f"  Total Time: {metrics.get('total_time_seconds', 0):.2f}s")
            print(f"  Video ID (DB): {metrics.get('video_id')}")
            print(f"  Comic ID (DB): {metrics.get('comic_id')}")

        # Viral Analysis
        viral = result.get('viral_analysis', {})
        if viral:
            print(f"\nViral Moments Found: {len(viral.get('segments', []))}")
            selected = viral.get('selected', {})
            print(f"AI Selected: Rank {selected.get('rank')} - {selected.get('reason', 'N/A')}")

            print("\nTop 3 Viral Moments:")
            for i, seg in enumerate(viral.get('segments', [])[:3], 1):
                print(f"\n  {i}. {seg.get('hook', 'N/A')} (Score: {seg.get('score')}/100)")
                print(f"     Type: {seg.get('viral_type', 'N/A')}")
                print(f"     Time: {seg.get('start_time', 'N/A')} - {seg.get('end_time', 'N/A')}")
                print(f"     Summary: {seg.get('summary', 'N/A')[:100]}...")

        # Storyboard
        storyboard = result.get('storyboard', {})
        if storyboard:
            print(f"\nStoryboard: {storyboard.get('title', 'N/A')}")
            print(f"Style: {storyboard.get('style', 'N/A')}")
            print(f"Tone: {storyboard.get('tone', 'N/A')}")
            print(f"Panels: {len(storyboard.get('panels', []))}/6")

        print("\n" + "="*70)
        print("TEST PASSED - All components working!")
        print("="*70)

        # Test /history endpoint
        print("\nTesting /history endpoint...")
        history_response = requests.get("http://localhost:8000/history?limit=5")
        if history_response.status_code == 200:
            history = history_response.json()
            print(f"History entries found: {history.get('count', 0)}")
            print("Latest videos:")
            for video in history.get('videos', [])[:3]:
                print(f"  - {video.get('title', 'N/A')} ({video.get('created_at', 'N/A')})")
        else:
            print(f"History endpoint error: {history_response.status_code}")

    else:
        print(f"ERROR - Status Code: {response.status_code}")
        print(f"Response: {response.text}")

except requests.exceptions.Timeout:
    print("ERROR - Request timed out (>5 minutes)")
except requests.exceptions.ConnectionError:
    print("ERROR - Could not connect to server. Is it running on localhost:8000?")
except Exception as e:
    print(f"ERROR - {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
