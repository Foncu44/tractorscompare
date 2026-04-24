'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, ArrowUp, ExternalLink } from 'lucide-react';
import type { ForumThread } from '@/app/api/forum-discussions/route';

interface ForumDiscussionsProps {
  brand: string;
  model: string;
}

function relativeTime(utc: number): string {
  if (!utc) return '';
  const diff = Date.now() - utc * 1000;
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'today';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function formatScore(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function ThreadCard({ thread }: { thread: ForumThread }) {
  return (
    <a
      href={thread.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '6px',
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-surface)',
        textDecoration: 'none',
        transition: 'border-color 150ms ease',
        alignItems: 'flex-start',
      }}
      className="hover:border-green-400 group"
    >
      {/* Vote column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          flexShrink: 0,
          minWidth: '36px',
        }}
      >
        <ArrowUp
          className="w-4 h-4"
          style={{ color: thread.score > 0 ? 'var(--color-amber-600)' : 'var(--fg3)' }}
        />
        <span
          style={{
            fontSize: '12px',
            fontFamily: '"IBM Plex Mono", monospace',
            fontWeight: 600,
            color: thread.score > 0 ? 'var(--fg1)' : 'var(--fg3)',
            lineHeight: 1,
          }}
        >
          {formatScore(thread.score)}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            fontSize: '13px',
            color: 'var(--fg1)',
            lineHeight: '1.4',
            marginBottom: '4px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
          className="group-hover:text-green-700 transition-colors"
        >
          {thread.title}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: 'var(--color-green-700)',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
            }}
          >
            r/{thread.subreddit}
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '11px',
              color: 'var(--fg3)',
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            <MessageSquare className="w-3 h-3" />
            {thread.numComments}
          </span>

          <span style={{ fontSize: '11px', color: 'var(--fg3)', fontFamily: '"DM Sans", sans-serif' }}>
            {relativeTime(thread.createdUtc)}
          </span>
        </div>
      </div>

      <ExternalLink
        className="w-3.5 h-3.5 flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity mt-0.5"
        style={{ color: 'var(--fg3)' }}
      />
    </a>
  );
}

function ThreadSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '6px',
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-surface)',
      }}
      className="animate-pulse"
    >
      <div style={{ width: '36px', flexShrink: 0 }}>
        <div className="h-4 w-4 bg-gray-200 rounded mx-auto mb-1" />
        <div className="h-3 w-6 bg-gray-100 rounded mx-auto" />
      </div>
      <div style={{ flex: 1 }}>
        <div className="h-3 bg-gray-200 rounded w-5/6 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
        <div className="h-2 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  );
}

export default function ForumDiscussions({ brand, model }: ForumDiscussionsProps) {
  const [threads, setThreads] = useState<ForumThread[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ brand, model });
    fetch(`/api/forum-discussions?${params.toString()}`)
      .then((r) => r.json())
      .then((data: { threads?: ForumThread[] }) => setThreads(data.threads ?? []))
      .catch(() => setThreads([]))
      .finally(() => setLoading(false));
  }, [brand, model]);

  const redditSearchUrl = `https://www.reddit.com/search/?q=${encodeURIComponent(brand + ' ' + model)}&sort=top`;

  if (loading) {
    return (
      <section
        style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border-default)' }}
        aria-labelledby="forum-heading"
      >
        <h2
          id="forum-heading"
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
          Community Discussions
        </h2>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => <ThreadSkeleton key={i} />)}
        </div>
      </section>
    );
  }

  if (!threads || threads.length === 0) return null;

  return (
    <section
      style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border-default)' }}
      aria-labelledby="forum-heading"
    >
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h2
            id="forum-heading"
            style={{
              fontFamily: '"Barlow Condensed", system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: 'var(--fg1)',
              marginBottom: '4px',
            }}
          >
            Community Discussions
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--fg3)', fontFamily: '"DM Sans", sans-serif' }}>
            Real owner threads from Reddit tractor communities.
          </p>
        </div>
        <a
          href={redditSearchUrl}
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
          More on Reddit →
        </a>
      </div>

      <div className="flex flex-col gap-3">
        {threads.map((t) => (
          <ThreadCard key={t.id} thread={t} />
        ))}
      </div>

      <p
        style={{
          marginTop: '12px',
          fontSize: '11px',
          color: 'var(--fg3)',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        Discussions sourced from Reddit. TractorsCompare is not affiliated with Reddit.
      </p>
    </section>
  );
}
