# JetSki - HACKATHON GAME PLAN

> **"If long-form was the ocean, I just built a jet ski."**

## 🎯 The Vision

Turn a **3-hour Joe Rogan podcast** into a **6-panel comic** you can read in **30 seconds**.

No scrubbing. No watching. No burnout.

Just: **Paste → Wait 2 minutes → Get comic → Post to Instagram**

---

## 🚀 What We're Building (SIMPLE VERSION)

### Input
YouTube URL (Huberman, Joe Rogan, Diary of a CEO, etc.)

### Magic Happens
1. AI extracts transcript
2. AI hunts for viral moments (top 3)
3. AI auto-picks the BEST one (no user decision)
4. AI writes 6-panel comic storyboard
5. NanoBanana (Google Gemini) draws 6 comic panels
6. Uploads all to Google Drive
7. Creates Google Doc with explanation + social media strategy

### Output
- 6 beautiful comic panels (ready to post)
- Google Drive folder with all images
- Google Doc explaining each panel
- (Future) Auto-post to Instagram carousel

**Cost:** ~$0.25 per comic
**Time:** ~2 minutes for 30-min video

---

## 🛠️ Current Tech Stack

### What We Already Have (DONE!)

✅ **Backend (FastAPI + Python)**
- [src/agents/transcript_agent.py](src/agents/transcript_agent.py) - YouTube transcript extraction
- [src/agents/highlight_agent.py](src/agents/highlight_agent.py) - Viral moment detection (GPT-4o-mini)
- [src/agents/storyboard_agent.py](src/agents/storyboard_agent.py) - 6-panel comic script generation
- [src/agents/image_agent.py](src/agents/image_agent.py) - NanoBanana comic generation
- [src/agents/doc_agent.py](src/agents/doc_agent.py) - Google Docs/Drive integration
- [src/agents/metadata_agent.py](src/agents/metadata_agent.py) - Video metadata extraction
- [src/db.py](src/db.py) - SQLite database for tracking
- [src/main.py](src/main.py) - FastAPI endpoints (`/jetski`, `/analyze`, `/history`)

**API Endpoints:**
- `POST /jetski` - Full pipeline (YouTube URL → Comic)
- `POST /analyze` - Viral analysis only
- `GET /history` - Past generations

### What We Need (HACKATHON TODO)

❌ **Frontend (Next.js)**
- Beautiful UI (Tailwind/Shadcn)
- Input field for YouTube URL
- Loading animation (2-min wait)
- Display 6-panel comic in grid
- Download buttons for each panel
- Links to Google Drive + Google Doc

❌ **Instagram Integration (Future)**
- Auto-upload carousel
- One-click posting

---

## 📋 HACKATHON TODO LIST

### Phase 1: Core Demo (MUST HAVE)
- [ ] Build Next.js frontend
- [ ] Connect frontend to FastAPI `/jetski` endpoint
- [ ] Display loading animation while processing
- [ ] Show 6 comic panels in beautiful grid
- [ ] Add download buttons for images
- [ ] Test with 1 real YouTube video

### Phase 2: Polish (SHOULD HAVE)
- [ ] Add video title + duration preview
- [ ] Show viral moment score (95/100)
- [ ] Display storyboard text under each panel
- [ ] Add "Share to Instagram" button (manual download)
- [ ] Error handling for bad URLs

### Phase 3: Wow Factor (NICE TO HAVE)
- [ ] Animate comic panels appearing one by one
- [ ] Add dark mode
- [ ] Show cost/time metrics
- [ ] Add "Try these examples" with pre-loaded URLs
- [ ] Instagram carousel preview mockup

---

## 🎨 Frontend Mockup

