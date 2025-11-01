import { NextRequest, NextResponse } from 'next/server';
import { getStoryboardWithPanels } from '@/lib/supabase/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storyboardId } = await params;

    if (!storyboardId) {
      return NextResponse.json(
        { error: 'Storyboard ID is required' },
        { status: 400 }
      );
    }

    const storyboard = await getStoryboardWithPanels(storyboardId);

    return NextResponse.json({
      status: 'success',
      storyboard
    });
  } catch (error: any) {
    console.error('Error fetching storyboard:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch storyboard'
      },
      { status: 500 }
    );
  }
}
