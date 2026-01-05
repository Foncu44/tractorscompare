'use client';

import { useEffect, useRef, useState } from 'react';

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
  const adRef = useRef<HTMLModElement>(null);
  const initializedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  // Solo montar en el cliente para evitar hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Solo inicializar una vez
    if (initializedRef.current || !adRef.current || !mounted) {
      return;
    }

    // Función para verificar si el script de AdSense está cargado
    const isAdSenseLoaded = () => {
      return typeof window !== 'undefined' && 
             window.adsbygoogle && 
             (Array.isArray(window.adsbygoogle) || typeof window.adsbygoogle.push === 'function');
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

    // Esperar a que el DOM y el script estén listos
    // Aumentar el tiempo de espera para asegurar que el script se cargue
    const timer = setTimeout(initializeAd, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [mounted]);

  // No renderizar hasta que esté montado en el cliente
  if (!mounted) {
    return (
      <div
        className={className}
        style={{
          display: 'block',
          minHeight: style?.minHeight || '250px',
          ...style,
        }}
      />
    );
  }

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