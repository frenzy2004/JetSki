import { NextRequest, NextResponse } from 'next/server';
import { getYouTubeTranscript } from '@/lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const { video_url } = await request.json();

    if (!video_url) {
      return NextResponse.json(
        { error: 'video_url is required' },
        { status: 400 }
      );
    }

    const transcript = await getYouTubeTranscript(video_url);

    return NextResponse.json({
      success: true,
      transcript,
      word_count: transcript.split(' ').length
    });
  } catch (error: any) {
    console.error('Transcript error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get transcript' },
      { status: 500 }
    );
  }
}

