# JetSki Setup Guide

## What You Built

**JetSki** is an AI-powered tool that transforms long-form YouTube videos into viral 6-panel comics automatically. Just paste a YouTube link, and AI does everything:

1. Extracts transcript from YouTube video
2. Analyzes and finds top 3 viral moments
3. Auto-selects the BEST viral moment (no user input needed)
4. Generates a 6-panel comic storyboard
5. Creates comic panel images using Google Gemini 2.5 (NanoBanana)
6. Uploads images to Google Drive
7. Creates a Google Doc with full analysis and social media strategy

---

## Architecture

```
YouTube URL Input
       ↓
[Transcript Agent] → Extracts video transcript
       ↓
[Highlight Agent] → Finds 3 viral moments + auto-selects best
       ↓
[Storyboard Agent] → Creates 6-panel comic breakdown
       ↓
[Image Agent] → Generates comic panels (NanoBanana)
       ↓
[Doc Agent] → Creates Google Doc + uploads to Drive
       ↓
Comic Ready for Social Media 🎉
```

---

## Prerequisites

You need:
1. Python 3.8+
2. OpenAI API key (for viral analysis)
3. Google API key (for NanoBanana image generation)
4. Google Service Account credentials (optional - for Google Docs/Drive)

---

## Installation

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Required
OPENAI_API_KEY=sk-your-openai-api-key-here
GOOGLE_API_KEY=your-google-gemini-api-key-here

# Optional (for Google Docs/Drive integration)
GOOGLE_SERVICE_ACCOUNT_PATH=/path/to/service-account.json
```

### 3. Get Your API Keys

#### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add to `.env` as `OPENAI_API_KEY`

#### Google Gemini API Key (NanoBanana)
1. Go to https://aistudio.google.com/apikey
2. Create a new API key
3. Add to `.env` as `GOOGLE_API_KEY`

**Cost:** ~$0.039 per image (6 panels = ~$0.24 per comic)

#### Google Service Account (Optional - for Docs/Drive)
1. Go to https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Enable Google Docs API and Google Drive API
4. Create a Service Account
5. Download JSON credentials
6. Add path to `.env` as `GOOGLE_SERVICE_ACCOUNT_PATH`

---

## Running JetSki

### Start the API Server

```bash
python run.py
```

Server runs at: http://localhost:8000

### API Documentation

Interactive docs: http://localhost:8000/docs

---

## API Endpoints

### 🚀 `/jetski` - Full Pipeline (Recommended)

**POST** `/jetski`

The main endpoint - does EVERYTHING automatically.

**Request:**
```json
{
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "generate_images": true,
  "create_google_doc": false
}
```

**Response:**
```json
{
  "video_url": "https://youtube.com/watch?v=...",
  "viral_analysis": {
    "segments": [
      {
        "rank": 1,
        "score": 95,
        "start_time": "8:45",
        "end_time": "11:15",
        "viral_type": "emotional quote",
        "hook": "The disease of the heart",
        "summary": "Historical quote about greed...",
        "transcript_excerpt": "We suffer from..."
      }
    ],
    "selected": {
      "rank": 1,
      "reason": "Highest viral potential..."
    }
  },
  "storyboard": {
    "title": "The disease of the heart",
    "style": "modern editorial comic...",
    "panels": [
      {
        "panel_number": 1,
        "scene_description": "...",
        "character_details": "...",
        "action": "...",
        "caption": "We suffer from a disease...",
        "visual_style": "...",
        "composition": "wide shot"
      }
    ],
    "hashtags": ["#History", "#Gold"],
    "posting_tip": "Post during peak hours..."
  },
  "images": {
    "title": "The disease of the heart",
    "total_panels": 6,
    "success_count": 6,
    "generated_panels": [
      {
        "panel_number": 1,
        "caption": "...",
        "image_base64": "iVBORw0KGgoAAAANS...",
        "mime_type": "image/png"
      }
    ]
  },
  "google_doc": {
    "doc_url": "https://docs.google.com/document/d/...",
    "drive_folder_url": "https://drive.google.com/drive/folders/...",
    "status": "success"
  },
  "status": "success"
}
```

### 📊 `/analyze` - Viral Analysis Only

**POST** `/analyze`

Get top 3 viral moments without generating storyboard or images.

**Request:**
```json
{
  "video_url": "https://youtube.com/watch?v=..."
}
```

### 🎨 `/storyboard` - Generate Storyboard

**POST** `/storyboard`

Generate 6-panel storyboard from segment data.

**Request:**
```json
{
  "segment_data": {
    "hook": "Amazing quote",
    "summary": "...",
    "transcript_excerpt": "..."
  }
}
```

---

## Example Usage

### Python

```python
import requests

# Full pipeline - paste YouTube URL, get comic
response = requests.post("http://localhost:8000/jetski", json={
    "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "generate_images": True,
    "create_google_doc": True
})

result = response.json()

# Access results
viral_moment = result["viral_analysis"]["segments"][0]
print(f"Selected: {viral_moment['hook']}")
print(f"Score: {viral_moment['score']}/100")

# Save comic panels
for panel in result["images"]["generated_panels"]:
    panel_num = panel["panel_number"]
    image_data = panel["image_base64"]
    # Decode and save...

print(f"Google Doc: {result['google_doc']['doc_url']}")
```

### cURL

```bash
curl -X POST "http://localhost:8000/jetski" \
  -H "Content-Type: application/json" \
  -d '{
    "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "generate_images": true,
    "create_google_doc": false
  }'
