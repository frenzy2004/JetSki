from fastapi import FastAPI
from agents.transcript_agent import get_transcript
from agents.highlight_agent import find_viral_moments
from agents.storyboard_agent import generate_storyboard

app = FastAPI()

@app.get("/")
def root():
    return {"message": "🚀 JetSki API is live"}

@app.post("/analyze")
def analyze_video(video_url: str):
    transcript = get_transcript(video_url)
    viral_segments = find_viral_moments(transcript)
    return {"viral_segments": viral_segments}

@app.post("/storyboard")
def create_storyboard(segment_text: str):
    storyboard = generate_storyboard(segment_text)
    return {"storyboard": storyboard}

