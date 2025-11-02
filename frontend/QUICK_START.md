# 🚤 JetSki - Quick Start Guide

> **All-in-One Next.js App** - No Python backend needed!

---

## ✅ What You Have

A complete full-stack Next.js app that:
- ✅ Has a beautiful React UI
- ✅ Has built-in API routes (backend logic)
- ✅ Calls OpenAI for viral analysis & storyboards
- ✅ Calls Google Gemini for comic generation
- ✅ Extracts YouTube transcripts
- ✅ All in ONE codebase!

---

## 🚀 3-Step Setup

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Set Up Environment Variables
Create `frontend/.env.local`:
```bash
OPENAI_API_KEY=your_openai_key_here
GOOGLE_API_KEY=AIzaSyAhne00yNumPpsJExCFQH01aCbwgazCnAI
```

### Step 3: Run the App
```bash
npm run dev
```

Open **http://localhost:3000** 🎉

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── page.tsx                 ← UI (React component)
│   ├── layout.tsx               ← App layout
│   └── api/                     ← Backend API routes
│       ├── jetski/route.ts      ← Main pipeline
│       ├── transcript/route.ts  ← YouTube transcript
│       ├── viral/route.ts       ← Viral moment detection
│       └── storyboard/route.ts  ← Storyboard generation
├── lib/
│   ├── openai.ts               ← OpenAI client
│   ├── google.ts               ← Google Gemini client
│   └── youtube.ts              ← YouTube transcript utility
└── .env.local                  ← API keys (YOU CREATE THIS)
```

---

## 🎬 How It Works

1. **User pastes YouTube URL** in the UI
2. **Frontend calls** `/api/jetski`
3. **API route:**
   - Extracts transcript from YouTube
   - Analyzes with OpenAI to find viral moments
   - Generates 6-panel storyboard with OpenAI
   - (Optional) Generates comic images with Gemini
4. **Returns results** to frontend
5. **UI displays** viral moments + storyboard

---

## 💰 Cost

- **~$0.02 per comic** (OpenAI GPT-4o-mini)
- **~$0.23 per comic** (if generating images with Gemini)
- **Total: ~$0.25 per comic**

---

## 🎯 What You Get

**Input:** YouTube URL  
**Output:**
- Top 3 viral moments (ranked with scores)
- AI auto-selects the best one
- 6-panel comic storyboard
- Full visual descriptions
- Ready for social media!

---

## 🚀 Deploy to Vercel (Optional)

```bash
npm run build
vercel deploy
```

That's it! No servers, no Python, just pure Next.js magic! ✨

---

## 🐛 Troubleshooting

### "Module not found: youtube-transcript"
```bash
npm install
```

### "Invalid API key"
- Check `.env.local` has correct keys
- Restart dev server after adding `.env.local`

### Port 3000 already in use
```bash
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

**Ready to convert YouTube videos into comics?** 🚤💨  
**Just run `npm run dev` and go!**

