'use client';

import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    if (!adRef.current || initializedRef.current) return;

    const status = adRef.current.getAttribute('data-adsbygoogle-status');
    if (status === 'done' || status === 'filled') {
      initializedRef.current = true;
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      initializedRef.current = true;
    } catch (error) {
      // Evitar ruido por llamadas duplicadas de AdSense
      if (error instanceof Error && error.message.toLowerCase().includes('already')) {
        initializedRef.current = true;
        return;
      }
      console.error('AdSense initialization error:', error);
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{
        display: 'block',
        ...style,
      }}
      data-ad-client="ca-pub-1428727998918616"
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
      style={{
        display: 'block',
        background: '#f5f5f5',
        border: '1px dashed #d1d5db',
        ...style,
      }}
    />
  );
}

// Componente para banner horizontal (header/footer)
export function AdBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full my-4 flex justify-center ${className}`}>
      {isNonEmptyString(SLOT_HEADER) ? (
        <AdSense
          adSlot={SLOT_HEADER}
          adFormat="horizontal"
          fullWidthResponsive={true}
          style={{ minHeight: '90px' }}
          className="w-full"
        />
      ) : (
        <AdFallback className="w-full" style={{ minHeight: '90px' }} />
      )}
    </div>
  );
}

// Componente para anuncio lateral (sidebar)
export function AdSidebar({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full my-4 flex justify-center ${className}`}>
      {isNonEmptyString(SLOT_SIDEBAR) ? (
        <AdSense
          adSlot={SLOT_SIDEBAR}
          adFormat="vertical"
          fullWidthResponsive={true}
          style={{ minHeight: '250px', width: '100%' }}
          className="w-full"
        />
      ) : (
        <AdFallback className="w-full" style={{ minHeight: '250px' }} />
      )}
    </div>
  );
}

// Componente para anuncio entre contenido
export function AdInContent({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full my-8 flex justify-center ${className}`}>
      {isNonEmptyString(SLOT_INCONTENT) ? (
        <AdSense
          adSlot={SLOT_INCONTENT}
          adFormat="auto"
          fullWidthResponsive={true}
          style={{ minHeight: '250px', width: '100%' }}
          className="w-full"
        />
      ) : (
        <AdFallback className="w-full" style={{ minHeight: '250px' }} />
      )}
    </div>
  );
}

// Componente para anuncio en lista de tractores
export function AdList({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full my-6 flex justify-center ${className}`}>
      {isNonEmptyString(SLOT_LIST) ? (
        <AdSense
          adSlot={SLOT_LIST}
          adFormat="rectangle"
          fullWidthResponsive={true}
          style={{ minHeight: '280px', width: '100%' }}
          className="w-full"
        />
      ) : (
        <AdFallback className="w-full" style={{ minHeight: '280px' }} />
      )}
    </div>
  );
}
