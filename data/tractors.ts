import { Tractor } from '@/types/tractor';
import { scrapedTractors } from './processed-tractors';

// Función para normalizar los datos scrapeados
function normalizeScrapedTractor(tractor: Tractor): Tractor {
  // Corregir el campo brand que está mal separado
  let brand = tractor.brand;
  let model = tractor.model;

  // Casos especiales de marcas con nombres compuestos
  if (brand === 'John' && model.startsWith('Deere ')) {
    brand = 'John Deere';
    model = model.replace('Deere ', '');
  } else if (brand === 'New' && model.startsWith('Holland ')) {
    brand = 'New Holland';
    model = model.replace('Holland ', '');
  } else if (brand === 'Massey' && model.startsWith('Ferguson ')) {
    brand = 'Massey Ferguson';
    model = model.replace('Ferguson ', '');
  }
  
  // Normalizar variantes de Case IH
  if (brand === 'CaseIH' || brand === 'Case IH' || brand === 'Case' || brand === 'J.I. Case' || brand === 'J.I Case') {
    brand = 'Case IH';
  }

  // Generate description and metadata optimized for SEO with "tractor data" keyword
  const fullName = `${brand} ${model}`;
  const yearText = tractor.year ? ` ${tractor.year}` : '';
  
  const description = tractor.description || 
    `The ${fullName}${yearText} is a ${tractor.type === 'farm' ? 'farm' : 'lawn'} tractor with ${tractor.engine.powerHP} HP power.`;
  
  const metaDescription = tractor.metaDescription || 
    `${fullName}${yearText} tractor data and complete specifications. ${tractor.engine.powerHP} HP ${tractor.engine.cylinders > 0 ? `${tractor.engine.cylinders}-cylinder ` : ''}${tractor.engine.fuelType} engine, ${tractor.transmission.type} transmission.${tractor.weight ? ` Weight: ${Math.round(tractor.weight / 1000)} tons.` : ''} Access detailed tractor data, technical specifications, dimensions, hydraulic system, and performance information.`;
  
  const metaKeywords = tractor.metaKeywords || [
    `${fullName.toLowerCase()} tractor data`,
    `${brand.toLowerCase()} ${model.toLowerCase()} specifications`,
    `${brand.toLowerCase()} ${model.toLowerCase()} specs`,
    `${brand.toLowerCase()} ${model.toLowerCase()} data`,
    `${brand.toLowerCase()} tractor data`,
    `${model.toLowerCase()} tractor specifications`,
    'tractor data',
    'tractor specifications',
    `tractor ${tractor.engine.powerHP} hp`,
    tractor.type === 'farm' ? 'farm tractor data' : 'lawn tractor data',
    brand.toLowerCase(),
    model.toLowerCase(),
  ];

  // Generar slug corregido
  const slug = `${brand.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${model.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;

  return {
    ...tractor,
    brand,
    model,
    slug,
    description,
    metaDescription,
    metaKeywords,
    // Preservar el tipo original del tractor
    type: tractor.type || 'farm',
    // Preservar imageUrl solo si existe (si no, usar placeholder)
    imageUrl: tractor.imageUrl || '',
    // Completar campos opcionales
    ptoHP: tractor.ptoHP || Math.round(tractor.engine.powerHP * 0.85), // Estimación: 85% del HP del motor
    ptoRPM: tractor.ptoRPM || 540,
    category: tractor.category || (tractor.type === 'farm' ? 'Farm' : tractor.type === 'lawn' ? 'Lawn' : 'Industrial'),
  };
}

// Normalizar tractores scrapeados
const normalizedScrapedTractors = scrapedTractors.map(normalizeScrapedTractor);

// Datos de ejemplo basados en la estructura de TractorData.com
// En producción, estos datos vendrían de una base de datos o API
const staticTractors: Tractor[] = [
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
    description: 'The John Deere 8245R is a high-power agricultural tractor designed for demanding field work. With a 245 HP engine and AutoPowr IVT transmission, it offers exceptional performance and fuel efficiency.',
    features: [
      'CommandView cab with climate control',
      '24-speed AutoPowr IVT transmission',
      'High-flow hydraulic system',
      '230 HP power take-off',
      'Compatibility with smart implements',
    ],
    metaDescription: 'Complete specifications of John Deere 8245R: 245 HP, AutoPowr IVT transmission, 227 L/min hydraulics. Compare prices and features.',
    metaKeywords: ['john deere 8245r tractor data', 'john deere 8245r specifications', 'john deere 8245r specs', 'tractor data', 'tractor specifications', 'tractor 245 hp', 'john deere', 'tractor row crop'],
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
      description: 'Hydrostatic CVT transmission',
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
    description: 'The Kubota M7-171 combines power and versatility in a compact design. Ideal for a wide range of agricultural applications.',
    features: [
      'V3800-CR-TI-E4 engine',
      'CVT transmission',
      'Comfortable cab with climate control',
      'Intelligent management system',
    ],
    metaDescription: 'Kubota M7-171 2021 tractor data and complete specifications. 171 HP, CVT transmission, weight 7,850 kg. Access detailed technical information, engine specs, dimensions, and performance data.',
    metaKeywords: ['kubota m7-171 tractor data', 'kubota m7-171 specifications', 'kubota m7-171 specs', 'tractor data', 'tractor specifications', 'tractor 171 hp', 'kubota', 'tractor utility'],
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
      description: 'Continuous CVT transmission',
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
    description: 'The New Holland T8.435 is a high-power tractor designed for large-scale work. With 435 HP and state-of-the-art CVT transmission.',
    features: [
      'FPT Cursor 13 6-cylinder engine',
      'Infinite range CVT transmission',
      '230 L/min hydraulic system',
      'Ultra-quiet VisionView cab',
      'Optional autonomous driving technology',
    ],
    metaDescription: 'New Holland T8.435 2022 tractor data and complete specifications. 435 HP, CVT transmission, 230 L/min hydraulic system. Access detailed technical information, engine specs, dimensions, and performance data.',
    metaKeywords: ['new holland t8.435 tractor data', 'new holland t8.435 specifications', 'new holland t8.435 specs', 'tractor data', 'tractor specifications', 'tractor 435 hp', 'new holland', 'tractor row crop'],
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
      description: '18-speed transmission',
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
    description: 'The Case IH Magnum 240 offers power and durability for intensive agricultural work. Designed for maximum productivity and efficiency.',
    features: [
      'FPT Cursor 9 6-cylinder engine',
      '18-speed transmission',
      'High-performance hydraulic system',
      'AFS Pro 700 cab',
    ],
    metaDescription: 'Case IH Magnum 240 2021 tractor data and complete specifications. 240 HP, 18-speed transmission. Access detailed technical information, engine specs, dimensions, and performance data.',
    metaKeywords: ['case ih magnum 240 tractor data', 'case ih magnum 240 specifications', 'case ih magnum 240 specs', 'tractor data', 'tractor specifications', 'tractor 240 hp', 'case ih', 'tractor row crop'],
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
      description: 'Dyna-VT transmission',
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
    description: 'The Massey Ferguson 8660 combines power and efficiency with Dyna-VT technology for optimal field performance.',
    features: [
      'AGCO Power 6-cylinder engine',
      'Dyna-VT CVT transmission',
      '200 L/min hydraulic system',
      'Climate-controlled Dyna-6 cab',
    ],
    metaDescription: 'Massey Ferguson 8660 2022 tractor data and complete specifications. 260 HP, Dyna-VT CVT transmission. Access detailed technical information, engine specs, dimensions, and performance data.',
    metaKeywords: ['massey ferguson 8660 tractor data', 'massey ferguson 8660 specifications', 'massey ferguson 8660 specs', 'tractor data', 'tractor specifications', 'tractor 260 hp', 'massey ferguson', 'tractor row crop'],
  },
];

// Combinar tractores estáticos con los scrapeados, evitando duplicados por ID
const existingIds = new Set(staticTractors.map(t => t.id));
const uniqueScrapedTractors = normalizedScrapedTractors.filter(t => !existingIds.has(t.id));

// Array final de tractores: primero los estáticos (con más información), luego los scrapeados
export const tractors: Tractor[] = [
  ...staticTractors,
  ...uniqueScrapedTractors,
];

// Exportar también el tipo para uso en otros archivos
export type TractorType = Tractor['type'];

// Función helper para buscar tractores
export function getTractorById(id: string): Tractor | undefined {
  return tractors.find(t => t.id === id);
}

export function getTractorBySlug(slug: string): Tractor | undefined {
  return tractors.find(t => t.slug === slug);
}

export function getTractorsByBrand(brand: string): Tractor[] {
  // Normalizar el brand de búsqueda
  const normalizedSearchBrand = (brand === 'CaseIH' || brand === 'Case' || brand === 'J.I. Case' || brand === 'J.I Case') 
    ? 'Case IH' 
    : brand;
  
  // Normalizar las marcas de los tractores al filtrar
  return tractors.filter(t => {
    let tractorBrand = t.brand;
    // Normalizar variantes de Case IH
    if (tractorBrand === 'CaseIH' || tractorBrand === 'Case' || tractorBrand === 'J.I. Case' || tractorBrand === 'J.I Case') {
      tractorBrand = 'Case IH';
    }
    return tractorBrand.toLowerCase() === normalizedSearchBrand.toLowerCase();
  });
}

export function getTractorsByType(type: Tractor['type']): Tractor[] {
  return tractors.filter(t => t.type === type);
}

export function getAllBrands(): string[] {
  // Normalizar marcas antes de eliminar duplicados
  const normalizedBrands = tractors.map(t => {
    const brand = t.brand;
    // Normalizar variantes de Case IH
    if (brand === 'CaseIH' || brand === 'Case' || brand === 'J.I. Case' || brand === 'J.I Case') {
      return 'Case IH';
    }
    return brand;
  });
  
  return Array.from(new Set(normalizedBrands)).sort();
}

export function searchTractors(query: string): Tractor[] {
  const lowerQuery = query.toLowerCase();
  return tractors.filter(t => 
    t.brand.toLowerCase().includes(lowerQuery) ||
    t.model.toLowerCase().includes(lowerQuery) ||
    `${t.brand} ${t.model}`.toLowerCase().includes(lowerQuery)
  );
}

