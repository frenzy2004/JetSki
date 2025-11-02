import { NextRequest, NextResponse } from 'next/server';
import { callGPT } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { segment } = await request.json();

    if (!segment) {
      return NextResponse.json(
        { error: 'segment is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a comic book storyboard artist. Convert viral moments into 6-panel comic storyboards.

Return JSON with this structure:
{
  "title": "catchy title",
  "panels": [
    {
      "panel_number": 1,
      "caption": "text that appears in comic",
      "visual_description": "detailed scene description",
      "character_details": "who appears and their expression",
      "composition": "camera angle, framing",
      "mood": "tone of the panel"
    }
  ]
}

Create exactly 6 panels that tell a complete story with:
- Strong visual narrative
- Clear beginning, middle, end
- Emotional progression
- Comic book aesthetic`;

    const userPrompt = `Create a 6-panel comic storyboard for this viral moment:

EXCERPT: "${segment.excerpt}"
WHY IT'S VIRAL: ${segment.reason}
TYPE: ${segment.viral_type}

Make it:
- Visually compelling
- Easy to understand without audio
- Shareable on social media
- True to the original content`;

    const result = await callGPT(systemPrompt, userPrompt, 0.8);

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('Storyboard generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate storyboard' },
      { status: 500 }
    );
  }
}

