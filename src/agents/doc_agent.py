"""
Doc Agent - Creates Google Docs summaries with captions and posting strategies
"""

import os
import json
from typing import Dict, List
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from io import BytesIO
import base64


class DocAgent:
    """Agent responsible for creating Google Docs summaries and managing Drive storage"""

    def __init__(self, credentials_path: str = None):
        """
        Initialize the Doc Agent

        Args:
            credentials_path: Path to Google service account JSON credentials
        """
        # Use service account credentials (easier for automation than OAuth)
        if credentials_path is None:
            credentials_path = os.getenv("GOOGLE_SERVICE_ACCOUNT_PATH")

        if credentials_path and os.path.exists(credentials_path):
            self.credentials = service_account.Credentials.from_service_account_file(
                credentials_path,
                scopes=[
                    'https://www.googleapis.com/auth/documents',
                    'https://www.googleapis.com/auth/drive.file'
                ]
            )
            self.docs_service = build('docs', 'v1', credentials=self.credentials)
            self.drive_service = build('drive', 'v3', credentials=self.credentials)
        else:
            print("⚠️  Warning: Google credentials not found. Doc Agent will work in preview mode.")
            self.docs_service = None
            self.drive_service = None

    def create_summary_doc(
        self,
        video_url: str,
        video_title: str,
        viral_analysis: Dict,
        storyboard_data: Dict,
        image_data: List[Dict] = None
    ) -> Dict:
        """
        Create a comprehensive Google Doc with viral segment analysis and posting strategy.

        Args:
            video_url: Original YouTube URL
            video_title: Video title
            viral_analysis: Output from highlight_agent (all 3 segments + selected)
            storyboard_data: Output from storyboard_agent (6-panel breakdown)
            image_data: Output from image_agent (generated comic panels)

        Returns:
            Dict with doc_url, drive_folder_url, and preview
        """
        selected_segment = viral_analysis["segments"][viral_analysis["selected"]["rank"] - 1]

        # Build document content
        doc_title = f"JetSki Comic - {storyboard_data.get('title', 'Untitled')}"

        doc_content = self._build_doc_content(
            video_url=video_url,
            video_title=video_title,
            selected_segment=selected_segment,
            all_segments=viral_analysis["segments"],
            storyboard=storyboard_data,
            selection_reason=viral_analysis["selected"]["reason"]
        )

        if self.docs_service is None:
            # Preview mode - return markdown
            return {
                "doc_url": None,
                "drive_folder_url": None,
                "preview": doc_content,
                "status": "preview_mode",
                "message": "Google credentials not configured. Showing preview only."
            }

        # Create Google Doc
        doc = self.docs_service.documents().create(body={
            'title': doc_title
        }).execute()

        doc_id = doc.get('documentId')

        # Insert content into doc
        self._insert_formatted_content(doc_id, doc_content)

        # Save images to Drive and get folder URL
        folder_url = None
        if image_data:
            folder_url = self.upload_images_to_drive(
                image_data=image_data,
                folder_name=f"JetSki - {storyboard_data.get('title', 'Comic')}"
            )

        doc_url = f"https://docs.google.com/document/d/{doc_id}/edit"

        print(f"📄 Google Doc created: {doc_url}")
        if folder_url:
            print(f"📁 Images saved to Drive: {folder_url}")

        return {
            "doc_url": doc_url,
            "doc_id": doc_id,
            "drive_folder_url": folder_url,
            "preview": doc_content,
            "status": "success"
        }

    def _build_doc_content(
        self,
        video_url: str,
        video_title: str,
        selected_segment: Dict,
        all_segments: List[Dict],
        storyboard: Dict,
        selection_reason: str
    ) -> str:
        """Build formatted document content"""

        hashtags = storyboard.get("hashtags", [])
        posting_tip = storyboard.get("posting_tip", "Post during peak engagement hours")
        panels = storyboard.get("panels", [])

        content = f"""
🚀 JETSKI COMIC ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📺 SOURCE VIDEO
Title: {video_title}
URL: {video_url}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ SELECTED VIRAL MOMENT (Auto-picked by AI)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Hook: {selected_segment.get('hook', 'N/A')}
⏱️  Timestamp: {selected_segment.get('start_time', '')} - {selected_segment.get('end_time', '')}
📊 Viral Score: {selected_segment.get('score', 0)}/100
🔥 Type: {selected_segment.get('viral_type', 'N/A')}

💡 Why it's viral:
{selection_reason}

📝 Summary:
{selected_segment.get('summary', 'N/A')}

🎬 Transcript Excerpt:
"{selected_segment.get('transcript_excerpt', 'N/A')}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ALL VIRAL MOMENTS ANALYZED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

        for segment in all_segments:
            rank_emoji = "🥇" if segment['rank'] == 1 else "🥈" if segment['rank'] == 2 else "🥉"
            content += f"""
{rank_emoji} OPTION {segment['rank']} (Score: {segment['score']}/100)
{segment['viral_type'].upper()} | {segment['start_time']} - {segment['end_time']}
"{segment['hook']}"
{segment['summary']}

