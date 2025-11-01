# 🚀 JetSki - Quick Start Guide

**Ready to turn YouTube videos into viral comics? Follow these 3 simple steps!**

---

## Step 1: Start the Backend ⚙️

Open a terminal and run:

```bash
python run.py
```

You should see:
```
🚤 Starting JetSki API Server...
Uvicorn running on http://127.0.0.1:8000
```

**Keep this terminal open!** The backend needs to stay running.

---

## Step 2: Start the Frontend 🎨

Open a **NEW** terminal (keep the first one running!) and run:

```bash
npm run dev
```

You should see:
```
- Local: http://localhost:3000
✓ Ready in 2s
```

**Keep this terminal open too!**

---

## Step 3: Open Your Browser 🌐

Open your web browser and go to:

**http://localhost:3000**

You should see the JetSki homepage with:
- A big "🚤 JetSki" title
- A YouTube URL input box
- Quick demo buttons

---

## Try It Out! 🎬

### Quick Demo (30 seconds - No Images)
1. Click the "Joe Rogan Podcast" quick button
2. **Uncheck** "Generate Comic Images" (faster demo)
3. Click "🚀 Generate Comic Strip"
4. Wait ~30 seconds
5. See the viral moment analysis and storyboard!

### Full Demo (2 minutes - With Images)
1. Paste any YouTube URL (or use quick button)
2. **Keep** "Generate Comic Images" checked
3. Optionally check "Create Google Doc"
4. Click "🚀 Generate Comic Strip"
5. Watch the 5-stage progress bar
6. Wait ~2 minutes
7. See the beautiful 6-panel comic with AI-generated images!
8. Click "Download All Panels" to save them

---

## What You Should See

### While Processing:
- Progress bar showing:
  - ✓ Extracting transcript
  - ✓ Finding viral moments
  - ✓ Generating storyboard
  - ✓ Creating comic images
  - ✓ Done!

### After Processing:
- **Video Info**: Title and processing time
- **Viral Moments**: Top 3 moments with scores (best one highlighted in green)
- **Comic Panels**: 6 panels in a 3x2 grid with captions
- **Download Section**: Buttons to download panels or view Google Doc

---

## View History 📚

Click "📚 View History" in the top-right to see all your previously generated comics!

---

## Troubleshooting 🔧

### "Connection refused" error
- Make sure the backend is running (`python run.py` in Terminal 1)
- Check if you see "Uvicorn running on http://127.0.0.1:8000"

### "Failed to process video"
- Check if your API keys are set in the `.env` file:
  - `OPENAI_API_KEY` (required)
  - `GOOGLE_API_KEY` (required for images)
- Try a different YouTube video
- Some videos may not have transcripts available

### Frontend won't start
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Images not showing
- Make sure "Generate Comic Images" toggle is ON
- Check that `GOOGLE_API_KEY` is set in `.env`
- First time may take longer to generate images

---

## Quick Commands Reference

### Start Everything
```bash
# Terminal 1 - Backend
python run.py

# Terminal 2 - Frontend
npm run dev
```

### Stop Everything
Press `Ctrl+C` in each terminal

### Rebuild Frontend
```bash
npm run build
```

### Check Backend Status
Open: http://localhost:8000

You should see:
```json
{
  "message": "🚀 JetSki API is live",
  "version": "1.0.0"
}
```

---

## Example YouTube URLs for Testing

These are known to work well:

1. **Short Video (~5 min)**
   - https://www.youtube.com/watch?v=dQw4w9WgXcQ
   - Fast processing, good for quick tests

2. **Medium Video (~15 min)**
   - https://www.youtube.com/watch?v=PssKpzB0Ah0
   - Good balance of content and speed

3. **Any Podcast**
   - Joe Rogan
   - Huberman Lab
   - Diary of a CEO
   - Lex Fridman

**Note:** Videos must have captions/transcripts available!

---

## What's Happening Behind the Scenes?

When you click "Generate Comic Strip":

1. **Backend** extracts the full YouTube transcript
2. **GPT-4o-mini** analyzes the transcript and finds top 3 viral moments
3. **AI** auto-selects the BEST viral moment (you don't choose!)
4. **GPT-4o-mini** generates a detailed 6-panel storyboard
5. **Google Gemini 2.5** (NanoBanana) creates manga/vintage style images
6. **(Optional)** Uploads everything to Google Drive and creates a Doc
7. **Frontend** displays the results beautifully!

**All of this happens automatically in ~2 minutes!**

---

## Cost Per Comic

- **Storyboard Only**: ~$0.01 (GPT-4o-mini)
- **With Images**: ~$0.25 (+ Google Gemini for 6 panels)
- **With Google Doc**: Free (Google Docs API)

**Total: $0.25 to turn a 3-hour podcast into viral content!**

---

## Need Help?

Check these files for more details:
- **README.md** - Complete project documentation
- **HACKATHON_READY_FINAL.md** - Demo guide and pitch
- **frontend/README.md** - Frontend-specific docs
- **SETUP.md** - Detailed setup instructions

---

## You're Ready! 🎉

Now that everything is running:
1. Generate your first comic
2. Check out the History page
3. Download some panels
4. Have fun creating viral content!

**If long-form was the ocean, you just built a jet ski!** 🚤
