'use client';

import { useState, useEffect, useRef } from 'react';

interface TractorImagePlaceholderProps {
  brand?: string;
  model?: string;
  imageUrl?: string;
  width?: number;
  height?: number;
  className?: string;
}

// Función para validar si una URL es válida
function isValidImageUrl(url: string): boolean {
  if (!url || url.trim() === '' || url === 'null' || url === 'undefined') return false;
  
  try {
    const urlObj = new URL(url);
    // Solo permitir HTTPS y HTTP
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    // Validar que sea una URL de imagen común
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const pathname = urlObj.pathname.toLowerCase();
    
    // Para Wikimedia Commons, aceptar si contiene números seguidos de px (ej: 250px-)
    const isWikimediaImage = urlObj.hostname.includes('wikimedia') || 
                             urlObj.hostname.includes('commons.wikimedia') ||
                             (urlObj.hostname.includes('upload.wikimedia') && /\d+px/.test(pathname));
    
    return imageExtensions.some(ext => pathname.includes(ext)) || 
           pathname.includes('image') || 
           isWikimediaImage;
  } catch {
    // Si la URL no se puede parsear, intentar decodificar y validar de nuevo
    try {
      const decodedUrl = decodeURIComponent(url);
      const urlObj = new URL(decodedUrl);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return false;
      }
      const pathname = urlObj.pathname.toLowerCase();
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      return imageExtensions.some(ext => pathname.includes(ext)) || 
             urlObj.hostname.includes('wikimedia');
    } catch {
      return false;
    }
  }
}

