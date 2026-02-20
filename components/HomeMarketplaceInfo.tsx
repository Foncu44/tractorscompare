'use client';

import Link from 'next/link';
import { DollarSign, Truck, CreditCard, CheckCircle, ArrowRight } from 'lucide-react';

const marketplaceItems = [
  {
    label: 'Used Tractors',
    description: 'Browse used tractors with detailed specifications and performance data',
    href: '/used',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-700',
  },
  {
    label: 'Price & Offers',
    description: 'Find current prices, offers, and deals on new and used equipment',
    href: '/offers',
    icon: DollarSign,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    label: 'Shipping',
    description: 'Information about shipping and delivery options for your equipment',
    href: '/offers#shipping',
    icon: Truck,
    color: 'bg-orange-100 text-orange-700',
  },
  {
    label: 'Financing',
    description: 'Explore financing options and payment plans for tractor purchases',
    href: '/offers#financing',
    icon: CreditCard,
    color: 'bg-purple-100 text-purple-700',
  },
];

export default function HomeMarketplaceInfo() {
  return (
    <section className="py-12 bg-gradient-to-br from-primary-50 to-white">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Marketplace Information
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find used tractors, current prices, offers, shipping information, and financing options. All equipment available with detailed specifications.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketplaceItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white rounded-xl border-2 border-gray-200 hover:border-primary-300 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                      {item.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center text-primary-600 group-hover:text-primary-700 font-semibold text-sm">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
