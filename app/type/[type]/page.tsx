import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { tractors } from '@/data/tractors';
import { Tractor } from '@/types/tractor';
import { brandToSlug } from '@/lib/tractorsLoader';
import TractorImagePlaceholder from '@/components/TractorImagePlaceholder';

const validTypes = ['compact', 'utility', 'lawn', 'mower'];

const typeLabels: Record<string, { label: string; description: string }> = {
  compact: {
    label: 'Compact Tractors',
    description: 'Compact utility tractors perfect for small farms, properties, and landscaping. These versatile machines offer excellent power-to-size ratio with diesel engines, hydraulic systems, and PTO capabilities.',
  },
  utility: {
    label: 'Utility Tractors',
    description: 'Utility tractors designed for medium-scale agricultural operations. Features include powerful diesel engines, multiple transmission options, and robust hydraulic systems for various attachments.',
  },
  lawn: {
    label: 'Lawn & Garden Tractors',
    description: 'Lawn and garden tractors ideal for residential use. These machines combine performance with ease of use, featuring reliable engines, efficient mowers, and comfortable operation.',
  },
  mower: {
    label: 'Riding Mowers',
    description: 'Riding mowers and zero-turn mowers for professional and residential lawn care. Compare specifications, engine power, cutting width, and performance data.',
  },
};

export async function generateStaticParams() {
  return validTypes.map((type) => ({ type }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  if (!validTypes.includes(type)) {
    return {
      title: 'Tractor Type Not Found | TractorsCompare',
    };
  }

  const typeInfo = typeLabels[type];
  return {
    title: `${typeInfo.label} – Specifications & Data | TractorsCompare`,
    description: `${typeInfo.description} Browse complete tractor data, engine specifications, transmission, PTO, hydraulic system, dimensions, and weight for all ${typeInfo.label.toLowerCase()}.`,
  };
}

export default async function TypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  
  if (!validTypes.includes(type)) {
    notFound();
  }

  const typeInfo = typeLabels[type];
  
  // Map URL type to internal type
  const internalTypeMap: Record<string, Tractor['type']> = {
    compact: 'farm',
    utility: 'farm',
    lawn: 'lawn',
    mower: 'lawn',
  };
  
  const internalType = internalTypeMap[type] || 'farm';
  
  // Filter tractors by type
  const filteredTractors = tractors.filter(t => {
    if (type === 'compact') {
      // Compact tractors are typically smaller farm tractors
      return t.type === 'farm' && (t.engine?.powerHP || 0) < 60;
    } else if (type === 'utility') {
      // Utility tractors are medium-sized farm tractors
      return t.type === 'farm' && (t.engine?.powerHP || 0) >= 60 && (t.engine?.powerHP || 0) < 150;
    } else {
      return t.type === internalType;
    }
  }).slice(0, 24);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href="/tractores" className="hover:text-primary-600">Tractors</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">{typeInfo.label}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {typeInfo.label}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            {typeInfo.description}
          </p>
        </div>
      </section>

      {/* Schema.org BreadcrumbList */}
      <Script
        id="type-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://tractorscompare.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Tractors',
                item: 'https://tractorscompare.com/tractores',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: typeInfo.label,
                item: `https://tractorscompare.com/type/${type}`,
              },
            ],
          }),
        }}
      />

      {/* Tractors Grid */}
      <section className="py-12">
        <div className="container-custom">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredTractors.length} {typeInfo.label} Found
            </h2>
            <Link
              href="/comparar"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Compare Models →
            </Link>
          </div>

          {filteredTractors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-600">No tractors found for this type.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTractors.map((tractor) => {
                const slug = tractor.slug || `${brandToSlug(tractor.brand)}-${tractor.model.toLowerCase().replace(/\s+/g, '-')}`;
                return (
                  <Link
                    key={tractor.id}
                    href={`/tractores/${slug}`}
                    className="bg-white rounded-xl border-2 border-gray-200 hover:border-primary-300 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="aspect-[4/3] bg-gray-100 relative">
                      <TractorImagePlaceholder
                        brand={tractor.brand}
                        model={tractor.model}
                        imageUrl={tractor.imageUrl}
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                        {tractor.brand}
                      </p>
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                        {tractor.model}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {tractor.engine?.powerHP && (
                          <span>{tractor.engine.powerHP} HP</span>
                        )}
                        {tractor.transmission?.type && (
                          <span>{tractor.transmission.type}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Comprehensive Content Section */}
      <section className="py-12 md:py-16 bg-white border-t border-gray-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg prose-sm md:prose-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              About {typeInfo.label}
            </h2>
            
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              {typeInfo.description} Our comprehensive database includes detailed specifications for {filteredTractors.length} {typeInfo.label.toLowerCase()} models from major manufacturers, providing essential information for selecting the right tractor for your specific needs and operational requirements.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              {typeInfo.label} Specifications and Features
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              {type === 'compact' && 'Compact tractors are ideal for small farms, properties, and landscaping tasks. These versatile machines typically feature 20-60 horsepower engines, hydrostatic or manual transmissions, hydraulic systems, and PTO capabilities. They offer an excellent balance of power, maneuverability, and fuel efficiency, making them perfect for property maintenance, small-scale farming, and residential use.'}
              {type === 'utility' && 'Utility tractors are designed for medium-scale agricultural operations and diverse tasks on farms and rural properties. These tractors typically feature 60-150 horsepower engines, multiple transmission options including manual, hydrostatic, and power shift, robust hydraulic systems, and powerful PTO systems. They provide versatility for various agricultural tasks, loader work, and implement operation.'}
              {type === 'lawn' && 'Lawn and garden tractors are designed for residential and commercial lawn care, combining performance with ease of use. These machines typically feature 15-30 horsepower engines, hydrostatic transmissions for smooth operation, efficient mowing decks, and comfortable operator stations. They offer reliable performance for mowing, light-duty landscaping, and property maintenance tasks.'}
              {type === 'mower' && 'Riding mowers and zero-turn mowers are specialized machines for professional and residential lawn care. These machines focus on mowing efficiency with powerful engines, wide cutting decks, and maneuverable designs. Zero-turn mowers offer exceptional turning radius and cutting precision, while traditional riding mowers provide versatility for various lawn care tasks.'}
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              When selecting a {typeInfo.label.toLowerCase()}, consider key specifications including engine power and type, transmission system and gear options, PTO specifications for implement operation, hydraulic capacity for attachments, dimensions for storage and operation, weight for traction and transport, and available features such as four-wheel drive, cabs, and modern technology integration.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Comparing {typeInfo.label} Models
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Use our comparison tool to evaluate {typeInfo.label.toLowerCase()} models side by side. Compare specifications including engine horsepower, transmission types, PTO capabilities, hydraulic systems, dimensions, weight, and price. This comprehensive comparison helps you identify the best model for your specific needs, property size, and intended applications.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              Each {typeInfo.label.toLowerCase()} listing in our database includes detailed technical specifications, performance data, engine information, transmission details, PTO and hydraulic specifications, dimensions and weight, tire options, production years, and available attachments. Use this comprehensive information to make informed purchasing decisions and ensure the selected tractor meets all your operational requirements.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
