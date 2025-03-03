/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    runtime: 'nodejs',
    serverComponents: true,
  },
}

module.exports = nextConfig 