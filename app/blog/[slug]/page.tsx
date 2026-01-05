import { notFound } from 'next/navigation';
import Link from 'next/link';
import blogData from '@/data/blog.json';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

interface BlogArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  publishedAt: string;
  author: string;
  category: string;
  keywords: string[];
  excerpt: string;
  content: Array<{
    type: string;
    level?: number;
    text: string;
  }>;
  imageUrl?: string;
  imageAlt: string;
}

function getArticle(slug: string): BlogArticle | undefined {
  return blogData.articles.find((article) => article.slug === slug);
}

function formatDate(publishedAt: string): string {
  const d = new Date(publishedAt);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function generateStaticParams() {
  return blogData.articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = getArticle(params.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
      tags: article.keywords,
      images: article.imageUrl ? [{ url: article.imageUrl, alt: article.imageAlt }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle,
      description: article.metaDescription,
    },
  };
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fbf7f1]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white py-12 md:py-16">
        <div className="container-custom">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-semibold"
          >
            ← Back to Blog
          </Link>
          
          <div className="mb-4">
            <span className="inline-flex items-center rounded-full bg-white/20 text-white px-4 py-1 text-sm font-semibold">
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <span>{formatDate(article.publishedAt)}</span>
            <span>•</span>
            <span>{article.author}</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {article.imageUrl ? (
              <div className="w-full h-64 md:h-96 rounded-2xl mb-8 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.imageUrl}
                  alt={article.imageAlt || article.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            ) : (
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mb-8 flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              {article.content.map((block, index) => {
                if (block.type === 'heading') {
                  const HeadingTag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
                  return (
                    <HeadingTag
                      key={index}
                      className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4 first:mt-0"
                    >
                      {block.text}
                    </HeadingTag>
                  );
                }
                if (block.type === 'paragraph') {
                  return (
                    <p
                      key={index}
                      className="text-gray-700 text-base md:text-lg leading-relaxed mb-6"
                    >
                      {block.text}
                    </p>
                  );
                }
                return null;
              })}
            </div>

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2 mb-6">
                {article.keywords.slice(0, 5).map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center text-green-700 hover:text-green-800 font-semibold"
              >
                ← Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

