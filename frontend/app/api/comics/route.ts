import { NextRequest, NextResponse } from 'next/server';
import { getRecentComics } from '@/lib/supabase/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');

    const comics = await getRecentComics(limit);

    return NextResponse.json({
      status: 'success',
      count: comics.length,
      comics
    });
  } catch (error: any) {
    console.error('Error fetching comics:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch comics'
      },
      { status: 500 }
    );
  }
}
