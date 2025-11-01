from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import os
import sys
import time
import io
from pathlib import Path

# Fix Windows encoding for emojis
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Add src directory to path
src_dir = Path(__file__).parent
sys.path.insert(0, str(src_dir))

# Import database module first (before agents to ensure it initializes)
import db

from agents.transcript_agent import get_transcript
from agents.highlight_agent import find_viral_moments
from agents.storyboard_agent import generate_storyboard
from agents.image_agent import generate_comic_panels, save_panel_image
from agents.doc_agent import DocAgent
from agents.metadata_agent import get_video_metadata

app = FastAPI(
    title="JetSki API",
    description="AI-powered YouTube video to comic converter",
    version="1.0.0"
)

# Request models
class VideoRequest(BaseModel):
    video_url: str
    generate_images: bool = True
    create_google_doc: bool = False

class FullPipelineResponse(BaseModel):
    video_url: str
    video_title: str = None
    viral_analysis: dict
    storyboard: dict
    images: Optional[dict] = None
    google_doc: Optional[dict] = None
    status: str
    metrics: Optional[dict] = None


@app.get("/")
def root():
    return {
        "message": "🚀 JetSki API is live",
        "version": "1.0.0",
        "endpoints": {
            "/jetski": "POST - Full automated pipeline (YouTube URL → Comic + Google Doc)",
            "/analyze": "POST - Get viral moment analysis only",
            "/storyboard": "POST - Generate storyboard from segment data",
            "/history": "GET - Get recent video processing history",
            "/metrics": "GET - Get performance metrics"
        }
    }


