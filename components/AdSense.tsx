'use client';

import { useEffect, useRef, useState } from 'react';
import { isAdSensePreview } from '@/src/lib/runtimeEnv';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

function isNonEmptyString(value: string | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export default function AdSense({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  style,
  className = '',
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const initializedRef = useRef(false);
  // Suppress ads in AdSense preview to avoid "Something went wrong" crash
  const [inPreview, setInPreview] = useState(false);

  useEffect(() => {
    if (isAdSensePreview()) {
      setInPreview(true);
      return;
    }

    if (!adRef.current || initializedRef.current) return;

    const status = adRef.current.getAttribute('data-adsbygoogle-status');
    if (status) {
      initializedRef.current = true;
      return;
    }

    const isAdSenseLoaded = () => {
      if (typeof window === 'undefined') return false;
      const ads = (window as Window & typeof globalThis).adsbygoogle;
      if (!ads) return false;
      return Array.isArray(ads) || typeof ads.push === 'function';
    };

    const initializeAd = () => {
      if (!adRef.current || initializedRef.current) return;
      const currentStatus = adRef.current.getAttribute('data-adsbygoogle-status');
      if (currentStatus) { initializedRef.current = true; return; }
      try {
        if (!Array.isArray(window.adsbygoogle)) window.adsbygoogle = [];
        (window.adsbygoogle as unknown[]).push({});
        initializedRef.current = true;
      } catch (err) {
        if (err instanceof Error && !err.message.includes('adsbygoogle')) {
          console.error('AdSense init error:', err);
        }
      }
    };

    const tryInit = () => {
      if (isAdSenseLoaded()) {
        initializeAd();
        return true;
      }
      return false;
    };

    // Try immediately; if not ready, poll up to 5s then observe intersection
    if (!tryInit()) {
      let retries = 0;
      const poll = setInterval(() => {
        if (++retries > 50 || tryInit()) clearInterval(poll);
      }, 100);
    }
  }, []);

  // In AdSense preview mode, render a placeholder so the preview doesn't crash
  if (inPreview) {
    return (
      <div
        className={className}
        style={{
          display: 'block',
          minHeight: style?.minHeight ?? '90px',
          background: 'transparent',
          ...style,
        }}
      />
    );
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', ...style }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-1428727998918616'}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
    />
  );
}

const SLOT_HEADER = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER;
const SLOT_SIDEBAR = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR;
const SLOT_INCONTENT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT;
const SLOT_LIST = process.env.NEXT_PUBLIC_ADSENSE_SLOT_LIST;

function AdFallback({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  if (process.env.NODE_ENV === 'production') return null;
  return (
    <div
      className={className}
      style={{ display: 'block', background: '#f5f5f5', border: '1px dashed #d1d5db', ...style }}
    />
  );
}

export function AdBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full my-4 flex justify-center ${className}`}>
      {isNonEmptyString(SLOT_HEADER) ? (
        <AdSense adSlot={SLOT_HEADER} adFormat="horizontal" fullWidthResponsive style={{ minHeight: '90px' }} className="w-full" />
      ) : (
        <AdFallback className="w-full" style={{ minHeight: '90px' }} />
      )}
    </div>
  );
}

export function AdSidebar({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full my-4 flex justify-center ${className}`}>
      {isNonEmptyString(SLOT_SIDEBAR) ? (
        <AdSense adSlot={SLOT_SIDEBAR} adFormat="vertical" fullWidthResponsive style={{ minHeight: '250px', width: '100%' }} className="w-full" />
      ) : (
        <AdFallback className="w-full" style={{ minHeight: '250px' }} />
      )}
    </div>
  );
}

export function AdInContent({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full my-8 flex justify-center ${className}`}>
      {isNonEmptyString(SLOT_INCONTENT) ? (
        <AdSense adSlot={SLOT_INCONTENT} adFormat="auto" fullWidthResponsive style={{ minHeight: '250px', width: '100%' }} className="w-full" />
      ) : (
        <AdFallback className="w-full" style={{ minHeight: '250px' }} />
      )}
    </div>
  );
}

export function AdList({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full my-6 flex justify-center ${className}`}>
      {isNonEmptyString(SLOT_LIST) ? (
        <AdSense adSlot={SLOT_LIST} adFormat="rectangle" fullWidthResponsive style={{ minHeight: '280px', width: '100%' }} className="w-full" />
      ) : (
        <AdFallback className="w-full" style={{ minHeight: '280px' }} />
      )}
    </div>
  );
}
