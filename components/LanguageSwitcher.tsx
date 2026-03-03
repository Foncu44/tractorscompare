'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import { pathForLocale } from '@/lib/i18n/routes';
import { ES_TO_EN_FIRST_SEGMENT } from '@/lib/i18n/routes';
import { PATH_SEGMENT_BY_LOCALE } from '@/lib/i18n/routes';

const LANGUAGES: { locale: Locale; label: string }[] = [
  { locale: 'en', label: 'English' },
  { locale: 'es', label: 'Español' },
];

function getLocalePath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] !== 'es' && segments[0] !== 'en') return `/${targetLocale}`;
  const currentLocale = segments[0] as Locale;
  const rest = segments.slice(1);
  if (rest.length === 0) return `/${targetLocale}`;
  const first = rest[0];
  let logicalFirst: string;
  if (currentLocale === 'es') {
    logicalFirst = ES_TO_EN_FIRST_SEGMENT[first] ?? first;
  } else {
    const pair = Object.entries(PATH_SEGMENT_BY_LOCALE).find(([, v]) => v.en === first);
    logicalFirst = pair ? pair[0] : first;
  }
  const logicalPath = [logicalFirst, ...rest.slice(1)].filter(Boolean).join('/');
  return pathForLocale(logicalPath, targetLocale);
}

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-5 h-5" strokeWidth={1.8} />
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 py-1.5 min-w-[180px] bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          {LANGUAGES.map(({ locale: loc, label }) => {
            const href = getLocalePath(pathname, loc);
            const isSelected = locale === loc;
            return (
              <Link
                key={loc}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  isSelected
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span>{label}</span>
                {isSelected && (
                  <span className="text-primary-600">
                    <Check className="w-4 h-4" />
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
