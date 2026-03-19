/**
 * Dynamic Open Graph image for tractor detail pages.
 *
 * URL:  /en/tractors/[slug]/opengraph-image
 *       /es/tractores/[slug]/opengraph-image
 * Size: 1200 × 630 — the minimum for Google Discover cards (must be ≥ 1200px wide).
 *
 * Next.js automatically adds og:image, og:image:width, og:image:height
 * and twitter:image meta tags pointing to this route. No manual metadata needed.
 *
 * Uses Node.js runtime (not Edge) because getTractorBySlug imports the full
 * 10k-tractor dataset which exceeds the Edge 1 MB bundle limit.
 */

import { ImageResponse } from 'next/og';
import { getTractorBySlug } from '@/data/tractors';

export const runtime = 'nodejs';

export const alt = 'Tractor specs, price and review | TractorsCompare';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Capitalise the first letter of each word in a transmission type string.
function formatTx(tx: string): string {
  return tx.charAt(0).toUpperCase() + tx.slice(1);
}

export default async function TractorOgImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tractor = getTractorBySlug(slug);

  const brand = tractor?.brand ?? 'TractorsCompare';
  const model = tractor?.model ?? 'Tractor Database';
  const hp = tractor?.engine?.powerHP;
  const tx = tractor?.transmission?.type;
  const year = tractor?.year;
  const isEs = locale === 'es';

  const typeLabel =
    tractor?.type === 'lawn'
      ? isEs ? 'Jardín' : 'Lawn'
      : tractor?.type === 'industrial'
        ? isEs ? 'Industrial' : 'Industrial'
        : isEs ? 'Agrícola' : 'Agricultural';

  const tagline = isEs
    ? 'Especificaciones · Precio · Review'
    : 'Specs · Price · Review';

  // ─── Colours ───────────────────────────────────────────────────────────
  const BG_DARK   = '#052e16';   // tailwind green-950
  const BG_LIGHT  = '#14532d';   // tailwind green-800
  const ACCENT    = '#4ade80';   // tailwind green-400
  const WHITE     = '#ffffff';
  const WHITE_60  = 'rgba(255,255,255,0.60)';
  const WHITE_10  = 'rgba(255,255,255,0.10)';
  const ACCENT_15 = 'rgba(74,222,128,0.15)';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: `linear-gradient(145deg, ${BG_LIGHT} 0%, ${BG_DARK} 100%)`,
          padding: '56px 64px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative large circle — top-right */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'rgba(74,222,128,0.06)',
          }}
        />
        {/* Decorative small circle — bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(74,222,128,0.05)',
          }}
        />

        {/* ── TOP ROW: brand name + site URL ─────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              color: ACCENT,
              fontSize: 20,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 5,
            }}
          >
            {brand}
          </span>
          <span style={{ color: WHITE_60, fontSize: 17 }}>tractorscompare.com</span>
        </div>

        {/* ── MAIN CONTENT ───────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', gap: 20 }}>
          {/* Model name + year */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
            <span
              style={{
                color: WHITE,
                fontSize: model.length > 10 ? 80 : 96,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: -1,
              }}
            >
              {model}
            </span>
            {year && (
              <span style={{ color: WHITE_60, fontSize: 38, fontWeight: 400 }}>{year}</span>
            )}
          </div>

          {/* Tagline */}
          <span style={{ color: ACCENT, fontSize: 24, fontWeight: 600 }}>{tagline}</span>

          {/* Spec badges */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 8 }}>
            {hp != null && (
              <span
                style={{
                  background: WHITE_10,
                  color: WHITE,
                  borderRadius: 10,
                  padding: '10px 22px',
                  fontSize: 21,
                  fontWeight: 700,
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                {hp} HP
              </span>
            )}
            {tx && (
              <span
                style={{
                  background: WHITE_10,
                  color: WHITE,
                  borderRadius: 10,
                  padding: '10px 22px',
                  fontSize: 21,
                  fontWeight: 700,
                  border: '1px solid rgba(255,255,255,0.15)',
                  textTransform: 'capitalize',
                }}
              >
                {formatTx(tx)}
              </span>
            )}
            <span
              style={{
                background: ACCENT_15,
                color: ACCENT,
                borderRadius: 10,
                padding: '10px 22px',
                fontSize: 21,
                fontWeight: 700,
                border: `1px solid rgba(74,222,128,0.30)`,
              }}
            >
              {typeLabel}
            </span>
          </div>
        </div>

        {/* ── BOTTOM BAR: site branding ──────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {/* Simple inline tractor SVG */}
          <svg width="40" height="30" viewBox="0 0 100 75" fill="none">
            <rect x="30" y="22" width="50" height="32" rx="6" fill={WHITE} fillOpacity="0.85" />
            <rect x="38" y="8" width="24" height="22" rx="4" fill={WHITE} fillOpacity="0.85" />
            <circle cx="22" cy="57" r="18" fill={WHITE} fillOpacity="0.85" />
            <circle cx="22" cy="57" r="10" fill={BG_DARK} />
            <circle cx="76" cy="59" r="13" fill={WHITE} fillOpacity="0.85" />
            <circle cx="76" cy="59" r="7" fill={BG_DARK} />
            <rect x="78" y="14" width="6" height="16" rx="2" fill={WHITE} fillOpacity="0.7" />
          </svg>
          <span style={{ color: WHITE, fontSize: 22, fontWeight: 700 }}>TractorsCompare</span>
          <span style={{ color: WHITE_60, fontSize: 17, marginLeft: 4 }}>
            {isEs ? '· Base de datos de tractores' : '· Tractor Database & Specs'}
          </span>
        </div>
      </div>
    ),
    size,
  );
}
