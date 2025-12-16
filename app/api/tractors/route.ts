import { NextRequest, NextResponse } from 'next/server';
import { tractorService } from '@/lib/tractorService';

/**
 * API Route para obtener todos los tractores
 * GET /api/tractors
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const brand = searchParams.get('brand');
    const type = searchParams.get('type');
    const q = searchParams.get('q');

    let tractors;

    if (q) {
      tractors = await tractorService.searchTractors(q);
    } else if (brand) {
      tractors = await tractorService.getTractorsByBrand(brand);
    } else if (type) {
      tractors = await tractorService.getTractorsByType(type as 'farm' | 'lawn' | 'industrial');
    } else {
      tractors = await tractorService.getAllTractors();
    }

    return NextResponse.json(tractors, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error en API /api/tractors:', error);
    return NextResponse.json(
      { error: 'Error al obtener tractores' },
      { status: 500 }
    );
  }
}

