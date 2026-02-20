import { Metadata } from 'next';
import Link from 'next/link';
import { DollarSign, Truck, CreditCard, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tractor Prices, Offers, Shipping & Financing | TractorsCompare',
  description: 'Find current tractor prices, special offers, shipping information, and financing options. Compare deals on new and used tractors with complete specifications and performance data.',
};

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Prices & Offers</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Prices, Offers, Shipping & Financing
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Find current prices, special offers, shipping information, and financing options for tractors. Compare deals on new and used equipment with complete specifications.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="py-12">
        <div className="container-custom space-y-8">
          {/* Prices */}
          <div id="prices" className="bg-white rounded-xl border-2 border-gray-200 p-8">
            <div className="flex items-center gap-4 mb-4">
              <DollarSign className="w-8 h-8 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Tractor Prices</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Tractor prices vary based on brand, model, engine power, transmission type, and included attachments. Compare specifications to find the best value for your needs.
            </p>
            <p className="text-gray-600">
              For current pricing information, contact authorized dealers or visit manufacturer websites. Prices are subject to change and may vary by location.
            </p>
          </div>

          {/* Offers */}
          <div id="offers" className="bg-white rounded-xl border-2 border-gray-200 p-8">
            <div className="flex items-center gap-4 mb-4">
              <Tag className="w-8 h-8 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Special Offers</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Many dealers offer special promotions, seasonal discounts, and financing incentives on new and used tractors. Check with local dealers for current offers and deals.
            </p>
            <p className="text-gray-600">
              Compare offers across different brands and models to find the best deal. Consider total cost including financing, shipping, and available attachments.
            </p>
          </div>

          {/* Shipping */}
          <div id="shipping" className="bg-white rounded-xl border-2 border-gray-200 p-8">
            <div className="flex items-center gap-4 mb-4">
              <Truck className="w-8 h-8 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Shipping costs for tractors depend on size, weight, distance, and delivery method. Most dealers offer delivery services or can arrange transportation.
            </p>
            <p className="text-gray-600">
              Contact your dealer for shipping quotes and delivery options. Some dealers include delivery within a certain radius, while others charge based on distance and equipment size.
            </p>
          </div>

          {/* Financing */}
          <div id="financing" className="bg-white rounded-xl border-2 border-gray-200 p-8">
            <div className="flex items-center gap-4 mb-4">
              <CreditCard className="w-8 h-8 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Financing Options</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Many manufacturers and dealers offer financing programs for new and used tractors. Options may include low-interest loans, lease programs, and payment plans.
            </p>
            <p className="text-gray-600">
              Compare financing terms from different sources. Consider interest rates, down payment requirements, and repayment terms when evaluating financing options.
            </p>
          </div>
        </div>
      </section>

      {/* Comprehensive Content Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg prose-sm md:prose-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              Tractor Pricing, Offers, Shipping, and Financing Guide
            </h2>
            
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              Understanding tractor pricing, financing options, shipping costs, and available offers is essential when purchasing a new or used tractor. This comprehensive guide covers key financial considerations, helping you make informed decisions and find the best value for your investment in agricultural or landscaping equipment.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Understanding Tractor Pricing
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Tractor prices vary significantly based on brand, model, horsepower, specifications, included attachments, and geographic location. Base tractor prices typically range from tens of thousands to hundreds of thousands of dollars depending on size and capabilities. Additional costs include attachments (loaders, mowers, tillers, backhoes), optional features (air conditioning, GPS systems, premium transmissions), dealer preparation fees, taxes, and registration.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              When comparing prices, ensure you're comparing similar specifications and included features. A lower-priced tractor may lack important features or have lower specifications, while a higher-priced model may include premium options that justify the cost difference. Use our comparison tool to evaluate specifications and determine which models offer the best value for your specific requirements.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Special Offers and Promotions
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Manufacturers and dealers frequently offer special promotions including seasonal discounts, model year closeout sales, trade-in incentives, attachment packages at reduced prices, extended warranty options, and financing promotions with low or zero percent interest rates. These offers can provide significant savings and should be factored into your purchasing decision.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Timing your purchase to coincide with promotional periods can result in substantial savings. Common promotion periods include end-of-year sales, new model introduction periods when previous models are discounted, and seasonal sales during slower periods. Contact multiple dealers to compare current offers and negotiate the best possible deal.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Shipping and Delivery Options
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Shipping costs for tractors depend on size, weight, distance, delivery method, and accessibility of the delivery location. Compact tractors may be transported on standard trailers, while large agricultural tractors require specialized heavy equipment transporters. Some dealers include delivery within a specified radius, while others charge based on distance and equipment size.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Delivery options include dealer delivery services, third-party heavy equipment transport companies, and self-transport using appropriate trailers and tow vehicles. Consider delivery timing, insurance coverage, unloading requirements, and potential damage during transport when selecting a shipping method. Obtain multiple shipping quotes and verify that transporters are properly licensed and insured.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Financing Options and Considerations
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Most manufacturers and dealers offer financing programs with various terms and conditions. Financing options may include low-interest or zero-percent promotional rates for qualified buyers, extended payment terms ranging from 36 to 84 months or longer, flexible down payment requirements, lease-to-own programs, and agricultural financing programs with special terms for farmers and agricultural businesses.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              When evaluating financing options, compare interest rates, annual percentage rates (APR), monthly payments, total financing costs, down payment requirements, prepayment penalties, and early payoff options. Consider your cash flow, tax implications of financing versus purchasing, and whether promotional rates require specific conditions or qualifications.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              Alternative financing sources include agricultural credit associations, equipment financing companies, bank loans, and personal loans. Compare terms from multiple sources to secure the most favorable financing arrangement. Ensure you understand all terms and conditions before signing any financing agreement.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Compare Tractors Before You Buy
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Use our comparison tool to compare specifications, performance, and value before making a purchase decision.
          </p>
          <Link
            href="/comparar"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
          >
            Compare Tractors
          </Link>
        </div>
      </section>
    </div>
  );
}
