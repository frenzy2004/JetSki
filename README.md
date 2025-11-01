# 🚤 JetSki

**"Turn long-form videos into viral, visual stories — automatically."**

> Paste a YouTube link → AI creates a 6-panel comic + Google Doc summary
>
> No watching required. No editing required. Just pure viral content.

## 🎯 What It Does

JetSki converts YouTube videos (podcasts, interviews, documentaries) into **Instagram-ready comics** automatically:

1. **Analyzes** entire video transcript
2. **Finds** top 3 viral moments (scored 0-100)
3. **Auto-selects** the BEST moment (AI picks, not you)
4. **Generates** 6-panel comic storyboard
5. **Creates** comic images using Google Gemini 2.5 (NanoBanana)
6. **Uploads** to Google Drive
7. **Writes** Google Doc with social media strategy

**Total time:** ~2 minutes for a 30-minute video
**Total cost:** ~$0.25 per comic

## 🔥 Why This Exists

> "I haven't watched the whole YouTube video, but I want an agent to quickly summarize it in a way I can just glance over quickly. Like reading comics."

That's exactly what JetSki does. Turn 3-hour Joe Rogan podcasts into 6-panel comics you can read in 30 seconds.

## ✨ Key Features

- ✅ **FULLY AUTOMATED** - No user decisions needed (AI auto-selects best viral moment)
- ✅ **STRUCTURED JSON** - All agents return clean, parseable data
- ✅ **NANOBANANA COMICS** - Google Gemini 2.5 Flash Image generation
- ✅ **GOOGLE INTEGRATION** - Auto-uploads to Docs + Drive
- ✅ **SOCIAL READY** - Hashtags, captions, posting strategy included
- ✅ **PRODUCTION READY** - FastAPI with proper error handling

## 🚀 Quick Start

### 1. Install

```bash
pip install -r requirements.txt
```

### 2. Configure API Keys

Copy `.env.example` to `.env`:

```bash
# Required
OPENAI_API_KEY=sk-your-key-here
GOOGLE_API_KEY=your-gemini-key-here

# Optional (for Google Docs/Drive)
GOOGLE_SERVICE_ACCOUNT_PATH=/path/to/credentials.json
```

**Get API keys:**
- OpenAI: https://platform.openai.com/api-keys
- Google Gemini: https://aistudio.google.com/apikey
- Google Service Account: https://console.cloud.google.com/

### 3. Run

```bash
python run.py
```

Server runs at: http://localhost:8000

API docs: http://localhost:8000/docs

### 4. Test

```python
import requests

response = requests.post("http://localhost:8000/jetski", json={
    "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "generate_images": True,
    "create_google_doc": True
})

result = response.json()
print(result["viral_analysis"]["segments"][0]["hook"])
# Output: AI-selected viral moment
```

See [example_usage.py](example_usage.py) for complete examples.

## 📖 Full Documentation

See [SETUP.md](SETUP.md) for:
- Complete installation guide
- API endpoint documentation
- Agent architecture breakdown
- Troubleshooting
- Cost breakdown
- Example workflows

## 🛠️ Tech Stack (What's Actually Built)

### ✅ Currently Implemented
- **Backend**: FastAPI (Python) with full orchestration
- **Transcript Agent**: YouTube Transcript API
- **Highlight Agent**: OpenAI GPT-4o-mini (viral analysis + auto-selection)
- **Storyboard Agent**: OpenAI GPT-4o-mini (6-panel breakdown)
- **Image Agent**: Google Gemini 2.5 Flash Image (NanoBanana)
- **Doc Agent**: Google Docs + Drive API integration
- **Data Format**: Structured JSON throughout

