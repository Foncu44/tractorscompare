import { NextRequest, NextResponse } from 'next/server';
import { getListings } from '@/lib/listings';
import {
  getCachedListings,
  setCachedListings,
  normalizeQuery,
} from '@/lib/listings/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';
  const normalized = normalizeQuery(q);
  const displayQuery = (q || '').trim() || 'tractor';

  try {
    const cached = await getCachedListings(normalized);
    if (cached) {
      return NextResponse.json({
        query: cached.query,
        items: cached.items,
      });
    }

    const items = await getListings(displayQuery);
    await setCachedListings(normalized, { query: displayQuery, items });

    return NextResponse.json({ query: displayQuery, items });
  } catch (e) {
    console.error('[listings]', e);
    return NextResponse.json(
      { error: 'Failed to fetch listings', query: displayQuery, items: [] },
      { status: 500 }
    );
  }
}