```

---

## Configuration

### Disable Image Generation

If you don't have a Google API key yet, you can still use JetSki without images:

```json
{
  "video_url": "...",
  "generate_images": false,
  "create_google_doc": false
}
```

This will give you the viral analysis and storyboard text only.

### Google Docs Preview Mode

If you don't have Google credentials configured, DocAgent runs in "preview mode" and returns the document content as text instead of creating a real Google Doc.

---

## Agents Breakdown

### 1. **Transcript Agent** (`transcript_agent.py`)
- Extracts YouTube transcripts
- Handles multiple URL formats
- Returns full transcript text

### 2. **Highlight Agent** (`highlight_agent.py`)
- Uses GPT-4o-mini to analyze transcript
- Finds top 3 viral moments
- Auto-selects the best one (no user choice)
- Returns structured JSON with scores

### 3. **Storyboard Agent** (`storyboard_agent.py`)
- Uses GPT-4o-mini to create 6-panel breakdown
- Generates detailed scene descriptions
- Maintains character consistency
- Returns structured JSON ready for image generation

### 4. **Image Agent** (`image_agent.py`)
- Uses Google Gemini 2.5 Flash Image (NanoBanana)
- Generates 6 comic panel images
- Maintains visual consistency across panels
- Returns base64-encoded images

### 5. **Doc Agent** (`doc_agent.py`)
- Creates comprehensive Google Doc summary
- Includes all 3 viral moments analyzed
- Provides social media posting strategy
- Uploads comic panels to Google Drive
- Returns doc URL and folder URL

---

## How It Works

### The Flow (User Perspective)

1. **User pastes YouTube link**
   - Example: 30-minute podcast episode
   - User hasn't watched it yet

2. **AI analyzes entire video**
   - Finds 3 potential viral moments
   - Scores each moment (0-100)
   - Auto-selects the BEST one

3. **AI creates comic storyboard**
   - 6 panels that tell the story
   - Detailed visual descriptions
   - Character consistency

4. **AI generates images**
   - NanoBanana creates comic panels
   - Consistent art style
   - Ready for social media

5. **AI creates summary doc**
   - Full breakdown of all moments
   - Social media captions
   - Hashtag recommendations
   - Posting strategy

6. **User gets:**
   - 6 comic panel images
   - Google Doc with analysis
   - Instagram carousel ready
   - No need to watch the full video!

### The Vision (Your Original Idea)

> "I haven't watched the whole YouTube video, but I want an agent to quickly summarize it in a way I can just glance over quickly. Like reading comics."

✅ **Achievement unlocked!** JetSki does exactly this.

---

## Costs

### Per Comic (6 panels)

- **OpenAI GPT-4o-mini:** ~$0.01 (viral analysis + storyboard)
- **Google Gemini 2.5 Flash:** ~$0.24 (6 images × $0.039)
- **Total:** ~$0.25 per comic

For a 3-hour Joe Rogan podcast → 6-panel comic for $0.25

---

## What's Next?

### Future Features (Not Yet Built)

1. **Frontend UI** - Next.js interface (just paste URL and go)
2. **Instagram Auto-Upload** - Post carousel directly to Instagram
3. **Video Chunking** - Handle 3-hour podcasts (currently limited by transcript size)
4. **Style Customization** - Choose comic art style
5. **Multi-Comic Generation** - Generate comics for all 3 viral moments
6. **User Accounts** - Save comic history

### Immediate Next Steps

1. **Test with real video:**
   ```bash
   # Try it!
   curl -X POST "http://localhost:8000/jetski" \
     -H "Content-Type: application/json" \
     -d '{
       "video_url": "https://www.youtube.com/watch?v=YOUR_VIDEO_HERE",
       "generate_images": true,
       "create_google_doc": true
     }'
   ```

2. **Check Google Docs** - See the auto-generated summary

3. **Download comic panels** - From the base64 response or Google Drive

---

## Troubleshooting

### "No transcript available"
- Video doesn't have captions enabled
- Try a different video with auto-generated captions

### "Image generation failed"
- Check `GOOGLE_API_KEY` is set correctly
- Verify you have Google AI Studio API access
- Check Gemini API quotas

### "Google Doc creation failed"
- Service account credentials not configured (this is optional)
- DocAgent will run in preview mode and return text content

### "Rate limit exceeded"
- OpenAI or Google API rate limits hit
- Wait a few seconds and retry
- Consider upgrading API tier for higher limits

---

## Project Structure

```
JetSki/
├── src/
│   ├── agents/
│   │   ├── transcript_agent.py    # YouTube transcript extraction
│   │   ├── highlight_agent.py     # Viral moment detection
│   │   ├── storyboard_agent.py    # 6-panel comic breakdown
│   │   ├── image_agent.py         # NanoBanana image generation
│   │   └── doc_agent.py           # Google Docs/Drive integration
│   └── main.py                    # FastAPI orchestration
├── docs/
│   └── PRD.md                     # Product requirements document
├── data/                          # Output folder (images, temp files)
├── requirements.txt               # Python dependencies
├── run.py                         # Server launcher
├── SETUP.md                       # This file
└── README.md                      # Project overview
```

---

## Credits

Inspired by the post about Lindy CMO and the vision of turning long-form content into digestible comics.

Built with love for NanoBanana 🍌

---

## Support

Questions? Found a bug?

1. Check the [PRD](docs/PRD.md) for technical details
2. Review API docs at http://localhost:8000/docs
3. Check server logs for error messages

---

Happy comic creating! 🎨🚀
