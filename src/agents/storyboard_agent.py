import os
import json
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from root directory
root_dir = Path(__file__).parent.parent.parent
load_dotenv(dotenv_path=root_dir / ".env")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_storyboard(segment_data: dict):
    """
    Creates a 6-panel comic storyboard from the selected viral segment.
    Returns structured JSON with panel descriptions ready for image generation.
    """
    segment_text = segment_data.get("transcript_excerpt", "")
    summary = segment_data.get("summary", "")
    hook = segment_data.get("hook", "")

    prompt = f"""
    You are a comic book writer. Create a compelling 6-panel comic storyboard that tells this story visually.

    VIRAL HOOK: {hook}
    SUMMARY: {summary}
    TRANSCRIPT EXCERPT: {segment_text}

    Return ONLY valid JSON in this exact format:
    {{
        "title": "{hook}",
        "style": "modern editorial comic, bold lines, vibrant colors",
        "panels": [
            {{
                "panel_number": 1,
                "scene_description": "Wide establishing shot of a grand Spanish palace in the 1500s, golden light streaming through windows",
                "character_details": "Spanish conquistador in armor, greedy expression, holding gold coins",
                "action": "Conquistador clutches gold while indigenous people work in background",
                "caption": "We suffer from a disease of the heart...",
                "visual_style": "dramatic lighting, warm color palette",
                "composition": "wide shot"
            }},
            {{
                "panel_number": 2,
                "scene_description": "Close-up of the conquistador's face, eyes gleaming with greed",
                "character_details": "Detailed facial expression showing obsession",
                "action": "Eyes reflecting gold coins",
                "caption": "...that can only be cured by gold.",
                "visual_style": "tight close-up, intense shadows",
                "composition": "close-up"
            }},
            {{
                "panel_number": 3,
                "scene_description": "...",
                "character_details": "...",
                "action": "...",
                "caption": "...",
                "visual_style": "...",
                "composition": "medium shot"
            }},
            {{
                "panel_number": 4,
                "scene_description": "...",
                "character_details": "...",
                "action": "...",
                "caption": "...",
                "visual_style": "...",
                "composition": "wide shot"
            }},
            {{
                "panel_number": 5,
                "scene_description": "...",
                "character_details": "...",
                "action": "...",
                "caption": "...",
                "visual_style": "...",
                "composition": "medium shot"
            }},
            {{
                "panel_number": 6,
                "scene_description": "Final impactful panel that delivers the punchline/conclusion",
                "character_details": "...",
                "action": "...",
                "caption": "...",
                "visual_style": "...",
                "composition": "dramatic wide shot"
            }}
        ],
        "narrative_arc": "Setup → Hook → Build → Climax → Impact → Resolution",
        "hashtags": ["#History", "#Gold", "#Colonialism", "#ViralQuotes"],
        "posting_tip": "Post during peak engagement hours (12pm-3pm EST)"
    }}

    IMPORTANT RULES:
    1. Each panel must flow naturally to the next
    2. Maintain consistent character appearance across all panels
    3. Build dramatic tension from panel 1 to 6
    4. Panel 6 should be the most impactful
    5. Captions should be SHORT (max 10 words each)
    6. Scene descriptions must be DETAILED for image generation
    7. Include character details for consistency (clothing, hair, facial features)
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )

    result = json.loads(response.choices[0].message.content)
    return result

