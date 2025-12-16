interface TractorImagePlaceholderProps {
  brand?: string;
  model?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function TractorImagePlaceholder({
  brand,
  model,
  width = 400,
  height = 300,
  className = '',
}: TractorImagePlaceholderProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  
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

