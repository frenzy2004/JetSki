# JetSki - Product Requirements Document

> **"Somewhere, a social media manager just cried. And it wasn't from burnout, it was joy."**

## 🧩 1. Product Vision

**"Turn 3-hour podcasts into 6-panel comics. Because nobody has time for that sh*t."**

> **"Somewhere, a social media manager just cried. And it wasn't from burnout, it was joy."**

### The Problem
You ever tried turning a three-hour podcast into content? You scrub through endless dialogue, praying for a "viral moment" that never arrives, until you start questioning your entire concept of time itself.

**Social media editors everywhere are drowning in long-form content.**

### The Solution
**JetSki** - If long-form was the ocean, we just built a jet ski. 🚤

**The EXACT Flow (Inspired by Lindy CMO):**

1. **Paste YouTube URL** → Joe Rogan, Huberman Lab, Diary of a CEO
2. **Agent analyzes ENTIRE video** → Every. Single. Word.
3. **Picks viral parts** → Emotional hooks, quotable lines, engagement spikes
4. **Shows recommendations** → Options 1, 2, 3 (with viral scores)
5. **AI auto-picks the BEST** → No user decisions, AI knows what's viral
6. **Crafts storyline/storyboard** → 6-panel comic narrative
7. **Develops comic with NanoBanana** → Google Gemini 2.5 generates panels
8. **Uploads to Google Drive** → All panels organized and shareable
9. **Auto-updates Google Doc** → Panel explanations + social media strategy
10. **Ready to pass to editors** → Complete package, zero manual work

**The goal:** 
- Glance at the comic without watching the full video ✓
- Read a 3-hour podcast in 30 seconds ✓
- Pass ready-to-post content to social media editors ✓
- **AI does EVERYTHING. User makes ZERO decisions.** ✓

## 💡 2. Core User Flow (HACKATHON EDITION)

**The Dream:** Paste YouTube link → Wait 2 minutes → Get comic → Post to Instagram → Profit

**THE EXACT FLOW (No User Decisions!):**

| Step | What Happens | Magic Output |
|------|-------------|--------------|
| 1️⃣ **Paste YouTube Link** | User pastes URL (Joe Rogan, Huberman, Diary of a CEO) | Transcript auto-extracted |
| 2️⃣ **Agent Analyzes ENTIRE Video** | GPT-4o scans FULL transcript for viral gold | Every. Single. Word. Analyzed. |
| 3️⃣ **AI Picks Viral Parts** | Detects emotional hooks, quotable lines, engagement spikes | Top 3 viral segments with scores |
| 4️⃣ **Show Recommendations** | Displays options 1, 2, 3 with viral scores | Option 1: 95/100, Option 2: 87/100, Option 3: 82/100 |
| 5️⃣ **AI AUTO-PICKS THE BEST** | 🔥 NO user decision - AI knows what's viral | Best moment auto-selected (highlighted green) |
| 6️⃣ **Crafts Storyline/Storyboard** | GPT-4o writes 6-panel comic script with scene descriptions | Complete narrative arc ready |
| 7️⃣ **Develops 6-Panel Comic** | NanoBanana (Google Gemini 2.5) generates all panels | 6 beautiful comic images with character consistency |
| 8️⃣ **Uploads to Google Drive** | All 6 panels auto-uploaded with organized naming | Shareable Drive folder link |
| 9️⃣ **Auto-Updates Google Doc** | Creates doc with panel explanations + social media strategy | Ready-to-use posting guide |
| 🔟 **Ready to Pass to Editors** | Comic + strategy doc + Drive folder = complete package | Zero manual work needed |

**User glances at comic without watching full video ✓**
**Pass storyboards/panels to social media editors ✓**
**Read 3-hour podcast in 30 seconds ✓**

**Time to complete:** ~2 minutes for 30-min video, ~5 minutes for 3-hour podcast
**Cost:** ~$0.25 per comic (GPT-4o-mini + NanoBanana)
**User effort:** Copy. Paste. Wait. **Done.**
**User decisions:** **ZERO.** AI does EVERYTHING.

## 🎯 3. Key Features

| Category | Feature | Description |
|----------|---------|-------------|
| 🧠 AI Analysis | Viral Segment Detection | Detects emotional hooks, quotable lines, high engagement moments |
| 📜 Transcript Engine | Transcript Fetcher | Pulls subtitles or uses speech-to-text fallback |
| 🎬 Storyboard Engine | Scene Breakdown | Converts chosen segment into a six-panel narrative |
| 🖼️ Visual Generator | Comic Panel Creator | AI creates visuals matching tone and context |
| 🧾 Doc Writer | Google Docs Sync | Auto-creates summary doc with captions and posting ideas |
| 🔄 Agent Workflow | Orchestrator | Manages step-by-step flow autonomously |
| 🧑‍💻 Frontend | Dashboard | Clean "Paste Link → Generate" web interface |

