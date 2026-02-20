import { Metadata } from 'next';
import Link from 'next/link';
import { DollarSign, Calendar, TrendingDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Used Tractors – Browse Used Equipment with Specifications | TractorsCompare',
  description: 'Browse used tractors with complete specifications and performance data. Compare used equipment by brand, model, engine, power, transmission, and condition. Find the best deals on used tractors.',
};

export default function UsedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Used Tractors</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Used Tractors
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Browse used tractors with detailed specifications and performance data. Compare used equipment by brand, model, engine, power, transmission, PTO, hydraulic system, and condition.
          </p>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <DollarSign className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Best Prices</h3>
                <p className="text-gray-600 text-sm">
                  Compare prices and find the best deals on used tractors
                </p>
              </div>
              <div className="text-center">
                <Calendar className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Complete Data</h3>
                <p className="text-gray-600 text-sm">
                  All used tractors include full specifications and performance data
                </p>
              </div>
              <div className="text-center">
                <TrendingDown className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">Value Comparison</h3>
                <p className="text-gray-600 text-sm">
                  Compare used vs new to find the best value for your needs
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Use our comparison tool to compare used tractors by specifications, engine, transmission, PTO, hydraulic system, dimensions, and weight.
              </p>
              <Link
                href="/comparar"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
              >
                Compare Used Tractors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Content Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg prose-sm md:prose-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              Buying Used Tractors: Complete Guide
            </h2>
            
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              Purchasing a used tractor can provide excellent value while meeting your agricultural, landscaping, or property management needs. Used tractors offer significant cost savings compared to new models while often providing reliable performance for many years. This guide covers essential considerations when evaluating used tractors, including condition assessment, specification verification, value determination, and inspection procedures.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Evaluating Used Tractor Condition
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              When inspecting a used tractor, examine the engine for signs of excessive wear, leaks, or smoke. Check the transmission by testing all gears and listening for unusual noises. Inspect the hydraulic system by operating all hydraulics and checking for leaks or slow operation. Examine the PTO system to ensure it engages and disengages properly and operates at correct speeds. Review service records to verify maintenance history and identify any major repairs or component replacements.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Physical condition assessment includes examining the frame for cracks or welds, checking tires for wear and damage, inspecting the cab or operator station for functionality and comfort, and evaluating paint condition and rust levels. While cosmetic issues may not affect performance, they can indicate how well the tractor was maintained and may affect resale value.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Verifying Used Tractor Specifications
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Compare the actual tractor's specifications with our database to verify that the model matches the seller's description. Check engine horsepower, transmission type and gear count, PTO specifications, hydraulic capacity, dimensions, and weight. Discrepancies may indicate modifications, incorrect identification, or potential issues. Our comprehensive database provides accurate specifications for thousands of tractor models to assist in verification.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Understanding specification differences between model years is important, as manufacturers often make updates and improvements. Our database includes production year information and detailed specifications to help identify the correct model and verify that advertised features match the actual tractor.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Determining Used Tractor Value
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Used tractor values depend on multiple factors including age, hours of operation, condition, specifications, market demand, location, and included attachments or implements. Compare asking prices with similar models in your area and consider the cost of any needed repairs or maintenance when evaluating value.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              Use our comparison tool to evaluate how used tractor specifications compare to newer models, helping you determine if a used model meets your needs or if investing in a newer model provides better long-term value. Consider total cost of ownership including maintenance, repairs, fuel efficiency, and potential upgrades when making purchasing decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="py-8 bg-yellow-50 border-y border-yellow-200">
        <div className="container-custom">
          <p className="text-center text-gray-700">
            <strong>Note:</strong> This page provides information about used tractors. For actual listings, please contact authorized dealers or visit manufacturer websites.
          </p>
        </div>
      </section>
    </div>
  );
}
