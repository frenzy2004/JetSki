# 🔧 Google Credentials Setup

## ✅ Step 1: Google Credentials File Created

I've created `google_credentials.json` with your Google service account credentials.

---

## 🔧 Step 2: Update Your `.env` File

**Open your `.env` file and add this line:**

```bash
GOOGLE_SERVICE_ACCOUNT_PATH=google_credentials.json
```

**Your complete `.env` should look like:**

```bash
# OpenAI API
OPENAI_API_KEY=your_openai_key_here

# Google Gemini API
GOOGLE_API_KEY=your_google_gemini_key_here

# Google Service Account (NEW - ADD THIS!)
GOOGLE_SERVICE_ACCOUNT_PATH=google_credentials.json
```

---

## ✅ What This Enables

With Google credentials configured, JetSki can now:
- ✅ Upload comic panels to Google Drive
- ✅ Create Google Docs with panel explanations
- ✅ Auto-generate social media strategy documents
- ✅ Share Drive folders with your team

---

## 🚀 To Use Full Features

When calling the API, set these flags to `true`:

```python
{
  "video_url": "https://youtube.com/...",
  "generate_images": true,      # Generate comic panels with NanoBanana
  "create_google_doc": true     # Create Google Doc + upload to Drive
}
```

---

## 🎯 Next Steps

1. ✅ **Created:** `google_credentials.json`
2. 🔧 **TODO:** Add `GOOGLE_SERVICE_ACCOUNT_PATH=google_credentials.json` to `.env`
3. 🚀 **Then:** Run `python run.py` to start backend

---

## 📁 Files

- `google_credentials.json` ← Your service account credentials
- `.env` ← Add the path variable here
- `src/agents/doc_agent.py` ← Uses these credentials

---

**Ready to enable full Google integration! 🎉**

