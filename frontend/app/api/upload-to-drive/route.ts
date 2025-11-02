import { NextRequest, NextResponse } from 'next/server';
import { createDriveFolder, uploadImageToDrive, createComicDoc } from '@/lib/google-drive';

// Upload comic panels to Google Drive and create a Google Doc breakdown
export async function POST(request: NextRequest) {
  try {
    const { panels, storyboard, selected_moment, comic_summary } = await request.json();

    if (!panels || !Array.isArray(panels)) {
      return NextResponse.json(
        { error: 'panels array is required' },
        { status: 400 }
      );
    }

    console.log('📂 Uploading to Google Drive...');

    // Step 1: Create a folder for this comic
    const folderName = `JetSki Comic - ${storyboard?.title || 'Untitled'} - ${new Date().toLocaleDateString()}`;
    const folder = await createDriveFolder(folderName);
    console.log(`✅ Created folder: ${folder.id}`);

    // Step 2: Upload all panel images
    const uploadedPanels = [];
    for (const panel of panels) {
      if (panel.image_base64) {
        try {
          const fileName = `Panel ${panel.panel_number} - ${panel.caption.substring(0, 30)}.png`;
          const uploadedFile = await uploadImageToDrive(
            panel.image_base64,
            fileName,
            panel.mime_type || 'image/png',
            folder.id!
          );
          uploadedPanels.push({
            panel_number: panel.panel_number,
            file_id: uploadedFile.id,
            url: uploadedFile.webViewLink,
          });
          console.log(`✅ Uploaded panel ${panel.panel_number}`);
        } catch (error: any) {
          console.error(`❌ Failed to upload panel ${panel.panel_number}:`, error.message);
        }
      }
    }

    // Step 3: Create Google Doc with comprehensive breakdown and social media copy
    const doc = await createComicDoc(
      `Viral Comic Strip - ${storyboard?.title || 'Untitled'}`,
      { selected_moment, storyboard, comic_summary },
      folder.id!
    );
    console.log(`✅ Created Google Doc: ${doc.documentId}`);

    const response = {
      success: true,
      drive_folder_url: folder.webViewLink,
      doc_url: doc.url,
      uploaded_panels: uploadedPanels.length,
      folder_id: folder.id,
      doc_id: doc.documentId,
      panels: uploadedPanels,
    };

    console.log('✅ Upload complete!');

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('❌ Drive upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload to Drive', detail: error.stack },
      { status: 500 }
    );
  }
}