```
┌─────────────────────────────────────────┐
│  🚤 JetSki                              │
│  Turn 3-hour podcasts into 6-panel      │
│  comics. Because nobody has time.       │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Paste YouTube URL...              │ │
│  └───────────────────────────────────┘ │
│           [Generate Comic]              │
│                                         │
│  ⏳ Analyzing video... (30s)            │
│  🎯 Found viral moment (Score: 95/100) │
│  🎨 Drawing comic panels... (90s)       │
│                                         │
│  ┌─────┬─────┬─────┐                   │
│  │ P1  │ P2  │ P3  │  6-Panel Comic    │
│  ├─────┼─────┼─────┤                   │
│  │ P4  │ P5  │ P6  │  Ready to post!   │
│  └─────┴─────┴─────┘                   │
│                                         │
│  📂 [View in Drive]  📄 [View Doc]     │
│  📱 [Download All]   📸 [Post to IG]   │
└─────────────────────────────────────────┘
```

---

## 💰 Cost Breakdown

**Per Comic:**
- Transcript extraction: FREE
- GPT-4o-mini (viral + storyboard): ~$0.02
- NanoBanana (6 images): ~$0.23
- **Total: ~$0.25**

**100 comics = $25** (cheaper than 1 hour of intern time!)

---

## 🏆 Hackathon Pitch

**Problem:**
Social media managers waste HOURS scrubbing through podcasts looking for viral moments.

**Solution:**
JetSki turns a 3-hour podcast into a 6-panel comic you can post immediately.

**Demo:**
1. Paste Joe Rogan podcast URL
2. Wait 2 minutes
3. Get beautiful comic + social media strategy
4. Post to Instagram
5. Profit

**Why It Wins:**
- ✅ Solves REAL pain point (content repurposing)
- ✅ Beautiful UI + smooth demo
- ✅ Uses cutting-edge AI (GPT-4o + NanoBanana)
- ✅ Actually works end-to-end
- ✅ Clear monetization ($0.25/comic = $25/100 comics)

**Judges Will Say:**
> "Holy sh*t, I need this for my podcast."

---

## 🚢 Deployment Plan

### Backend (FastAPI)
**Option 1:** Render.com (free tier)
```bash
# render.yaml
services:
  - type: web
    name: jetski-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn src.main:app --host 0.0.0.0 --port $PORT
```

**Option 2:** Railway.app (also free)

### Frontend (Next.js)
**Vercel** (literally 30 seconds)
```bash
npm run build
vercel deploy
```

### Environment Variables
```
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AIza...
BACKEND_URL=https://jetski-api.onrender.com
```

---

## 📊 Success Metrics

**MVP Success = Demo Works:**
- [ ] User pastes YouTube URL
- [ ] Gets 6-panel comic in <2 min
- [ ] Can download all panels
- [ ] Google Doc link works
- [ ] Judges say "wow"

**Bonus Points:**
- [ ] Test with 3-hour Joe Rogan podcast
- [ ] Show cost/time savings vs manual editing
- [ ] Instagram carousel mockup
- [ ] Analytics dashboard (X comics generated)

---

## 🎯 Your Current Status

**What's Done:**
✅ All 6 AI agents working
✅ FastAPI backend complete
✅ Database tracking
✅ Full pipeline tested

**What's Next:**
❌ Frontend UI
❌ Make it pretty
❌ Practice demo pitch

**Estimated Time to MVP:**
- Frontend build: 3-4 hours
- Styling/polish: 2 hours
- Testing: 1 hour
- **Total: ~6 hours** (doable in 1 day!)

---

## 🔥 The Pitch (30 seconds)

> "You ever tried turning a 3-hour Joe Rogan podcast into social media content?
>
> It's hell. Hours of scrubbing, editing, hoping you find the ONE viral moment.
>
> **JetSki does it in 2 minutes.**
>
> Paste the YouTube link. Wait 2 minutes. Get a 6-panel comic ready to post.
>
> AI finds the viral moment. NanoBanana draws the comic. Google Drive uploads it all.
>
> **Cost:** 25 cents per comic.
> **Time:** 2 minutes.
> **Burnout:** Zero.
>
> If long-form was the ocean, we just built a jet ski."

---

## 🚀 LET'S WIN THIS THING!

Current backend is SOLID. You just need:
1. **Pretty frontend** (Next.js + Tailwind)
2. **Smooth demo** (test with 1 video)
3. **Fire pitch** (use the script above)

**You got this! 🔥**
