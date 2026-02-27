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

    // Script is loaded by layout.tsx (Next.js Script from pagead2.googlesyndication.com). Do not inject or proxy it.

    // Función para verificar si el script de AdSense está cargado
    const isAdSenseLoaded = () => {
      if (typeof window === 'undefined') return false;
      const ads = (window as any).adsbygoogle;
      if (!ads) return false;
      if (Array.isArray(ads)) return true;
      return typeof ads.push === 'function';
    };

    // Función para inicializar el anuncio
    const initializeAd = () => {
      if (!adRef.current) return;

      try {
        // Verificar si el elemento ya tiene el atributo que indica que fue inicializado
        const status = adRef.current.getAttribute('data-adsbygoogle-status');
        if (status === 'done' || status === 'filled') {
          initializedRef.current = true;
          return;
        }

        // Verificar si ya tiene un anuncio asociado
        if (status) {
          initializedRef.current = true;
          return;
        }

        // Asegurar que adsbygoogle esté disponible
        if (!isAdSenseLoaded()) {
          // Esperar más tiempo y reintentar
          let retries = 0;
          const maxRetries = 50; // 5 segundos máximo
          
          const checkAndRetry = () => {
            if (retries >= maxRetries) {
              console.warn('AdSense script not loaded after maximum retries');
              return;
            }
            
            if (isAdSenseLoaded()) {
              initializeAd();
            } else {
              retries++;
              setTimeout(checkAndRetry, 100);
            }
          };
          
          setTimeout(checkAndRetry, 100);
          return;
        }

        // Inicializar adsbygoogle si no existe como array
        if (!Array.isArray(window.adsbygoogle)) {
          window.adsbygoogle = [];
        }
        
        // Inicializar el anuncio usando el método correcto de AdSense
        try {
          // Después de verificar/crear el array, siempre será un array
          const adsbygoogle = window.adsbygoogle as any[];
          adsbygoogle.push({});
          
          // Forzar la inicialización si es necesario
          if (typeof (window as any).adsbygoogle?.loaded === 'undefined') {
            (window as any).adsbygoogle.loaded = true;
          }
        } catch (pushError) {
          // Si push falla, intentar inicialización manual
          if (adRef.current && typeof (window as any).adsbygoogle?.requestNonPersonalizedAds === 'function') {
            (window as any).adsbygoogle.requestNonPersonalizedAds = 1;
          }
        }
        
        initializedRef.current = true;
      } catch (err) {
        // Ignorar errores de múltiples inicializaciones
        if (err instanceof Error && (
          err.message.includes('already have ads') || 
          err.message.includes('adsbygoogle') ||
          err.message.includes('duplicate')
        )) {
          initializedRef.current = true;
          return;
        }
        // Solo loggear errores críticos
        if (err instanceof Error && !err.message.includes('adsbygoogle')) {
          console.error('AdSense error:', err);
        }
      }
    };

    // Usar Intersection Observer para inicializar el anuncio solo cuando sea visible (script ya cargado por layout)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !initializedRef.current) {
            const checkScript = setInterval(() => {
              if (isAdSenseLoaded()) {
                clearInterval(checkScript);
                initializeAd();
              }
            }, 100);
            setTimeout(() => clearInterval(checkScript), 5000);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px', threshold: 0.01 }
    );

    if (adRef.current) {
      const rect = adRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight + 50 && rect.bottom > -50;
      if (isVisible) {
        const checkScript = setInterval(() => {
          if (isAdSenseLoaded()) {
            clearInterval(checkScript);
            initializeAd();
          }
        }, 100);
        setTimeout(() => clearInterval(checkScript), 5000);
      } else {
        observer.observe(adRef.current);
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
