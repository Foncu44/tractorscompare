'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/types/listings';
import { getFallbackListings } from '@/lib/listings/providers/FallbackSearchLinkProvider';
import { buildBroaderSearchLink } from '@/lib/buildMarketplaceLinks';

export interface UsedListingsInternationalProps {
  brandName: string;
  modelName: string;
  fullName: string;
}

function buildSearchQuery(brandName: string, modelName: string, fullName: string): string {
  const b = (brandName || '').trim();
  const m = (modelName || '').trim();
  if (b && m) return `${b} ${m}`.trim();
  return (fullName || '').trim() || 'tractor';
}

function ListingCardSkeleton() {
  return (
    <li className="flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
    </li>
  );
}

function ListingCard({ item }: { item: Listing }) {
  const imageSrc = item.imageUrl?.startsWith('http')
    ? item.imageUrl
    : item.imageUrl ?? '/marketplaces/placeholder.svg';

  return (
    <li>
      <a
        href={item.listingUrl}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-primary-300 hover:bg-primary-50/30 transition-colors h-full"
        title={item.title}
      >
        <span className="relative block aspect-[16/10] w-full bg-gray-100 overflow-hidden">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={imageSrc.startsWith('http') || imageSrc.endsWith('.svg')}
          />
        </span>
        <span className="flex flex-col p-4 min-w-0">
          <span className="font-semibold text-gray-900 block line-clamp-2">{item.title}</span>
          {item.priceText && (
            <span className="text-sm text-primary-600 font-medium mt-1">{item.priceText}</span>
          )}
          {item.locationText && (
            <span className="text-xs text-gray-500 mt-0.5">{item.locationText}</span>
          )}
          <span className="text-xs text-gray-500 mt-1">{item.marketplaceName}</span>
        </span>
      </a>
    </li>
  );
}

export default function UsedListingsInternational({
  brandName,
  modelName,
  fullName,
}: UsedListingsInternationalProps) {
  const query = buildSearchQuery(brandName, modelName, fullName);
  const [items, setItems] = useState<Listing[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const input = {
    brandName,
    modelName,
    fullName,
    slug: `${brandName} ${modelName}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
  };
  const broader = buildBroaderSearchLink(input);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetch(`/api/listings?q=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Listings unavailable');
        return res.json();
      })
      .then((data: { query?: string; items?: Listing[] }) => {
        if (cancelled) return;
        if (Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        } else {
          setItems(getFallbackListings(query));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setItems(getFallbackListings(query));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const displayItems = items ?? [];

  return (
    <section
      className="mt-10 md:mt-12 pt-8 border-t border-gray-200"
      aria-labelledby="used-listings-heading"
    >
      <h2 id="used-listings-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
        Find Used Listings (International)
      </h2>
      <p className="text-gray-600 text-sm mb-6 max-w-2xl">
        First result or search link per marketplace. Listings are provided by third parties.
      </p>

      {loading && !displayItems.length ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {displayItems.map((item) => (
            <ListingCard key={item.marketplaceId} item={item} />
          ))}
        </ul>
      )}

      {error && (
        <p className="text-sm text-amber-700 mb-4">
          Showing search links only. Enable server (e.g. deploy on Vercel) for live listing previews.
        </p>
      )}

      {broader && (
        <p className="text-sm text-gray-600 mb-4">
          Broader search:{' '}
          <a
            href={broader.url}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="text-primary-600 hover:underline font-medium"
          >
            &quot;{broader.query}&quot;
          </a>
        </p>
      )}

      <p className="text-xs text-gray-500">
        <Link href="/data-sources" className="text-primary-600 hover:underline">
          Data sources
        </Link>
      </p>
    </section>
  );
}
