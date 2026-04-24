'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Youtube } from 'lucide-react';
import type { YoutubeVideo } from '@/app/api/youtube-videos/route';

interface YoutubeVideosProps {
  brand: string;
  model: string;
}

function relativeTime(iso: string): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'today';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function VideoCard({ video }: { video: YoutubeVideo }) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`;

  return (
    <div
      style={{
        borderRadius: '6px',
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-surface)',
        overflow: 'hidden',
      }}
    >
      {/* Thumbnail / embed */}
      <div
        style={{ position: 'relative', aspectRatio: '16/9', backgroundColor: '#000', cursor: 'pointer' }}
        onClick={() => setPlaying(true)}
        role={playing ? undefined : 'button'}
        aria-label={playing ? undefined : `Play ${video.title}`}
      >
        {playing ? (
          <iframe
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        ) : (
          <>
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              unoptimized
            />
            {/* Play overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.25)',
                transition: 'background-color 150ms ease',
              }}
              className="group-hover:bg-black/40"
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,0,0,0.88)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Play className="w-5 h-5 fill-white text-white" style={{ marginLeft: '3px' }} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Meta */}
      <div style={{ padding: '10px 12px' }}>
        <a
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            fontSize: '13px',
            color: 'var(--fg1)',
            textDecoration: 'none',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.4',
          }}
          className="hover:text-green-700 transition-colors"
        >
          {video.title}
        </a>
        <div
          style={{
            marginTop: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--fg3)', fontFamily: '"DM Sans", sans-serif' }}>
            {video.channelTitle}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--fg3)', fontFamily: '"DM Sans", sans-serif', flexShrink: 0 }}>
            {relativeTime(video.publishedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

function VideoSkeleton() {
  return (
    <div
      style={{ borderRadius: '6px', border: '1px solid var(--border-default)', overflow: 'hidden' }}
      className="animate-pulse"
    >
      <div style={{ aspectRatio: '16/9', backgroundColor: '#e5e7eb' }} />
      <div style={{ padding: '10px 12px' }}>
        <div className="h-3 bg-gray-200 rounded w-5/6 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function YoutubeVideos({ brand, model }: YoutubeVideosProps) {
  const [videos, setVideos] = useState<YoutubeVideo[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ brand, model });
    fetch(`/api/youtube-videos?${params.toString()}`)
      .then((r) => r.json())
      .then((data: { videos?: YoutubeVideo[] }) => setVideos(data.videos ?? []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, [brand, model]);

  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(brand + ' ' + model + ' tractor')}`;

  if (loading) {
    return (
      <section
        style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border-default)' }}
        aria-labelledby="yt-heading"
      >
        <h2
          id="yt-heading"
          style={{
            fontFamily: '"Barlow Condensed", system-ui, sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            color: 'var(--fg1)',
            marginBottom: '16px',
          }}
        >
          {brand} {model} Videos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <VideoSkeleton key={i} />)}
        </div>
      </section>
    );
  }

  if (!videos || videos.length === 0) return null;

  return (
    <section
      style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border-default)' }}
      aria-labelledby="yt-heading"
    >
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <h2
          id="yt-heading"
          style={{
            fontFamily: '"Barlow Condensed", system-ui, sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            color: 'var(--fg1)',
            margin: 0,
          }}
        >
          {brand} {model} Videos
        </h2>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'var(--color-green-700)',
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            textDecoration: 'none',
            flexShrink: 0,
          }}
          className="hover:underline"
        >
          <Youtube className="w-4 h-4" />
          More on YouTube
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.map((v) => (
          <VideoCard key={v.videoId} video={v} />
        ))}
      </div>
    </section>
  );
}
