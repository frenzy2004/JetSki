# JetSki Quick Start Guide

Get your YouTube-to-Comic pipeline running in 5 minutes.

## Prerequisites

- Python 3.8+
- Node.js 18+ (for frontend)
- Supabase account (free tier works)
- OpenAI API key
- Google Gemini API key

## Step 1: Clone and Install

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Step 2: Set Up Supabase Database

The database schema has already been created! Your Supabase instance has 6 tables:
- `videos` - Stores YouTube video metadata and transcripts
- `viral_segments` - Detected viral moments with scores
- `storyboards` - 6-panel comic storyboard data
- `comic_panels` - Individual generated panel images
- `generated_comics` - Complete comic generation results
- `processing_metrics` - Performance tracking

All tables have Row Level Security (RLS) enabled.

## Step 3: Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your credentials in `.env`:

```bash
# Supabase (REQUIRED)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Frontend (same as above)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI (REQUIRED)
OPENAI_API_KEY=sk-your-key-here

# Google Gemini (REQUIRED for image generation)
GOOGLE_API_KEY=your-gemini-key-here

# Google Service Account (OPTIONAL for Drive/Docs)
GOOGLE_SERVICE_ACCOUNT_PATH=

# Comic Style
COMIC_STYLE=manga-vintage
```

### Where to Get API Keys:

1. **Supabase**:
   - Go to https://app.supabase.com/
   - Create a new project (or use existing)
   - Go to Settings → API
   - Copy your Project URL and anon/public key

2. **OpenAI**:
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Cost: ~$0.01 per comic

3. **Google Gemini**:
   - Go to https://aistudio.google.com/apikey
   - Create API key
   - Cost: ~$0.24 per comic (6 panels)

4. **Google Service Account** (Optional):
   - Go to https://console.cloud.google.com/
   - Create project
   - Enable Google Docs API and Google Drive API
   - Create Service Account
   - Download JSON credentials

## Step 4: Run the Backend

```bash
python run.py
```

Server will start at http://localhost:8000

API docs available at http://localhost:8000/docs

## Step 5: Run the Frontend (Optional)

In a separate terminal:

```bash
cd frontend
npm run dev
```

Frontend will start at http://localhost:3000

## Step 6: Test with a YouTube Video

### Option A: Using the Frontend

1. Open http://localhost:3000
2. Paste a YouTube URL (e.g., Joe Rogan, Huberman Lab)
3. Click "Generate Comic Strip"
4. Wait 1-2 minutes for processing
5. View your viral comic!

### Option B: Using the API

```bash
curl -X POST http://localhost:8000/jetski \
  -H "Content-Type: application/json" \
  -d '{
    "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "generate_images": true,
    "create_google_doc": false
  }'
```

Or use Python:

```python
import requests

response = requests.post("http://localhost:8000/jetski", json={
    "video_url": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
    "generate_images": True,
    "create_google_doc": False
})

result = response.json()
print(f"Title: {result['video_title']}")
print(f"Selected moment: {result['viral_analysis']['selected']}")
print(f"Comic panels: {len(result['storyboard']['panels'])}")
```

## What Happens Next?

The pipeline will:

1. Extract the video transcript (5-10 seconds)
2. Analyze for viral moments (10-15 seconds)
3. Auto-select the best moment (AI decides)
4. Generate 6-panel storyboard (10-15 seconds)
5. Create manga/vintage comic images (30-60 seconds)
6. Save everything to Supabase
7. (Optional) Create Google Doc summary

**Total time**: 1-2 minutes for a 30-minute video

**Total cost**: ~$0.25 per comic

## API Endpoints

- `POST /jetski` - Full pipeline (URL → Comic)
- `POST /analyze` - Viral moment analysis only
- `POST /storyboard` - Generate storyboard
- `GET /history` - Recent videos processed
- `GET /comics` - Recent generated comics
- `GET /storyboard/{id}` - Get storyboard by ID

## Viewing Your Data

All processed videos and comics are stored in Supabase:

1. Go to https://app.supabase.com/
2. Select your project
3. Click "Table Editor"
4. Browse:
   - `videos` - All processed videos
   - `viral_segments` - Detected viral moments
   - `storyboards` - Generated storyboards
   - `comic_panels` - Individual panel images
   - `generated_comics` - Complete results

## Troubleshooting

### "Missing Supabase credentials"
- Check that `.env` has `SUPABASE_URL` and `SUPABASE_ANON_KEY` filled in
- Make sure there are no spaces around the `=` sign

### "No transcript available"
- Video may not have English captions
- Try a different video with auto-generated or manual captions
- Check the video is publicly accessible

### "Image generation failed"
- Verify `GOOGLE_API_KEY` is correct
- Check you have Gemini API access enabled
- Try setting `generate_images: false` to test without images

### "Database error"
- Verify Supabase credentials are correct
- Check that your Supabase project is active
- Ensure RLS policies allow public inserts (for testing)

## Next Steps

- Add your own Google Service Account for Drive/Docs integration
- Test with different YouTube videos (podcasts, interviews, documentaries)
- Customize the manga/vintage comic style in `COMIC_STYLE` env var
- Build custom workflows with the API endpoints

## Need Help?

Check the full documentation:
- [README.md](README.md) - Complete overview
- [SETUP.md](SETUP.md) - Detailed setup guide
- [docs/PRD.md](docs/PRD.md) - Product requirements and experiment log

---

**JetSki** - Turn hours of video into seconds of viral content 🚀
