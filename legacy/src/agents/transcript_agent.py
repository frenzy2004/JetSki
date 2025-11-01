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
        # Fetch transcript using youtube-transcript-api (v1.2.3+)
        # Try multiple language codes to increase compatibility
        api = YouTubeTranscriptApi()

        # Try different English variants
        for lang_codes in [['en'], ['en-US'], ['en-GB'], ['en-CA']]:
            try:
                transcript_obj = api.fetch(video_id, languages=lang_codes)
                # Extract text from transcript snippets
                full_transcript = " ".join([snippet.text for snippet in transcript_obj.snippets])
                return full_transcript
            except:
                continue

        # If no English transcript found, try to list available transcripts
        api2 = YouTubeTranscriptApi()
        transcript_list = api2.list(video_id)
        available = [t.language_code for t in transcript_list]
        return f"Error: No English transcript found. Available languages: {', '.join(available)}"

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

