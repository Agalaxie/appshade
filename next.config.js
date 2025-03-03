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
  webpack: (config, { isServer }) => {
    if (!isServer) {
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
    }
    // Ajouter une règle pour transpiler les modules node_modules
    config.module.rules.push({
      test: /\.m?js$/,
      include: [
        /node_modules\/@clerk/,
        /node_modules\/scheduler/,
      ],
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['next/babel'],
          ],
        },
      },
    });
    return config;
  },
}

module.exports = nextConfig 