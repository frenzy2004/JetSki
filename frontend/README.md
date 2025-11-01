# JetSki - YouTube to Comic Strip Generator

Turn YouTube videos into viral comic strips powered by AI. Built with Next.js, OpenAI, Google Gemini, and Supabase.

## Architecture

This is a pure Next.js application with no separate backend. All AI processing happens in Next.js API routes.

```
Frontend (React) → Next.js API Routes → OpenAI + Google Gemini + Supabase
```

### Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **AI Services**:
  - OpenAI GPT-4o-mini (viral analysis, storyboard generation)
  - Google Gemini 2.0 Flash (comic image generation)
- **Database**: Supabase (PostgreSQL)
- **Transcript Extraction**: youtube-transcript npm package

## Quick Start

### Prerequisites

- Node.js 18+
- OpenAI API key
- Google Gemini API key
- Supabase account

### Installation

1. Clone the repository and navigate to the frontend folder:

```bash
cd frontend
npm install
```

2. Create `.env.local` file with your API keys:

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

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### 1. Transcript Extraction
- User provides a YouTube URL
- System extracts the full video transcript using youtube-transcript

### 2. Viral Moment Detection
- OpenAI GPT-4o-mini analyzes the transcript
- Identifies top 3 viral segments based on:
  - Emotional impact
  - Novelty and insights
  - Visual potential
  - Shareability
- Auto-selects the best moment

### 3. Storyboard Generation
- Creates a 6-panel comic structure
- Defines scene descriptions, character details, and captions
- Optimizes for manga-vintage aesthetic

### 4. Image Generation
- Google Gemini 2.0 Flash generates each panel
- Maintains character consistency across panels
- Applies hybrid manga-vintage comic style

### 5. Storage
- Saves video metadata, storyboard, and panels to Supabase
- Stores generated images as base64 in database

## API Routes

### `POST /api/jetski`
Main endpoint for generating comics from YouTube videos.

**Request:**
```json
{
  "video_url": "https://www.youtube.com/watch?v=...",
  "generate_images": true,
  "create_google_doc": false
}
```

**Response:**
```json
{
  "video_url": "...",
  "video_title": "...",
  "viral_analysis": { ... },
  "storyboard": { ... },
  "images": { ... },
  "status": "success",
  "metrics": { ... }
}
```

### `GET /api/history`
Retrieves video processing history.

### `GET /api/comics`
Fetches recent generated comics with full panel data.

### `GET /api/storyboard/[id]`
Gets a specific storyboard with all panels.

## Project Structure

```
frontend/
├── app/
│   ├── api/              # Next.js API routes
│   │   ├── jetski/       # Main pipeline endpoint
│   │   ├── history/      # Video history
│   │   ├── comics/       # Recent comics
│   │   └── storyboard/   # Individual storyboard
│   ├── history/          # History page
│   ├── page.tsx          # Main page
│   └── layout.tsx        # Root layout
├── lib/
│   ├── agents/           # AI agent logic (TypeScript)
│   │   ├── transcript.ts # YouTube transcript extraction
│   │   ├── highlight.ts  # Viral moment detection
│   │   ├── storyboard.ts # 6-panel comic generation
│   │   ├── image.ts      # Comic image generation
│   │   └── metadata.ts   # Video metadata extraction
│   └── supabase/         # Database client and helpers
│       ├── client.ts     # Supabase client
│       └── db.ts         # Database functions
├── types/
│   └── index.ts          # TypeScript type definitions
└── .env.local            # Environment variables
```

## Environment Variables

### Required Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public, client-safe)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public, client-safe)
- `OPENAI_API_KEY` - OpenAI API key (server-side only, never exposed to client)
- `GOOGLE_API_KEY` - Google Gemini API key (server-side only, never exposed to client)

### Optional Variables

- `COMIC_STYLE` - Comic style preset (default: "manga-vintage")

## Cost Estimates

### Per Comic Generation

- **Transcript Extraction**: Free (via youtube-transcript)
- **Viral Analysis (GPT-4o-mini)**: ~$0.01
- **Storyboard (GPT-4o-mini)**: ~$0.01
- **Images (Gemini 2.0 Flash, 6 panels)**: ~$0.24
- **Total**: ~$0.26 per comic

### Time Estimates

- Without images: ~30 seconds
- With images: ~2 minutes

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import project to Vercel:
```bash
vercel
```

3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `GOOGLE_API_KEY`

4. Deploy:
```bash
vercel --prod
```

## Troubleshooting

### "Invalid YouTube URL"
- Ensure the URL is a valid YouTube video link
- Supported formats: `youtube.com/watch?v=...`, `youtu.be/...`

### "No transcript available"
- The video must have captions/transcripts enabled
- Try a different video with captions

### "Failed to generate images"
- Check your Google API key is valid
- Ensure you have sufficient API quota
- Verify the API key has Gemini access enabled

### "Failed to save to database"
- Verify Supabase credentials are correct
- Check that database tables exist (run migrations if needed)
- Ensure RLS policies allow insertions

## Development

### Running Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Legacy Backend

The original Python FastAPI backend has been moved to `/legacy/` folder for reference. It is no longer needed as all functionality has been ported to Next.js API routes.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
