import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_storyboard(segment_text: str):
    prompt = f"""
    Create a six-panel comic storyboard from this segment. 
    For each panel include:
    - Panel number
    - Scene description (visual)
    - Caption text (1 short sentence)
    Segment:
    {segment_text}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

