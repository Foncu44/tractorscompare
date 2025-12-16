import Link from 'next/link';
import { AdBanner } from '@/components/AdSense';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="bg-gray-50 border-t border-gray-800 py-4">
        <div className="container-custom">
          <AdBanner />
        </div>
      </div>
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">TractorsCompare</h3>
            <p className="text-sm">
              The most complete source of information on agricultural, lawn, and industrial tractors. 
              Compare specifications and find the perfect tractor.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tractores" className="hover:text-white transition-colors">
                  All Tractors
                </Link>
              </li>
              <li>
                <Link href="/marcas" className="hover:text-white transition-colors">
                  Brands
                </Link>
              </li>
              <li>
                <Link href="/comparar" className="hover:text-white transition-colors">
                  Compare Tractors
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="hover:text-white transition-colors">
                  News
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tractores?tipo=farm" className="hover:text-white transition-colors">
                  Agricultural Tractors
                </Link>
              </li>
              <li>
                <Link href="/tractores?tipo=lawn" className="hover:text-white transition-colors">
                  Lawn Tractors
                </Link>
              </li>
              <li>
                <Link href="/tractores?tipo=industrial" className="hover:text-white transition-colors">
                  Industrial Tractors
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} TractorsCompare. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-500">
            All information is provided for reference. Always consult the manufacturer's official specifications.
          </p>
        </div>
      </div>
    </footer>
  );
}

