import { Tractor } from '@/types/tractor';

// Datos de ejemplo basados en la estructura de TractorData.com
// En producción, estos datos vendrían de una base de datos o API
export const tractors: Tractor[] = [
  {
    id: 'john-deere-8245r',
    brand: 'John Deere',
    model: '8245R',
    year: 2020,
    type: 'farm',
    category: 'Row Crop',
    slug: 'john-deere-8245r',
    imageUrl: '/images/tractors/tractor_8245r.jpg',
    engine: {
      cylinders: 6,
      displacement: 9.0,
      powerHP: 245,
      powerKW: 183,
      fuelType: 'diesel',
      cooling: 'liquid',
      turbocharged: true,
    },
    transmission: {
      type: 'powershift',
      gears: 24,
      description: '24-speed AutoPowr IVT',
    },
    dimensions: {
      length: 5690,
      width: 2790,
      height: 3240,
      wheelbase: 2860,
      groundClearance: 480,
    },
    weight: 12250,
    hydraulicSystem: {
      pumpFlow: 227,
      steeringFlow: 24,
      liftCapacity: 9500,
      valves: 5,
    },
    ptoHP: 230,
    ptoRPM: 540,
    description: 'El John Deere 8245R es un tractor agrícola de gran potencia diseñado para trabajos exigentes en el campo. Con un motor de 245 HP y transmisión AutoPowr IVT, ofrece rendimiento excepcional y eficiencia de combustible.',
    features: [
      'Cabina CommandView con climatización',
      'Transmisión AutoPowr IVT de 24 velocidades',
      'Sistema hidráulico de alto flujo',
      'Toma de fuerza de 230 HP',
      'Compatibilidad con implementos inteligentes',
    ],
    metaDescription: 'Especificaciones completas del John Deere 8245R: 245 HP, transmisión AutoPowr IVT, hidráulica de 227 L/min. Compara precios y características.',
    metaKeywords: ['john deere 8245r', 'tractor 245 hp', 'tractor agrícola', 'john deere', 'tractor row crop'],
  },
  {
    id: 'kubota-m7-171',
    brand: 'Kubota',
    model: 'M7-171',
    year: 2021,
    type: 'farm',
    category: 'Utility',
    slug: 'kubota-m7-171',
    imageUrl: '/images/tractors/Kubota M7-171.jpeg',
    engine: {
      cylinders: 6,
      displacement: 6.1,
      powerHP: 171,
      powerKW: 127,
      fuelType: 'diesel',
      cooling: 'liquid',
      turbocharged: true,
    },
    transmission: {
      type: 'hydrostatic',
      description: 'Transmisión hidrostática CVT',
    },
    dimensions: {
      length: 4850,
      width: 2450,
      height: 2850,
      wheelbase: 2650,
      groundClearance: 420,
    },
    weight: 7850,
    hydraulicSystem: {
      pumpFlow: 95,
      liftCapacity: 4200,
      valves: 3,
    },
    ptoHP: 160,
    ptoRPM: 540,
    description: 'El Kubota M7-171 combina potencia y versatilidad en un diseño compacto. Ideal para una amplia gama de aplicaciones agrícolas.',
    features: [
      'Motor V3800-CR-TI-E4',
      'Transmisión CVT',
      'Cabina cómoda con control climático',
      'Sistema de gestión inteligente',
    ],
    metaDescription: 'Especificaciones del Kubota M7-171: 171 HP, transmisión CVT, peso 7.850 kg. Información completa y comparación.',
    metaKeywords: ['kubota m7-171', 'tractor 171 hp', 'kubota', 'tractor utility'],
  },
  {
    id: 'new-holland-t8-435',
    brand: 'New Holland',
    model: 'T8.435',
    year: 2022,
    type: 'farm',
    category: 'Row Crop',
    slug: 'new-holland-t8-435',
    imageUrl: '/images/tractors/New Holland T8.435.jpg',
    engine: {
      cylinders: 6,
      displacement: 9.0,
      powerHP: 435,
      powerKW: 324,
      fuelType: 'diesel',
      cooling: 'liquid',
      turbocharged: true,
    },
    transmission: {
      type: 'cvt',
      description: 'Transmisión continua CVT',
    },
    dimensions: {
      length: 6150,
      width: 3050,
      height: 3450,
      wheelbase: 3100,
      groundClearance: 520,
    },
    weight: 16800,
    hydraulicSystem: {
      pumpFlow: 230,
      liftCapacity: 12000,
      valves: 6,
    },
    ptoHP: 410,
    ptoRPM: 1000,
    description: 'El New Holland T8.435 es un tractor de alta potencia diseñado para trabajos de gran escala. Con 435 HP y transmisión CVT de última generación.',
    features: [
      'Motor FPT Cursor 13 de 6 cilindros',
      'Transmisión CVT de rango infinito',
      'Sistema hidráulico de 230 L/min',
      'Cabina VisionView ultra silenciosa',
      'Tecnología de conducción autónoma opcional',
    ],
    metaDescription: 'New Holland T8.435: 435 HP, transmisión CVT, sistema hidráulico de 230 L/min. Especificaciones completas y precio.',
    metaKeywords: ['new holland t8.435', 'tractor 435 hp', 'new holland', 'tractor agrícola'],
  },
  {
    id: 'case-ih-magnum-240',
    brand: 'Case IH',
    model: 'Magnum 240',
    year: 2021,
    type: 'farm',
    category: 'Row Crop',
    slug: 'case-ih-magnum-240',
    imageUrl: '/images/tractors/Case IH Magnum 240.webp',
    engine: {
      cylinders: 6,
      displacement: 8.7,
      powerHP: 240,
      powerKW: 179,
      fuelType: 'diesel',
      cooling: 'liquid',
      turbocharged: true,
    },
    transmission: {
      type: 'powershift',
      gears: 18,
      description: 'Transmisión de 18 velocidades',
    },
    dimensions: {
      length: 5750,
      width: 2850,
      height: 3350,
      wheelbase: 2920,
      groundClearance: 490,
    },
    weight: 13200,
    hydraulicSystem: {
      pumpFlow: 215,
      liftCapacity: 9800,
      valves: 4,
    },
    ptoHP: 225,
    ptoRPM: 540,
    description: 'El Case IH Magnum 240 ofrece potencia y durabilidad para trabajos agrícolas intensivos. Diseñado para máxima productividad y eficiencia.',
    features: [
      'Motor FPT Cursor 9 de 6 cilindros',
      'Transmisión de 18 velocidades',
      'Sistema hidráulico de alto rendimiento',
      'Cabina AFS Pro 700',
    ],
    metaDescription: 'Case IH Magnum 240: 240 HP, transmisión de 18 velocidades. Especificaciones técnicas completas y características.',
    metaKeywords: ['case ih magnum 240', 'tractor 240 hp', 'case ih', 'tractor row crop'],
  },
  {
    id: 'massey-ferguson-8660',
    brand: 'Massey Ferguson',
    model: '8660',
    year: 2022,
    type: 'farm',
    category: 'Row Crop',
    slug: 'massey-ferguson-8660',
    imageUrl: '/images/tractors/Massey Ferguson 8660.jpg',
    engine: {
      cylinders: 6,
      displacement: 7.4,
      powerHP: 260,
      powerKW: 194,
      fuelType: 'diesel',
      cooling: 'liquid',
      turbocharged: true,
    },
    transmission: {
      type: 'cvt',
      description: 'Transmisión Dyna-VT',
    },
    dimensions: {
      length: 5600,
      width: 2750,
      height: 3200,
      wheelbase: 2850,
    },
    weight: 11800,
    hydraulicSystem: {
      pumpFlow: 200,
      liftCapacity: 9200,
      valves: 5,
    },
    ptoHP: 245,
    ptoRPM: 540,
    description: 'El Massey Ferguson 8660 combina potencia y eficiencia con la tecnología Dyna-VT para un rendimiento óptimo en campo.',
    features: [
      'Motor AGCO Power de 6 cilindros',
      'Transmisión Dyna-VT CVT',
      'Sistema hidráulico de 200 L/min',
      'Cabina Dyna-6 climatizada',
    ],
    metaDescription: 'Massey Ferguson 8660: 260 HP, transmisión Dyna-VT CVT. Especificaciones y características completas.',
    metaKeywords: ['massey ferguson 8660', 'tractor 260 hp', 'massey ferguson', 'tractor agrícola'],
  },
];

// Función helper para buscar tractores
export function getTractorById(id: string): Tractor | undefined {
  return tractors.find(t => t.id === id);
}

export function getTractorBySlug(slug: string): Tractor | undefined {
  return tractors.find(t => t.slug === slug);
}

export function getTractorsByBrand(brand: string): Tractor[] {
  return tractors.filter(t => t.brand.toLowerCase() === brand.toLowerCase());
}

export function getTractorsByType(type: Tractor['type']): Tractor[] {
  return tractors.filter(t => t.type === type);
}

export function getAllBrands(): string[] {
  return Array.from(new Set(tractors.map(t => t.brand))).sort();
}

export function searchTractors(query: string): Tractor[] {
  const lowerQuery = query.toLowerCase();
  return tractors.filter(t => 
    t.brand.toLowerCase().includes(lowerQuery) ||
    t.model.toLowerCase().includes(lowerQuery) ||
    `${t.brand} ${t.model}`.toLowerCase().includes(lowerQuery)
  );
}

