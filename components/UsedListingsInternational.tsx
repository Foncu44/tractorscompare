'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Listing } from '@/types/listings';
import { buildMarketplaceLinks } from '@/lib/buildMarketplaceLinks';
import { getMarketplaceById } from '@/lib/marketplaces';

export interface UsedListingsInternationalProps {
  /** Search query, e.g. "Claas Axion 820" */
  query: string;
  /** Optional: for more accurate search URLs (passed to API as brand/model) */
  brandName?: string;
  modelName?: string;
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
  const imageSrc = item.imageUrl ?? '/marketplaces/placeholder.svg';

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
  query,
  brandName,
  modelName,
}: UsedListingsInternationalProps) {
  const [items, setItems] = useState<Listing[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const q = (query || '').trim();
    if (!q || q.length < 3) {
      setLoading(false);
      setItems([]);
      return;
    }

    setLoading(true);
    const params = new URLSearchParams({ q });
    if (brandName) params.set('brand', brandName);
    if (modelName) params.set('model', modelName);

    fetch(`/api/listings?${params.toString()}`)
      .then((res) => {
        if (res.status === 429) throw new Error('Rate limited');
        if (res.status === 400) throw new Error('Invalid query');
        if (!res.ok) throw new Error('Listings unavailable');
        return res.json();
      })
      .then((data: { query?: string; items?: Listing[] }) => {
        if (cancelled) return;
        setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query, brandName, modelName]);

  const displayItems = (items ?? []).filter(
    (item) => !/facebook/i.test(item.marketplaceId || '') && !/facebook/i.test(item.marketplaceName || '')
  );

  if (loading && displayItems.length === 0) {
    return (
      <section className="mt-10 md:mt-12 pt-8 border-t border-gray-200" aria-labelledby="used-listings-heading">
        <h2 id="used-listings-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Find Used Listings (International)
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </ul>
      </section>
    );
  }

  if (displayItems.length === 0) {
    const input = {
      brandName: brandName ?? '',
      modelName: modelName ?? '',
      fullName: query,
      slug: query.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    };
    const searchLinks = buildMarketplaceLinks(input);

    return (
      <section className="mt-8 md:mt-10 pt-6 border-t border-gray-200" aria-labelledby="used-listings-heading">
        <h2 id="used-listings-heading" className="text-base font-semibold text-gray-800 mb-2">
          Used listings
        </h2>
        <p className="text-sm text-gray-600">
          Search on{' '}
          {searchLinks.map((link, i) => (
            <span key={link.marketplaceId}>
              <a
                href={link.url}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                {getMarketplaceById(link.marketplaceId)?.name ?? link.marketplaceId}
              </a>
              {i < searchLinks.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10 md:mt-12 pt-8 border-t border-gray-200" aria-labelledby="used-listings-heading">
      <h2 id="used-listings-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
        Find Used Listings (International)
      </h2>
      <p className="text-gray-600 text-sm mb-6 max-w-2xl">
        Listings are provided by third parties.
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayItems.map((item) => (
          <ListingCard key={`${item.marketplaceId}-${item.listingUrl}`} item={item} />
        ))}
      </ul>
    </section>
  );
}
