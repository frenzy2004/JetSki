import os
import json
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from root directory
root_dir = Path(__file__).parent.parent.parent
load_dotenv(dotenv_path=root_dir / ".env")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def find_viral_moments(transcript: str):
    """
    Analyzes transcript and identifies 3 potential viral segments.
    Returns the TOP viral moment auto-selected for comic generation.
    """
    prompt = f"""
    You are a viral content strategist. Analyze the transcript and identify the TOP 3 potential viral segments.

    Return ONLY valid JSON in this exact format:
    {{
        "segments": [
            {{
                "rank": 1,
                "score": 95,
                "start_time": "8:45",
                "end_time": "11:15",
                "viral_type": "emotional quote",
                "hook": "The disease of the heart line",
                "summary": "Historical quote about greed and colonialism that sparks deep conversation",
                "transcript_excerpt": "We suffer from a disease of the heart that can only be cured by gold..."
            }},
            {{
                "rank": 2,
                "score": 82,
                "start_time": "21:15",
                "end_time": "23:45",
                "viral_type": "economics insight",
                "hook": "Gold standard explained simply",
                "summary": "Breakdown of how gold connects to economics and crypto",
                "transcript_excerpt": "..."
            }},
            {{
                "rank": 3,
                "score": 75,
                "start_time": "45:30",
                "end_time": "47:00",
                "viral_type": "humor",
                "hook": "Crypto bro meets historian",
                "summary": "Funny exchange about modern vs historical perspectives",
                "transcript_excerpt": "..."
            }}
        ],
        "selected": {{
            "rank": 1,
            "reason": "Highest viral potential - combines emotion, history, and quotable moment"
        }}
    }}

    Score from 0-100 based on:
    - Emotional impact (quotable lines, dramatic moments)
    - Novelty (unique insights, surprising facts)
    - Visual potential (easy to illustrate in comic form)
    - Shareability (would people post this?)

    Transcript:
    {transcript}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )

    result = json.loads(response.choices[0].message.content)
    return result

