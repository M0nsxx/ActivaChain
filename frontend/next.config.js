/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ipfs.io', 'gateway.pinata.cloud'],
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    };
    
    return config;
  },
}

module.exports = nextConfig
