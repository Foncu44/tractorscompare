import { NextRequest, NextResponse } from 'next/server';
import { computeSuitability, specsFromTractor } from '@/lib/tractorSuitability';
import type { TractorSpecsInput } from '@/lib/tractorSuitability';

/**
 * POST /api/tractor-suitability
 * Body: { specs: TractorSpecsInput } or { tractor: <full tractor> }
 * Optional: { tractorName?: string }
 * Returns: TractorSuitabilityResult (JSON)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let specs: TractorSpecsInput;
    let tractorName: string | undefined;

    if (body.specs && body.specs.engine?.powerHP != null && body.specs.transmission?.type != null) {
      specs = body.specs as TractorSpecsInput;
      tractorName = body.tractorName;
    } else if (body.tractor && body.tractor.engine?.powerHP != null && body.tractor.transmission?.type != null) {
      specs = specsFromTractor(body.tractor);
      tractorName = body.tractorName ?? (body.tractor.brand && body.tractor.model ? `${body.tractor.brand} ${body.tractor.model}` : undefined);
    } else {
      return NextResponse.json(
        { error: 'Invalid input: provide either "specs" (engine.powerHP, transmission.type) or "tractor" object' },
        { status: 400 }
      );
    }

    const result = computeSuitability(specs, tractorName);
    return NextResponse.json(result);
  } catch (e) {
    console.error('TractorSuitability API error:', e);
    return NextResponse.json(
      { error: 'Failed to compute suitability analysis' },
      { status: 500 }
    );
  }
}
