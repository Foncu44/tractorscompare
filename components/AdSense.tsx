'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[] | { loaded?: boolean; push: (ad: any) => void };
  }
}

interface AdSenseProps {
  adSlot?: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function AdSense({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  style,
  className = '',
}: AdSenseProps) {
  useEffect(() => {
    try {
      // Inicializar adsbygoogle si no existe
      if (!window.adsbygoogle) {
        window.adsbygoogle = [];
      }
      
      // Verificar si es un array y hacer push
      if (Array.isArray(window.adsbygoogle)) {
        window.adsbygoogle.push({});
      } else if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
        window.adsbygoogle.push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <ins
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

// Componente para banner horizontal (header/footer)
export function AdBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full my-4 flex justify-center ${className}`}>
      <AdSense
        adFormat="horizontal"
        fullWidthResponsive={true}
        style={{ minHeight: '90px' }}
        className="w-full"
      />
    </div>
  );
}

// Componente para anuncio lateral (sidebar)
export function AdSidebar({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full my-4 flex justify-center ${className}`}>
      <AdSense
        adFormat="vertical"
        fullWidthResponsive={true}
        style={{ minHeight: '250px', width: '100%' }}
        className="w-full"
      />
    </div>
  );
}

// Componente para anuncio entre contenido
export function AdInContent({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full my-8 flex justify-center ${className}`}>
      <AdSense
        adFormat="auto"
        fullWidthResponsive={true}
        style={{ minHeight: '250px', width: '100%' }}
        className="w-full"
      />
    </div>
  );
}

// Componente para anuncio en lista de tractores
export function AdList({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full my-6 flex justify-center ${className}`}>
      <AdSense
        adFormat="rectangle"
        fullWidthResponsive={true}
        style={{ minHeight: '280px', width: '100%' }}
        className="w-full"
      />
    </div>
  );
}