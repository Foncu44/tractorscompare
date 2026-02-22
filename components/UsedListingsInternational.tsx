import Link from 'next/link';
import Image from 'next/image';
import {
  buildMarketplaceLinks,
  buildBroaderSearchLink,
  type MarketplaceLinkInput,
} from '@/lib/buildMarketplaceLinks';
import { getMarketplaceById } from '@/lib/marketplaces';

export interface UsedListingsInternationalProps {
  brandName: string;
  modelName: string;
  fullName: string;
}

export default function UsedListingsInternational({
  brandName,
  modelName,
  fullName,
}: UsedListingsInternationalProps) {
  const input: MarketplaceLinkInput = {
    brandName,
    modelName,
    fullName,
    slug: `${brandName} ${modelName}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
  };
  const links = buildMarketplaceLinks(input);
  const broader = buildBroaderSearchLink(input);

  return (
    <section className="mt-10 md:mt-12 pt-8 border-t border-gray-200" aria-labelledby="used-listings-heading">
      <h2 id="used-listings-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
        Find Used Listings (International)
      </h2>
      <p className="text-gray-600 text-sm mb-6 max-w-2xl">
        Links open the marketplace search for this tractor model. Listings are provided by third parties.
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {links.map((link) => {
          const config = getMarketplaceById(link.marketplaceId);
          return (
            <li key={link.marketplaceId}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/30 transition-colors"
                title={link.title}
              >
                <span className="relative flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                  <Image
                    src={config?.logoPath ?? '/marketplaces/placeholder.svg'}
                    alt=""
                    width={48}
                    height={48}
                    className="object-contain"
                    unoptimized
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-semibold text-gray-900 block">{config?.name ?? link.marketplaceId}</span>
                  {link.label && (
                    <span className="text-xs text-gray-500">{link.label}</span>
                  )}
                </span>
                <span className="flex-shrink-0 text-primary-600 font-medium text-sm">Search listings</span>
              </a>
            </li>
          );
        })}
      </ul>

      {broader && (
        <p className="text-sm text-gray-600 mb-4">
          If the exact model returns few results, try a broader search:{' '}
          <a
            href={broader.url}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="text-primary-600 hover:underline font-medium"
          >
            Search &quot;{broader.query}&quot;
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
