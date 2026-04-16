import NewsSections from '@/components/NewsSections';
import newsData from '@/data/news.json';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industry News - Agriculture & Tractors',
  description: 'Recent news about agriculture, tractors and agricultural machinery (last 6 months).',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-static';

export default function NoticiasPage() {
  const newsItems = (newsData as any).items || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf7f1] to-white">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Tractor Industry News
          </h1>
          <p className="text-lg md:text-xl text-white/95 max-w-3xl">
            Stay informed with the latest news, trends, and developments in the agricultural tractor industry. Get updates on new models, industry innovations, farming technology, and agricultural machinery.
          </p>
        </div>
      </section>

      {/* News Content */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <NewsSections items={newsItems} showAll={true} />
        </div>
      </section>

      {/* Additional Content Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg prose-sm md:prose-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              Stay Updated with Tractor Industry News
            </h2>
            
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              The agricultural tractor industry is constantly evolving with new technologies, innovations, and developments. Our news section provides comprehensive coverage of the latest updates in tractor manufacturing, agricultural machinery, farming technology, and industry trends. Stay informed about new tractor models, engine innovations, transmission advancements, hydraulic system improvements, and equipment specifications.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Industry Trends and Developments
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Modern tractors continue to incorporate advanced technologies including precision agriculture systems, GPS guidance, telematics, automated steering, and smart implement control. These innovations improve efficiency, reduce operator fatigue, and optimize agricultural operations. Manufacturers are also focusing on sustainability with improved fuel efficiency, reduced emissions, and alternative fuel options.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Electric and hybrid tractors are emerging as innovative solutions for sustainable agriculture. These models offer quiet operation, zero emissions, and reduced operating costs while maintaining the power and performance required for agricultural operations. Battery technology continues to improve, extending operating times and making electric tractors more viable for farm use.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              New Tractor Models and Releases
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Leading manufacturers regularly introduce new tractor models with updated specifications, enhanced features, and improved performance. These new releases often include upgraded engines with higher horsepower, advanced transmission systems with more gear options, improved hydraulic capacities, enhanced operator comfort with better cabs and controls, and integration with modern agricultural technology.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              When new tractor models are released, we update our database with complete specifications including engine details, transmission options, PTO specifications, hydraulic systems, dimensions, weight, and performance data. This ensures that our database remains current and comprehensive, providing accurate information for tractor comparison and selection.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

