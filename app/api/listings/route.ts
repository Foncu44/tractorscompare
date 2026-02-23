import { NextRequest, NextResponse } from 'next/server';
import { getListings } from '@/lib/listings';
import { getCache, setCache, normalizeQuery, buildCacheKey } from '@/lib/listings/cache';
import { checkRateLimit } from '@/lib/listings/rateLimit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const MIN_QUERY_LENGTH = 3;
const MAX_QUERY_LENGTH = 60;

function validateAndNormalize(q: string): { valid: boolean; normalized: string; displayQuery: string } {
  const trimmed = (q || '').trim();
  const collapsed = trimmed.replace(/\s+/g, ' ').trim();
  const displayQuery = collapsed || 'tractor';
  const normalized = normalizeQuery(displayQuery);

  if (collapsed.length < MIN_QUERY_LENGTH) {
    return { valid: false, normalized, displayQuery };
  }
  if (collapsed.length > MAX_QUERY_LENGTH) {
    return { valid: false, normalized, displayQuery };
  }
  return { valid: true, normalized, displayQuery };
}

export async function GET(request: NextRequest) {
  try {
    if (!checkRateLimit(request)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const q = request.nextUrl.searchParams.get('q') ?? '';
    const { valid, normalized, displayQuery } = validateAndNormalize(q);

    if (!valid) {
      return NextResponse.json(
        { error: `Query must be ${MIN_QUERY_LENGTH}-${MAX_QUERY_LENGTH} characters`, query: displayQuery, items: [] },
        { status: 400 }
      );
    }

    const cacheKey = buildCacheKey(normalized);

    const cached = await getCache<{ query: string; items: import('@/types/listings').Listing[] }>(cacheKey);
    if (cached) {
      return NextResponse.json({ query: cached.query, items: cached.items });
    }

    const brandName = request.nextUrl.searchParams.get('brand') ?? undefined;
    const modelName = request.nextUrl.searchParams.get('model') ?? undefined;

    const items = await getListings(displayQuery, brandName, modelName);
    await setCache(cacheKey, { query: displayQuery, items });

    return NextResponse.json({ query: displayQuery, items });
  } catch (e) {
    console.error('[listings API]', e);
    return NextResponse.json(
      { error: 'Failed to fetch listings', query: '', items: [] },
      { status: 500 }
    );
  }
}
