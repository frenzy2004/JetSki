from youtube_transcript_api import YouTubeTranscriptApi
import re

def get_transcript(video_url: str) -> str:
    """
    Extract transcript from YouTube video
    
    Args:
        video_url: YouTube video URL
        
    Returns:
        str: Full transcript text
    """
    # Extract video ID from URL
    video_id = extract_video_id(video_url)
    
    if not video_id:
        return "Error: Invalid YouTube URL"
    
    try:
        # Fetch transcript using youtube-transcript-api
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        
        # Combine all transcript segments into one string
        full_transcript = " ".join([item['text'] for item in transcript_list])
        
        return full_transcript
    
    except Exception as e:
        return f"Error fetching transcript: {str(e)}"

def extract_video_id(video_url: str) -> str:
    """
    Extract video ID from various YouTube URL formats
    
    Examples:
        - https://www.youtube.com/watch?v=VIDEO_ID
        - https://youtu.be/VIDEO_ID
        - https://www.youtube.com/embed/VIDEO_ID
    """
    patterns = [
        r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
        r'(?:embed\/)([0-9A-Za-z_-]{11})',
        r'(?:watch\?v=)([0-9A-Za-z_-]{11})'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, video_url)
        if match:
            return match.group(1)
    
    return None

