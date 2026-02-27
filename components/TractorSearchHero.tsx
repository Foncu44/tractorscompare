'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, GitCompare, ArrowRight } from 'lucide-react';
import { tractors, getAllBrands } from '@/data/tractors';
import { Tractor } from '@/types/tractor';

export default function TractorSearchHero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [tractorType, setTractorType] = useState<'all' | 'farm' | 'lawn' | 'industrial'>('all');
  const [hpRange, setHpRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [suggestions, setSuggestions] = useState<Tractor[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const brands = getAllBrands();

  // Filter suggestions based on search
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = tractors
        .filter(t => {
          const matchesSearch = `${t.brand} ${t.model}`.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesType = tractorType === 'all' || t.type === tractorType;
          const matchesHP = (t.engine?.powerHP || 0) >= hpRange.min && (t.engine?.powerHP || 0) <= hpRange.max;
          return matchesSearch && matchesType && matchesHP;
        })
        .slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, tractorType, hpRange]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}&type=${tractorType}&minHP=${hpRange.min}&maxHP=${hpRange.max}`);
    }
  };

  const handleCompare = () => {
    router.push('/comparar');
  };

  const handleExplore = () => {
    router.push('/tractores');
  };

  return (
    <div className="relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Main Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <div className="flex items-center bg-white rounded-2xl shadow-2xl border-2 border-primary-200 overflow-hidden">
              <div className="flex items-center px-6 py-4 text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <input
                id="hero-tractor-search"
                name="q"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search by brand or model (e.g., John Deere 8245R)"
                className="flex-1 px-4 py-4 text-lg text-gray-900 placeholder-gray-400 focus:outline-none"
                aria-label="Search tractors by brand or model"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
              >
                Search
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
                {suggestions.map((tractor) => (
                  <button
                    key={tractor.id}
                    type="button"
                    onClick={() => {
                      router.push(`/tractores/${tractor.slug}`);
                      setShowSuggestions(false);
                    }}
                    className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {tractor.brand} {tractor.model}
                        </p>
                        <p className="text-sm text-gray-600">
                          {tractor.engine?.powerHP || 'N/A'} HP • {tractor.transmission?.type || 'N/A'} • {tractor.type}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Type Filter */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Filter className="w-4 h-4" />
              Tractor Type
            </label>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'farm', label: 'Agricultural' },
                { value: 'lawn', label: 'Lawn' },
                { value: 'industrial', label: 'Industrial' },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setTractorType(type.value as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tractorType === type.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* HP Range Filter */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Filter className="w-4 h-4" />
              Power Range (HP)
            </label>
            <div className="flex items-center gap-3">
              <input
                id="hero-min-hp"
                name="minHP"
                type="number"
                value={hpRange.min}
                onChange={(e) => setHpRange({ ...hpRange, min: parseInt(e.target.value) || 0 })}
                placeholder="Min"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Minimum horsepower"
              />
              <span className="text-gray-500">-</span>
              <input
                id="hero-max-hp"
                name="maxHP"
                type="number"
                value={hpRange.max}
                onChange={(e) => setHpRange({ ...hpRange, max: parseInt(e.target.value) || 1000 })}
                placeholder="Max"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Maximum horsepower"
              />
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleCompare}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-primary-600"
          >
            <GitCompare className="w-5 h-5" />
            Compare Tractors
          </button>
          <button
            onClick={handleExplore}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Explore Catalog
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
