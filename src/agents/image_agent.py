import os
import json
from google import genai
from PIL import Image
from io import BytesIO
import base64

# Initialize Google Gemini client
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_comic_panels(storyboard_data: dict):
    """
    Generates 6 comic panel images using Google Gemini 2.5 Flash Image (NanoBanana).
    Maintains character consistency across all panels.

    Returns list of image data (base64 encoded) for each panel.
    """
    panels = storyboard_data.get("panels", [])
    style = storyboard_data.get("style", "modern editorial comic, bold lines, vibrant colors")
    title = storyboard_data.get("title", "Comic Story")

    generated_images = []

    # Extract character details from first panel for consistency
    character_reference = panels[0].get("character_details", "") if panels else ""

    print(f"🎨 Generating comic panels for: {title}")
    print(f"📐 Style: {style}")

    for i, panel in enumerate(panels):
        panel_num = panel.get("panel_number", i + 1)
        scene = panel.get("scene_description", "")
        character = panel.get("character_details", character_reference)
        action = panel.get("action", "")
        caption = panel.get("caption", "")
        visual_style = panel.get("visual_style", "")
        composition = panel.get("composition", "wide shot")

        # Build comprehensive prompt for NanoBanana
        prompt = f"""
A single comic book panel in a {style} style.

COMPOSITION: {composition}
SCENE: {scene}
CHARACTERS: {character}
ACTION: {action}
VISUAL STYLE: {visual_style}

CONSISTENT CHARACTER DESIGN (important - use this reference for all panels):
{character_reference}

TEXT CAPTION (overlay at bottom): "{caption}"

Panel {panel_num} of 6. Comic book panel with clear borders, professional comic art quality.
Maintain visual consistency with previous panels for character appearance.
"""

        try:
            print(f"  → Generating Panel {panel_num}/6...")

            response = client.models.generate_content(
                model="gemini-2.5-flash-image",
                contents=prompt
            )

            # Extract image from response
            # Note: Gemini returns image in response.parts
            if response.parts:
                for part in response.parts:
                    if hasattr(part, 'inline_data'):
                        # Image is returned as inline data
                        image_data = part.inline_data.data
                        mime_type = part.inline_data.mime_type

                        generated_images.append({
                            "panel_number": panel_num,
                            "caption": caption,
                            "image_base64": base64.b64encode(image_data).decode('utf-8'),
                            "mime_type": mime_type,
                            "prompt_used": prompt
                        })

                        print(f"  ✅ Panel {panel_num} generated successfully")
                        break
            else:
                print(f"  ⚠️  Panel {panel_num} - No image returned")
                generated_images.append({
                    "panel_number": panel_num,
                    "caption": caption,
                    "error": "No image data received from API"
                })

        except Exception as e:
            print(f"  ❌ Panel {panel_num} failed: {str(e)}")
            generated_images.append({
                "panel_number": panel_num,
                "caption": caption,
                "error": str(e)
            })

    result = {
        "title": title,
        "style": style,
        "total_panels": len(panels),
        "generated_panels": generated_images,
        "success_count": sum(1 for img in generated_images if "image_base64" in img)
    }

    print(f"\n✨ Generated {result['success_count']}/{len(panels)} panels successfully")

    return result


def save_panel_image(image_data: dict, output_path: str):
    """
    Saves a single panel image to disk.
    """
    if "image_base64" not in image_data:
        raise ValueError(f"No image data found for panel {image_data.get('panel_number')}")

    # Decode base64 image
    image_bytes = base64.b64decode(image_data["image_base64"])

    # Save using PIL
    image = Image.open(BytesIO(image_bytes))
    image.save(output_path)

    print(f"💾 Saved panel {image_data.get('panel_number')} to {output_path}")

    return output_path
