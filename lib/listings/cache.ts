import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import { createHash } from 'crypto';

const TTL_SECONDS = 24 * 60 * 60; // 24 hours

function getCacheDir(): string {
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), 'tractorscompare-listings');
  }
  return path.join(process.cwd(), '.next', 'cache', 'listings');
}

function cacheFilePath(key: string): string {
  const hash = createHash('sha256').update(key).digest('hex');
  return path.join(getCacheDir(), `${hash}.json`);
}

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * Get cached value. Returns null if not found or expired.
 * Uses /tmp JSON file cache (Vercel) or .next/cache/listings (local).
 * To use Vercel KV: install @vercel/kv, set KV_REST_API_URL, and add KV logic in getCache/setCache.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const filePath = cacheFilePath(key);
  try {
    if (!existsSync(filePath)) return null;
    const raw = await readFile(filePath, 'utf-8');
    const data = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() > data.expiresAt) return null;
    return data.value;
  } catch {
    return null;
  }
}

/**
 * Set cached value with TTL in seconds.
 */
export async function setCache<T>(key: string, value: T, ttlSeconds: number = TTL_SECONDS): Promise<void> {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  const entry: CacheEntry<T> = { value, expiresAt };

  const dir = getCacheDir();
  const filePath = cacheFilePath(key);
  try {
    await mkdir(dir, { recursive: true });
    await writeFile(filePath, JSON.stringify(entry), 'utf-8');
  } catch {
    // ignore write errors
  }
}

export function normalizeQuery(q: string): string {
  return (q || '').trim().toLowerCase().replace(/\s+/g, ' ') || 'tractor';
}

export function buildCacheKey(normalizedQuery: string): string {
  return `listings:v1:${normalizedQuery}`;
}
