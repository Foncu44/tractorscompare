import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import { createHash } from 'crypto';
import { normalizeQuery } from './utils';

const TTL_SECONDS = 86400; // 24 hours

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

export function buildCacheKey(normalizedQuery: string): string {
  return `listings:v2:${normalizedQuery}`;
}

/**
 * Get cached value as JSON string. Returns null if not found or expired.
 */
export async function getCached(key: string): Promise<string | null> {
  const filePath = cacheFilePath(key);
  try {
    if (!existsSync(filePath)) return null;
    const raw = await readFile(filePath, 'utf-8');
    const data = JSON.parse(raw) as { value: string; expiresAt: number };
    if (Date.now() > data.expiresAt) return null;
    return data.value;
  } catch {
    return null;
  }
}

/**
 * Set cached value (JSON string) with TTL in seconds.
 */
export async function setCached(
  key: string,
  value: string,
  ttlSeconds: number = TTL_SECONDS
): Promise<void> {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  const dir = getCacheDir();
  const filePath = cacheFilePath(key);
  try {
    await mkdir(dir, { recursive: true });
    await writeFile(
      filePath,
      JSON.stringify({ value, expiresAt }),
      'utf-8'
    );
  } catch {
    // ignore write errors
  }
}

export { normalizeQuery };
