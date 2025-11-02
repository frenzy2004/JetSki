import { NextRequest, NextResponse } from 'next/server';
import { callGPT } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();

    if (!transcript) {
      return NextResponse.json(
        { error: 'transcript is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a viral content analyst. Analyze transcripts and identify the most engaging moments for social media.

Return JSON with this structure:
{
  "segments": [
    {
      "rank": 1,
      "score": 95,
      "excerpt": "quote from transcript",
      "timestamps": "estimated time range",
      "viral_type": "emotional/surprising/quotable/controversial",
      "reason": "why this will go viral"
    }
  ],
  "selected": { same structure as best segment }
}

Return top 3 segments ranked by viral potential (score 0-100).`;

    const userPrompt = `Analyze this video transcript and find the 3 most viral moments:

${transcript.substring(0, 8000)}

Focus on:
- Emotional hooks (surprise, humor, inspiration)
- Quotable one-liners
- Controversial or debate-worthy statements
- Storytelling peaks
- Unexpected reveals`;

    const result = await callGPT(systemPrompt, userPrompt, 0.7);

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('Viral analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze viral moments' },
      { status: 500 }
    );
  }
}

