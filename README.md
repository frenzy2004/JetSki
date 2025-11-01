# JetSki - YouTube to Comic Strip Generator

Turn YouTube videos into viral comic strips powered by AI. Pure Next.js application with zero backend dependencies.

## Quick Start

```bash
# From project root
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## What Changed (v2.0)

This is now a **pure Next.js application** with no Python backend. All AI processing happens in Next.js API routes.

### Before (v1.0)
```
Frontend (React) → FastAPI (Python) → OpenAI + Google + Supabase
```

### Now (v2.0)
```
Frontend (React) → Next.js API Routes → OpenAI + Google + Supabase
```

### Benefits
- No port conflicts
- Single language stack (TypeScript)
- Simpler deployment (Vercel one-click)
- Better type safety
- Faster development with hot reload

## Architecture

### Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **AI Services**:
  - OpenAI GPT-4o-mini (viral moment analysis, storyboard generation)
  - Google Gemini 2.0 Flash (comic image generation)
- **Database**: Supabase (PostgreSQL)
- **Transcript**: youtube-transcript npm package

### Project Structure

```
jetski/
├── frontend/                  # Main application
│   ├── app/
│   │   ├── api/              # Next.js API routes (replaces Python backend)
│   │   │   ├── jetski/       # Main pipeline endpoint
│   │   │   ├── history/      # Video history
│   │   │   ├── comics/       # Recent comics
│   │   │   └── storyboard/   # Individual storyboard
│   │   ├── history/          # History page
│   │   ├── page.tsx          # Main page
│   │   └── layout.tsx        # Root layout
│   ├── lib/
│   │   ├── agents/           # AI agent logic (TypeScript)
│   │   │   ├── transcript.ts # YouTube transcript extraction
│   │   │   ├── highlight.ts  # Viral moment detection
│   │   │   ├── storyboard.ts # 6-panel comic generation
│   │   │   ├── image.ts      # Comic image generation
│   │   │   └── metadata.ts   # Video metadata
│   │   └── supabase/         # Database client and helpers
│   │       ├── client.ts     # Supabase client
│   │       └── db.ts         # Database functions
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   └── .env.local            # Environment variables
└── legacy/                    # Old Python backend (reference only)
```

## Setup

### Prerequisites

- Node.js 18+
- OpenAI API key
- Google Gemini API key
- Supabase account

### Installation

1. Navigate to frontend folder:
```bash
cd frontend
npm install
```

2. Create `.env.local`:
```bash
cp .env.local.example .env.local
```

3. Add your API keys to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
GOOGLE_API_KEY=your_google_gemini_api_key
```

4. Start dev server:
```bash
npm run dev
```

## How It Works

1. **Transcript Extraction** - Extracts YouTube video transcript
2. **Viral Moment Detection** - OpenAI analyzes transcript, identifies top 3 viral segments
3. **Storyboard Generation** - Creates 6-panel comic structure
4. **Image Generation** - Google Gemini generates each panel with manga-vintage style
5. **Storage** - Saves everything to Supabase

## API Routes

### POST /api/jetski
Main endpoint for generating comics.

**Request:**
```json
{
  "video_url": "https://www.youtube.com/watch?v=...",
  "generate_images": true,
  "create_google_doc": false
}
```

### GET /api/history
Retrieves video processing history.

### GET /api/comics
Fetches recent generated comics.

### GET /api/storyboard/[id]
Gets specific storyboard with panels.

## Cost & Performance

### Per Comic
- Transcript: Free
- Viral Analysis: ~$0.01
- Storyboard: ~$0.01
- Images (6 panels): ~$0.24
- **Total**: ~$0.26

### Time
- Without images: ~30 seconds
- With images: ~2 minutes

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

```bash
vercel --prod
```

## Troubleshooting

### "Invalid YouTube URL"
- Use valid YouTube URL format
- Supported: `youtube.com/watch?v=...`, `youtu.be/...`

### "No transcript available"
- Video must have captions/transcripts enabled
- Try different video

### "Failed to generate images"
- Check Google API key validity
- Verify API quota
- Ensure Gemini access is enabled

### "Database error"
- Verify Supabase credentials
- Check database tables exist
- Ensure RLS policies allow operations

## Development

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

## Legacy Backend

The original Python FastAPI backend is in `/legacy/` for reference. It's no longer used or required.

## License

MIT

## Support

For issues, open a GitHub issue.
