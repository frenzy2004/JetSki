# JetSki - Product Requirements Document

## 🧩 1. Product Vision

**"Turn long-form videos into viral, visual stories — automatically."**

JetSki is an AI agent that takes a YouTube video (like Huberman, Joe Rogan, Diary of a CEO, etc.), analyzes it for viral potential, and outputs:

- Top 3 viral segments with timestamps and "why they're viral"
- Six-panel storyboard for the selected clip
- (Optional) Comic panels generated automatically
- Google Doc summary explaining each panel's meaning and how to post it later

**The goal:** help content teams, editors, and marketers repurpose long-form video instantly — without watching hours of footage.

## 💡 2. Core User Flow

| Step | Description | Output |
|------|-------------|--------|
| 1️⃣ Paste YouTube Link | User inputs a video URL | YouTube transcript fetched |
| 2️⃣ Analyze for Virality | AI scans transcript for "viral moments" | Ranked segments (Option 1, 2, 3) |
| 3️⃣ User Selects Clip | User picks preferred segment | Excerpt selected |
| 4️⃣ Generate Storyboard | AI builds a 6-panel comic script | Storyboard JSON or Markdown |
| 5️⃣ (Optional) Generate Visuals | AI image model draws panels | 6 images saved |
| 6️⃣ Auto Write Summary Doc | AI writes Google Doc with captions, hashtags, and panel meaning | Google Doc link |
| 7️⃣ (Later) Upload to Socials | Future phase (Instagram carousel / TikTok post) | N/A for now |

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

## 🧱 4. Tech Stack Overview

### 🧩 Core Technologies

| Layer | Tech | Purpose |
|-------|------|---------|
| Frontend | Next.js (React) + Shadcn/UI | Web dashboard |
| Backend | FastAPI (Python) | API + Orchestration engine |
| AI Agent Framework | LangChain or CrewAI | Multi-step task automation |
| LLM | OpenAI GPT-4o (text) + DALL·E 3 (image) | Summaries + storyboards + visuals |
| Transcription | YouTube Transcript API + Whisper API | Pulls transcripts automatically |
| Database | Supabase / SQLite | Stores transcripts, options, and results |
| Cloud Storage | Google Drive API | Save generated outputs |
| Docs Writer | Google Docs API | Auto-generate final reports |
| Auth (optional) | Clerk / Firebase Auth | If user accounts are needed later |

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

