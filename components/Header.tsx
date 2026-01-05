'use client';

import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdBanner } from '@/components/AdSense';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/50 shadow-sm transition-all duration-300">
        <div className="container-custom">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center flex-shrink-0 group">
            <span className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
              TractorsCompare.com
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center justify-center flex-1 space-x-1">
            <Link 
              href="/tractores-agricolas" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-primary-50 relative group"
            >
              Agricultural Tractors
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/tractores-jardin" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-primary-50 relative group"
            >
              Lawn Tractors
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/comparar" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-primary-50 relative group"
            >
              Compare
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/noticias" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-primary-50 relative group"
            >
              News
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/blog" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-primary-50 relative group"
            >
              Blog
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Search Bar - Right */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-shrink-0">
            <div className="relative w-full min-w-[250px] group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tractors..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400"
                aria-label="Search tractors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors duration-200" />
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700 flex-shrink-0"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200 mt-4 pt-4">
            <nav className="flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tractors..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </form>
              <Link
                href="/tractores-agricolas"
                className="text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Agricultural Tractors
              </Link>
              <Link
                href="/tractores-jardin"
                className="text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Lawn Tractors
              </Link>
              <Link
                href="/comparar"
                className="text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Compare
              </Link>
              <Link
                href="/noticias"
                className="text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
    <div className="bg-gray-50 border-b">
      <div className="container-custom">
        <AdBanner />
      </div>
    </div>
    </>
  );
}