@app.get("/history")
def get_history(limit: int = 10):
    """Get recent video processing history"""
    try:
        history = db.get_video_history(limit=limit)
        return {
            "status": "success",
            "count": len(history),
            "videos": history
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/jetski", response_model=FullPipelineResponse)
def jetski_full_pipeline(request: VideoRequest):
    """
    🚀 FULL JETSKI PIPELINE - Automated end-to-end flow

    User pastes YouTube URL → AI does EVERYTHING automatically:
    1. Extract transcript
    2. Find top 3 viral moments
    3. Auto-select the BEST one
    4. Generate 6-panel storyboard
    5. Create comic images (NanoBanana/Gemini)
    6. Upload to Google Drive
    7. Create Google Doc summary with posting strategy

    No user decisions needed - AI picks the best viral moment automatically.
    """
    try:
        pipeline_start = time.time()
        print(f"\n{'='*60}")
        print(f"🚀 JETSKI PIPELINE STARTED")
        print(f"{'='*60}\n")

        # STEP 0: Extract Video Metadata
        print("🎬 STEP 0: Extracting video metadata...")
        step_start = time.time()
        metadata = get_video_metadata(request.video_url)
        video_id = metadata.get('video_id')
        video_title = metadata.get('title', 'Unknown Video')
        duration = metadata.get('duration')
        print(f"   ✅ Metadata extracted: {video_title}")
        print(f"   Duration: {metadata.get('duration_formatted', 'Unknown')}\n")
        db.log_metric(0, "metadata_extraction", time.time() - step_start)

        # STEP 1: Extract Transcript
        print("📝 STEP 1: Extracting YouTube transcript...")
        step_start = time.time()
        transcript = get_transcript(request.video_url)
        print(f"   ✅ Transcript extracted ({len(transcript)} characters)\n")

        # Save video to database
        video_pk = db.save_video(
            video_url=request.video_url,
            video_id=video_id,
            title=video_title,
            duration=duration,
            transcript=transcript
        )
        db.log_metric(video_pk, "transcript_extraction", time.time() - step_start)

        # STEP 2: Find Viral Moments (AI auto-selects best one)
        print("🔍 STEP 2: Analyzing viral moments...")
        step_start = time.time()
        viral_analysis = find_viral_moments(transcript)

        selected_rank = viral_analysis["selected"]["rank"]
        selected_segment = viral_analysis["segments"][selected_rank - 1]

        print(f"   ✅ Found {len(viral_analysis['segments'])} viral moments")
        print(f"   🎯 AI selected: {selected_segment['hook']} (Score: {selected_segment['score']}/100)\n")

        # Save viral segments to database
        segment_id = db.save_viral_segments(video_pk, viral_analysis["segments"], selected_rank)
        db.log_metric(video_pk, "viral_analysis", time.time() - step_start)

        # STEP 3: Generate Storyboard
        print("🎨 STEP 3: Generating 6-panel storyboard...")
        step_start = time.time()
        storyboard_data = generate_storyboard(selected_segment)
        print(f"   ✅ Storyboard created: {storyboard_data.get('title', 'Untitled')}\n")

        # Save storyboard to database
        storyboard_id = db.save_storyboard(video_pk, segment_id, storyboard_data)
        db.log_metric(video_pk, "storyboard_generation", time.time() - step_start)

        # STEP 4: Generate Images (if requested)
        image_result = None
        if request.generate_images:
            print("🖼️  STEP 4: Generating comic panel images (NanoBanana)...")
            step_start = time.time()
            try:
                image_result = generate_comic_panels(storyboard_data)
                print(f"   ✅ Generated {image_result.get('success_count', 0)}/6 panels\n")
                db.log_metric(video_pk, "image_generation", time.time() - step_start, success=True)
            except Exception as e:
                print(f"   ⚠️  Image generation failed: {str(e)}")
                print(f"   Continuing without images...\n")
                image_result = {"error": str(e), "success_count": 0}
                db.log_metric(video_pk, "image_generation", time.time() - step_start,
                            success=False, error=str(e))

        # STEP 5: Create Google Doc (if requested)
        doc_result = None
        google_doc_url = None
        drive_folder_url = None

        if request.create_google_doc:
            print("📄 STEP 5: Creating Google Doc summary...")
            step_start = time.time()
            try:
                doc_agent = DocAgent()
                doc_result = doc_agent.create_summary_doc(
                    video_url=request.video_url,
                    video_title=video_title,
                    viral_analysis=viral_analysis,
                    storyboard_data=storyboard_data,
                    image_data=image_result.get("generated_panels") if image_result else None
                )
                print(f"   ✅ Google Doc created\n")
                google_doc_url = doc_result.get("google_doc_url")
                drive_folder_url = doc_result.get("drive_folder_url")
                db.log_metric(video_pk, "doc_creation", time.time() - step_start, success=True)
            except Exception as e:
                print(f"   ⚠️  Doc creation failed: {str(e)}\n")
                doc_result = {"error": str(e), "status": "failed"}
                db.log_metric(video_pk, "doc_creation", time.time() - step_start,
                            success=False, error=str(e))

        # Save final generated comic to database
        total_time = time.time() - pipeline_start
        comic_id = db.save_generated_comic(
            storyboard_id=storyboard_id,
            images_data=image_result,
            google_doc_url=google_doc_url,
            drive_folder_url=drive_folder_url,
            generation_time=total_time,
            status="success"
        )

        print(f"{'='*60}")
        print(f"✨ JETSKI PIPELINE COMPLETE")
        print(f"   Total time: {total_time:.2f}s")
        print(f"   Comic ID: {comic_id}")
        print(f"{'='*60}\n")

        return {
            "video_url": request.video_url,
            "video_title": video_title,
            "viral_analysis": viral_analysis,
            "storyboard": storyboard_data,
            "images": image_result,
            "google_doc": doc_result,
            "status": "success",
            "metrics": {
                "total_time_seconds": total_time,
                "comic_id": comic_id,
                "video_id": video_pk
            }
        }

    except Exception as e:
        print(f"\n❌ Pipeline failed: {str(e)}\n")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze")
def analyze_video(video_url: str):
    """
    Analyze video and get top 3 viral moments (AI auto-selects best one).
    Returns structured JSON.
    """
    try:
        transcript = get_transcript(video_url)
        viral_analysis = find_viral_moments(transcript)
        return {
            "status": "success",
            "viral_analysis": viral_analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/storyboard")
def create_storyboard(segment_data: dict):
    """
    Generate 6-panel storyboard from viral segment data.
    Returns structured JSON ready for image generation.
    """
    try:
        storyboard = generate_storyboard(segment_data)
        return {
            "status": "success",
            "storyboard": storyboard
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

