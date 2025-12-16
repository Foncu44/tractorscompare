'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, GitCompare as CompareIcon } from 'lucide-react';
import { tractors, getTractorById } from '@/data/tractors';
import { Tractor } from '@/types/tractor';

export default function CompararPage() {
  const [selectedTractors, setSelectedTractors] = useState<Tractor[]>([]);
  const [showTractorSelector, setShowTractorSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Cargar tractores desde URL params si existen
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
    if (!selectedTractors.find(t => t.id === tractor.id)) {
      setSelectedTractors([...selectedTractors, tractor]);
    }
    setShowTractorSelector(false);
    setSearchQuery('');
  };

  const removeTractor = (id: string) => {
    setSelectedTractors(selectedTractors.filter(t => t.id !== id));
  };

  const filteredTractors = searchQuery
    ? tractors.filter(t =>
        `${t.brand} ${t.model}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tractors.slice(0, 10);

  const specsToCompare = [
    { label: 'Marca', key: 'brand' as keyof Tractor },
    { label: 'Modelo', key: 'model' as keyof Tractor },
    { label: 'Año', key: 'year' as keyof Tractor },
    { label: 'Potencia (HP)', key: 'engine.powerHP' },
    { label: 'Potencia (kW)', key: 'engine.powerKW' },
    { label: 'Cilindros', key: 'engine.cylinders' },
    { label: 'Combustible', key: 'engine.fuelType' },
    { label: 'Peso (kg)', key: 'weight' },
    { label: 'Tipo Transmisión', key: 'transmission.type' },
    { label: 'Marchas', key: 'transmission.gears' },
    { label: 'TDF HP', key: 'ptoHP' },
  ];

  const getSpecValue = (tractor: Tractor, specKey: string): string | number | undefined => {
    if (specKey.includes('.')) {
      const [parent, child] = specKey.split('.');
      const parentObj = (tractor as any)[parent];
      return parentObj?.[child];
    }
    return (tractor as any)[specKey];
  };

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Comparar Tractores</h1>
        <p className="text-gray-600 text-lg">
          Compara hasta 4 tractores lado a lado para encontrar el mejor para tus necesidades.
        </p>
      </div>

      {/* Tractor Selector */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          {selectedTractors.map((tractor) => (
            <div
              key={tractor.id}
              className="flex items-center bg-primary-100 rounded-lg p-3 pr-2"
            >
              <Link
                href={`/tractores/${tractor.slug}`}
                className="font-semibold text-primary-900 mr-2 hover:underline"
              >
                {tractor.brand} {tractor.model}
              </Link>
              <button
                onClick={() => removeTractor(tractor.id)}
                className="text-primary-600 hover:text-primary-800 p-1"
                aria-label="Eliminar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {selectedTractors.length < 4 && (
            <button
              onClick={() => setShowTractorSelector(!showTractorSelector)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar Tractor</span>
            </button>
          )}
        </div>

        {/* Tractor Selector Dropdown */}
        {showTractorSelector && (
          <div className="mt-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-h-96 overflow-y-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tractor..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-primary-500"
            />
            <div className="space-y-2">
              {filteredTractors.map((tractor) => (
                <button
                  key={tractor.id}
                  onClick={() => addTractor(tractor)}
                  disabled={selectedTractors.some(t => t.id === tractor.id)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">
                      {tractor.brand} {tractor.model}
                    </div>
                    <div className="text-sm text-gray-600">
                      {tractor.engine.powerHP} HP • {tractor.type}
                    </div>
                  </div>
                  {selectedTractors.some(t => t.id === tractor.id) && (
                    <span className="text-primary-600 text-sm">Ya agregado</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {selectedTractors.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-gray-50 z-10 min-w-[200px]">
                    Especificación
                  </th>
                  {selectedTractors.map((tractor) => (
                    <th
                      key={tractor.id}
                      className="px-6 py-4 text-center text-sm font-semibold text-gray-900 min-w-[250px]"
                    >
                      <div className="flex flex-col items-center">
                        {tractor.imageUrl && (
                          <div className="relative w-24 h-24 mb-2 rounded-lg overflow-hidden bg-gray-200">
                            <Image
                              src={tractor.imageUrl}
                              alt={`${tractor.brand} ${tractor.model}`}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </div>
                        )}
                        <Link
                          href={`/tractores/${tractor.slug}`}
                          className="font-bold text-primary-600 hover:underline"
                        >
                          {tractor.brand} {tractor.model}
                        </Link>
                        {tractor.year && (
                          <span className="text-sm text-gray-500">{tractor.year}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {specsToCompare.map((spec, index) => {
                  const specKey = spec.key;
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                        {spec.label}
                      </td>
                      {selectedTractors.map((tractor) => {
                        const value = getSpecValue(tractor, specKey);
                        return (
                          <td
                            key={tractor.id}
                            className="px-6 py-4 text-sm text-center text-gray-700"
                          >
                            {value !== undefined && value !== null
                              ? typeof value === 'string'
                                ? value.charAt(0).toUpperCase() + value.slice(1)
                                : value.toLocaleString()
                              : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* Engine Specs */}
                {selectedTractors.some(t => t.engine.displacement) && (
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 sticky left-0 bg-white z-10">
                      Cilindrada (L)
                    </td>
                    {selectedTractors.map((tractor) => (
                      <td key={tractor.id} className="px-6 py-4 text-sm text-center text-gray-700">
                        {tractor.engine.displacement || '-'}
                      </td>
                    ))}
                  </tr>
                )}

                {/* Dimensions */}
                {selectedTractors.some(t => t.dimensions) && (
                  <>
                    <tr className="bg-gray-50">
                      <td colSpan={selectedTractors.length + 1} className="px-6 py-3 text-sm font-bold text-gray-900">
                        Dimensiones
                      </td>
                    </tr>
                    {['length', 'width', 'height'].map((dim) => (
                      <tr key={dim}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700 sticky left-0 bg-white z-10">
                          {dim === 'length' ? 'Longitud' : dim === 'width' ? 'Ancho' : 'Altura'} (mm)
                        </td>
                        {selectedTractors.map((tractor) => (
                          <td key={tractor.id} className="px-6 py-4 text-sm text-center text-gray-700">
                            {tractor.dimensions?.[dim as keyof typeof tractor.dimensions] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}

                {/* Hydraulics */}
                {selectedTractors.some(t => t.hydraulicSystem) && (
                  <>
                    <tr className="bg-gray-50">
                      <td colSpan={selectedTractors.length + 1} className="px-6 py-3 text-sm font-bold text-gray-900">
                        Sistema Hidráulico
                      </td>
                    </tr>
                    {['pumpFlow', 'liftCapacity'].map((hyd) => (
                      <tr key={hyd}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700 sticky left-0 bg-white z-10">
                          {hyd === 'pumpFlow' ? 'Flujo bomba (L/min)' : 'Capacidad elevación (kg)'}
                        </td>
                        {selectedTractors.map((tractor) => (
                          <td key={tractor.id} className="px-6 py-4 text-sm text-center text-gray-700">
                            {tractor.hydraulicSystem?.[hyd as keyof typeof tractor.hydraulicSystem] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <CompareIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Comienza a Comparar</h3>
          <p className="text-gray-600 mb-6">
            Agrega tractores para comparar sus especificaciones lado a lado.
          </p>
          <button
            onClick={() => setShowTractorSelector(true)}
            className="btn-primary"
          >
            Agregar Primer Tractor
          </button>
        </div>
      )}
    </div>
  );
}

