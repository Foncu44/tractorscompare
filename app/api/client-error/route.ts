import { NextRequest, NextResponse } from 'next/server';

/**
 * Production-safe client error reporting.
 * Logs payload to console so it appears in Vercel logs.
 * Only accepts POST with JSON body; no heavy processing.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = {
      ...body,
      receivedAt: new Date().toISOString(),
    };
    // Log to stdout so it shows in Vercel function logs
    console.error('[TC CLIENT-ERROR]', JSON.stringify(payload));
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error('[TC CLIENT-ERROR] parse failed', e);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
