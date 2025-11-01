"""
JetSki - Example Usage

Quick example showing how to use JetSki API to convert YouTube videos to comics.
"""

import requests
import json
import base64
from pathlib import Path


# Configuration
API_BASE = "http://localhost:8000"
OUTPUT_DIR = Path("data/output")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def full_pipeline_example():
    """
    Complete example: YouTube URL → Viral analysis → Storyboard → Images → Google Doc
    """
    print("🚀 JetSki Full Pipeline Example\n")

    # Example YouTube video (replace with your own)
    video_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

    print(f"📺 Processing: {video_url}\n")

    # Call JetSki API
    response = requests.post(
        f"{API_BASE}/jetski",
        json={
            "video_url": video_url,
            "generate_images": True,  # Set to False if no Google API key
            "create_google_doc": False  # Set to True if you have Google credentials
        }
    )

    if response.status_code != 200:
        print(f"❌ Error: {response.json()}")
        return

    result = response.json()

    # 1. Show viral analysis
    print("=" * 60)
    print("📊 VIRAL MOMENT ANALYSIS")
    print("=" * 60)

    viral_analysis = result["viral_analysis"]
    selected_rank = viral_analysis["selected"]["rank"]
    selected = viral_analysis["segments"][selected_rank - 1]

    print(f"\n🎯 AI Selected (Rank {selected_rank}):")
    print(f"   Hook: {selected['hook']}")
    print(f"   Score: {selected['score']}/100")
    print(f"   Type: {selected['viral_type']}")
    print(f"   Time: {selected['start_time']} - {selected['end_time']}")
    print(f"\n   Summary: {selected['summary']}\n")

    print("All options analyzed:")
    for segment in viral_analysis["segments"]:
        emoji = "🥇" if segment['rank'] == 1 else "🥈" if segment['rank'] == 2 else "🥉"
        print(f"   {emoji} Option {segment['rank']}: {segment['hook']} ({segment['score']}/100)")

    # 2. Show storyboard
    print("\n" + "=" * 60)
    print("🎨 STORYBOARD")
    print("=" * 60)

    storyboard = result["storyboard"]
    print(f"\nTitle: {storyboard['title']}")
    print(f"Style: {storyboard['style']}")
    print(f"Hashtags: {' '.join(storyboard['hashtags'])}\n")

    for panel in storyboard["panels"]:
        print(f"Panel {panel['panel_number']}:")
        print(f"  Scene: {panel['scene_description'][:80]}...")
        print(f"  Caption: \"{panel['caption']}\"")
        print()

    # 3. Save images
    if "images" in result and result["images"]:
        print("=" * 60)
        print("🖼️  SAVING IMAGES")
        print("=" * 60)

        images = result["images"]
        print(f"\nGenerated {images['success_count']}/{images['total_panels']} panels\n")

        comic_dir = OUTPUT_DIR / "comic_panels"
        comic_dir.mkdir(exist_ok=True)

        for panel in images.get("generated_panels", []):
            if "image_base64" not in panel:
                print(f"  ⚠️  Panel {panel.get('panel_number')} - No image data")
                continue

            panel_num = panel["panel_number"]
            image_data = base64.b64decode(panel["image_base64"])

            output_path = comic_dir / f"panel_{panel_num}.png"
            output_path.write_bytes(image_data)

            print(f"  ✅ Saved: {output_path}")

        print(f"\n📁 All panels saved to: {comic_dir}")

    # 4. Google Doc info
    if "google_doc" in result and result["google_doc"]:
        print("\n" + "=" * 60)
        print("📄 GOOGLE DOC")
        print("=" * 60)

        doc = result["google_doc"]
        if doc.get("doc_url"):
            print(f"\n✅ Doc created: {doc['doc_url']}")
            if doc.get("drive_folder_url"):
                print(f"📁 Images uploaded: {doc['drive_folder_url']}")
        else:
            print("\n⚠️  Preview mode (no Google credentials)")
            # Optionally save preview
            preview_path = OUTPUT_DIR / "doc_preview.txt"
            preview_path.write_text(doc.get("preview", ""))
            print(f"💾 Preview saved to: {preview_path}")

    # 5. Save full result as JSON
    output_json = OUTPUT_DIR / "full_result.json"
    with open(output_json, "w") as f:
        json.dump(result, f, indent=2)

    print("\n" + "=" * 60)
    print("✨ DONE!")
    print("=" * 60)
    print(f"\n📄 Full result saved to: {output_json}")
    print("\n🎉 Your comic is ready for social media!\n")


def analyze_only_example():
    """
    Quick example: Just get viral moment analysis without images
    """
    print("🔍 Analyze Video Example\n")

    response = requests.post(
        f"{API_BASE}/analyze",
        params={"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
    )

    if response.status_code != 200:
        print(f"❌ Error: {response.json()}")
        return

    result = response.json()
    viral_analysis = result["viral_analysis"]

    print("Top 3 Viral Moments:\n")
    for segment in viral_analysis["segments"]:
        print(f"{segment['rank']}. {segment['hook']} ({segment['score']}/100)")
        print(f"   {segment['summary']}\n")


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🎨 JETSKI - YouTube to Comic Converter")
    print("=" * 60)
    print("\nMake sure the server is running: python run.py\n")

    choice = input("Choose example:\n1. Full pipeline (recommended)\n2. Analysis only\n\nEnter (1 or 2): ").strip()

    if choice == "1":
        full_pipeline_example()
    elif choice == "2":
        analyze_only_example()
    else:
        print("Invalid choice. Running full pipeline...")
        full_pipeline_example()
