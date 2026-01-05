import Link from 'next/link';
import blogData from '@/data/blog.json';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Tractor Industry News & Insights',
  description: 'Stay informed with the latest news, trends, and insights about tractors, agricultural machinery, and the farming industry. Expert analysis and in-depth articles.',
};

export const dynamic = 'force-static';

function formatDate(publishedAt: string): string {
  const d = new Date(publishedAt);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BlogPage() {
  const articles = blogData.articles.sort((a, b) => 
    Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  );

  return (
    <div className="min-h-screen bg-[#fbf7f1]">
      {/* Hero Section with Cornfield Background */}
      <section className="relative py-16 md:py-24 overflow-hidden min-h-[500px] md:min-h-[600px]">
        {/* Background Image with Effects */}
        <div className="absolute inset-0 z-0 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=80&auto=format"
            alt="Green cornfield agricultural background"
            className="w-full h-full object-cover transition-all duration-700 ease-out"
            style={{
              filter: 'brightness(0.7) saturate(1.15) contrast(1.1)',
              transform: 'scale(1.08)',
            }}
          />
          {/* Animated gradient overlay with depth */}
          <div 
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 83, 45, 0.88) 0%, rgba(22, 101, 52, 0.78) 50%, rgba(21, 128, 61, 0.88) 100%)',
            }}
          />
          {/* Additional depth overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          {/* Subtle animated shimmer effect */}
          <div 
            className="absolute inset-0 opacity-0 md:opacity-10"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
              animation: 'shimmer 5s ease-in-out infinite',
              width: '200%',
            }}
          />
        </div>

        {/* Content */}
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-2xl">
              Tractor Industry Blog
            </h1>
            <p className="text-white/95 text-lg md:text-xl lg:text-2xl leading-relaxed drop-shadow-lg">
              Expert insights, industry news, and in-depth analysis about tractors, agricultural machinery, and farming technology.
            </p>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg
            className="w-full h-16 md:h-24"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,60 C300,100 600,20 900,60 C1050,80 1150,40 1200,60 L1200,120 L0,120 Z"
              fill="#fbf7f1"
              className="transition-all duration-300"
            />
          </svg>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Article Image */}
                {article.imageUrl ? (
                  <div className="w-full h-48 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.imageUrl}
                      alt={article.imageAlt || article.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                <div className="p-6">
                  {/* Category badge */}
                  <div className="mb-3">
                    <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-3 py-1 text-xs font-semibold">
                      {article.category}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="text-sm text-gray-500 mb-3">
                    {formatDate(article.publishedAt)}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h2>

                  {/* Excerpt */}
                  {article.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Read more */}
                  <div className="text-green-700 font-semibold text-sm">
                    Read article →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

