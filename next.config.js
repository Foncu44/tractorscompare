/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  output: 'export', // Habilita export estático
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