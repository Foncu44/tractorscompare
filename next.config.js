/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
}

module.exports = nextConfig