import { NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
};

/**
 * OPTIONS: CORS preflight; return 204 with CORS headers.
 */
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * GET: Health/usage hint. Return JSON so visiting /api/client-error in browser shows ok:true.
 */
export async function GET() {
  return NextResponse.json(
    { ok: true, method: 'GET', hint: 'Use POST to send error payload' },
    { status: 200, headers: CORS_HEADERS }
  );
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
