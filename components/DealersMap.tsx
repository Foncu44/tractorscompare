'use client';

import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Star, Navigation } from 'lucide-react';
import type { DealerResult } from '@/app/api/dealers/route';

interface DealersMapProps {
  brand: string;
}

type GeoState =
  | { status: 'idle' }
  | { status: 'requesting' }
  | { status: 'ready'; lat: number; lng: number }
  | { status: 'denied' };

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1" style={{ fontSize: '12px', color: 'var(--color-amber-600)' }}>
      <Star className="w-3 h-3 fill-current" />
      {rating.toFixed(1)}
    </span>
  );
}

function DealerCard({ dealer }: { dealer: DealerResult }) {
  return (
    <a
      href={dealer.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        padding: '12px 14px',
        borderRadius: '6px',
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-surface)',
        textDecoration: 'none',
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
      }}
      className="hover:border-green-400 hover:shadow-sm group"
    >
      <div className="flex items-start gap-2">
        <MapPin
          className="w-4 h-4 flex-shrink-0 mt-0.5"
          style={{ color: 'var(--color-green-700)' }}
        />
        <div className="min-w-0 flex-1">
          <p
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              color: 'var(--fg1)',
              marginBottom: '2px',
              lineHeight: '1.4',
            }}
            className="group-hover:text-green-700 transition-colors"
          >
            {dealer.name}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--fg3)', lineHeight: '1.4' }}>
            {dealer.address}
          </p>
          {dealer.rating && (
            <div className="mt-1">
              <StarRating rating={dealer.rating} />
            </div>
          )}
        </div>
        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--fg3)' }} />
      </div>
    </a>
  );
}

function DealerSkeleton() {
  return (
    <div
      style={{
        padding: '12px 14px',
        borderRadius: '6px',
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-surface)',
      }}
      className="animate-pulse"
    >
      <div className="flex gap-2">
        <div className="w-4 h-4 rounded bg-gray-200 flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-full" />
        </div>
      </div>
    </div>
  );
}

export default function DealersMap({ brand }: DealersMapProps) {
  const [geo, setGeo] = useState<GeoState>({ status: 'idle' });
  const [dealers, setDealers] = useState<DealerResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [noApiKey, setNoApiKey] = useState(false);

  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  function requestLocation() {
    if (!navigator.geolocation) {
      setGeo({ status: 'denied' });
      return;
    }
    setGeo({ status: 'requesting' });
    navigator.geolocation.getCurrentPosition(
      (pos) => setGeo({ status: 'ready', lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGeo({ status: 'denied' }),
      { timeout: 10000, maximumAge: 300000 }
    );
  }

  useEffect(() => {
    if (geo.status !== 'ready') return;

    setLoading(true);
    const params = new URLSearchParams({
      brand,
      lat: String(geo.lat),
      lng: String(geo.lng),
    });

    fetch(`/api/dealers?${params.toString()}`)
      .then((r) => r.json())
      .then((data: { dealers?: DealerResult[]; noApiKey?: boolean }) => {
        setDealers(data.dealers ?? []);
        if (data.noApiKey) setNoApiKey(true);
      })
      .catch(() => setDealers([]))
      .finally(() => setLoading(false));
  }, [geo, brand]);

  // ── Embed URL (Maps Embed API search mode) ──────────────────────────────────
  const embedUrl =
    geo.status === 'ready' && mapsKey
      ? `https://www.google.com/maps/embed/v1/search?key=${mapsKey}&q=${encodeURIComponent(brand + ' tractor dealer')}&center=${geo.lat},${geo.lng}&zoom=9`
      : null;

  // ── Fallback search link (no API key or denied) ─────────────────────────────
  const fallbackSearchUrl = `https://www.google.com/maps/search/${encodeURIComponent(brand + ' tractor dealer')}`;

  return (
    <section
      style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border-default)' }}
      aria-labelledby="dealers-heading"
    >
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h2
            id="dealers-heading"
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
            Find {brand} Dealers Near You
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--fg3)', fontFamily: '"DM Sans", sans-serif' }}>
            Authorized dealerships selling and servicing {brand} tractors.
          </p>
        </div>

        {geo.status === 'idle' && (
          <button
            onClick={requestLocation}
            className="btn-primary flex items-center gap-2"
            style={{ fontSize: '13px', padding: '8px 14px', flexShrink: 0 }}
          >
            <Navigation className="w-3.5 h-3.5" />
            Use my location
          </button>
        )}
      </div>

      {/* ── Location requesting ── */}
      {geo.status === 'requesting' && (
        <p style={{ fontSize: '13px', color: 'var(--fg3)', fontFamily: '"DM Sans", sans-serif' }}>
          Requesting your location…
        </p>
      )}

      {/* ── Location denied ── */}
      {geo.status === 'denied' && (
        <div
          style={{
            padding: '14px 16px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
          }}
        >
          <p style={{ fontSize: '13px', color: 'var(--fg2)', fontFamily: '"DM Sans", sans-serif' }}>
            Location access denied.{' '}
            <a
              href={fallbackSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-green-700)', fontWeight: 600 }}
              className="hover:underline"
            >
              Search {brand} dealers on Google Maps →
            </a>
          </p>
        </div>
      )}

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => <DealerSkeleton key={i} />)}
        </div>
      )}

      {/* ── No API key fallback ── */}
      {!loading && noApiKey && geo.status === 'ready' && (
        <div
          style={{
            padding: '14px 16px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
          }}
        >
          <p style={{ fontSize: '13px', color: 'var(--fg2)', fontFamily: '"DM Sans", sans-serif' }}>
            <a
              href={fallbackSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-green-700)', fontWeight: 600 }}
              className="hover:underline"
            >
              Search {brand} dealers near you on Google Maps →
            </a>
          </p>
        </div>
      )}

      {/* ── Results ── */}
      {!loading && dealers && dealers.length > 0 && (
        <>
          {/* Map embed toggle */}
          {embedUrl && (
            <div className="mb-4">
              {showMap ? (
                <>
                  <div
                    style={{
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-default)',
                      marginBottom: '12px',
                    }}
                  >
                    <iframe
                      src={embedUrl}
                      width="100%"
                      height="320"
                      style={{ border: 0, display: 'block' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${brand} dealers map`}
                    />
                  </div>
                  <button
                    onClick={() => setShowMap(false)}
                    style={{ fontSize: '12px', color: 'var(--fg3)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    className="hover:text-gray-700"
                  >
                    Hide map
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowMap(true)}
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-green-700)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  className="hover:underline"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Show map
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dealers.map((d) => (
              <DealerCard key={d.placeId || d.name} dealer={d} />
            ))}
          </div>
        </>
      )}

      {/* ── No results ── */}
      {!loading && dealers && dealers.length === 0 && !noApiKey && geo.status === 'ready' && (
        <p style={{ fontSize: '13px', color: 'var(--fg3)', fontFamily: '"DM Sans", sans-serif' }}>
          No dealers found within 120 km.{' '}
          <a
            href={fallbackSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--color-green-700)', fontWeight: 600 }}
            className="hover:underline"
          >
            Try a broader search on Google Maps →
          </a>
        </p>
      )}
    </section>
  );
}
