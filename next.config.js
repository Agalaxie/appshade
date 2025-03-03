/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  transpilePackages: [
    '@clerk/nextjs',
    '@clerk/clerk-react',
    '@clerk/shared',
    'scheduler',
  ],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      os: false,
      path: false,
      stream: false,
      util: false,
      buffer: false,
      process: false,
    };
    return config;
  },
}

module.exports = nextConfig 