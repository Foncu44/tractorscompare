import { NextResponse } from 'next/server';

/**
 * Muestra las cabeceras de seguridad (CSP, etc.) que aplica la app.
 * Solo disponible en desarrollo o con ALLOW_DEBUG_HEADERS=true (para verificar CSP en deploy).
 */
export async function GET() {
  const allowed =
    process.env.NODE_ENV === 'development' ||
    process.env.ALLOW_DEBUG_HEADERS === 'true';
  if (!allowed) {
    return NextResponse.json({ error: 'Not available' }, { status: 404 });
  }
  // Las cabeceras reales las aplica next.config.js; aquí devolvemos la CSP que está definida en build.
  // Para ver la CSP real en producción, usar DevTools > Network > cabeceras de respuesta de cualquier documento.
  const cspNote =
    'Content-Security-Policy is set in next.config.js headers(). ' +
    'Check response headers of any page in DevTools > Network.';
  return NextResponse.json({
    message: 'Debug headers info',
    nodeEnv: process.env.NODE_ENV,
    allowDebugHeaders: process.env.ALLOW_DEBUG_HEADERS === 'true',
    note: cspNote,
    howToVerify: [
      '1. Open any page, DevTools > Network, select the document request.',
      '2. Response Headers should include Content-Security-Policy (no X-Frame-Options).',
      '3. View Source: <head> should contain <script async src="...adsbygoogle.js?client=ca-pub-..." crossorigin="anonymous"> without data-nscript.',
      '4. Console: no "violates CSP" or "data-nscript" warnings for AdSense.',
    ],
  });
}
