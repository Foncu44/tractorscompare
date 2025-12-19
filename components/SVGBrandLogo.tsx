'use client';

import { useState, useEffect } from 'react';

interface SVGBrandLogoProps {
  logoPath: string;
  brandName: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function SVGBrandLogo({
  logoPath,
  brandName,
  width = 80,
  height = 80,
  className = '',
}: SVGBrandLogoProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Intentar cargar el SVG como texto
    // Si es una URL externa, usar directamente; si es local, usar fetch
    const isExternalUrl = logoPath.startsWith('http://') || logoPath.startsWith('https://');
    
    if (isExternalUrl) {
      // Para URLs externas, usar fetch con CORS
      fetch(logoPath, {
        mode: 'cors',
        referrerPolicy: 'no-referrer-when-downgrade'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch SVG: ${response.status}`);
          }
          return response.text();
        })
        .then(text => {
          setSvgContent(text);
          setHasError(false);
        })
        .catch(error => {
          console.error(`Error loading external SVG from ${logoPath}:`, error);
          setHasError(true);
        });
    } else {
      // Para rutas locales
      fetch(logoPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch SVG: ${response.status}`);
          }
          return response.text();
        })
        .then(text => {
          setSvgContent(text);
          setHasError(false);
        })
        .catch(error => {
          console.error(`Error loading SVG from ${logoPath}:`, error);
          setHasError(true);
        });
    }
  }, [logoPath]);

  if (hasError || !svgContent) {
    // Fallback a img tag si fetch falla
    return (
      <img
        src={logoPath}
        alt={brandName}
        className={`object-contain ${className}`}
        width={width}
        height={height}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`, 
          maxWidth: '100%', 
          maxHeight: '100%',
          display: 'block'
        }}
      />
    );
  }

  // Renderizar SVG como HTML directamente
  return (
    <div
      className={className}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

