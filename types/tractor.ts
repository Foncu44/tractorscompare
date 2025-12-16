export type TractorType = 'farm' | 'lawn' | 'industrial';

export type TransmissionType = 'manual' | 'hydrostatic' | 'powershift' | 'cvt';

export interface Engine {
  manufacturer?: string;
  model?: string;
  cylinders: number;
  displacement?: number; // in liters
  powerHP: number; // Horsepower
  powerKW?: number; // Kilowatts
  fuelType: 'diesel' | 'gasoline' | 'electric' | 'methane' | 'hybrid';
  cooling: 'liquid' | 'air';
  turbocharged?: boolean;
}

export interface Transmission {
  type: TransmissionType;
  gears?: number;
  description?: string;
}

export interface Dimensions {
  length?: number; // in mm
  width?: number; // in mm
  height?: number; // in mm
  wheelbase?: number; // in mm
  groundClearance?: number; // in mm
}

export interface Hydraulics {
  pumpFlow?: number; // in L/min
  steeringFlow?: number; // in L/min
  liftCapacity?: number; // in kg
  valves?: number;
}

export interface Tractor {
  id: string;
  brand: string;
  model: string;
  year?: number;
  type: TractorType;
  category?: string;
  imageUrl?: string;
  
  // Specifications
  engine: Engine;
  transmission: Transmission;
  dimensions?: Dimensions;
  weight?: number; // in kg
  hydraulicSystem?: Hydraulics;
  ptoHP?: number; // Power take-off horsepower
  ptoRPM?: number; // Standard PTO RPM (540/1000)
  
  // Additional info
  description?: string;
  features?: string[];
  
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

