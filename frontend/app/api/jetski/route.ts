import { NextRequest, NextResponse } from 'next/server';
import { getTranscript } from '@/lib/agents/transcript';
import { getVideoMetadata } from '@/lib/agents/metadata';
import { findViralMoments } from '@/lib/agents/highlight';
import { generateStoryboard } from '@/lib/agents/storyboard';
import { generateComicPanels } from '@/lib/agents/image';
import { saveVideoRecord, saveStoryboard, savePanels } from '@/lib/supabase/db';
import { VideoRequest, PipelineResponse } from '@/types';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: VideoRequest = await request.json();
    const { video_url, generate_images = true, create_google_doc = false } = body;

    if (!video_url) {
      return NextResponse.json(
        { error: 'video_url is required' },
        { status: 400 }
      );
    }

    console.log('🚤 Starting JetSki pipeline for:', video_url);

    const transcriptStart = Date.now();
    console.log('📝 Step 1: Extracting transcript...');
    const transcript = await getTranscript(video_url);
    const transcriptTime = Date.now() - transcriptStart;
    console.log(`✅ Transcript extracted (${transcriptTime}ms)`);

    console.log('📺 Step 2: Fetching video metadata...');
    const metadata = await getVideoMetadata(video_url);
    console.log(`✅ Metadata fetched: ${metadata.title}`);

    const viralStart = Date.now();
    console.log('🔍 Step 3: Analyzing viral moments...');
    const viralAnalysis = await findViralMoments(transcript);
    const viralTime = Date.now() - viralStart;
    console.log(`✅ Found ${viralAnalysis.segments.length} viral moments (${viralTime}ms)`);

    const selectedSegment = viralAnalysis.segments.find(
      (s) => s.rank === viralAnalysis.selected.rank
    );

    if (!selectedSegment) {
      throw new Error('No viral segment selected');
    }

    const storyboardStart = Date.now();
    console.log('🎬 Step 4: Generating storyboard...');
    const storyboard = await generateStoryboard(selectedSegment);
    const storyboardTime = Date.now() - storyboardStart;
    console.log(`✅ Storyboard created with ${storyboard.panels.length} panels (${storyboardTime}ms)`);

    let imageResult;
    let imageTime;
    if (generate_images) {
      const imageStart = Date.now();
      console.log('🎨 Step 5: Generating comic images...');
      imageResult = await generateComicPanels(storyboard);
      imageTime = Date.now() - imageStart;
      console.log(`✅ Generated ${imageResult.success_count}/${imageResult.total_panels} images (${imageTime}ms)`);
    }

    console.log('💾 Step 6: Saving to Supabase...');
    const videoId = await saveVideoRecord({
      video_url,
      video_title: metadata.title,
      channel_name: metadata.channel_name,
      selected_segment_rank: selectedSegment.rank,
      selected_segment_score: selectedSegment.score,
      viral_type: selectedSegment.viral_type
    });

    const storyboardId = await saveStoryboard(videoId, storyboard);
    await savePanels(storyboardId, storyboard.panels, imageResult);
    console.log('✅ Saved to database');

    const totalTime = Date.now() - startTime;

    const response: PipelineResponse = {
      video_url,
      video_title: metadata.title,
      viral_analysis: viralAnalysis,
      storyboard,
      images: imageResult,
      status: 'success',
      metrics: {
        total_time_seconds: totalTime / 1000,
        transcript_time: transcriptTime,
        viral_analysis_time: viralTime,
        storyboard_time: storyboardTime,
        image_generation_time: imageTime
      }
    };

    console.log(`🎉 Pipeline complete! Total time: ${totalTime}ms`);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('❌ Pipeline error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
        detail: error.stack
      },
      { status: 500 }
    );
  }
}
