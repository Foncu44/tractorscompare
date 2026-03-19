/**
 * Site-wide fallback OG image for pages that don't have a specific image.
 * Appears in Google Discover, social shares of the homepage, brand pages, etc.
 *
 * Size: 1200 × 630 — minimum required for Google Discover.
 */

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'TractorsCompare — Tractor Database & Specifications';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BG_DARK   = '#052e16';
const BG_LIGHT  = '#14532d';
const ACCENT    = '#4ade80';
const WHITE     = '#ffffff';
const WHITE_60  = 'rgba(255,255,255,0.60)';
const WHITE_10  = 'rgba(255,255,255,0.10)';

export default function SiteOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: `linear-gradient(145deg, ${BG_LIGHT} 0%, ${BG_DARK} 100%)`,
          padding: '64px 80px',
          position: 'relative',
          overflow: 'hidden',
          justifyContent: 'space-between',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -140, right: -140, width: 520, height: 520, borderRadius: '50%', background: 'rgba(74,222,128,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 360, height: 360, borderRadius: '50%', background: 'rgba(74,222,128,0.05)' }} />

        {/* Top: site name */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: ACCENT, fontSize: 20, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase' }}>
            TractorsCompare
          </span>
          <span style={{ color: WHITE_60, fontSize: 17 }}>tractorscompare.com</span>
        </div>

        {/* Main heading */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span style={{ color: WHITE, fontSize: 78, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>
            Tractor Database
          </span>
          <span style={{ color: WHITE, fontSize: 78, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>
            & Specifications
          </span>
          <span style={{ color: ACCENT, fontSize: 26, fontWeight: 600, marginTop: 8 }}>
            10,000+ tractors · Specs · Price · Review
          </span>

          {/* Feature pills */}
          <div style={{ display: 'flex', gap: 14, marginTop: 12 }}>
            {['John Deere', 'Kubota', 'New Holland', 'Massey Ferguson', '+300 brands'].map((brand) => (
              <span
                key={brand}
                style={{
                  background: WHITE_10,
                  color: WHITE,
                  borderRadius: 8,
                  padding: '8px 18px',
                  fontSize: 17,
                  fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <svg width="40" height="30" viewBox="0 0 100 75" fill="none">
            <rect x="30" y="22" width="50" height="32" rx="6" fill={WHITE} fillOpacity="0.85" />
            <rect x="38" y="8" width="24" height="22" rx="4" fill={WHITE} fillOpacity="0.85" />
            <circle cx="22" cy="57" r="18" fill={WHITE} fillOpacity="0.85" />
            <circle cx="22" cy="57" r="10" fill={BG_DARK} />
            <circle cx="76" cy="59" r="13" fill={WHITE} fillOpacity="0.85" />
            <circle cx="76" cy="59" r="7" fill={BG_DARK} />
            <rect x="78" y="14" width="6" height="16" rx="2" fill={WHITE} fillOpacity="0.7" />
          </svg>
          <span style={{ color: WHITE, fontSize: 24, fontWeight: 700 }}>TractorsCompare</span>
          <span style={{ color: WHITE_60, fontSize: 18, marginLeft: 4 }}>· Free Tractor Specs Database</span>
        </div>
      </div>
    ),
    size,
  );
}
