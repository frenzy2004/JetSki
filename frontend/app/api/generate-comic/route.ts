import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import mime from 'mime';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'placeholder-key-for-build',
});

export async function POST(request: NextRequest) {
  try {
    const { panels } = await request.json();

    if (!panels || !Array.isArray(panels)) {
      return NextResponse.json(
        { error: 'panels array is required' },
        { status: 400 }
      );
    }

    console.log(`🎨 Generating ${panels.length} comic panels with NanoBanana (Gemini 2.5 Flash Image)...`);

    const generatedPanels = [];
    const model = 'gemini-2.5-flash-image';

    // Generate all panels in parallel for speed
    const panelPromises = panels.map(async (panel) => {
      console.log(`🖼️  Generating panel ${panel.panel_number}...`);

      // Special 4-panel grid layout for panel 3
      const isGridPanel = panel.panel_number === 3;

      // Craft a comic-style prompt optimized for Gemini image generation
      const comicPrompt = isGridPanel
        ? `Generate a comic panel with a 4-PANEL GRID LAYOUT (2x2 grid showing 4 different mini-scenes):

📖 PANEL ${panel.panel_number} - MULTI-SCENE GRID:
OVERALL THEME: ${panel.visual_description}
CHARACTERS: ${panel.character_details}
MOOD: ${panel.mood}
CAPTION/DIALOGUE: "${panel.caption}"

🎨 VISUAL STYLE:
- Classic American comic book art style (1960s-1980s Silver/Bronze Age)
- CINEMATIC COMPOSITION: Mix of dramatic wide shots and intense close-ups
- DRAMATIC LIGHTING: High contrast with deep shadows and vibrant highlights
- Bold black borders separating each mini-panel in the 2x2 grid
- Each mini-panel should flow together to tell the story sequentially

🎨 COLOR PALETTE:
- Rich, saturated colors: vibrant golds, oranges, reds for intensity
- Mood-appropriate palette for ${panel.mood}
- Vintage comic book color printing aesthetic
- High contrast between light and shadow areas

💬 DIALOGUE:
- Each of the 4 mini-panels has its own speech bubble or dialogue text
- Break up the main caption/dialogue across all 4 mini-panels naturally
- Clear, bold lettering in speech bubbles within each mini-panel
- Text should be readable and integrate seamlessly with the art

📐 LAYOUT:
- Professional comic grid layout with clear separation between mini-panels
- Top-left → top-right → bottom-left → bottom-right reading flow
- Each mini-panel shows different moments/angles of the narrative
- Thick black panel borders for classic comic aesthetic

Example flow: Top-left (wide establishing shot with dialogue), top-right (character close-up reaction), bottom-left (dramatic action moment), bottom-right (emotional conclusion)`
        : `Generate a single comic book panel in classic comic art style:

📖 PANEL ${panel.panel_number}:
SCENE: ${panel.visual_description}
CHARACTERS: ${panel.character_details}
MOOD: ${panel.mood}
COMPOSITION: ${panel.composition}

💬 SPEECH BUBBLE TEXT: "${panel.caption}"

🎨 VISUAL STYLE:
- Classic American comic book art style (1960s-1980s Silver/Bronze Age)
- CINEMATIC COMPOSITION: ${panel.composition} - treat this like a movie frame
- DRAMATIC LIGHTING: High contrast, deep shadows, vibrant highlights
- Bold black ink outlines and clear, confident line work
- Professional comic panel layout with thick black border frame

🎨 COLOR PALETTE:
- Rich, saturated colors: vibrant golds, oranges, reds, blues
- Mood-appropriate colors for ${panel.mood} atmosphere
- Vintage comic book color printing aesthetic with halftone texture
- High contrast between foreground and background elements
- Dynamic use of light and shadow to enhance drama

💬 DIALOGUE INTEGRATION:
- Speech bubble with caption text clearly visible and readable
- Clear, bold comic book lettering style
- Speech bubble positioned naturally within composition
- Text integrates seamlessly with the artwork

🎬 CINEMATOGRAPHY:
- Treat composition like a dramatic film shot
- Use perspective and depth to create visual impact
- Dynamic angles that enhance the emotional tone
- Balance between character focus and environmental storytelling
- Vintage comic book aesthetic with modern visual polish`;

      try {
        const config: any = {
          responseModalities: ['IMAGE'],
          imageConfig: {
            imageSize: '1K',
          },
        };

        const contents = [
          {
            role: 'user' as const,
            parts: [
              {
                text: comicPrompt,
              },
            ],
          },
        ];

        const response = await ai.models.generateContentStream({
          model,
          config,
          contents,
        });

        let imageBase64: string | null = null;
        let mimeType: string | null = null;

        for await (const chunk of response) {
          if (
            chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData
          ) {
            const inlineData = chunk.candidates[0].content.parts[0].inlineData;
            imageBase64 = inlineData.data || null;
            mimeType = inlineData.mimeType || 'image/png';
            break; // Got the image, stop streaming
          }
        }

        if (imageBase64 && mimeType) {
          console.log(`✅ Panel ${panel.panel_number} generated`);
          return {
            panel_number: panel.panel_number,
            image_base64: imageBase64,
            mime_type: mimeType,
            caption: panel.caption,
            visual_description: panel.visual_description,
          };
        } else {
          console.error(`❌ No image data for panel ${panel.panel_number}`);
          return {
            panel_number: panel.panel_number,
            error: 'No image data received',
            caption: panel.caption,
            visual_description: panel.visual_description,
          };
        }
      } catch (imageError: any) {
        console.error(`❌ Failed to generate panel ${panel.panel_number}:`, imageError.message);
        return {
          panel_number: panel.panel_number,
          error: imageError.message,
          caption: panel.caption,
          visual_description: panel.visual_description,
        };
      }
    });

    // Wait for all panels to generate in parallel
    generatedPanels.push(...(await Promise.all(panelPromises)));

    const successfulPanels = generatedPanels.filter(p => p.image_base64).length;
    console.log(`✅ Generated ${successfulPanels}/${panels.length} panels successfully`);

    return NextResponse.json({
      success: true,
      panels: generatedPanels,
      total_panels: panels.length,
      successful_panels: successfulPanels,
    });
  } catch (error: any) {
    console.error('❌ Comic generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate comic panels' },
      { status: 500 }
    );
  }
}
