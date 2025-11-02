import { NextRequest, NextResponse } from 'next/server';
import { getYouTubeTranscript } from '@/lib/youtube';
import { callGPT } from '@/lib/openai';

// Step 1: Analyze video and return 3 viral moment options
export async function POST(request: NextRequest) {
  try {
    const { video_url, manual_transcript } = await request.json();

    if (!video_url && !manual_transcript) {
      return NextResponse.json(
        { error: 'video_url or manual_transcript is required' },
        { status: 400 }
      );
    }

    console.log('🚤 Starting video analysis for:', video_url || 'manual transcript');

    // STEP 1: Get transcript
    let transcript: string;

    if (manual_transcript) {
      console.log('📝 Using manual transcript...');
      transcript = manual_transcript;
      console.log(`✅ Manual transcript provided (${transcript.split(' ').length} words)`);
    } else {
      console.log('📝 Extracting transcript...');
      transcript = await getYouTubeTranscript(video_url);
      console.log(`✅ Transcript extracted (${transcript.split(' ').length} words)`);
    }

    // STEP 2: Find 3 viral moments (DO NOT auto-select)
    console.log('🔍 Analyzing viral moments...');

    const viralSystemPrompt = `You are a viral content analyst. Analyze the transcript and find exactly 3 viral moments.

Return JSON in this exact format:
{
  "segments": [
    {
      "rank": 1,
      "score": 95,
      "title": "Short catchy title",
      "excerpt": "The actual quote or key excerpt from transcript",
      "timestamps": "0:00 - 2:30",
      "viral_type": "emotional/quotable/surprising/controversial",
      "reason": "Why this moment will go viral - be specific"
    }
  ]
}

IMPORTANT: Return exactly 3 segments, ranked by viral potential.`;

    const viralUserPrompt = `Find the 3 most viral moments in this transcript:

${transcript.substring(0, 12000)}

Prioritize:
- Quotable one-liners
- Emotional peaks
- Surprising revelations
- Controversial statements
- Universal truths`;

    const viralAnalysis = await callGPT(viralSystemPrompt, viralUserPrompt, 0.7);

    console.log(`✅ Found ${viralAnalysis.segments?.length || 0} viral moments`);

    // Return the analysis WITHOUT generating storyboard yet
    return NextResponse.json({
      success: true,
      video_url,
      transcript_length: transcript.split(' ').length,
      viral_moments: viralAnalysis.segments || [],
      message: 'Video analyzed! Pick a viral moment to create your comic.'
    });

  } catch (error: any) {
    console.error('❌ Video analysis error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to analyze video',
        detail: error.stack
      },
      { status: 500 }
    );
  }
}
