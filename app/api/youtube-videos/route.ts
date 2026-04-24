import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

const TTL_MS = 86400 * 1000; // 24 h
const MAX_RESULTS = 4;

export interface YoutubeVideo {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  thumbnailUrl: string;
  description: string;
}

// ── Filesystem cache ──────────────────────────────────────────────────────────

function getCacheDir(): string {
  return process.env.VERCEL
    ? path.join(os.tmpdir(), 'tractorscompare-youtube')
    : path.join(process.cwd(), '.next', 'cache', 'youtube');
}

function cacheFilePath(key: string): string {
  const hash = createHash('sha256').update(key).digest('hex');
  return path.join(getCacheDir(), `${hash}.json`);
}

async function getCached(key: string): Promise<YoutubeVideo[] | null> {
  const fp = cacheFilePath(key);
  try {
    if (!existsSync(fp)) return null;
    const raw = await readFile(fp, 'utf-8');
    const data = JSON.parse(raw) as { videos: YoutubeVideo[]; expiresAt: number };
    if (Date.now() > data.expiresAt) return null;
    return data.videos;
  } catch {
    return null;
  }
}

async function setCached(key: string, videos: YoutubeVideo[]): Promise<void> {
  const fp = cacheFilePath(key);
  try {
    await mkdir(getCacheDir(), { recursive: true });
    await writeFile(fp, JSON.stringify({ videos, expiresAt: Date.now() + TTL_MS }), 'utf-8');
  } catch {
    // ignore
  }
}

// ── YouTube Data API v3 ───────────────────────────────────────────────────────

interface YTSnippet {
  title?: string;
  channelTitle?: string;
  publishedAt?: string;
  description?: string;
  thumbnails?: {
    medium?: { url?: string };
    high?: { url?: string };
    default?: { url?: string };
  };
}

interface YTItem {
  id?: { videoId?: string };
  snippet?: YTSnippet;
}

interface YTSearchResponse {
  items?: YTItem[];
  error?: { message?: string };
}

async function fetchVideos(brand: string, model: string): Promise<YoutubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  const query = model ? `${brand} ${model} tractor` : `${brand} tractor review`;
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', String(MAX_RESULTS));
  url.searchParams.set('relevanceLanguage', 'en');
  url.searchParams.set('videoEmbeddable', 'true');
  url.searchParams.set('key', apiKey);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return [];

    const data = (await res.json()) as YTSearchResponse;
    if (!data.items?.length) return [];

    return data.items
      .filter((item) => item.id?.videoId && item.snippet)
      .map((item) => {
        const s = item.snippet!;
        const thumbnail =
          s.thumbnails?.medium?.url ??
          s.thumbnails?.high?.url ??
          s.thumbnails?.default?.url ??
          `https://i.ytimg.com/vi/${item.id!.videoId}/mqdefault.jpg`;
        return {
          videoId: item.id!.videoId!,
          title: (s.title ?? '').slice(0, 120),
          channelTitle: s.channelTitle ?? '',
          publishedAt: s.publishedAt ?? '',
          thumbnailUrl: thumbnail,
          description: (s.description ?? '').slice(0, 200),
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
  const model = (sp.get('model') ?? '').trim().slice(0, 80);

  if (!brand) {
    return NextResponse.json({ error: 'brand is required', videos: [] }, { status: 400 });
  }

  const cacheKey = `youtube:v1:${brand.toLowerCase()}:${model.toLowerCase()}`;

  const cached = await getCached(cacheKey);
  if (cached) {
    return NextResponse.json({ videos: cached, fromCache: true });
  }

  if (!process.env.YOUTUBE_API_KEY) {
    return NextResponse.json({ videos: [], noApiKey: true });
  }

  const videos = await fetchVideos(brand, model);
  await setCached(cacheKey, videos);

  return NextResponse.json({ videos });
}
