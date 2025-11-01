"""
YouTube Video Metadata Extraction Agent
Fetches video title, duration, and other metadata
"""

import re
import requests
from typing import Dict, Optional

def extract_video_id(video_url: str) -> Optional[str]:
    """
    Extract video ID from various YouTube URL formats

    Examples:
        - https://www.youtube.com/watch?v=VIDEO_ID
        - https://youtu.be/VIDEO_ID
        - https://www.youtube.com/embed/VIDEO_ID
    """
    patterns = [
        r'(?:v=|/)([0-9A-Za-z_-]{11}).*',
        r'(?:embed/)([0-9A-Za-z_-]{11})',
        r'(?:watch\?v=)([0-9A-Za-z_-]{11})'
    ]

    for pattern in patterns:
        match = re.search(pattern, video_url)
        if match:
            return match.group(1)

    return None


def get_video_metadata(video_url: str) -> Dict:
    """
    Extract video metadata from YouTube URL
    Uses web scraping as fallback when API not available

    Returns:
        dict: {
            "video_id": str,
            "title": str,
            "duration": int (seconds),
            "thumbnail_url": str,
            "channel": str,
            "view_count": int (optional)
        }
    """
    video_id = extract_video_id(video_url)

    if not video_id:
        return {
            "error": "Invalid YouTube URL",
            "video_id": None,
            "title": "Unknown Video",
            "duration": None
        }

    try:
        # Method 1: Try to extract from YouTube page HTML (no API key needed)
        response = requests.get(f"https://www.youtube.com/watch?v={video_id}", timeout=10)

        if response.status_code == 200:
            html = response.text

            # Extract title from <title> tag
            title_match = re.search(r'<title>(.+?) - YouTube</title>', html)
            title = title_match.group(1) if title_match else f"Video {video_id}"

            # Extract duration from page metadata
            duration_match = re.search(r'"lengthSeconds":"(\d+)"', html)
            duration = int(duration_match.group(1)) if duration_match else None

            # Extract channel name
            channel_match = re.search(r'"author":"(.+?)"', html)
            channel = channel_match.group(1) if channel_match else "Unknown Channel"

            # Extract thumbnail
            thumbnail_url = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"

            return {
                "video_id": video_id,
                "title": title,
                "duration": duration,
                "duration_formatted": format_duration(duration) if duration else None,
                "thumbnail_url": thumbnail_url,
                "channel": channel,
                "video_url": video_url
            }

    except Exception as e:
        # Fallback: return basic info
        return {
            "video_id": video_id,
            "title": f"YouTube Video {video_id}",
            "duration": None,
            "thumbnail_url": f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
            "channel": "Unknown",
            "video_url": video_url,
            "error": str(e)
        }


def format_duration(seconds: int) -> str:
    """Convert seconds to HH:MM:SS or MM:SS format"""
    if not seconds:
        return "Unknown"

    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60

    if hours > 0:
        return f"{hours}:{minutes:02d}:{secs:02d}"
    else:
        return f"{minutes}:{secs:02d}"
