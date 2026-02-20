'use client';

import { useState, useEffect } from 'react';

interface SVGBrandLogoProps {
  logoPath: string;
  brandName: string;
  width?: number;
  height?: number;
  className?: string;
}

function Placeholder({ brandName, width, height }: { brandName: string; width: number; height: number }) {
  const fontSize = Math.min(width / (brandName.length * 0.6), height / 2, 20);
  return (
    <div
      className="font-bold text-white flex items-center justify-center text-center"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        fontSize: `${fontSize}px`,
        lineHeight: 1.2,
        padding: '4px',
        wordBreak: 'break-word' as const,
        overflow: 'hidden',
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {brandName}
    </div>
  );
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

  const isExternalUrl = logoPath.startsWith('http://') || logoPath.startsWith('https://');

  // External URLs: use <img> only; on error show placeholder (no fetch = no CORS/404 in console)
  useEffect(() => {
    if (isExternalUrl) return;
    fetch(logoPath)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.text();
      })
      .then((text) => setSvgContent(text))
      .catch(() => setHasError(true));
  }, [logoPath, isExternalUrl]);

  // External SVG: single <img> attempt; on error show placeholder (no retry)
  if (isExternalUrl) {
    if (hasError) return <Placeholder brandName={brandName} width={width} height={height} />;
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
          display: 'block',
        }}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    );
  }

  if (hasError || !svgContent) {
    return <Placeholder brandName={brandName} width={width} height={height} />;
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

