import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import { createHash } from 'crypto';

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getCacheDir(): string {
  // Vercel: /tmp is writable; local: .next/cache/listings
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), 'tractorscompare-listings');
  }
  return path.join(process.cwd(), '.next', 'cache', 'listings');
}

function cacheKey(normalizedQuery: string): string {
  return createHash('sha256').update(normalizedQuery).digest('hex');
}

export function normalizeQuery(q: string): string {
  return (q || '').trim().toLowerCase().replace(/\s+/g, ' ') || 'tractor';
}

export interface CachedListings {
  query: string;
  items: import('@/types/listings').Listing[];
  cachedAt: number;
}

export async function getCachedListings(normalizedQuery: string): Promise<CachedListings | null> {
  const dir = getCacheDir();
  const key = cacheKey(normalizedQuery);
  const filePath = path.join(dir, `${key}.json`);
  try {
    if (!existsSync(filePath)) return null;
    const raw = await readFile(filePath, 'utf-8');
    const data = JSON.parse(raw) as CachedListings;
    if (Date.now() - data.cachedAt > TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

export async function setCachedListings(
  normalizedQuery: string,
  payload: { query: string; items: CachedListings['items'] }
): Promise<void> {
  const dir = getCacheDir();
  const key = cacheKey(normalizedQuery);
  const filePath = path.join(dir, `${key}.json`);
  try {
    await mkdir(dir, { recursive: true });
    const data: CachedListings = {
      query: payload.query,
      items: payload.items,
      cachedAt: Date.now(),
    };
    await writeFile(filePath, JSON.stringify(data), 'utf-8');
  } catch {
    // ignore write errors (e.g. read-only fs)
  }
}
