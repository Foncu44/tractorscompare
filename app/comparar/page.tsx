'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Plus, GitCompare as CompareIcon, Share2, RotateCcw, Filter, Info, Zap, Gauge, Settings, Ruler, Droplets } from 'lucide-react';
import { tractors, getTractorById } from '@/data/tractors';
import { Tractor } from '@/types/tractor';
import TractorImagePlaceholder from '@/components/TractorImagePlaceholder';

type TabCategory = 'basic' | 'power' | 'transmission' | 'hydraulics' | 'dimensions' | 'other';

interface SpecCategory {
  id: TabCategory;
  label: string;
  icon: React.ReactNode;
}

const categories: SpecCategory[] = [
  { id: 'basic', label: 'Basic Information', icon: <Info className="w-4 h-4" /> },
  { id: 'power', label: 'Power', icon: <Zap className="w-4 h-4" /> },
  { id: 'transmission', label: 'Transmission', icon: <Gauge className="w-4 h-4" /> },
  { id: 'hydraulics', label: 'Hydraulics', icon: <Droplets className="w-4 h-4" /> },
  { id: 'dimensions', label: 'Dimensions', icon: <Ruler className="w-4 h-4" /> },
  { id: 'other', label: 'Other Information', icon: <Settings className="w-4 h-4" /> },
];

