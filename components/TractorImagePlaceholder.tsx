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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Validar URL y decidir si intentar cargar
  useEffect(() => {
    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Resetear estados cuando cambia la URL
    setImageError(false);
    setImageLoading(true);
    setShouldTryLoad(false);
    
    // Validar y preparar para cargar
    if (imageUrl && imageUrl.trim() !== '' && imageUrl !== 'null' && imageUrl !== 'undefined') {
      if (isValidImageUrl(imageUrl)) {
        setShouldTryLoad(true);
        // Timeout corto (1.5 segundos) - si la imagen no carga en este tiempo, mostrar placeholder
        timeoutRef.current = setTimeout(() => {
          setImageError(true);
          setImageLoading(false);
          timeoutRef.current = null;
        }, 1500);
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
  }, [imageUrl]);
  
  // Si hay imageUrl válida y no hay error, mostrar la imagen
  if (imageUrl && shouldTryLoad && !imageError && imageUrl.trim() !== '' && imageUrl !== 'null' && imageUrl !== 'undefined') {
    return (
      <div 
        className={`bg-white flex items-center justify-center relative overflow-hidden ${className}`}
        style={{ width, height }}
      >
        {/* Mostrar placeholder mientras carga, solo si está cargando - sin mensaje para que sea más rápido */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-100 z-10" />
        )}
        <img
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
          referrerPolicy="no-referrer"
          onLoad={() => {
            // Limpiar timeout si la imagen carga exitosamente
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            setImageLoading(false);
            setImageError(false);
          }}
          onError={() => {
            // Limpiar timeout en caso de error
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            // Manejar error inmediatamente - mostrar placeholder sin esperar timeout
            setImageError(true);
            setImageLoading(false);
          }}
        />
      </div>
    );
  }
  
  // Mostrar placeholder si no hay imagen o hubo error
  return (
    <div 
      className={`bg-white flex items-center justify-center relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* White Background */}
        <rect width={width} height={height} fill="#FFFFFF" />
        
        {/* Faded Tractor Silhouette in Background */}
        <g opacity="0.15" transform={`translate(${centerX}, ${centerY})`}>
          {/* Tractor Body */}
          <rect x="-80" y="-25" width="160" height="50" rx="8" fill="#4B5563" />
          {/* Cabin */}
          <rect x="-50" y="-45" width="45" height="35" rx="5" fill="#374151" />
          {/* Front Wheel */}
          <circle cx="-60" cy="35" r="18" fill="#1F2937" />
          <circle cx="-60" cy="35" r="12" fill="#FFFFFF" />
          {/* Rear Wheel (larger) */}
          <circle cx="60" cy="35" r="25" fill="#1F2937" />
          <circle cx="60" cy="35" r="16" fill="#FFFFFF" />
          {/* Exhaust Pipe */}
          <rect x="45" y="-50" width="10" height="20" fill="#374151" />
          {/* Front Grille */}
          <rect x="-75" y="-20" width="20" height="30" rx="3" fill="#6B7280" />
        </g>
        
        {/* Main Text - NO PHOTO AVAILABLE */}
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          fill="#000000"
          fontSize={Math.min(width / 15, 28)}
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          dominantBaseline="middle"
          letterSpacing="2"
        >
          NO PHOTO AVAILABLE
        </text>
        
        {/* Brand and Model (if provided) */}
        {brand && model && (
          <text
            x={centerX}
            y={centerY + 30}
            textAnchor="middle"
            fill="#6B7280"
            fontSize={Math.min(width / 25, 16)}
            fontFamily="Arial, sans-serif"
            dominantBaseline="middle"
          >
            {brand} {model}
          </text>
        )}
      </svg>
    </div>
  );
}

