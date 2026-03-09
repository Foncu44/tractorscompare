'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, FileText } from 'lucide-react';

interface SEOContentSectionProps {
  content: string;
}

export default function SEOContentSection({ content }: SEOContentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [content]);

  return (
    <div className="mt-8 md:mt-12 bg-white rounded-card border border-gray-200 overflow-hidden shadow-card">
      {/* Header - Siempre visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 md:p-6 hover:bg-gradient-to-r hover:from-primary-50 hover:to-white transition-all duration-200 text-left group"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Ocultar información detallada' : 'Mostrar información detallada'}
      >
        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
          <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-200 flex-shrink-0 shadow-sm">
            <FileText className="h-5 w-5 md:h-6 md:w-6 text-primary-700" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 break-words mb-1">
              Detailed Tractor Information
            </h2>
            <p className="text-sm md:text-base text-gray-600 break-words">
              Complete specifications, technical characteristics and detailed data
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 text-primary-700 group-hover:text-primary-800 transition-colors flex-shrink-0 ml-3">
          <span className="text-sm md:text-base font-semibold hidden sm:inline">
            {isExpanded ? 'Hide' : 'View more'}
          </span>
          <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        </div>
      </button>

      {/* Content - With smooth animation */}
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out bg-gradient-to-b from-white to-gray-50/30"
        style={{
          maxHeight: isExpanded ? `${contentHeight}px` : '0px',
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="px-5 md:px-8 pb-8 md:pb-10 pt-4">
          <div
            className="seo-content-wrapper max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
