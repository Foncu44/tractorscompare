import { NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * OPTIONS: CORS preflight; return 204 with CORS headers.
 */
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * GET: 204 para que nunca devuelva 405 ni rompa iframes/preview.
 */
export async function GET() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * POST: Production-safe client error reporting.
 * Parse JSON payload, log with "[TC CLIENT ERROR]", return 204.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = {
      ...body,
      receivedAt: new Date().toISOString(),
    };
    console.error('[TC CLIENT ERROR]', JSON.stringify(payload));
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
  } catch (e) {
    console.error('[TC CLIENT ERROR] parse failed', e);
    return new NextResponse(null, { status: 400, headers: CORS_HEADERS });
  }
}