### ⏳ Planned (Not Yet Built)
- **Frontend**: Next.js UI (currently API-only)
- **Database**: Supabase/SQLite (agents don't persist data yet)
- **Instagram Upload**: Auto-post to Instagram (not implemented)
- **Video Chunking**: Handle 3+ hour videos (currently limited by transcript size)

## 🏗️ Architecture

```
User pastes YouTube URL
         ↓
┌─────────────────────────────────────────────────┐
│  JETSKI FULL PIPELINE (/jetski endpoint)       │
└─────────────────────────────────────────────────┘
         ↓
[1] Transcript Agent → Extract YouTube transcript
         ↓
[2] Highlight Agent → Find 3 viral moments, score them, AUTO-SELECT best
         ↓
[3] Storyboard Agent → Generate 6-panel comic breakdown
         ↓
[4] Image Agent → Generate images via NanoBanana (Gemini 2.5)
         ↓
[5] Doc Agent → Create Google Doc + upload images to Drive
         ↓
    Comic ready! 🎉
```

## 📊 Example Output

**Input:** 30-minute YouTube video about gold's historical significance

**Output:**
```json
{
  "viral_analysis": {
    "segments": [
      {
        "rank": 1,
        "score": 95,
        "hook": "The disease of the heart",
        "viral_type": "emotional quote",
        "summary": "Powerful historical quote about greed and colonialism",
        "start_time": "8:45",
        "end_time": "11:15"
      }
    ],
    "selected": {
      "rank": 1,
      "reason": "Highest viral potential - combines emotion, history, quotable moment"
    }
  },
  "storyboard": {
    "title": "The disease of the heart",
    "panels": [ /* 6 detailed panel descriptions */ ],
    "hashtags": ["#History", "#Gold", "#Colonialism"],
    "posting_tip": "Post during peak engagement hours (12pm-3pm EST)"
  },
  "images": {
    "success_count": 6,
    "generated_panels": [ /* 6 base64-encoded comic images */ ]
  },
  "google_doc": {
    "doc_url": "https://docs.google.com/document/d/...",
    "drive_folder_url": "https://drive.google.com/drive/folders/..."
  }
}
```

## 🎨 Comic Style (NanoBanana)

JetSki uses **Google Gemini 2.5 Flash Image** (nicknamed "NanoBanana"):
- Modern editorial comic style
- Bold lines, vibrant colors
- Character consistency across panels
- ~$0.039 per image (6 panels = $0.24 per comic)

## 📈 Current Status

### ✅ MVP Complete
- [x] 5 agents fully implemented
- [x] End-to-end automation (paste URL → get comic)
- [x] Structured JSON outputs
- [x] Google Docs/Drive integration
- [x] NanoBanana image generation
- [x] Auto-selection of best viral moment
- [x] Social media strategy generation

### 🚧 Next Steps
- [ ] Frontend UI (Next.js)
- [ ] Test with 100+ videos
- [ ] Instagram auto-upload
- [ ] User accounts & history
- [ ] Multi-comic generation (all 3 moments)

## 💰 Costs Per Comic

| Service | Cost |
|---------|------|
| OpenAI GPT-4o-mini (analysis + storyboard) | ~$0.01 |
| Google Gemini 2.5 (6 images) | ~$0.24 |
| **Total** | **~$0.25** |

Turn a 3-hour podcast into a viral comic for a quarter.

## 🤝 Credits

Inspired by the Lindy CMO post about turning long-form videos into comic-style summaries.

Built with love for NanoBanana 🍌

## 📄 Project Structure

```
JetSki/
├── src/
│   ├── agents/
│   │   ├── transcript_agent.py     # YouTube transcript extraction
│   │   ├── highlight_agent.py      # Viral moment detection (auto-selects best)
│   │   ├── storyboard_agent.py     # 6-panel comic breakdown
│   │   ├── image_agent.py          # NanoBanana comic generation
│   │   └── doc_agent.py            # Google Docs/Drive automation
│   └── main.py                     # FastAPI orchestrator
├── docs/
│   └── PRD.md                      # Living product requirements doc
├── SETUP.md                        # Complete setup guide
├── example_usage.py                # Python usage examples
├── .env.example                    # Environment variables template
├── requirements.txt                # Python dependencies
└── run.py                          # Server launcher
```

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Installation, API docs, troubleshooting
- **[docs/PRD.md](docs/PRD.md)** - Product requirements + experiment log
- **[example_usage.py](example_usage.py)** - Code examples

---

**JetSki** - Turn hours of video into seconds of viral content 🚀

*"Somewhere, a social media manager just cried. And it wasn't from burnout, it was joy."*

