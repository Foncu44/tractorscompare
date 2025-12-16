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
  // Ignorar las API routes en el build estático
  exportPathMap: async function () {
    return {};
  },
}

module.exports = nextConfig