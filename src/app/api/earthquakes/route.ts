import { NextResponse } from 'next/server';
import { getEarthquakesData } from '@/lib/earthquakes-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'all';
    const earthquakes = await getEarthquakesData(source);

    return NextResponse.json(earthquakes, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch earthquake data',
      },
      { status: 500 },
    );
  }
}
