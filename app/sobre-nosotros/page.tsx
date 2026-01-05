import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about TractorsCompare, the most complete source of information on agricultural, lawn, and industrial tractors. Our mission and commitment to providing accurate tractor data.',
};

export const dynamic = 'force-static';

export default function SobreNosotrosPage() {
  return (
    <div className="container-custom py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Welcome to TractorsCompare</h2>
          <p className="text-gray-700 mb-4">
            TractorsCompare is the most complete source of information on agricultural, lawn, and industrial tractors. 
            Our mission is to provide comprehensive, accurate, and accessible tractor data to help farmers, landscapers, 
            and industry professionals make informed decisions.
          </p>
          <p className="text-gray-700">
            We understand that choosing the right tractor is a significant investment, and having access to detailed 
            specifications, comparisons, and technical information is crucial. That's why we've built a comprehensive 
            database with over 18,000 tractors from all major manufacturers.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            Our mission is to democratize access to tractor information by providing a free, comprehensive, and 
            easy-to-use platform for comparing tractor specifications. We believe that everyone should have access 
            to the information they need to make the best decisions for their agricultural, landscaping, or industrial needs.
          </p>
          <p className="text-gray-700">
            We are committed to maintaining the highest standards of accuracy and continuously updating our database 
            with the latest information from manufacturers and industry sources.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>
                <strong>Comprehensive Database:</strong> Access detailed specifications for thousands of tractors from 
                major manufacturers including John Deere, Kubota, New Holland, Case IH, Massey Ferguson, and many more.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>
                <strong>Comparison Tools:</strong> Compare up to 4 tractors side-by-side to evaluate specifications, 
                performance data, and technical details.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>
                <strong>Search & Filter:</strong> Find tractors by brand, model, power, type, and other specifications 
                using our advanced search and filtering capabilities.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>
                <strong>Industry News:</strong> Stay updated with the latest news and developments in the agricultural 
                and tractor industry.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>
                <strong>Free Access:</strong> All our tools and information are available free of charge to help 
                you make informed decisions.
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Commitment to Accuracy</h2>
          <p className="text-gray-700 mb-4">
            We strive to provide the most accurate and up-to-date information possible. Our data is compiled from 
            manufacturer specifications, industry publications, and verified sources. However, we always recommend 
            consulting the manufacturer's official specifications for critical decisions.
          </p>
          <p className="text-gray-700">
            If you notice any discrepancies or outdated information, please don't hesitate to contact us. We value 
            feedback from our users and continuously work to improve the accuracy and completeness of our database.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
          <p className="text-gray-700">
            All information provided on TractorsCompare is for reference purposes only. While we make every effort 
            to ensure accuracy, specifications may vary by region, model year, and configuration. Always consult the 
            manufacturer's official specifications and documentation before making purchasing decisions. TractorsCompare 
            is not responsible for any decisions made based on the information provided on this platform.
          </p>
        </div>
      </div>
    </div>
  );
}

