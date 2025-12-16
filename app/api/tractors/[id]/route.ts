import { NextRequest, NextResponse } from 'next/server';
import { tractorService } from '@/lib/tractorService';

/**
 * API Route para obtener un tractor por ID
 * GET /api/tractors/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tractor = await tractorService.getTractorById(params.id);

    if (!tractor) {
      return NextResponse.json(
        { error: 'Tractor no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(tractor, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error en API /api/tractors/[id]:', error);
    return NextResponse.json(
      { error: 'Error al obtener tractor' },
      { status: 500 }
    );
  }
}

