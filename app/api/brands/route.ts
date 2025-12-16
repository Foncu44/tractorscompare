import { NextRequest, NextResponse } from 'next/server';
import { tractorService } from '@/lib/tractorService';

/**
 * API Route para obtener todas las marcas
 * GET /api/brands
 */
export async function GET(request: NextRequest) {
  try {
    const brands = await tractorService.getAllBrands();

    return NextResponse.json(brands, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Error en API /api/brands:', error);
    return NextResponse.json(
      { error: 'Error al obtener marcas' },
      { status: 500 }
    );
  }
}

