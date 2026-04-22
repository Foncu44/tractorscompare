import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { locales } from '@/lib/i18n/config';
import { pathForLocale, getCanonicalUrl, getAlternates } from '@/lib/i18n/routes';
import LocaleLink from '@/components/LocaleLink';
import blogData from '@/data/blog.json';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tractorscompare.com';

interface ContentBlock {
  type: string;
  level?: number;
  text?: string;
  items?: string[];
}

interface BlogArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  authorBio?: string;
  category: string;
  keywords: string[];
  excerpt: string;
  content: ContentBlock[];
  imageUrl?: string;
  imageAlt: string;
  readingTimeMinutes?: number;
}

function getArticle(slug: string): BlogArticle | undefined {
  return (blogData.articles as BlogArticle[]).find((a) => a.slug === slug);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const article of blogData.articles) {
      params.push({ locale, slug: article.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const article = getArticle(slug);
  if (!article) return { title: 'Article Not Found' };

  const canonical = `${BASE_URL}/${loc}/blog/${slug}`;
  const alternates = getAlternates(`blog/${slug}`, loc);

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: {
      canonical,
      languages: {
        en: alternates.en,
        es: alternates.es,
        'x-default': alternates['x-default'],
      },
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: 'article',
      url: canonical,
      siteName: 'TractorsCompare',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: [`${BASE_URL}/about-us`],
      section: article.category,
      tags: article.keywords.slice(0, 6),
      images: article.imageUrl
        ? [{ url: article.imageUrl, alt: article.imageAlt, width: 1200, height: 630 }]
        : [{ url: `${BASE_URL}/en/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle,
      description: article.metaDescription,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

function renderBlock(block: ContentBlock, index: number): React.ReactNode {
  if (block.type === 'heading') {
    const level = block.level ?? 2;
    if (level === 2) {
      return (
        <h2 key={index} className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-4">
          {block.text}
        </h2>
      );
    }
    return (
      <h3 key={index} className="text-xl md:text-2xl font-bold text-gray-800 mt-8 mb-3">
        {block.text}
      </h3>
    );
  }

  if (block.type === 'paragraph') {
    return (
      <p key={index} className="text-gray-700 text-base md:text-lg leading-relaxed mb-5">
        {block.text}
      </p>
    );
  }

  if (block.type === 'list' && block.items) {
    return (
      <ul key={index} className="list-none space-y-2 mb-6 pl-0">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-700 text-base md:text-lg leading-relaxed">
            <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-green-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === 'tip' && block.text) {
    return (
      <div key={index} className="bg-green-50 border-l-4 border-green-600 rounded-r-xl px-6 py-4 mb-6">
        <p className="text-green-900 font-semibold text-sm mb-1">Pro tip</p>
        <p className="text-green-800 text-base leading-relaxed">{block.text}</p>
      </div>
    );
  }

  return null;
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const article = getArticle(slug);
  if (!article) notFound();

  const readingTime = article.readingTimeMinutes ?? Math.max(3, Math.ceil(
    article.content.reduce((acc, b) => acc + (b.text?.split(' ').length ?? 0), 0) / 200
  ));

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    image: article.imageUrl ?? `${BASE_URL}/en/opengraph-image`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'TractorsCompare Editorial',
      url: `${BASE_URL}/about-us`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'TractorsCompare',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/${loc}/blog/${slug}` },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, item: { '@id': `${BASE_URL}/${loc}`, name: 'Home' } },
      { '@type': 'ListItem', position: 2, item: { '@id': `${BASE_URL}/${loc}/blog`, name: 'Blog' } },
      { '@type': 'ListItem', position: 3, item: { '@id': `${BASE_URL}/${loc}/blog/${slug}`, name: article.title } },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-screen bg-[#fbf7f1]">
        {/* Hero */}
        <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white py-12 md:py-16">
          <div className="container-custom">
            <LocaleLink
              locale={loc}
              logicalPath="blog"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-semibold transition-colors"
            >
              ← Back to Blog
            </LocaleLink>

            <div className="mb-4">
              <span className="inline-flex items-center rounded-full bg-white/20 text-white px-4 py-1 text-sm font-semibold">
                {article.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight max-w-4xl">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span>{article.author}</span>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </section>

        {/* Article */}
        <article className="py-12 md:py-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              {/* Featured image */}
              {article.imageUrl ? (
                <div className="w-full aspect-[16/9] rounded-2xl mb-10 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.imageUrl}
                    alt={article.imageAlt || article.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    width={896}
                    height={504}
                  />
                </div>
              ) : (
                <div className="w-full aspect-[16/9] bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-10 flex items-center justify-center">
                  <svg className="w-20 h-20 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}

              {/* Excerpt lead */}
              <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-green-600 pl-5">
                {article.excerpt}
              </p>

              {/* Body */}
              <div>{article.content.map((block, i) => renderBlock(block, i))}</div>

              {/* Author bio */}
              {article.authorBio && (
                <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-6 flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{article.author}</p>
                    <p className="text-gray-600 text-sm mt-1">{article.authorBio}</p>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap gap-2 mb-8">
                  {article.keywords.slice(0, 6).map((kw) => (
                    <span key={kw} className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs font-medium">
                      {kw}
                    </span>
                  ))}
                </div>

                <LocaleLink
                  locale={loc}
                  logicalPath="blog"
                  className="inline-flex items-center text-green-700 hover:text-green-800 font-semibold transition-colors"
                >
                  ← Back to Blog
                </LocaleLink>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
