# 🚤 JetSki - YouTube to Comic Converter

> **"If long-form was the ocean, we just built a jet ski."**

Transform 3-hour podcasts into 6-panel comics in 2 minutes. **All-in-One Next.js app** - no Python backend needed!

---

## ⚡ Quick Start

```bash
cd frontend
npm install
```

Create `.env.local`:
```bash
OPENAI_API_KEY=your_key_here
GOOGLE_API_KEY=AIzaSyAhne00yNumPpsJExCFQH01aCbwgazCnAI
```

Run:
```bash
npm run dev
```

Open **http://localhost:3000** 🎉

---

## 🎯 What It Does

1. **Paste** a YouTube URL (Joe Rogan, Huberman, Diary of a CEO)
2. **AI analyzes** the ENTIRE transcript
3. **Finds** top 3 viral moments
4. **Auto-selects** the best one
5. **Generates** 6-panel comic storyboard
6. **Done!** Ready for social media

---

## 🏗️ Architecture

**Full-Stack Next.js App:**
- **Frontend**: React UI with Tailwind CSS
- **Backend**: Next.js API routes
- **AI**: OpenAI GPT-4o-mini + Google Gemini
- **Data**: YouTube transcripts

**No separate server. No Python. Just Next.js.**

---

## 📦 What's Inside

```
frontend/
├── app/
│   ├── page.tsx              ← Beautiful gradient UI
│   ├── api/
│   │   ├── jetski/           ← Main pipeline
│   │   ├── transcript/       ← YouTube extraction
│   │   ├── viral/            ← Viral analysis
│   │   └── storyboard/       ← Comic generation
│   └── lib/
│       ├── openai.ts         ← OpenAI client
│       ├── google.ts         ← Gemini client
│       └── youtube.ts        ← Transcript utility
└── .env.local                ← Your API keys
```

---

## 💰 Cost

- **Transcript extraction**: Free (no API needed)
- **Viral analysis**: ~$0.01 (OpenAI GPT-4o-mini)
- **Storyboard**: ~$0.01 (OpenAI GPT-4o-mini)
- **Comic images** (optional): ~$0.23 (Google Gemini)

**Total: ~$0.02-0.25 per comic**

---

## 🎨 Features

- ✅ Beautiful gradient UI (blue → purple → pink)
- ✅ Real-time progress updates
- ✅ Viral moment scoring (0-100)
- ✅ AI auto-selection (no user decisions)
- ✅ 6-panel comic storyboards
- ✅ Detailed visual descriptions
- ✅ Ready for social media editors

---

## 🚀 Deploy

```bash
npm run build
vercel deploy
```

---

## 🐛 Troubleshooting

See `QUICK_START.md` for detailed troubleshooting.

---

## 📚 Documentation

- `QUICK_START.md` - Detailed setup guide
- `ENV_SETUP.md` - API keys configuration

---

## 🎯 Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenAI GPT-4o-mini** - Viral analysis & storyboards
- **Google Gemini 2.0** - Comic generation
- **youtube-transcript** - Transcript extraction

---

## 💡 Philosophy

Social media managers waste HOURS turning long-form content into posts.

JetSki does it in **2 minutes** for **25 cents**.

No burnout. Just AI magic. ✨

---

**Built for hackathons. Ready for production.** 🚤💨
