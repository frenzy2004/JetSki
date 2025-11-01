/*
  # JetSki Database Schema - Complete Setup

  ## Overview
  Creates all necessary tables for the YouTube-to-Comic pipeline with proper relationships,
  constraints, and Row Level Security policies.

  ## New Tables

  ### 1. `videos`
  Stores YouTube video information and processing metadata
  - `id` (uuid, primary key) - Unique identifier
  - `video_id` (text, unique) - YouTube video ID
  - `video_url` (text) - Full YouTube URL
  - `title` (text) - Video title
  - `duration` (integer) - Video duration in seconds
  - `channel_name` (text) - YouTube channel name
  - `thumbnail_url` (text) - Video thumbnail URL
  - `transcript` (text) - Full video transcript
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. `viral_segments`
  Stores detected viral moments from video analysis
  - `id` (uuid, primary key) - Unique identifier
  - `video_id` (uuid, foreign key) - Reference to videos table
  - `rank` (integer) - Segment ranking (1-3)
  - `score` (integer) - Viral score (0-100)
  - `hook` (text) - Catchy title/hook line
  - `summary` (text) - Detailed explanation
  - `viral_type` (text) - Type of viral content (emotional quote, controversy, etc.)
  - `start_time` (text) - Timestamp start (MM:SS format)
  - `end_time` (text) - Timestamp end (MM:SS format)
  - `excerpt` (text) - Key quote or excerpt
  - `is_selected` (boolean) - Whether AI selected this segment
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `storyboards`
  Stores 6-panel comic storyboard data
  - `id` (uuid, primary key) - Unique identifier
  - `video_id` (uuid, foreign key) - Reference to videos table
  - `segment_id` (uuid, foreign key) - Reference to viral_segments table
  - `title` (text) - Storyboard title
  - `style` (text) - Visual style (manga/vintage comic)
  - `tone` (text) - Narrative tone
  - `panels` (jsonb) - Array of 6 panel objects with scene descriptions
  - `hashtags` (text[]) - Social media hashtags
  - `posting_strategy` (text) - Social media posting recommendations
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. `comic_panels`
  Stores individual generated comic panel images
  - `id` (uuid, primary key) - Unique identifier
  - `storyboard_id` (uuid, foreign key) - Reference to storyboards table
  - `panel_number` (integer) - Panel position (1-6)
  - `image_url` (text) - Google Drive image URL
  - `image_data` (text) - Base64 encoded image (fallback)
  - `caption` (text) - Panel caption/dialogue
  - `scene_description` (text) - Detailed scene description
  - `generation_prompt` (text) - Prompt used for image generation
  - `created_at` (timestamptz) - Record creation timestamp

  ### 5. `generated_comics`
  Stores complete comic generation results and metadata
  - `id` (uuid, primary key) - Unique identifier
  - `storyboard_id` (uuid, foreign key) - Reference to storyboards table
  - `google_doc_url` (text) - Generated Google Doc summary URL
  - `drive_folder_url` (text) - Google Drive folder URL with all panels
  - `generation_time_seconds` (numeric) - Total processing time
  - `cost_estimate` (numeric) - Estimated API cost
  - `status` (text) - Generation status (success, failed, pending)
  - `error_message` (text) - Error details if failed
  - `created_at` (timestamptz) - Record creation timestamp

  ### 6. `processing_metrics`
  Tracks performance metrics for each pipeline step
  - `id` (uuid, primary key) - Unique identifier
  - `video_id` (uuid, foreign key) - Reference to videos table
  - `step_name` (text) - Pipeline step identifier
  - `duration_seconds` (numeric) - Step execution time
  - `success` (boolean) - Whether step succeeded
  - `error_message` (text) - Error details if failed
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - All tables have RLS enabled
  - Public read access for demonstration (adjust for production)
  - Insert/update restricted to authenticated users in production

  ## Indexes
  - Foreign key indexes for efficient joins
  - Timestamp indexes for chronological queries
  - Video ID index for quick lookups
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: videos
-- =====================================================
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id text UNIQUE NOT NULL,
  video_url text NOT NULL,
  title text DEFAULT '',
  duration integer,
  channel_name text,
  thumbnail_url text,
  transcript text,
  created_at timestamptz DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_videos_video_id ON videos(video_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Public read access (adjust for production)
CREATE POLICY "Public can view videos"
  ON videos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =====================================================
-- TABLE: viral_segments
-- =====================================================
CREATE TABLE IF NOT EXISTS viral_segments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  rank integer NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  hook text NOT NULL,
  summary text,
  viral_type text,
  start_time text,
  end_time text,
  excerpt text,
  is_selected boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_viral_segments_video_id ON viral_segments(video_id);
CREATE INDEX IF NOT EXISTS idx_viral_segments_selected ON viral_segments(is_selected) WHERE is_selected = true;

-- Enable RLS
ALTER TABLE viral_segments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view viral segments"
  ON viral_segments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert viral segments"
  ON viral_segments FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =====================================================
-- TABLE: storyboards
-- =====================================================
CREATE TABLE IF NOT EXISTS storyboards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  segment_id uuid NOT NULL REFERENCES viral_segments(id) ON DELETE CASCADE,
  title text NOT NULL,
  style text DEFAULT 'manga-vintage',
  tone text,
  panels jsonb NOT NULL,
  hashtags text[],
  posting_strategy text,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_storyboards_video_id ON storyboards(video_id);
CREATE INDEX IF NOT EXISTS idx_storyboards_segment_id ON storyboards(segment_id);

-- Enable RLS
ALTER TABLE storyboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view storyboards"
  ON storyboards FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert storyboards"
  ON storyboards FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =====================================================
-- TABLE: comic_panels
-- =====================================================
CREATE TABLE IF NOT EXISTS comic_panels (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  storyboard_id uuid NOT NULL REFERENCES storyboards(id) ON DELETE CASCADE,
  panel_number integer NOT NULL CHECK (panel_number >= 1 AND panel_number <= 6),
  image_url text,
  image_data text,
  caption text,
  scene_description text,
  generation_prompt text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(storyboard_id, panel_number)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_comic_panels_storyboard_id ON comic_panels(storyboard_id);
CREATE INDEX IF NOT EXISTS idx_comic_panels_panel_number ON comic_panels(storyboard_id, panel_number);

-- Enable RLS
ALTER TABLE comic_panels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view comic panels"
  ON comic_panels FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert comic panels"
  ON comic_panels FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =====================================================
-- TABLE: generated_comics
-- =====================================================
CREATE TABLE IF NOT EXISTS generated_comics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  storyboard_id uuid NOT NULL REFERENCES storyboards(id) ON DELETE CASCADE,
  google_doc_url text,
  drive_folder_url text,
  generation_time_seconds numeric,
  cost_estimate numeric DEFAULT 0.25,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_generated_comics_storyboard_id ON generated_comics(storyboard_id);
CREATE INDEX IF NOT EXISTS idx_generated_comics_status ON generated_comics(status);
CREATE INDEX IF NOT EXISTS idx_generated_comics_created_at ON generated_comics(created_at DESC);

-- Enable RLS
ALTER TABLE generated_comics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view generated comics"
  ON generated_comics FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert generated comics"
  ON generated_comics FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update generated comics"
  ON generated_comics FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- TABLE: processing_metrics
-- =====================================================
CREATE TABLE IF NOT EXISTS processing_metrics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  step_name text NOT NULL,
  duration_seconds numeric,
  success boolean DEFAULT true,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_processing_metrics_video_id ON processing_metrics(video_id);
CREATE INDEX IF NOT EXISTS idx_processing_metrics_step_name ON processing_metrics(step_name);

-- Enable RLS
ALTER TABLE processing_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view processing metrics"
  ON processing_metrics FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert processing metrics"
  ON processing_metrics FOR INSERT
  TO authenticated
  WITH CHECK (true);
