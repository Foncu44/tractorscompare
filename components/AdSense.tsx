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
    if (initializedRef.current || !adRef.current) {
      return;
    }

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

        // Verificar si ya tiene un anuncio asociado (atributo interno de AdSense)
        if (adRef.current.hasAttribute('data-adsbygoogle-status')) {
          initializedRef.current = true;
          return;
        }

        // Asegurar que adsbygoogle esté disponible
        if (typeof window === 'undefined' || !window.adsbygoogle) {
          // Esperar a que el script se cargue
          setTimeout(initializeAd, 100);
          return;
        }

        // Inicializar adsbygoogle si no existe
        if (!window.adsbygoogle) {
          window.adsbygoogle = [];
        }
        
        // Inicializar el anuncio solo si el elemento aún no ha sido inicializado
        if (Array.isArray(window.adsbygoogle)) {
          window.adsbygoogle.push({});
        } else if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
          window.adsbygoogle.push({});
        }
        
        initializedRef.current = true;
      } catch (err) {
        // Ignorar errores de múltiples inicializaciones
        if (err instanceof Error && err.message.includes('already have ads')) {
          initializedRef.current = true;
          return;
        }
        console.error('AdSense error:', err);
      }
    };

    // Esperar un poco para asegurar que el DOM está listo
    const timer = setTimeout(initializeAd, 50);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

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