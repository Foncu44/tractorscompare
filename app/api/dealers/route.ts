import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

const TTL_MS = 86400 * 1000; // 24 h
const MAX_RESULTS = 6;
const SEARCH_RADIUS_M = 120000; // 120 km

export interface DealerResult {
  name: string;
  address: string;
  lat: number;
  lng: number;
  placeId: string;
  rating?: number;
  ratingsCount?: number;
  mapsUrl: string;
}

// ── Filesystem cache (same pattern as listings) ──────────────────────────────

function getCacheDir(): string {
  return process.env.VERCEL
    ? path.join(os.tmpdir(), 'tractorscompare-dealers')
    : path.join(process.cwd(), '.next', 'cache', 'dealers');
}

function cacheFilePath(key: string): string {
  const hash = createHash('sha256').update(key).digest('hex');
  return path.join(getCacheDir(), `${hash}.json`);
}

async function getCached(key: string): Promise<DealerResult[] | null> {
  const fp = cacheFilePath(key);
  try {
    if (!existsSync(fp)) return null;
    const raw = await readFile(fp, 'utf-8');
    const data = JSON.parse(raw) as { results: DealerResult[]; expiresAt: number };
    if (Date.now() > data.expiresAt) return null;
    return data.results;
  } catch {
    return null;
  }
}

async function setCached(key: string, results: DealerResult[]): Promise<void> {
  const fp = cacheFilePath(key);
  try {
    await mkdir(getCacheDir(), { recursive: true });
    await writeFile(fp, JSON.stringify({ results, expiresAt: Date.now() + TTL_MS }), 'utf-8');
  } catch {
    // ignore
  }
}

// ── Google Places Text Search ─────────────────────────────────────────────────

interface PlacesResult {
  name?: string;
  formatted_address?: string;
  geometry?: { location?: { lat?: number; lng?: number } };
  place_id?: string;
  rating?: number;
  user_ratings_total?: number;
}

interface PlacesResponse {
  status?: string;
  results?: PlacesResult[];
}

async function fetchDealers(brand: string, lat: number, lng: number): Promise<DealerResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return [];

  const query = `${brand} tractor dealer`;
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', query);
  url.searchParams.set('location', `${lat},${lng}`);
  url.searchParams.set('radius', String(SEARCH_RADIUS_M));
  url.searchParams.set('key', apiKey);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return [];

    const data = (await res.json()) as PlacesResponse;
    if (data.status !== 'OK' || !data.results?.length) return [];

    return data.results.slice(0, MAX_RESULTS).map((p) => {
      const lat = p.geometry?.location?.lat ?? 0;
      const lng = p.geometry?.location?.lng ?? 0;
      return {
        name: p.name ?? 'Unknown dealer',
        address: p.formatted_address ?? '',
        lat,
        lng,
        placeId: p.place_id ?? '',
        rating: p.rating,
        ratingsCount: p.user_ratings_total,
        mapsUrl: `https://www.google.com/maps/place/?q=place_id:${p.place_id ?? ''}`,
      };
    });
  } catch {
    clearTimeout(timeout);
    return [];
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const brand = (sp.get('brand') ?? '').trim().slice(0, 80);
  const latRaw = parseFloat(sp.get('lat') ?? '');
  const lngRaw = parseFloat(sp.get('lng') ?? '');

  if (!brand || isNaN(latRaw) || isNaN(lngRaw)) {
    return NextResponse.json({ error: 'brand, lat and lng are required', dealers: [] }, { status: 400 });
  }

  // Round to 0.5° grid for cache key (~55 km cells)
  const lat = Math.round(latRaw * 2) / 2;
  const lng = Math.round(lngRaw * 2) / 2;

  const cacheKey = `dealers:v1:${brand.toLowerCase()}:${lat}:${lng}`;

  const cached = await getCached(cacheKey);
  if (cached) {
    return NextResponse.json({ dealers: cached, fromCache: true });
  }

  if (!process.env.GOOGLE_PLACES_API_KEY) {
    return NextResponse.json({ dealers: [], noApiKey: true });
  }

  const dealers = await fetchDealers(brand, lat, lng);
  await setCached(cacheKey, dealers);

  return NextResponse.json({ dealers });
}