## 🧱 4. Tech Stack (HACKATHON SIMPLIFIED)

**Philosophy:** Keep it SIMPLE. No fancy orchestration. Just paste, wait, boom - comic.

### 🧩 Core Technologies

| Layer | Tech | Why This One |
|-------|------|--------------|
| **Frontend** | Next.js (React) + Tailwind/Shadcn | Beautiful UI in 1 hour |
| **Backend** | **OPTIONAL** - Can do everything in Next.js API routes | For hackathon, skip the backend! |
| **AI Brain** | OpenAI GPT-4o-mini (cheap!) | Viral detection + storyboard |
| **Comic Artist** | Google Gemini 2.5 Flash Image (NanoBanana) | ~$0.039/image = CHEAP AS HELL |
| **Transcript** | youtube-transcript-api (Python) or youtube-transcript (npm) | Free, no quota limits |
| **Storage** | Google Drive API | Auto-upload all panels |
| **Doc Writer** | Google Docs API | Auto-create summary doc |
| **Database** | SQLite (or skip it!) | For demo metrics only |

### 🚀 HACKATHON DEPLOYMENT STRATEGY

**Option A - Simple (Recommended for hackathon):**
```
Next.js App (Vercel)
├── Frontend (React + Tailwind)
└── API Routes (/api/jetski)
    ├── Get YouTube transcript
    ├── Call OpenAI for viral analysis
    ├── Call Gemini for comic generation
    └── Upload to Google Drive/Docs
```
**Deployment:** `vercel deploy` (literally 30 seconds)

**Option B - Your Current Setup (Also good!):**
```
FastAPI Backend (Python)  +  Next.js Frontend
├── python run.py         └── npm run dev
└── localhost:8000           localhost:3000
```
**Deployment:** Backend on Render/Railway, Frontend on Vercel

## 🔌 5. External APIs Needed

| API | Purpose | Auth Type | Notes |
|-----|---------|-----------|-------|
| YouTube Data API v3 | Fetch video metadata + transcript | OAuth / API Key | Fallback: youtube-transcript-api package |
| OpenAI API | GPT-4o for text + DALL·E for images | API Key | Core AI model |
| Google Cloud Speech (optional) | Alternative to Whisper | OAuth | Use if you want faster transcriptions |
| Google Drive API | Save generated files | OAuth | Output comic panels here |
| Google Docs API | Auto-write explanations | OAuth | For final summary document |
| LangChain | Agent orchestration | Local | Handles logic flow |

## ⚙️ 6. System Architecture (Simplified)

```
               ┌────────────────────────────┐
                │        Web Frontend        │
                │ (Next.js / Shadcn UI)      │
                │ Paste YouTube Link         │
                └─────────────┬──────────────┘
                              │
                              ▼
                ┌────────────────────────────┐
                │        FastAPI Backend     │
                │ Handles requests, routing  │
                └─────────────┬──────────────┘
                              │
                              ▼
          ┌────────────────────────────────────────┐
          │           AI Agent Orchestrator        │
          │ (LangChain / CrewAI)                   │
          │ Step 1: Get transcript                 │
          │ Step 2: Viral analysis                 │
          │ Step 3: Storyboard creation            │
          │ Step 4: Image generation               │
          │ Step 5: Google Docs output             │
          └────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────┐
              │      External APIs        │
              │ YouTube / OpenAI / Google │
              └───────────────────────────┘
```

## 📦 7. Data Model (Simplified JSON)

```json
{
  "video_id": "YOUTUBE_ID",
  "title": "Gold's Historical Significance",
  "options": [
    {
      "score": 82,
      "timestamps": "8:45 - 11:15",
      "excerpt": "We suffer from a disease of the heart...",
      "reason": "Quotable + emotional + historical tension"
    }
  ],
  "storyboard": [
    {
      "panel": 1,
      "caption": "The Spanish obsession with gold begins.",
      "visual_prompt": "Aztec temple, conquistadors arriving..."
    }
  ],
  "google_doc_link": "https://docs.google.com/...",
  "drive_folder_link": "https://drive.google.com/..."
}
```

## 🧰 8. Development Plan (No-Code + Dev Split)

| Phase | Who Can Do It | Tools |
|-------|---------------|-------|
| Prototype Workflow (LLM flow) | You (no code) | ChatGPT Advanced Data Analysis or Lindy.ai |
| Backend + API | Developer | FastAPI + LangChain |
| Frontend UI | Developer | Next.js |
| Integration | Developer | Google APIs |
| Testing / Validation | You | Manual via uploaded YouTube links |

## 📈 9. Success Metrics (MVP Goals)

