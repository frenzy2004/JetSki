import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
from typing import Optional, Dict, List, Any
from datetime import datetime

root_dir = Path(__file__).parent.parent
load_dotenv(root_dir / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise ValueError("Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env file")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)


def save_video(
    video_url: str,
    video_id: str,
    title: str = "",
    duration: Optional[int] = None,
    channel_name: Optional[str] = None,
    thumbnail_url: Optional[str] = None,
    transcript: Optional[str] = None
) -> str:
    data = {
        "video_id": video_id,
        "video_url": video_url,
        "title": title,
        "duration": duration,
        "channel_name": channel_name,
        "thumbnail_url": thumbnail_url,
        "transcript": transcript
    }

    result = supabase.table("videos").insert(data).execute()
    return result.data[0]["id"]


def save_viral_segments(video_id: str, segments: List[Dict], selected_rank: int) -> str:
    segments_data = []
    selected_segment_id = None

    for segment in segments:
        is_selected = segment["rank"] == selected_rank
        segment_data = {
            "video_id": video_id,
            "rank": segment["rank"],
            "score": segment["score"],
            "hook": segment["hook"],
            "summary": segment.get("summary", ""),
            "viral_type": segment.get("viral_type", ""),
            "start_time": segment.get("start_time", ""),
            "end_time": segment.get("end_time", ""),
            "excerpt": segment.get("excerpt", ""),
            "is_selected": is_selected
        }
        segments_data.append(segment_data)

    result = supabase.table("viral_segments").insert(segments_data).execute()

    for item in result.data:
        if item["is_selected"]:
            selected_segment_id = item["id"]
            break

    return selected_segment_id


def save_storyboard(
    video_id: str,
    segment_id: str,
    storyboard_data: Dict
) -> str:
    data = {
        "video_id": video_id,
        "segment_id": segment_id,
        "title": storyboard_data.get("title", ""),
        "style": storyboard_data.get("style", "manga-vintage"),
        "tone": storyboard_data.get("tone", ""),
        "panels": storyboard_data.get("panels", []),
        "hashtags": storyboard_data.get("hashtags", []),
        "posting_strategy": storyboard_data.get("posting_tip", "")
    }

    result = supabase.table("storyboards").insert(data).execute()
    return result.data[0]["id"]


def save_comic_panels(storyboard_id: str, panels_data: List[Dict]) -> List[str]:
    panels_to_insert = []

    for panel in panels_data:
        panel_data = {
            "storyboard_id": storyboard_id,
            "panel_number": panel.get("panel_number"),
            "image_url": panel.get("image_url"),
            "image_data": panel.get("image_data"),
            "caption": panel.get("caption", ""),
            "scene_description": panel.get("scene_description", ""),
            "generation_prompt": panel.get("generation_prompt", "")
        }
        panels_to_insert.append(panel_data)

    result = supabase.table("comic_panels").insert(panels_to_insert).execute()
    return [item["id"] for item in result.data]


def save_generated_comic(
    storyboard_id: str,
    google_doc_url: Optional[str] = None,
    drive_folder_url: Optional[str] = None,
    generation_time: float = 0.0,
    cost_estimate: float = 0.25,
    status: str = "success",
    error_message: Optional[str] = None
) -> str:
    data = {
        "storyboard_id": storyboard_id,
        "google_doc_url": google_doc_url,
        "drive_folder_url": drive_folder_url,
        "generation_time_seconds": generation_time,
        "cost_estimate": cost_estimate,
        "status": status,
        "error_message": error_message
    }

    result = supabase.table("generated_comics").insert(data).execute()
    return result.data[0]["id"]


def log_metric(
    video_id: Optional[str],
    step_name: str,
    duration: float,
    success: bool = True,
    error: Optional[str] = None
):
    data = {
        "video_id": video_id,
        "step_name": step_name,
        "duration_seconds": duration,
        "success": success,
        "error_message": error
    }

    supabase.table("processing_metrics").insert(data).execute()


def get_video_history(limit: int = 10) -> List[Dict]:
    result = supabase.table("videos") \
        .select("id, video_id, video_url, title, duration, created_at") \
        .order("created_at", desc=True) \
        .limit(limit) \
        .execute()

    return result.data


def get_video_by_id(video_id: str) -> Optional[Dict]:
    result = supabase.table("videos") \
        .select("*") \
        .eq("id", video_id) \
        .maybeSingle() \
        .execute()

    return result.data


def get_storyboard_with_panels(storyboard_id: str) -> Optional[Dict]:
    storyboard_result = supabase.table("storyboards") \
        .select("*") \
        .eq("id", storyboard_id) \
        .maybeSingle() \
        .execute()

    if not storyboard_result.data:
        return None

    panels_result = supabase.table("comic_panels") \
        .select("*") \
        .eq("storyboard_id", storyboard_id) \
        .order("panel_number") \
        .execute()

    storyboard = storyboard_result.data
    storyboard["comic_panels"] = panels_result.data

    return storyboard


def get_recent_comics(limit: int = 10) -> List[Dict]:
    result = supabase.table("generated_comics") \
        .select("""
            *,
            storyboards (
                title,
                style,
                videos (
                    title,
                    video_url
                )
            )
        """) \
        .order("created_at", desc=True) \
        .limit(limit) \
        .execute()

    return result.data
