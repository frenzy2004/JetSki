# 🚤 JetSki

**"Turn long-form videos into viral, visual stories — automatically."**

JetSki is an AI agent that analyzes YouTube videos (podcasts, interviews, documentaries) for viral potential and automatically generates:

- 🎯 **Top 3 viral segments** with timestamps and virality analysis
- 🎬 **Six-panel storyboards** for selected clips
- 🖼️ **Comic panels** generated automatically (optional)
- 📄 **Google Doc summaries** with captions, hashtags, and posting strategies

## 🎯 Product Vision

Help content teams, editors, and marketers **repurpose long-form video instantly** — without watching hours of footage.

## ✨ Key Features

- **🧠 Viral Segment Detection** - AI detects emotional hooks, quotable lines, and high engagement moments
- **📜 Transcript Engine** - Automatic subtitle extraction with speech-to-text fallback
- **🎬 Storyboard Engine** - Converts segments into six-panel narratives
- **🖼️ Visual Generator** - AI-created comic panels matching tone and context
- **🧾 Doc Writer** - Auto-generates Google Docs with captions and posting ideas
- **🔄 Agent Workflow** - Autonomous step-by-step orchestration

## 🔄 User Flow

1. **Paste YouTube Link** → Fetch transcript
2. **AI Analysis** → Identify viral moments (ranked top 3)
3. **Select Clip** → Choose your preferred segment
4. **Generate Storyboard** → 6-panel comic script created
5. **Create Visuals** → AI draws panels (optional)
6. **Auto Summary** → Google Doc with captions & strategy
7. **Share** → Post to social media (future phase)

## 🛠️ Tech Stack

### Core Technologies
- **Frontend**: Next.js (React) + Shadcn/UI
- **Backend**: FastAPI (Python)
- **AI Framework**: LangChain or CrewAI
- **LLM**: OpenAI GPT-4o (text) + DALL·E 3 (images)
- **Transcription**: YouTube Transcript API + Whisper API
- **Database**: Supabase / SQLite
- **Storage**: Google Drive API
- **Docs**: Google Docs API

### External APIs
- YouTube Data API v3
- OpenAI API (GPT-4o + DALL·E)
- Google Drive API
- Google Docs API
- Google Cloud Speech (optional)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/frenzy2004/JetSki.git
cd JetSki

# Backend setup
pip install -r requirements.txt

# Frontend setup
cd frontend
npm install
```

## 🚀 Usage

```bash
# Start backend
python main.py

# Start frontend (in separate terminal)
cd frontend
npm run dev
```

## 📈 Success Metrics (MVP Goals)

| Metric | Target |
|--------|--------|
| ⏱️ Avg. time to analyze 30-min video | < 2 minutes |
| 🧠 Viral segment accuracy | > 80% relevance |
| 🎬 Storyboard coherence | > 4/5 human score |
| 📄 Docs generated | 100% automated |

## 🗺️ Development Roadmap

- [ ] Phase 1: Prototype workflow (LLM flow)
- [ ] Phase 2: Backend API + LangChain integration
- [ ] Phase 3: Frontend UI (Next.js)
- [ ] Phase 4: Google API integrations
- [ ] Phase 5: Testing & validation
- [ ] Phase 6: Social media auto-posting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

License information will be added here.

---

*Built to help creators turn hours of content into viral moments in minutes.*

