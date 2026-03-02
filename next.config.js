/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// CSP compatible con AdSense, Auto Ads preview y Funding Choices. Sin require-trusted-types-for (rompe preview).
const scriptAndStyleHosts = [
  'https://pagead2.googlesyndication.com',
  'https://tpc.googlesyndication.com',
  'https://googleads.g.doubleclick.net',
  'https://securepubads.g.doubleclick.net',
  'https://www.googletagservices.com',
  'https://adservice.google.com',
  'https://fundingchoicesmessages.google.com',
  'https://www.googletagmanager.com',
  'https://www.gstatic.com',
  'https://*.googlesyndication.com',
  'https://*.doubleclick.net',
  'https://*.google.com',
  'https://*.googleusercontent.com',
];
const scriptSrc = ["'self'", "'unsafe-inline'", "'unsafe-eval'", ...scriptAndStyleHosts].join(' ');
const styleSrc = ["'self'", "'unsafe-inline'", "https://www.gstatic.com", "https://*.google.com", "https://*.googleusercontent.com"].join(' ');
const frameSrc = ["'self'", "https://googleads.g.doubleclick.net", "https://tpc.googlesyndication.com", "https://securepubads.g.doubleclick.net", "https://fundingchoicesmessages.google.com", "https://*.google.com", "https://*.googleusercontent.com"].join(' ');
const connectSrc = ["'self'", "https://pagead2.googlesyndication.com", "https://googleads.g.doubleclick.net", "https://tpc.googlesyndication.com", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://analytics.google.com", "https://fundingchoicesmessages.google.com", "https://*.google.com", "https://*.googleusercontent.com"].join(' ');
// frame-ancestors: quién puede embeber esta web en iframe (AdSense Preview, etc.). No confundir con frame-src.
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
  "img-src 'self' data: blob: https:",
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