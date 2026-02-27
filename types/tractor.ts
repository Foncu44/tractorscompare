export type TractorType = 'farm' | 'lawn' | 'industrial';

export type TransmissionType = 'manual' | 'hydrostatic' | 'powershift' | 'cvt';

export interface Engine {
  manufacturer?: string;
  model?: string;
  cylinders: number;
  displacement?: number; // in liters
  powerHP: number; // Horsepower (gross)
  powerHPNet?: number; // Net horsepower
  powerKW?: number; // Kilowatts
  powerHPNominal?: number; // Nominal power in HP
  powerRPM?: number; // RPM at which power is measured
  torqueMax?: number; // Maximum torque in Nm
  torqueRPM?: number; // RPM at which max torque occurs
  torqueReserve?: number; // Torque reserve percentage
  bore?: number; // Cylinder bore in mm
  stroke?: number; // Piston stroke in mm
  compression?: number; // Compression ratio (e.g., 16:1)
  fuelSystem?: string; // e.g., "Common Rail", "Direct Injection"
  aspiration?: string; // e.g., "Turbocharged with Intercooler", "Naturally Aspirated"
  emissions?: string; // e.g., "Tier 4 Final / Stage V", "Tier 3"
  fuelType: 'diesel' | 'gasoline' | 'electric' | 'methane' | 'hybrid';
  cooling: 'liquid' | 'air';
  turbocharged?: boolean;
  starterVolts?: number; // Starter voltage (e.g., 12V)
}

export interface Transmission {
  type: TransmissionType;
  gears?: number;
  description?: string;
  speedRange?: string; // e.g., "0.05 - 50 km/h"
  reverser?: string; // e.g., "Electro-hydraulic Reverser"
  clutch?: string; // e.g., "Multi-disc wet clutch"
  superSlowSpeed?: string; // e.g., "0.05 km/h available"
  features?: string[]; // e.g., ["Clutchless shift", "ECO Mode", "Cruise control"]
}

export interface Dimensions {
  length?: number; // in mm
  width?: number; // in mm
  height?: number; // in mm
  wheelbase?: number; // in mm
  groundClearance?: number; // in mm
  frontTread?: { min?: number; max?: number }; // Front tread width in mm
  rearTread?: { min?: number; max?: number }; // Rear tread width in mm
}

export interface Hydraulics {
  type?: string; // e.g., "Closed center with pressure and flow compensation"
  pumpFlow?: number; // in L/min
  steeringFlow?: number; // in L/min
  maxPressure?: number; // in bar
  valves?: number; // Total number of valves (generic)
  rearValves?: number; // Number of rear valves
  rearValvesMax?: number; // Maximum rear valves
  frontValves?: number; // Number of front valves (optional)
  liftCapacity?: number; // Rear lift capacity in kg
  frontLiftCapacity?: number; // Front lift capacity in kg (optional)
  category?: string; // e.g., "Category I/II", "Category II", "Category III"
}

export interface Capacities {
  fuelTank?: number; // in liters
  hydraulicReservoir?: number; // in liters
  coolant?: number; // in liters
  engineOil?: number; // in liters
  transmissionOil?: number; // in liters
}

export interface DocumentationLinks {
  technicalCatalog?: string; // URL to technical catalog PDF
  operatorManual?: string; // URL to operator manual
  serviceManual?: string; // URL to service manual
  partsCatalog?: string; // URL to parts catalog
  manufacturerPage?: string; // URL to manufacturer's product page
}

export interface Tires {
  front?: string[]; // Front tire sizes (e.g., ["5.50-16", "6.00-16"])
  rear?: string[]; // Rear tire sizes (e.g., ["11.2/10-28", "9-32"])
}

export interface ProductionYears {
  start?: number; // Production start year
  end?: number; // Production end year
}

/** Free-to-use image with attribution (e.g. from Wikimedia Commons). */
export interface TractorImage {
  url: string;
  source: 'wikimedia';
  sourcePageUrl: string;
  author: string;
  license: string;
  licenseUrl: string;
  attributionHtml: string;
  matchConfidence?: 'high' | 'medium' | 'low';
}

export interface Tractor {
  id: string;
  brand: string;
  model: string;
  year?: number; // Single year (for backward compatibility)
  productionYears?: ProductionYears; // Production years range
  type: TractorType;
  category?: string;
  imageUrl?: string;
  /** Structured image + attribution (e.g. from Wikimedia pipeline). */
  image?: TractorImage;
  brandWebsite?: string; // Sitio oficial del fabricante (si está disponible)
  
  // Specifications
  engine: Engine;
  transmission: Transmission;
  dimensions?: Dimensions;
  weight?: number; // in kg
  hydraulicSystem?: Hydraulics;
  ptoHP?: number; // Power take-off horsepower
  ptoRPM?: number; // Standard PTO RPM (540/1000)
  ptoRearType?: string; // e.g., "Independent"
  ptoRearSpeeds?: string; // e.g., "540 / 540E / 1000 / 1000E"
  ptoFront?: string; // e.g., "1000 rpm optional"
  ptoFrontPower?: number; // Front PTO power in HP
  ptoActuation?: string; // e.g., "Electrohydraulic"
  capacities?: Capacities;
  tires?: Tires; // Tire sizes
  
  // Documentation and external links
  documentation?: DocumentationLinks;
  
  // Additional info
  description?: string;
  features?: string[];
  seoContent?: string; // Rich SEO content for the tractor page
  
  // Pricing
  priceRange?: {
    min?: number; // Minimum price in USD
    max?: number; // Maximum price in USD
  };
  
  // SEO
  slug: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface Brand {
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  tractorCount?: number;
}