export default function CompararPage() {
  const [selectedTractors, setSelectedTractors] = useState<Tractor[]>([]);
  const [showTractorSelector, setShowTractorSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const [activeCategory, setActiveCategory] = useState<TabCategory>('basic');

  useEffect(() => {
    // Load tractors from URL params if they exist
    const params = new URLSearchParams(window.location.search);
    const tractorIds = params.get('tractores');
    if (tractorIds) {
      const ids = tractorIds.split(',');
      const loadedTractors = ids
        .map(id => getTractorById(id))
        .filter((t): t is Tractor => t !== undefined);
      setSelectedTractors(loadedTractors);
    }
  }, []);

  const addTractor = (tractor: Tractor) => {
    if (!selectedTractors.find(t => t.id === tractor.id) && selectedTractors.length < 4) {
      setSelectedTractors([...selectedTractors, tractor]);
    }
    setShowTractorSelector(false);
    setSearchQuery('');
  };

  const removeTractor = (id: string) => {
    setSelectedTractors(selectedTractors.filter(t => t.id !== id));
  };

  const resetComparison = () => {
    setSelectedTractors([]);
    setShowTractorSelector(false);
    setSearchQuery('');
  };

  const shareComparison = () => {
    if (selectedTractors.length > 0) {
      const ids = selectedTractors.map(t => t.id).join(',');
      const url = `${window.location.origin}/comparar?tractores=${ids}`;
      navigator.clipboard.writeText(url).then(() => {
        alert('Enlace de comparación copiado al portapapeles!');
      });
    }
  };

  const filteredTractors = searchQuery
    ? tractors.filter(t =>
        `${t.brand} ${t.model}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tractors.slice(0, 20);

  const getSpecValue = (tractor: Tractor, specKey: string): string | number | undefined => {
    if (specKey.includes('.')) {
      const [parent, child] = specKey.split('.');
      const parentObj = (tractor as any)[parent];
      return parentObj?.[child];
    }
    return (tractor as any)[specKey];
  };

  const hasDifferences = (specKey: string): boolean => {
    if (selectedTractors.length < 2) return true;
    const values = selectedTractors.map(t => getSpecValue(t, specKey));
    return new Set(values.map(v => String(v))).size > 1;
  };

  // Define specs by category
  const getSpecsByCategory = (category: TabCategory) => {
    switch (category) {
      case 'basic':
        return [
          { label: 'Brand', key: 'brand' },
          { label: 'Model', key: 'model' },
          { label: 'Year', key: 'year' },
          { label: 'Type', key: 'type' },
          { label: 'Category', key: 'category' },
        ];
      case 'power':
        return [
          { label: 'Power (HP)', key: 'engine.powerHP' },
          { label: 'Power (kW)', key: 'engine.powerKW' },
          { label: 'Cylinders', key: 'engine.cylinders' },
          { label: 'Displacement (L)', key: 'engine.displacement' },
          { label: 'Fuel Type', key: 'engine.fuelType' },
          { label: 'Cooling', key: 'engine.cooling' },
          { label: 'PTO HP', key: 'ptoHP' },
          { label: 'PTO RPM', key: 'ptoRPM' },
        ];
      case 'transmission':
        return [
          { label: 'Transmission Type', key: 'transmission.type' },
          { label: 'Gears', key: 'transmission.gears' },
          { label: 'Description', key: 'transmission.description' },
          { label: 'Clutch', key: 'transmission.clutch' },
        ];
      case 'hydraulics':
        return [
          { label: 'Type', key: 'hydraulicSystem.type' },
          { label: 'Pump Flow (L/min)', key: 'hydraulicSystem.pumpFlow' },
          { label: 'Lift Capacity (kg)', key: 'hydraulicSystem.liftCapacity' },
          { label: 'Rear Valves', key: 'hydraulicSystem.rearValves' },
          { label: 'Category', key: 'hydraulicSystem.category' },
        ];
      case 'dimensions':
        return [
          { label: 'Weight (kg)', key: 'weight' },
          { label: 'Length (mm)', key: 'dimensions.length' },
          { label: 'Width (mm)', key: 'dimensions.width' },
          { label: 'Height (mm)', key: 'dimensions.height' },
          { label: 'Wheelbase (mm)', key: 'dimensions.wheelbase' },
          { label: 'Ground Clearance (mm)', key: 'dimensions.groundClearance' },
        ];
      case 'other':
        return [
          { label: 'Fuel Tank (L)', key: 'capacities.fuelTank' },
          { label: 'Hydraulic Reservoir (L)', key: 'capacities.hydraulicReservoir' },
        ];
      default:
        return [];
    }
  };

  const formatValue = (value: any): string => {
    if (value === undefined || value === null || value === '') return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toLocaleString();
    if (typeof value === 'string') {
      // Capitalize first letter
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return String(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
            Comparar Tractores
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Compara hasta 4 tractores lado a lado con todas sus especificaciones técnicas
          </p>
        </div>

        {/* Tractor Selector Cards - Similar to TractorJunction */}
        {selectedTractors.length > 0 && (
          <div className="mb-6 md:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {selectedTractors.map((tractor, index) => (
                <div
                  key={tractor.id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-all shadow-sm relative"
                >
                  <button
                    onClick={() => removeTractor(tractor.id)}
                    className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
                    aria-label="Eliminar tractor"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  <Link href={`/tractores/${tractor.slug}`} className="block">
                    <div className="p-4 md:p-6">
                      {/* Image */}
                      <div className="w-full aspect-[4/3] mb-4 rounded-lg overflow-hidden bg-gray-100">
                        <TractorImagePlaceholder
                          brand={tractor.brand}
                          model={tractor.model}
                          imageUrl={tractor.imageUrl}
                          width={300}
                          height={225}
                          className="w-full h-full"
                        />
                      </div>
                      
                      {/* Info */}
                      <div className="text-center">
                        <h3 className="font-bold text-gray-900 text-base md:text-lg mb-1 hover:text-primary-600 transition-colors">
                          {tractor.brand} {tractor.model}
                        </h3>
                        {tractor.year && (
                          <p className="text-sm text-gray-500 mb-2">{tractor.year}</p>
                        )}
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                          <Zap className="w-4 h-4 text-primary-600" />
                          <span className="font-semibold text-primary-700">{tractor.engine.powerHP} HP</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
              
              {/* Add Tractor Button */}
              {selectedTractors.length < 4 && (
                <button
                  onClick={() => setShowTractorSelector(true)}
                  className="bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50 transition-all flex flex-col items-center justify-center min-h-[280px] md:min-h-[320px]"
                >
                  <Plus className="w-12 h-12 text-gray-400 mb-3" />
                  <span className="text-gray-600 font-medium text-sm md:text-base">Agregar Tractor</span>
                  <span className="text-xs text-gray-500 mt-1">{selectedTractors.length}/4</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedTractors.length === 0 && (
          <div className="text-center py-12 md:py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <CompareIcon className="w-16 h-16 md:w-20 md:h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Comenzar Comparación</h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base max-w-md mx-auto">
              Agrega tractores para comparar sus especificaciones lado a lado
            </p>
            <button
              onClick={() => setShowTractorSelector(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Agregar Primer Tractor
            </button>
          </div>
        )}

        {/* Tractor Selector Modal */}
        {showTractorSelector && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
              <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Seleccionar Tractor</h2>
                <button
                  onClick={() => setShowTractorSelector(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 md:p-6 flex-1 overflow-y-auto">
                <input
                  id="compare-tractor-search"
                  name="q"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar tractor por marca o modelo..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm md:text-base"
                  aria-label="Search tractor to compare"
                />
                
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {filteredTractors.map((tractor) => {
                    const isSelected = selectedTractors.some(t => t.id === tractor.id);
                    const isMaxReached = selectedTractors.length >= 4;
                    
                    return (
                      <button
                        key={tractor.id}
                        onClick={() => addTractor(tractor)}
                        disabled={isSelected || isMaxReached}
                        className={`w-full text-left p-3 md:p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'bg-green-50 border-green-300 cursor-not-allowed'
                            : isMaxReached
                            ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                            : 'bg-white border-gray-200 hover:border-primary-400 hover:bg-primary-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <TractorImagePlaceholder
                              brand={tractor.brand}
                              model={tractor.model}
                              imageUrl={tractor.imageUrl}
                              width={80}
                              height={80}
                              className="w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm md:text-base mb-1">
                              {tractor.brand} {tractor.model}
                            </div>
                            <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
                              <span>{tractor.engine.powerHP} HP</span>
                              <span>•</span>
                              <span className="capitalize">{tractor.type}</span>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="text-green-600 text-xs md:text-sm font-medium flex-shrink-0">
                              Agregado
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table with Tabs */}
        {selectedTractors.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Action Bar */}
            <div className="border-b border-gray-200 bg-gray-50 px-4 md:px-6 py-3 md:py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                  <button
                    onClick={() => setShowTractorSelector(true)}
                    className="flex items-center gap-2 px-3 md:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Agregar</span>
                  </button>
                  <button
                    onClick={shareComparison}
                    className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Compartir</span>
                  </button>
                  <button
                    onClick={resetComparison}
                    className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">Reiniciar</span>
                  </button>
                </div>
                <label htmlFor="compare-show-differences" className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="compare-show-differences"
                    name="showOnlyDifferences"
                    type="checkbox"
                    checked={showOnlyDifferences}
                    onChange={(e) => setShowOnlyDifferences(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Solo diferencias</span>
                  <Filter className="w-4 h-4 text-gray-500" />
                </label>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="border-b border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <div className="flex gap-2 px-4 md:px-6 pt-4 pb-3 min-w-max md:min-w-0 md:flex-wrap">
                  {categories.map((category) => {
                    const isActive = activeCategory === category.id;
                    const categorySpecs = getSpecsByCategory(category.id);
                    const hasData = selectedTractors.some(tractor => {
                      return categorySpecs.some(spec => {
                        const value = getSpecValue(tractor, spec.key);
                        return value !== undefined && value !== null && value !== '';
                      });
                    });

                    if (!hasData) return null;

                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`
                          flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg font-medium transition-all whitespace-nowrap text-xs md:text-sm
                          ${isActive
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                          }
                        `}
                      >
                        {category.icon}
                        <span className="hidden sm:inline">{category.label}</span>
                        <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <table className="hidden md:table w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-gray-50 z-10 min-w-[200px]">
                      Especificación
                    </th>
                    {selectedTractors.map((tractor) => (
                      <th
                        key={tractor.id}
                        className="px-6 py-4 text-center text-sm font-semibold text-gray-900 min-w-[220px]"
                      >
                        <Link
                          href={`/tractores/${tractor.slug}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {tractor.brand} {tractor.model}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getSpecsByCategory(activeCategory)
                    .filter((spec) => {
                      // Filter by data availability
                      const hasData = selectedTractors.some(tractor => {
                        const value = getSpecValue(tractor, spec.key);
                        return value !== undefined && value !== null && value !== '';
                      });
                      if (!hasData) return false;
                      
                      // Filter by differences if enabled
                      if (showOnlyDifferences) {
                        return hasDifferences(spec.key);
                      }
                      return true;
                    })
                    .map((spec, index) => {
                      const specKey = spec.key;
                      const isDifferent = hasDifferences(specKey);
                      
                      return (
                        <tr
                          key={index}
                          className={`hover:bg-gray-50 ${isDifferent && showOnlyDifferences ? 'bg-yellow-50' : ''}`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                            {spec.label}
                          </td>
                          {selectedTractors.map((tractor) => {
                            const value = getSpecValue(tractor, specKey);
                            const otherValues = selectedTractors
                              .filter(t => t.id !== tractor.id)
                              .map(t => getSpecValue(t, specKey));
                            const isValueDifferent = isDifferent && !otherValues.some(v => String(v) === String(value));
                            
                            return (
                              <td
                                key={tractor.id}
                                className={`px-6 py-4 text-sm text-center ${
                                  isValueDifferent && showOnlyDifferences
                                    ? 'text-primary-700 font-semibold bg-yellow-100'
                                    : 'text-gray-700'
                                }`}
                              >
                                {formatValue(value)}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {getSpecsByCategory(activeCategory)
                  .filter((spec) => {
                    const hasData = selectedTractors.some(tractor => {
                      const value = getSpecValue(tractor, spec.key);
                      return value !== undefined && value !== null && value !== '';
                    });
                    if (!hasData) return false;
                    if (showOnlyDifferences) {
                      return hasDifferences(spec.key);
                    }
                    return true;
                  })
                  .map((spec, index) => {
                    const specKey = spec.key;
                    const isDifferent = hasDifferences(specKey);
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 ${isDifferent && showOnlyDifferences ? 'bg-yellow-50' : ''}`}
                      >
                        <div className="font-medium text-gray-900 mb-3 text-sm">{spec.label}</div>
                        <div className="space-y-3">
                          {selectedTractors.map((tractor) => {
                            const value = getSpecValue(tractor, specKey);
                            const otherValues = selectedTractors
                              .filter(t => t.id !== tractor.id)
                              .map(t => getSpecValue(t, specKey));
                            const isValueDifferent = isDifferent && !otherValues.some(v => String(v) === String(value));
                            
                            return (
                              <div
                                key={tractor.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <Link
                                  href={`/tractores/${tractor.slug}`}
                                  className="font-semibold text-primary-600 text-sm hover:underline flex-1"
                                >
                                  {tractor.brand} {tractor.model}
                                </Link>
                                <span
                                  className={`font-semibold text-right ml-4 ${
                                    isValueDifferent && showOnlyDifferences
                                      ? 'text-primary-700'
                                      : 'text-gray-900'
                                  }`}
                                >
                                  {formatValue(value)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}