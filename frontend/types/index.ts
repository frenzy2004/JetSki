export interface VideoRequest {
  video_url: string;
  generate_images?: boolean;
  create_google_doc?: boolean;
}

export interface ViralSegment {
  rank: number;
  score: number;
  start_time: string;
  end_time: string;
  viral_type: string;
  hook: string;
  summary: string;
  transcript_excerpt: string;
}

export interface ViralAnalysis {
  segments: ViralSegment[];
  selected: {
    rank: number;
    reason: string;
  };
}

export interface ComicPanel {
  panel_number: number;
  scene_description: string;
  character_details: string;
  action: string;
  caption: string;
  visual_style: string;
  composition: string;
}

export interface Storyboard {
  title: string;
  style: string;
  tone: string;
  panels: ComicPanel[];
  narrative_arc: string;
  hashtags: string[];
  posting_tip: string;
}

export interface GeneratedPanel {
  panel_number: number;
  caption: string;
  image_base64?: string;
  mime_type?: string;
  prompt_used?: string;
  error?: string;
}

export interface ImageGenerationResult {
  title: string;
  style: string;
  total_panels: number;
  generated_panels: GeneratedPanel[];
  success_count: number;
}

export interface GoogleDocResult {
  doc_id: string;
  doc_url: string;
  drive_folder_url: string;
}

export interface PipelineMetrics {
  total_time_seconds: number;
  transcript_time?: number;
  viral_analysis_time?: number;
  storyboard_time?: number;
  image_generation_time?: number;
}

export interface PipelineResponse {
  video_url: string;
  video_title: string;
  viral_analysis: ViralAnalysis;
  storyboard: Storyboard;
  images?: ImageGenerationResult;
  google_doc?: GoogleDocResult;
  status: string;
  metrics?: PipelineMetrics;
}

export interface VideoRecord {
  id: string;
  video_url: string;
  video_title: string;
  video_duration?: number;
  channel_name?: string;
  selected_segment_rank: number;
  selected_segment_score: number;
  viral_type: string;
  processing_status: string;
  created_at: string;
}

export interface StoryboardRecord {
  id: string;
  video_id: string;
  title: string;
  style: string;
  tone: string;
  narrative_arc: string;
  hashtags: string[];
  posting_tip: string;
  created_at: string;
}

export interface PanelRecord {
  id: string;
  storyboard_id: string;
  panel_number: number;
  scene_description: string;
  character_details: string;
  action: string;
  caption: string;
  visual_style: string;
  composition: string;
  image_url?: string;
  image_base64?: string;
  mime_type?: string;
  prompt_used?: string;
  created_at: string;
}

export interface ComicWithPanels extends StoryboardRecord {
  panels: PanelRecord[];
  video: VideoRecord;
}