"""

        content += f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎨 6-PANEL COMIC STORYBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title: {storyboard.get('title', 'Untitled')}
Style: {storyboard.get('style', 'N/A')}
Arc: {storyboard.get('narrative_arc', 'N/A')}

"""

        for panel in panels:
            content += f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PANEL {panel.get('panel_number', '?')} - {panel.get('composition', 'N/A').upper()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎬 SCENE: {panel.get('scene_description', 'N/A')}

👥 CHARACTERS: {panel.get('character_details', 'N/A')}

⚡ ACTION: {panel.get('action', 'N/A')}

🎨 VISUAL STYLE: {panel.get('visual_style', 'N/A')}

💬 CAPTION: "{panel.get('caption', 'N/A')}"

"""

        content += f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 SOCIAL MEDIA STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📸 INSTAGRAM CAROUSEL POST

Caption for Instagram:
{selected_segment.get('hook', '')}

{selected_segment.get('summary', '')}

Swipe to see the full story ➡️

{' '.join(hashtags)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ POSTING STRATEGY

{posting_tip}

✅ Best platforms: Instagram (carousel), LinkedIn (thought leadership), Twitter/X (thread)

✅ Engagement hooks:
- Ask viewers to tag someone who needs to see this
- Create a poll based on the topic
- Share behind-the-scenes of the comic creation

✅ Hashtag strategy:
{' '.join(hashtags)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 CAPTIONS FOR EACH PANEL (for stories/reels)

"""

        for i, panel in enumerate(panels, 1):
            content += f"Panel {i}: {panel.get('caption', 'N/A')}\n"

        content += f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated by JetSki 🚀
AI-powered video-to-comic content engine
"""

        return content

    def _insert_formatted_content(self, doc_id: str, content: str):
        """Insert formatted content into Google Doc"""
        requests = [
            {
                'insertText': {
                    'location': {'index': 1},
                    'text': content
                }
            }
        ]

        self.docs_service.documents().batchUpdate(
            documentId=doc_id,
            body={'requests': requests}
        ).execute()

    def upload_images_to_drive(self, image_data: List[Dict], folder_name: str = "JetSki Outputs") -> str:
        """
        Upload generated comic panels to Google Drive.

        Args:
            image_data: List of panel images with base64 data
            folder_name: Name of folder to create

        Returns:
            str: Google Drive folder URL
        """
        if self.drive_service is None:
            print("⚠️  Warning: Drive service not initialized")
            return None

        # Create folder
        folder_metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder'
        }

        folder = self.drive_service.files().create(
            body=folder_metadata,
            fields='id, webViewLink'
        ).execute()

        folder_id = folder.get('id')
        folder_url = folder.get('webViewLink')

        print(f"📁 Created Drive folder: {folder_name}")

        # Upload each panel
        for panel in image_data:
            if "image_base64" not in panel:
                continue

            panel_num = panel.get("panel_number", "?")
            image_bytes = base64.b64decode(panel["image_base64"])
            mime_type = panel.get("mime_type", "image/png")

            file_metadata = {
                'name': f'Panel_{panel_num}.png',
                'parents': [folder_id]
            }

            media = MediaIoBaseUpload(
                BytesIO(image_bytes),
                mimetype=mime_type,
                resumable=True
            )

            uploaded_file = self.drive_service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id, webViewLink'
            ).execute()

            print(f"  ✅ Uploaded Panel {panel_num}: {uploaded_file.get('webViewLink')}")

        return folder_url