export default function TractorImagePlaceholder({
  brand,
  model,
  imageUrl,
  width = 400,
  height = 300,
  className = '',
}: TractorImagePlaceholderProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [shouldTryLoad, setShouldTryLoad] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Intersection Observer para lazy loading más agresivo
  // Usar requestIdleCallback para no bloquear el hilo principal
  useEffect(() => {
    if (!containerRef.current) return;

    const setupObserver = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '50px', // Cargar 50px antes de que sea visible
          threshold: 0.01,
        }
      );

      observer.observe(containerRef.current!);
      return observer;
    };

    // Defer observer setup si el navegador está ocupado
    let observer: IntersectionObserver | null = null;
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = requestIdleCallback(() => {
        observer = setupObserver();
      }, { timeout: 200 });
      
      return () => {
        cancelIdleCallback(idleId);
        observer?.disconnect();
      };
    } else {
      // Fallback inmediato
      observer = setupObserver();
      return () => {
        observer?.disconnect();
      };
    }
  }, []);

  // Validar URL y decidir si intentar cargar
  useEffect(() => {
    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Reset states when URL changes
    setImageError(false);
    setImageLoading(true);
    setShouldTryLoad(false);
    
    // Solo intentar cargar si está en viewport
    if (!isInView) {
      return;
    }
    
    // Validar y preparar para cargar
    if (imageUrl && imageUrl.trim() !== '' && imageUrl !== 'null' && imageUrl !== 'undefined') {
      if (isValidImageUrl(imageUrl)) {
        // Para imágenes de Wikimedia, usar un delay más largo en móvil para evitar rate limiting
        // Y manejar mejor los errores 429
        const isWikimedia = imageUrl.includes('wikimedia.org');
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        
        // En móvil, esperar más antes de intentar cargar imágenes de Wikimedia
        // para evitar errores 429 que afectan PageSpeed
        const delay = isWikimedia ? (isMobile ? 300 : 150) : 0;
        
        setTimeout(() => {
          setShouldTryLoad(true);
          // Timeout más corto para imágenes de Wikimedia (más corto en móvil para mejor UX)
          // Pero suficiente para evitar errores 429
          const timeoutDuration = isWikimedia ? (isMobile ? 600 : 800) : 1500;
          timeoutRef.current = setTimeout(() => {
            setImageError(true);
            setImageLoading(false);
            setShouldTryLoad(false);
            timeoutRef.current = null;
          }, timeoutDuration);
        }, delay);
      } else {
        // URL no válida, mostrar placeholder inmediatamente
        setImageError(true);
        setImageLoading(false);
        setShouldTryLoad(false);
      }
    } else {
      // No hay URL válida, mostrar placeholder inmediatamente
      setImageError(true);
      setImageLoading(false);
      setShouldTryLoad(false);
    }
    
    // Cleanup: limpiar timeout al desmontar o cuando cambia imageUrl
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [imageUrl, isInView]);
  
  // Si hay imageUrl válida y no hay error, mostrar la imagen
  if (imageUrl && shouldTryLoad && !imageError && imageUrl.trim() !== '' && imageUrl !== 'null' && imageUrl !== 'undefined') {
    return (
      <div 
        ref={containerRef}
        className={`bg-white flex items-center justify-center relative overflow-hidden ${className}`}
        style={{ width, height }}
      >
        {/* Mostrar placeholder mientras carga, solo si está cargando - sin mensaje para que sea más rápido */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-100 z-10" />
        )}
        <img
          ref={imgRef}
          src={imageUrl}
          alt={brand && model ? `${brand} ${model}` : 'Tractor'}
          width={width}
          height={height}
          className="w-full h-full object-contain"
          style={{ 
            opacity: imageLoading ? 0 : 1,
            transition: 'opacity 0.15s ease-in-out',
            position: 'relative',
            zIndex: imageLoading ? 0 : 1
          }}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          fetchPriority="low"
          onLoad={() => {
            // Limpiar timeout si la imagen carga exitosamente
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            setImageLoading(false);
            setImageError(false);
          }}
          onError={(e) => {
            // Limpiar timeout en caso de error
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            
            // Si es error 429 (Too Many Requests), no reintentar inmediatamente
            const target = e.target as HTMLImageElement;
            const isRateLimit = imageUrl.includes('wikimedia.org');
            
            // Manejar error inmediatamente - mostrar placeholder sin esperar timeout
            setImageError(true);
            setImageLoading(false);
            
            // Para imágenes de Wikimedia con error, no reintentar
            if (isRateLimit) {
              // Marcar como error permanente para esta sesión
              setShouldTryLoad(false);
            }
          }}
        />
      </div>
    );
  }
  
  // Mostrar placeholder premium si no hay imagen o hubo error
  return (
    <div 
      ref={containerRef}
      className={`bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Gradient Background */}
        <defs>
          <linearGradient id="placeholderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9FAFB" />
            <stop offset="100%" stopColor="#F3F4F6" />
          </linearGradient>
        </defs>
        <rect width={width} height={height} fill="url(#placeholderGradient)" />
        
        {/* Decorative Pattern */}
        <g opacity="0.05">
          <circle cx={centerX - 100} cy={centerY - 80} r="60" fill="#6B7280" />
          <circle cx={centerX + 120} cy={centerY + 100} r="80" fill="#6B7280" />
        </g>
        
        {/* Tractor Icon - More elegant */}
        <g opacity="0.2" transform={`translate(${centerX}, ${centerY - 20})`}>
          {/* Tractor Body - More refined */}
          <rect x="-70" y="-20" width="140" height="45" rx="10" fill="#4B5563" />
          {/* Cabin */}
          <rect x="-40" y="-40" width="40" height="30" rx="6" fill="#374151" />
          {/* Front Wheel */}
          <circle cx="-55" cy="30" r="16" fill="#1F2937" />
          <circle cx="-55" cy="30" r="10" fill="#FFFFFF" />
          {/* Rear Wheel (larger) */}
          <circle cx="55" cy="30" r="22" fill="#1F2937" />
          <circle cx="55" cy="30" r="14" fill="#FFFFFF" />
          {/* Exhaust Pipe */}
          <rect x="40" y="-45" width="8" height="18" fill="#374151" />
          {/* Front Grille */}
          <rect x="-70" y="-15" width="18" height="25" rx="3" fill="#6B7280" />
        </g>
        
        {/* Icon Container */}
        <g transform={`translate(${centerX}, ${centerY - 20})`}>
          <circle cx="0" cy="0" r="40" fill="white" opacity="0.8" />
          <path
            d="M-15,-10 L15,-10 L15,10 L-15,10 Z M-10,-5 L10,-5 M-5,-10 L-5,10 M5,-10 L5,10"
            stroke="#9CA3AF"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        
        {/* Main Text - More elegant */}
        <text
          x={centerX}
          y={centerY + 35}
          textAnchor="middle"
          fill="#6B7280"
          fontSize={Math.min(width / 20, 18)}
          fontWeight="600"
          fontFamily="system-ui, -apple-system, sans-serif"
          dominantBaseline="middle"
        >
          Photo Not Available
        </text>
        
        {/* Brand and Model (if provided) - More subtle */}
        {brand && model && (
          <text
            x={centerX}
            y={centerY + 55}
            textAnchor="middle"
            fill="#9CA3AF"
            fontSize={Math.min(width / 28, 14)}
            fontFamily="system-ui, -apple-system, sans-serif"
            dominantBaseline="middle"
          >
            {brand} {model}
          </text>
        )}
      </svg>
    </div>
  );
}

