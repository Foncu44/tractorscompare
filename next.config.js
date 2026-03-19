/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// CSP compatible con AdSense, Auto Ads preview y Funding Choices. Sin require-trusted-types-for (rompe preview).
// No se usa X-Frame-Options ni frame-ancestors solo 'self' para permitir el iframe del preview.
const scriptSrcList = [
  "'self'", "'unsafe-inline'", "'unsafe-eval'",
  'https://pagead2.googlesyndication.com',
  'https://googleads.g.doubleclick.net',
  'https://tpc.googlesyndication.com',
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
  'https://analytics.google.com',
  'https://fundingchoicesmessages.google.com',
  'https://fundingchoices.google.com',
  'https://*.gstatic.com',
  'https://securepubads.g.doubleclick.net',
  'https://www.googletagservices.com',
  'https://adservice.google.com',
  'https://*.googlesyndication.com',
  'https://*.doubleclick.net',
  'https://*.google.com',
  'https://*.googleusercontent.com',
];
const scriptSrc = scriptSrcList.join(' ');
const styleSrc = ["'self'", "'unsafe-inline'", "https://*.gstatic.com"].join(' ');
const frameSrc = [
  "'self'",
  'https://googleads.g.doubleclick.net',
  'https://tpc.googlesyndication.com',
  'https://fundingchoicesmessages.google.com',
  'https://fundingchoices.google.com',
  'https://securepubads.g.doubleclick.net',
  'https://*.google.com',
  'https://*.googleusercontent.com',
].join(' ');
const connectSrc = [
  "'self'",
  'https://pagead2.googlesyndication.com',
  'https://googleads.g.doubleclick.net',
  'https://tpc.googlesyndication.com',
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
  'https://analytics.google.com',
  'https://fundingchoicesmessages.google.com',
  'https://fundingchoices.google.com',
  'https://*.google.com',
  'https://*.gstatic.com',
  'https://*.googleusercontent.com',
].join(' ');
const imgSrc = [
  "'self'", 'data:', 'blob:', 'https:',
  'https://pagead2.googlesyndication.com',
  'https://googleads.g.doubleclick.net',
  'https://tpc.googlesyndication.com',
  'https://*.gstatic.com',
].join(' ');
// frame-ancestors: quién puede embeber esta web en iframe (AdSense Preview). No restringir solo a 'self'.
const frameAncestors = [
  "'self'",
  "https://*.google.com",
  "https://*.googleusercontent.com",
  "https://adsense.google.com",
  "https://autoads-preview.googleusercontent.com",
  "https://*.doubleclick.net",
  "https://*.googlesyndication.com",
].join(' ');
const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  `script-src-elem ${scriptSrc}`,
  `style-src ${styleSrc}`,
  `style-src-elem ${styleSrc}`,
  `frame-src ${frameSrc}`,
  `frame-ancestors ${frameAncestors}`,
  "connect-src " + connectSrc,
  "img-src " + imgSrc,
  "font-src 'self' data: https://www.gstatic.com https://*.googleusercontent.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  // No se envía X-Frame-Options (permitiría bloquear iframe); el control de embedding se hace solo con CSP frame-ancestors.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          // Tell Google (and other crawlers) that large image previews are
          // allowed.  This is the HTTP-header equivalent of the <meta> robots
          // tag already set in app/layout.tsx and is required for Google
          // Discover eligibility (images must be ≥ 1200 px wide AND the site
          // must opt-in to large previews via one of these two mechanisms).
          { key: 'X-Robots-Tag', value: 'max-image-preview:large' },
        ],
      },
      // Cache OG images aggressively — they change only when tractor data
      // changes.  stale-while-revalidate lets CDNs serve stale during regen.
      {
        source: '/:path*/opengraph-image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
  // output: 'export' — Desactivado: /api/listings requiere servidor. Para export estático, elimina app/api/listings y la UI usará solo enlaces de búsqueda.
  // output: 'export',
  images: {
    unoptimized: true, // Necesario para export estático
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Deshabilitar generación de páginas de error en export estático
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Configuración para evitar errores con páginas de error
  distDir: '.next',
  // Optimizaciones de bundle
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Optimizar imports
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = withBundleAnalyzer(nextConfig)