| Metric | Target |
|--------|--------|
| 🕒 Avg. time to analyze 30-min video | < 2 minutes |
| 🧠 Viral segment accuracy (human eval) | > 80% relevance |
| 🎬 Storyboard coherence | > 4/5 human score |
| 📄 Docs generated | 100% automated |
| 😎 "JetSki Moment" comments | People say "holy sh*t this is useful" |

---

## 🧪 10. Experiment Log

> **Purpose:** Track experiments, improvements, and learnings as we build and iterate on JetSki.
> Document what works, what doesn't, and why.

### 🧪 Experiment Log 00 — Initial Setup (2025-11-01)

**Goal:** Establish project foundation and architecture

**What we did:**
- Created complete project structure (docs/, src/agents/, data/)
- Scaffolded 4 core agents: transcript, highlight, storyboard, doc
- Set up main orchestrator in `main.py`
- Defined tech stack and dependencies

**Results:**
- ✅ Clean separation of concerns (each agent has single responsibility)
- ✅ PRD established as living document
- 🔄 Ready for first implementation sprint

**Next Steps:**
- Implement transcript_agent with youtube-transcript-api
- Test viral detection prompts with GPT-4o
- Build minimal FastAPI endpoint

---

### 🧪 Experiment Log 01 — Complete MVP Implementation (2025-11-01)

**Goal:** Implement full automated pipeline from YouTube URL to comic generation with database persistence

**Hypothesis:** We can build a complete end-to-end system that processes YouTube videos, auto-selects viral moments, generates storyboards, and persists results - all within the PRD's target of <2 minutes for a 30-minute video.

**What we did:**

**Agent Implementation:**
- ✅ Implemented all 5 core agents with structured JSON outputs
- ✅ **transcript_agent.py**: YouTube transcript extraction with multi-language fallback (en, en-US, en-GB, en-CA)
  - Fixed API compatibility for youtube-transcript-api v1.2.3+ (`.fetch()` instead of `.get_transcript()`)
- ✅ **highlight_agent.py**: GPT-4o-mini viral moment detection with auto-selection
  - Returns 3 ranked segments with viral scoring (0-100)
  - AI automatically picks best moment (no user decision needed)
- ✅ **storyboard_agent.py**: 6-panel comic storyboard generation
  - Detailed scene descriptions, character details, composition notes
- ✅ **image_agent.py**: NanoBanana (Google Gemini 2.5 Flash Image) integration
  - Generates 6 comic panels with character consistency
  - Base64 image encoding for API transfer
- ✅ **doc_agent.py**: Google Docs/Drive automation
  - Creates comprehensive summary documents
  - Includes social media posting strategy
  - Works in preview mode without credentials
- ✅ **metadata_agent.py**: YouTube video metadata extraction
  - Fetches title, duration, channel, thumbnail
  - Web scraping fallback (no API key needed)

**Database Layer:**
- ✅ Created `db.py` with SQLite integration
- ✅ 5 tables: videos, viral_segments, storyboards, generated_comics, metrics
- ✅ Full persistence of pipeline results
- ✅ Performance metrics tracking for each step

**API Endpoints:**
- ✅ `POST /jetski`: Full automated pipeline
  - STEP 0: Extract video metadata
  - STEP 1: Get transcript
  - STEP 2: Viral analysis (AI auto-selects best)
  - STEP 3: Generate storyboard
  - STEP 4: Generate images (optional)
  - STEP 5: Create Google Doc (optional)
  - All results persisted to database
- ✅ `POST /analyze`: Viral moment analysis only
- ✅ `POST /storyboard`: Storyboard generation from segment
- ✅ `GET /history`: Recent video processing history
- ✅ `GET /`: API info and endpoints

**Environment & Configuration:**
- ✅ `.env` file with API keys (OpenAI, Google)
- ✅ Windows encoding fixes for emoji support
- ✅ Proper dotenv path resolution from nested directories

**Results:**

**✅ What worked extremely well:**
1. **Structured JSON approach**: All agents return parseable JSON instead of plain text
   - Makes pipeline orchestration clean and reliable
   - Easy to persist and retrieve from database
2. **Auto-selection logic**: AI picking best viral moment eliminates user friction
   - User just pastes URL and gets result
   - Matches original vision: "AI does EVERYTHING automatically"
3. **Database persistence**: SQLite provides full history and metrics
   - Can track performance over time
   - Easy to implement analytics later
4. **Multi-language transcript fallback**: Handles international videos gracefully
   - Tries en, en-US, en-GB, en-CA in sequence
   - Shows available languages if none found
5. **Metadata extraction without API**: Web scraping works reliably
   - No YouTube Data API quota limits
   - Gets title, duration, channel info
6. **Modular agent architecture**: Easy to test and modify individual components

**❌ What didn't work / Issues fixed:**
1. **YouTube Transcript API breaking change**:
   - Old API: `YouTubeTranscriptApi.get_transcript()`
   - New API: `api = YouTubeTranscriptApi(); api.fetch()`
   - **Fix**: Updated to instance-based API with `.snippets` access
