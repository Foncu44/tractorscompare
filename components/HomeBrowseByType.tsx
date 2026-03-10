'use client';

import Link from 'next/link';
import { pathForLocale } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/config';
import { ArrowRight } from 'lucide-react';

interface HomeBrowseByTypeProps {
  locale?: Locale;
}

const TYPES = [
  {
    slug: 'compact',
    label: 'Compact Tractors',
    desc: 'Versatile machines under 40 HP, ideal for small farms and hobby operations.',
    emoji: '🚜',
    color: 'from-blue-600 to-blue-700',
    bg:    'bg-blue-50',
    border:'border-blue-100 hover:border-blue-300',
    text:  'text-blue-700',
  },
  {
    slug: 'utility',
    label: 'Utility Tractors',
    desc: 'The workhorse 40–100 HP class for row crops, hayfields, and general farming.',
    emoji: '🌾',
    color: 'from-primary-600 to-primary-700',
    bg:    'bg-primary-50',
    border:'border-primary-100 hover:border-primary-300',
    text:  'text-primary-700',
  },
  {
    slug: 'lawn',
    label: 'Lawn & Garden',
    desc: 'Purpose-built for lawn care, landscaping, and residential property maintenance.',
    emoji: '🌿',
    color: 'from-emerald-600 to-emerald-700',
    bg:    'bg-emerald-50',
    border:'border-emerald-100 hover:border-emerald-300',
    text:  'text-emerald-700',
  },
  {
    slug: 'mower',
    label: 'Riding Mowers',
    desc: 'Zero-turn and riding mower platforms engineered for efficient grass cutting.',
    emoji: '✂️',
    color: 'from-amber-600 to-amber-700',
    bg:    'bg-amber-50',
    border:'border-amber-100 hover:border-amber-300',
    text:  'text-amber-700',
  },
];

export default function HomeBrowseByType({ locale = 'en' }: HomeBrowseByTypeProps) {
  return (
    <section className="py-14 md:py-20 bg-surface-warm">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-amber-600 font-semibold text-xs uppercase tracking-widest mb-2">Categories</p>
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-stone-900 mb-3">
            Browse by Tractor Type
          </h2>
          <p className="text-stone-500 text-base max-w-xl mx-auto leading-relaxed">
            Not sure where to start? Filter by the tractor type that fits your operation.
          </p>
        </div>

        {/* Type cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TYPES.map(({ slug, label, desc, emoji, color, bg, border, text }) => (
            <Link
              key={slug}
              href={pathForLocale(`type/${slug}`, locale)}
              className={`group relative bg-white rounded-2xl border-2 ${border} p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover overflow-hidden`}
            >
              {/* Background corner decoration */}
              <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${bg} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-md text-2xl`}>
                  {emoji}
                </div>

                {/* Text */}
                <h3 className={`font-heading text-lg font-bold mb-2 ${text}`}>{label}</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-4">{desc}</p>

                {/* CTA arrow */}
                <div className={`flex items-center gap-1 text-sm font-semibold ${text}`}>
                  Explore
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
