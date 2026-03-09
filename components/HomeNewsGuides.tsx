'use client';

import Link from 'next/link';
import { Newspaper, BookOpen, ArrowRight } from 'lucide-react';
import { pathForLocale } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/config';

const placeholderArticles = [
  { title: 'Understanding Tractor Specifications', description: 'Learn how to read and compare engine, transmission, and PTO specifications', href: 'guides/tractor-specifications', type: 'guide' },
  { title: 'Best Compact Tractors 2026', description: 'Top-rated compact utility tractors with detailed performance data', href: 'news/best-compact-tractors-2026', type: 'news' },
  { title: 'Tractor Maintenance Guide', description: 'Essential maintenance tips for diesel engines and hydraulic systems', href: 'guides/tractor-maintenance', type: 'guide' },
];

export default function HomeNewsGuides({ locale = 'en' }: { locale?: Locale }) {
  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              News & Guides
            </h2>
            <p className="text-gray-600">
              Stay updated with the latest tractor news, guides, and equipment information
            </p>
          </div>
          <div className="flex gap-4">
            <Link href={pathForLocale('news', locale)} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors">
              <Newspaper className="w-5 h-5" /> All News
            </Link>
            <Link href={pathForLocale('guides', locale)} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors">
              <BookOpen className="w-5 h-5" /> All Guides
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {placeholderArticles.map((article, index) => (
            <Link
              key={index}
              href={pathForLocale(article.href, locale)}
              className="group bg-white rounded-card border-2 border-gray-200 hover:border-primary-300 p-6 transition-all duration-300 shadow-card hover:shadow-card-hover hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  article.type === 'news' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {article.type === 'news' ? (
                    <Newspaper className="w-6 h-6" />
                  ) : (
                    <BookOpen className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {article.description}
                  </p>
                  <div className="flex items-center text-primary-600 group-hover:text-primary-700 font-semibold text-sm">
                    Read {article.type === 'news' ? 'article' : 'guide'}
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
