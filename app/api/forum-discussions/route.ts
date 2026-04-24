import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

const TTL_MS = 43200 * 1000; // 12 h — forums update more often than dealers/videos
const MAX_RESULTS = 6;

export interface ForumThread {
  id: string;
  title: string;
  subreddit: string;
  score: number;
  numComments: number;
  author: string;
  createdUtc: number;
  url: string;
  selftext: string;
  source: 'reddit';
}

// ── Filesystem cache ──────────────────────────────────────────────────────────

function getCacheDir(): string {
  return process.env.VERCEL
    ? path.join(os.tmpdir(), 'tractorscompare-forum')
    : path.join(process.cwd(), '.next', 'cache', 'forum');
}

function cacheFilePath(key: string): string {
  const hash = createHash('sha256').update(key).digest('hex');
  return path.join(getCacheDir(), `${hash}.json`);
}

async function getCached(key: string): Promise<ForumThread[] | null> {
  const fp = cacheFilePath(key);
  try {
    if (!existsSync(fp)) return null;
    const raw = await readFile(fp, 'utf-8');
    const data = JSON.parse(raw) as { threads: ForumThread[]; expiresAt: number };
    if (Date.now() > data.expiresAt) return null;
    return data.threads;
  } catch {
    return null;
  }
}

async function setCached(key: string, threads: ForumThread[]): Promise<void> {
  const fp = cacheFilePath(key);
  try {
    await mkdir(getCacheDir(), { recursive: true });
    await writeFile(fp, JSON.stringify({ threads, expiresAt: Date.now() + TTL_MS }), 'utf-8');
  } catch {
    // ignore
  }
}

// ── Reddit JSON API ───────────────────────────────────────────────────────────
// Searches r/tractors+farming+homesteading+TractorTalk multi for tractor posts.
// Falls back to site-wide search if that returns < 2 results.

const SUBREDDITS = 'tractors+farming+homesteading+TractorTalk+john_deere+kubota';

interface RedditPost {
  id?: string;
  title?: string;
  subreddit?: string;
  score?: number;
  num_comments?: number;
  author?: string;
  created_utc?: number;
  url?: string;
  permalink?: string;
  selftext?: string;
  is_self?: boolean;
}

interface RedditResponse {
  data?: {
    children?: { data?: RedditPost }[];
  };
}

function buildRedditUrl(query: string, subreddit?: string): string {
  const base = subreddit
    ? `https://www.reddit.com/r/${subreddit}/search.json`
    : 'https://www.reddit.com/search.json';
  const params = new URLSearchParams({
    q: query,
    sort: 'top',
    t: 'all',
    limit: String(MAX_RESULTS),
    type: 'link',
  });
  if (subreddit) params.set('restrict_sr', 'on');
  return `${base}?${params.toString()}`;
}

async function fetchReddit(url: string): Promise<ForumThread[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'tractorscompare-bot/1.0 (https://tractorscompare.com)',
        Accept: 'application/json',
      },
      // Reddit blocks default next.js fetch cache; use no-store to get fresh
      cache: 'no-store',
    });
    clearTimeout(timeout);
    if (!res.ok) return [];

    const data = (await res.json()) as RedditResponse;
    const children = data.data?.children ?? [];

    return children
      .map((c) => c.data)
      .filter((p): p is RedditPost => !!p?.id && !!p?.title)
      .map((p) => ({
        id: p.id!,
        title: p.title!.slice(0, 200),
        subreddit: p.subreddit ?? 'reddit',
        score: p.score ?? 0,
        numComments: p.num_comments ?? 0,
        author: p.author ?? '',
        createdUtc: p.created_utc ?? 0,
        url: p.permalink
          ? `https://www.reddit.com${p.permalink}`
          : (p.url ?? '#'),
        selftext: (p.selftext ?? '').slice(0, 300),
        source: 'reddit' as const,
      }));
  } catch {
    clearTimeout(timeout);
    return [];
  }
}

async function fetchThreads(brand: string, model: string): Promise<ForumThread[]> {
  const query = model ? `${brand} ${model}` : brand;

  // Try subreddit-restricted first for better quality
  const threads = await fetchReddit(buildRedditUrl(query, SUBREDDITS));
  if (threads.length >= 2) return threads.slice(0, MAX_RESULTS);

  // Fallback: site-wide search with tractor keyword
  return fetchReddit(buildRedditUrl(`${query} tractor`));
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const brand = (sp.get('brand') ?? '').trim().slice(0, 80);
  const model = (sp.get('model') ?? '').trim().slice(0, 80);

  if (!brand) {
    return NextResponse.json({ error: 'brand is required', threads: [] }, { status: 400 });
  }

  const cacheKey = `forum:v1:${brand.toLowerCase()}:${model.toLowerCase()}`;

  const cached = await getCached(cacheKey);
  if (cached) {
    return NextResponse.json({ threads: cached, fromCache: true });
  }

  const threads = await fetchThreads(brand, model);
  await setCached(cacheKey, threads);

  return NextResponse.json({ threads });
}
