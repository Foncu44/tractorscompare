'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getBrandLogo } from '@/lib/brandLogos';
import SVGBrandLogo from './SVGBrandLogo';

interface BrandLogoProps {
  brandName: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function BrandLogo({
  brandName,
  width = 80,
  height = 80,
  className = '',
}: BrandLogoProps) {
  const logoPath = getBrandLogo(brandName);
  const [hasError, setHasError] = useState(false);

  if (!logoPath || hasError) {
    // Calcular tamaño de fuente basado en el ancho disponible
    const fontSize = Math.min(width / (brandName.length * 0.6), height / 2, 14);
    
    return (
      <div 
        className={`font-bold ${className}`} 
        style={{ 
          width: `${width}px`, 
          height: `${height}px`, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: `${fontSize}px`,
          lineHeight: '1.2',
          textAlign: 'center',
          padding: '4px',
          wordBreak: 'break-word',
          overflow: 'hidden',
          color: '#000000',
          fontFamily: "'Times New Roman', Times, serif"
        }}
      >
        {brandName}
      </div>
    );
  }

  // Estilos específicos por marca
  const getBrandSpecificStyles = () => {
    const normalizedBrand = brandName.toLowerCase();
    
    // Case IH: ajustar para mejor visualización
    if (normalizedBrand === 'case ih' || normalizedBrand === 'case') {
      return {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain' as const,
      };
    }
    
    // Massey Ferguson: max-width 64px
    if (normalizedBrand === 'massey ferguson') {
      return {
        maxWidth: '64px',
      };
    }
    
    return {};
  };

  const brandSpecificStyles = getBrandSpecificStyles();

  // Para SVG, usar componente especializado que carga el SVG como HTML
  if (logoPath.endsWith('.svg')) {
    return (
      <div 
        className={className}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <SVGBrandLogo
          logoPath={logoPath}
          brandName={brandName}
          width={width}
          height={height}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // Para PNG/JPG usar Next.js Image
  return (
    <div 
      className={className}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <Image
        src={logoPath}
        alt={brandName}
        width={width}
        height={height}
        className="object-contain"
        style={{ 
          maxWidth: '100%', 
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          ...brandSpecificStyles
        }}
        unoptimized
        onError={() => {
          console.error(`Error loading image: ${logoPath} for brand: ${brandName}`);
          setHasError(true);
        }}
        onLoad={() => {
          console.log(`Successfully loaded image: ${logoPath} for brand: ${brandName}`);
        }}
      />
    </div>
  );
}

