import { NextRequest, NextResponse } from 'next/server';
import { tractorService } from '@/lib/tractorService';

/**
 * API Route para obtener un tractor por slug
 * GET /api/tractors/slug/[slug]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const tractor = await tractorService.getTractorBySlug(params.slug);

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
    console.error('Error en API /api/tractors/slug/[slug]:', error);
    return NextResponse.json(
      { error: 'Error al obtener tractor' },
      { status: 500 }
    );
  }
}

