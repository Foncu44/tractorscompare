import Link from 'next/link';
import { AdBanner } from '@/components/AdSense';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 mt-20 border-t border-gray-800">
      <div className="bg-gray-50/50 border-b border-gray-800 py-4">
        <div className="container-custom">
          <AdBanner />
        </div>
      </div>
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-xl mb-5">TractorsCompare</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              The most complete source of information on agricultural, lawn, and industrial tractors. 
              Compare specifications and find the perfect tractor for your needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-xl mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/tractores-agricolas" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1">
                  Agricultural Tractors
                </Link>
              </li>
              <li>
                <Link href="/tractores-jardin" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1">
                  Lawn Tractors
                </Link>
              </li>
              <li>
                <Link href="/comparar" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1">
                  Compare
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1">
                  News
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-xl mb-5">Categories</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/tractores" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1">
                  Tractors (categories)
                </Link>
              </li>
              <li>
                <Link href="/comparar" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1">
                  Compare Tractors
                </Link>
              </li>
              <li>
                <Link href="/marcas" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1">
                  All Brands
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-xl mb-5">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">&copy; {currentYear} TractorsCompare. All rights reserved.</p>
          <p className="mt-3 text-xs text-gray-500 max-w-2xl mx-auto">
            All information is provided for reference. Always consult the manufacturer's official specifications.
          </p>
        </div>
      </div>
    </footer>
  );
}

