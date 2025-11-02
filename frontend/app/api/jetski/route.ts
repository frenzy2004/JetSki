import { NextRequest, NextResponse } from 'next/server';
import { getYouTubeTranscript } from '@/lib/youtube';
import { callGPT } from '@/lib/openai';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { video_url, generate_images = false } = await request.json();

    if (!video_url) {
      return NextResponse.json(
        { error: 'video_url is required' },
        { status: 400 }
      );
    }

    console.log('🚤 Starting JetSki pipeline for:', video_url);

    // STEP 1: Get transcript
    console.log('📝 Step 1: Extracting transcript...');
    const transcriptStart = Date.now();
    const transcript = await getYouTubeTranscript(video_url);
    const transcriptTime = Date.now() - transcriptStart;
    console.log(`✅ Transcript extracted (${transcriptTime}ms, ${transcript.split(' ').length} words)`);

    // STEP 2: Find viral moments
    console.log('🔍 Step 2: Analyzing viral moments...');
    const viralStart = Date.now();
    
    const viralSystemPrompt = `You are a viral content analyst. Return JSON:
{
  "segments": [
    {
      "rank": 1,
      "score": 95,
      "excerpt": "quote",
      "timestamps": "time range",
      "viral_type": "emotional/quotable/surprising",
      "reason": "why viral"
    }
  ],
  "selected": { best segment }
}`;

    const viralUserPrompt = `Find 3 most viral moments in this transcript:

${transcript.substring(0, 8000)}`;

    const viralAnalysis = await callGPT(viralSystemPrompt, viralUserPrompt, 0.7);
    const viralTime = Date.now() - viralStart;
    console.log(`✅ Found ${viralAnalysis.segments.length} viral moments (${viralTime}ms)`);

    // STEP 3: Generate storyboard
    console.log('🎬 Step 3: Generating 6-panel storyboard...');
    const storyboardStart = Date.now();

    const storyboardSystemPrompt = `You are a comic storyboard artist. Return JSON:
{
  "title": "title",
  "panels": [
    {
      "panel_number": 1,
      "caption": "text",
      "visual_description": "scene",
      "character_details": "who & expression",
      "composition": "framing",
      "mood": "tone"
    }
  ]
}
Create exactly 6 panels.`;

    const storyboardUserPrompt = `Create 6-panel comic for:
"${viralAnalysis.selected.excerpt}"
Type: ${viralAnalysis.selected.viral_type}`;

    const storyboard = await callGPT(storyboardSystemPrompt, storyboardUserPrompt, 0.8);
    const storyboardTime = Date.now() - storyboardStart;
    console.log(`✅ Storyboard created (${storyboardTime}ms)`);

    // STEP 4: Generate comic images (if requested)
    let comicImages = null;
    let imageGenerationTime = 0;

    if (generate_images) {
      console.log('🎨 Step 4: Generating comic panel images...');
      const imageStart = Date.now();

      try {
        const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/generate-comic`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ panels: storyboard.panels }),
        });

        if (imageResponse.ok) {
          comicImages = await imageResponse.json();
          imageGenerationTime = Date.now() - imageStart;
          console.log(`✅ Generated ${comicImages.successful_panels}/${comicImages.total_panels} images (${imageGenerationTime}ms)`);
        } else {
          console.error('❌ Image generation failed:', await imageResponse.text());
        }
      } catch (imageError: any) {
        console.error('❌ Image generation error:', imageError.message);
      }
    }

    const totalTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      video_url,
      viral_analysis: viralAnalysis,
      storyboard: storyboard,
      comic_images: comicImages,
      metrics: {
        total_time_seconds: totalTime / 1000,
        transcript_time: transcriptTime,
        viral_analysis_time: viralTime,
        storyboard_time: storyboardTime,
        image_generation_time: imageGenerationTime
      }
    });
  } catch (error: any) {
    console.error('❌ Pipeline error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Pipeline failed',
        detail: error.stack
      },
      { status: 500 }
    );
  }
}

