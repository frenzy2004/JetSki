# JetSki Frontend - PRODUCTION READY! 🚀

> **"Turn 3-hour podcasts into 6-panel comics in 2 minutes."**

## ✨ What's New (Latest Update)

### Fully Implemented Features:
- ✅ **Real Image Display** - Shows generated comic panels from NanoBanana
- ✅ **Toggle Controls** - Enable/disable image generation and Google Doc creation
- ✅ **Cost Estimator** - Shows real-time cost based on selected options
- ✅ **Progress Bar** - 5-stage status tracking during generation
- ✅ **History Page** - View all previously generated comics from Supabase
- ✅ **Download All Panels** - One-click download of all 6 comic panels
- ✅ **Google Doc/Drive Links** - Direct links to generated docs and folders
- ✅ **Example Videos** - Quick-click demo buttons for instant testing
- ✅ **Error Handling** - Helpful error messages with troubleshooting tips
- ✅ **How It Works** - Visual 5-step process flow
- ✅ **Environment Variables** - Configurable API URL via .env.local

---

## 🚀 Quick Start (3 Steps)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run the Frontend
```bash
npm run dev
```
Opens on: **http://localhost:3000**

### 3. Start Backend (separate terminal)
```bash
# From project root:
python run.py
```
Backend runs on: **http://localhost:8000**

---

## 🎨 Features Breakdown

### Main Page (`/`)
- **YouTube URL Input** with validation
- **Quick Demo Buttons** - Pre-filled example URLs
- **Toggle Switches:**
  - Generate Comic Images (NanoBanana) - $0.24
  - Create Google Doc & Upload to Drive - Free
- **Cost & Time Estimator** - Updates based on toggles
- **5-Stage Progress Bar:**
  1. Extracting transcript
  2. Finding viral moments
  3. Generating storyboard
  4. Creating comic images (if enabled)
  5. Uploading to Google Drive (if enabled)

### Results Display
- **Video Info Card** - Title, duration, processing time
- **Viral Analysis Card** - Top 3 moments with scores (best one highlighted)
- **Comic Panels Grid** - 3x2 layout with real generated images or storyboard descriptions
- **Download Section:**
  - Hashtags for social media
  - Posting tips
  - View Google Doc button (if created)
  - Open Drive Folder button (if created)
  - Download All Panels button (downloads all 6 as PNGs)

### History Page (`/history`)
- **View Past Comics** - Grid of all previously generated comics
- **Comic Cards** show:
  - Video title and storyboard title
  - Generation time and cost
  - Status badge (success/pending)
  - Quick links to Google Doc and Drive
- **Generate New** button to return to main page

---

## 💡 How It Works

1. **User pastes YouTube URL** → Joe Rogan, Huberman, Diary of a CEO
2. **Frontend sends POST to backend** → `/jetski` endpoint
3. **Backend processes video:**
   - Extracts full transcript
   - Finds top 3 viral moments (GPT-4o-mini)
   - AI auto-selects the BEST one
   - Generates 6-panel storyboard
   - (Optional) Creates comic images with NanoBanana
   - (Optional) Uploads to Google Drive & creates Doc
4. **Frontend displays results:**
   - Viral moment analysis
   - 6-panel comic with images
   - Download options
   - Social media strategy

---

## 🎯 Demo Flow (Perfect for Judges)

1. Open **http://localhost:3000**
2. Click "Joe Rogan Podcast" quick demo button (auto-fills URL)
3. Keep "Generate Images" checked (show full power!)
4. Optionally enable "Create Google Doc"
5. Click "Generate Comic Strip"
6. Watch the progress bar animate through 5 stages
7. Results appear in ~2 minutes:
   - See the viral moment AI selected
   - View beautiful 6-panel comic with real images
   - Download panels or open Google Doc
8. Click "View History" to show persistence
9. WOW THE JUDGES! 🏆

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── page.tsx              ← Main UI with full functionality
│   ├── layout.tsx            ← Next.js app layout
│   ├── globals.css           ← Tailwind styles
│   └── history/
│       └── page.tsx          ← History view with Supabase integration
├── .env.local                ← Environment variables (API URL)
├── .env.local.example        ← Template for env vars
├── tailwind.config.ts        ← Tailwind configuration
├── next.config.js            ← Next.js configuration
├── package.json              ← Dependencies
└── README.md                 ← This file
```

---

## ⚙️ Environment Variables

Create `.env.local` in the frontend directory:

```env
# Backend API URL (change for production deployment)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase (optional - for direct queries)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🐛 Troubleshooting

### Frontend won't start
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend connection error
- Make sure FastAPI is running on `localhost:8000`
- Check CORS is enabled in backend
- Verify API keys are set in backend `.env` file

### Images not displaying
- Ensure `generate_images` toggle is enabled
- Check GOOGLE_API_KEY is set in backend
- Verify NanoBanana (Gemini 2.5) is working

### History page is empty
- Generate at least one comic first
- Check backend Supabase connection
- Verify `/comics` endpoint returns data

---

## 💰 Cost Breakdown

| Option | Service | Cost |
|--------|---------|------|
| Storyboard Only | GPT-4o-mini | ~$0.01 |
| With Images | + NanoBanana (6 panels) | ~$0.25 |
| With Google Doc | + Google Drive API | Free |

**Demo Tip:** For fast demos, disable image generation (30 seconds vs 2 minutes)

---

## 🚀 Deployment

### Deploy Frontend (Vercel)
```bash
vercel deploy
```

### Deploy Backend (Render/Railway)
1. Push to GitHub
2. Connect repo to Render
3. Set environment variables
4. Deploy!

### Update API URL
Change `NEXT_PUBLIC_API_URL` in `.env.local` to your production backend URL

---

## 🏆 Hackathon Pitch (30 seconds)

> "Content creators waste HOURS turning podcasts into social media posts.
>
> JetSki solves that in 2 minutes.
>
> Paste any YouTube link. AI analyzes the ENTIRE video, finds the viral moments, and generates a 6-panel comic automatically.
>
> *[SHOW DEMO]*
>
> 25 cents per comic. Zero manual work. Zero burnout.
>
> If long-form was the ocean, we just built a jet ski."

---

## ✅ Pre-Demo Checklist

- [ ] Backend running (`python run.py`)
- [ ] Frontend running (`npm run dev`)
- [ ] Browser open to `localhost:3000`
- [ ] API keys configured in backend `.env`
- [ ] Test with one example video
- [ ] Pitch memorized
- [ ] History has 1-2 example comics

---

## 🎉 You're Ready!

**What You Built:**
- Complete Next.js frontend with TypeScript
- Real-time image display from backend
- History tracking with Supabase
- Beautiful, responsive UI
- Error handling and loading states
- Production-ready code

**Now go crush that demo!** 🔥
