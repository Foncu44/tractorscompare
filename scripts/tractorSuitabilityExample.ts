/**
 * Example: run TractorSuitability™ Engine from Node.
 * Run: npx tsx scripts/tractorSuitabilityExample.ts
 *
 * Or call the API: POST /api/tractor-suitability with body { specs: {...} } or { tractor: {...} }
 */

import { computeSuitability, analyzeTractor } from '../lib/tractorSuitability';
import type { TractorSpecsInput } from '../lib/tractorSuitability';

const sampleSpecs: TractorSpecsInput = {
  engine: { powerHP: 100, fuelType: 'diesel', displacement: 4.5, cylinders: 4 },
  transmission: { type: 'powershift', gears: 24 },
  weight: 4500,
  hydraulicSystem: {
    pumpFlow: 95,
    liftCapacity: 4200,
    rearValves: 3,
  },
  ptoHP: 88,
  ptoRPM: 540,
  ptoRearSpeeds: '540 / 540E / 1000 / 1000E',
  capacities: { fuelTank: 120 },
};

const result = computeSuitability(sampleSpecs, 'John Deere 6M 100');
console.log(JSON.stringify(result, null, 2));

// Or from a full tractor-like object:
const tractorResult = analyzeTractor(
  {
    engine: { powerHP: 55, fuelType: 'diesel', powerKW: 41 },
    transmission: { type: 'manual', gears: 12 },
    weight: 2100,
    ptoHP: 46,
    ptoRPM: 540,
  },
  'Kubota M6060'
);
console.log('\n--- Second example (small tractor) ---');
console.log(JSON.stringify(tractorResult, null, 2));
