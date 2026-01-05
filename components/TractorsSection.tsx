'use client';

import { Suspense } from 'react';
import BrandsSidebar from './BrandsSidebar';
import TractorsByBrand from './TractorsByBrand';

function TractorsSectionContent() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#fbf7f1]">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Marcas - Izquierda */}
          <div className="lg:w-64 xl:w-72 flex-shrink-0">
            <BrandsSidebar type="all" />
          </div>

          {/* Contenido Principal - Derecha */}
          <div className="flex-1 min-w-0">
            <TractorsByBrand type="all" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TractorsSection() {
  return (
    <Suspense fallback={
      <section className="py-20 bg-gradient-to-b from-white to-[#fbf7f1]">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-64 xl:w-72 flex-shrink-0">
              <div className="w-full md:w-64 lg:w-72 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-1 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200">
                      <div className="aspect-[4/3] bg-gray-200"></div>
                      <div className="p-5">
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    }>
      <TractorsSectionContent />
    </Suspense>
  );
}

