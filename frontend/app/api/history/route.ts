import { NextRequest, NextResponse } from 'next/server';
import { getVideoHistory } from '@/lib/supabase/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');

    const history = await getVideoHistory(limit);

    return NextResponse.json({
      status: 'success',
      count: history.length,
      videos: history
    });
  } catch (error: any) {
    console.error('Error fetching history:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch history'
      },
      { status: 500 }
    );
  }
}
