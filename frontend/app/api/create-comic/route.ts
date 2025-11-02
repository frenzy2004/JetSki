import { NextRequest, NextResponse } from 'next/server';
import { callGPT } from '@/lib/openai';

// Step 2: Generate storyboard and comic from selected viral moment
export async function POST(request: NextRequest) {
  try {
    const { selected_moment, generate_images = true } = await request.json();

    if (!selected_moment) {
      return NextResponse.json(
        { error: 'selected_moment is required' },
        { status: 400 }
      );
    }

    console.log('🎬 Creating comic for selected moment...');
    const startTime = Date.now();

    // STEP 1: Generate storyboard
    console.log('🎨 Generating 6-panel storyboard...');
    const storyboardStart = Date.now();

    const storyboardSystemPrompt = `You are a comic book storyboard artist. Convert viral moments into 6-panel comic storyboards.

Return JSON with this structure:
{
  "title": "catchy comic title",
  "style": "comic style (e.g., vintage, modern, manga)",
  "tone": "tone of the story",
  "panels": [
    {
      "panel_number": 1,
      "caption": "text that appears in the comic",
      "visual_description": "detailed scene description for image generation",
      "character_details": "who appears and their expression/emotion",
      "composition": "camera angle and framing (wide shot, close-up, etc.)",
      "mood": "emotional tone of this specific panel"
    }
  ]
}

Create exactly 6 panels that tell a complete story with:
- Strong visual narrative arc
- Clear beginning, middle, climax, and end
- Emotional progression
- Classic comic book aesthetic
- Speech bubbles with punchy dialogue`;

    const storyboardUserPrompt = `Create a 6-panel comic storyboard for this viral moment:

TITLE: "${selected_moment.title}"
EXCERPT: "${selected_moment.excerpt}"
WHY IT'S VIRAL: ${selected_moment.reason}
TYPE: ${selected_moment.viral_type}

Make it:
- Visually compelling and dramatic
- Easy to understand without audio
- Shareable on social media (Instagram carousel format)
- True to the original message
- Emotionally resonant`;

    const storyboard = await callGPT(storyboardSystemPrompt, storyboardUserPrompt, 0.8);
    const storyboardTime = Date.now() - storyboardStart;
    console.log(`✅ Storyboard created (${storyboardTime}ms)`);

    // STEP 2: Review storyboard for coherence
    console.log('🔍 Reviewing storyboard coherence...');
    const reviewStart = Date.now();

    const reviewSystemPrompt = `You are a comic storyboard quality reviewer. Review the storyboard for narrative coherence, visual flow, and character consistency.

Return JSON with this structure:
{
  "isCoherent": true,
  "overallScore": 95,
  "recommendation": "proceed",
  "panelReviews": [
    {
      "panelNumber": 1,
      "contextClarity": "pass",
      "characterConsistency": "pass",
      "visualFlow": "pass",
      "narrativeCoherence": "pass",
      "notes": "Optional brief note if needed"
    }
  ],
  "strengths": ["strength 1", "strength 2"],
  "suggestions": ["optional suggestion if needed"]
}

Check each panel for:
- Context clarity: Can viewers understand what's happening?
- Character consistency: Are characters consistent across panels?
- Visual flow: Does the visual narrative flow smoothly?
- Narrative coherence: Does the story make sense panel-to-panel?

Return "pass" for each check if it's good. Only include suggestions if there are minor improvements.`;

    const reviewUserPrompt = `Review this 6-panel comic storyboard:

TITLE: "${storyboard.title}"
STYLE: ${storyboard.style}
TONE: ${storyboard.tone}

PANELS:
${storyboard.panels.map((p: any) => `
Panel ${p.panel_number}:
- Caption: "${p.caption}"
- Visual: ${p.visual_description}
- Characters: ${p.character_details}
- Mood: ${p.mood}
`).join('\n')}

Provide a comprehensive coherence review.`;

    const coherenceReview = await callGPT(reviewSystemPrompt, reviewUserPrompt, 0.3);
    const reviewTime = Date.now() - reviewStart;
    console.log(`✅ Coherence review completed (${reviewTime}ms)`);

    // STEP 3: Generate comic images (if requested)
    let comicImages = null;
    let imageGenerationTime = 0;

    if (generate_images) {
      console.log('🎨 Generating comic panel images with NanoBanana...');
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

    // STEP 4: Generate comprehensive breakdown summary
    console.log('📝 Generating comic breakdown summary...');
    const summaryStart = Date.now();

    const summarySystemPrompt = `You are a content strategist writing a comprehensive breakdown of a comic strip. Create a detailed summary that includes context, viral potential, and panel-by-panel analysis.

Return JSON with this structure:
{
  "context": "Brief context about the topic/story (2-3 sentences)",
  "viralPotential": "Why this comic has viral potential (2-3 sentences)",
  "panelBreakdown": [
    {
      "panelNumber": 1,
      "title": "Short title for this panel",
      "visualDescription": "Detailed description of what's shown (2-3 sentences)",
      "dialogueCaption": "The exact caption/dialogue",
      "narrativePurpose": "Why this panel matters to the story"
    }
  ],
  "keyThemes": ["theme 1", "theme 2", "theme 3"],
  "targetAudience": "Who this comic appeals to"
}`;

    const summaryUserPrompt = `Create a comprehensive breakdown for this comic:

VIRAL MOMENT:
Title: "${selected_moment.title}"
Excerpt: "${selected_moment.excerpt}"
Why it's viral: ${selected_moment.reason}

STORYBOARD:
Title: "${storyboard.title}"
Style: ${storyboard.style}
Tone: ${storyboard.tone}

PANELS:
${storyboard.panels.map((p: any) => `
Panel ${p.panel_number}:
- Caption: "${p.caption}"
- Visual: ${p.visual_description}
- Characters: ${p.character_details}
- Mood: ${p.mood}
`).join('\n')}

Provide a detailed breakdown that explains the story, viral potential, and each panel's contribution.`;

    const comicSummary = await callGPT(summarySystemPrompt, summaryUserPrompt, 0.7);
    const summaryTime = Date.now() - summaryStart;
    console.log(`✅ Comic summary generated (${summaryTime}ms)`);

    const totalTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      selected_moment,
      storyboard,
      coherence_review: coherenceReview,
      comic_images: comicImages,
      comic_summary: comicSummary,
      metrics: {
        total_time_seconds: totalTime / 1000,
        storyboard_time: storyboardTime,
        review_time: reviewTime,
        image_generation_time: imageGenerationTime,
        summary_time: summaryTime
      }
    });

  } catch (error: any) {
    console.error('❌ Comic creation error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to create comic',
        detail: error.stack
      },
      { status: 500 }
    );
  }
}
