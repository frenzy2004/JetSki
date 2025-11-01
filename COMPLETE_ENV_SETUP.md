# 🔧 Complete Environment Setup

## ✅ All Your API Keys

I have all your credentials! Here's what you need in your `.env` file:

---

## 📝 **Copy This Into Your `.env` File:**

```bash
# Google Gemini API (NanoBanana - comic generation)
GOOGLE_API_KEY=AIzaSyAhne00yNumPpsJExCFQH01aCbwgazCnAI

# OpenAI API (viral analysis + storyboard)
OPENAI_API_KEY=your_openai_key_here

# Google Service Account (Drive + Docs)
GOOGLE_SERVICE_ACCOUNT_PATH=google_credentials.json
```

---

## 🎯 **Quick Steps:**

1. **Open** `.env` file in JetSki folder
2. **Paste** the 3 lines above
3. **Replace** `your_openai_key_here` with your actual OpenAI key (if you have it)
4. **Save** the file
5. **Run** `python run.py`

---

## ✅ **What Each Key Does:**

| Key | Purpose | Cost |
|-----|---------|------|
| `GOOGLE_API_KEY` | NanoBanana (Gemini 2.5) generates comic panels | ~$0.23/comic (6 images) |
| `OPENAI_API_KEY` | GPT-4o-mini for viral detection + storyboard | ~$0.02/comic |
| `GOOGLE_SERVICE_ACCOUNT_PATH` | Upload to Drive, create Docs | Free |

---

## 📁 **Files Created:**

- ✅ `google_credentials.json` - Service account credentials
- ✅ `ENV_SETUP.txt` - Quick copy-paste version
- ✅ This file - Complete instructions

---

## 🚀 **Ready to Run:**

Once you update `.env`:

**Terminal 1:**
```bash
python run.py
```
→ Backend on `localhost:8000`

**Terminal 2:**
```bash
cd frontend
npm run dev
```
→ Frontend on `localhost:3000` (already running!)

**Browser:**
Open `http://localhost:3000` and paste a YouTube URL!

---

## 💡 **Note on OpenAI Key:**

If you don't have an OpenAI API key yet:
- You can get one at: https://platform.openai.com/api-keys
- Or test without it (but viral analysis won't work)

---

**You're almost ready to demo! Just update that `.env` file! 🔥**

