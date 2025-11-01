import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def find_viral_moments(transcript: str):
    prompt = f"""
    You are a viral content strategist. Analyze the transcript and identify
    3 potential viral segments. For each include:
    - Timestamp (approximate)
    - Why it's viral (emotion, novelty, quote, humor)
    - Short summary
    Transcript:
    {transcript[:4000]}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

