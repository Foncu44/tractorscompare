import { NextRequest, NextResponse } from 'next/server';
import { tractorService } from '@/lib/tractorService';

/**
 * API Route para obtener tractores por marca
 * GET /api/tractors/brand/[brand]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { brand: string } }
) {
  try {
    const brand = decodeURIComponent(params.brand);
    const tractors = await tractorService.getTractorsByBrand(brand);

    return NextResponse.json(tractors, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error en API /api/tractors/brand/[brand]:', error);
    return NextResponse.json(
      { error: 'Error al obtener tractores por marca' },
      { status: 500 }
    );
  }
}