2. **AI hallucination from failed transcripts**:
   - When transcript extraction failed silently, GPT-4o-mini saw error text and invented fake viral moments
   - **Fix**: Proper error handling and transcript validation
3. **Environment variable loading**:
   - `load_dotenv()` without path didn't work from nested agent files
   - **Fix**: Explicit path resolution: `root_dir / ".env"`

**🤔 Surprising findings:**
1. **NanoBanana is incredibly cost-effective**: ~$0.039/image = ~$0.23 for 6-panel comic
   - Much cheaper than expected
   - Quality is excellent for comic-style art
2. **GPT-4o-mini is great at viral detection**: Accurately identifies hooks, emotional moments, quotable lines
   - Scoring is surprisingly consistent
   - Reasons are insightful and actionable
3. **SQLite is perfectly sufficient**: No need for Supabase at MVP stage
   - Fast, simple, zero configuration
   - Can migrate later if needed

**📊 Key metrics/data:**
- **Pipeline steps**: 6 total (metadata, transcript, viral, storyboard, images, docs)
- **Database tables**: 5 (complete relationship tracking)
- **API endpoints**: 5 (full CRUD + pipeline)
- **Agent count**: 6 (transcript, highlight, storyboard, image, doc, metadata)
- **Estimated cost per video**: ~$0.25 (GPT-4o-mini + NanoBanana)
- **Target time**: <2 minutes for 30-minute video (ready to test)

**Learnings:**

1. **Start with structured outputs from day 1**: Refactoring from plain text to JSON was the right move
2. **Database early > Database later**: Having persistence from the start enables better debugging and metrics
3. **Fallbacks are critical**: Multi-language support, web scraping for metadata, error handling - all essential
4. **AI auto-selection works**: Users don't want to make decisions - let AI pick the best viral moment
5. **Modular > Monolithic**: Each agent is independently testable and replaceable

**Next Steps:**

**Immediate (MVP Completion):**
- [ ] Test full `/jetski` pipeline with real YouTube video
- [ ] Verify end-to-end flow: URL → transcript → viral → storyboard → images → doc
- [ ] Measure actual execution time for 30-minute video
- [ ] Test with different video types (podcast, interview, documentary)
- [ ] Validate viral moment accuracy against human judgment

**Short-term (MVP Enhancement):**
- [ ] Add cost tracking per pipeline run
- [ ] Implement caching for repeat video URLs
- [ ] Add thumbnail preview in API response
- [ ] Create simple frontend UI (Next.js)
- [ ] Add error recovery and retry logic

**Medium-term (Post-MVP):**
- [ ] A/B test different viral detection prompts
- [ ] Experiment with different image styles (cinematic vs comic vs minimalist)
- [ ] Add character consistency improvements
- [ ] Implement panel layout optimization
- [ ] Add Instagram auto-upload integration

**Long-term (Scale):**
- [ ] Migrate to Supabase if traffic grows
- [ ] Add user accounts and authentication
- [ ] Build analytics dashboard for metrics
- [ ] Implement webhook for async processing
- [ ] Add support for other video platforms (TikTok, Instagram Reels)

**Status:** MVP is feature-complete and ready for end-to-end testing.

---

### 🧪 Experiment Log Template

**Copy this template for each new experiment:**

```markdown
### 🧪 Experiment Log [##] — [Short Title] ([Date])

**Goal:** What are we trying to achieve?

**Hypothesis:** What do we expect to happen?

**What we did:**
- Action 1
- Action 2
- Action 3

**Results:**
- ✅ What worked well
- ❌ What didn't work
- 🤔 Surprising findings
- 📊 Key metrics/data

**Learnings:**
- Key insight 1
- Key insight 2

**Next Steps:**
- What to try next
- What to change
```

---

### 📝 Future Experiment Ideas

**Add experiment ideas here as they come up:**

- **Viral Detection Prompts:** Test different prompt strategies for identifying viral moments
  - Compare GPT-4o vs Claude for viral analysis
  - Test few-shot vs zero-shot prompting
  - Measure accuracy against human-labeled dataset

- **Storyboard Tone Tests:** Experiment with different visual styles
  - Cinematic vs comic book vs minimalist
  - Consistency across 6 panels
  - Brand voice matching

- **Timestamp Accuracy:** Improve segment extraction precision
  - Test different chunking strategies
  - Compare accuracy with/without video metadata
  
- **Image Generation Quality:** DALL·E 3 experiments
  - Prompt engineering for consistent style
  - Character consistency across panels
  - Background vs foreground emphasis

- **Performance Optimization:** Speed up the pipeline
  - Parallel API calls vs sequential
  - Caching strategies for repeated videos
  - Cost vs speed tradeoffs

