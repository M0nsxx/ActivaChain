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
    
    // Configuración mejorada de chunks para evitar errores de carga
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
            web3: {
              test: /[\\/]node_modules[\\/](@reown|wagmi|viem|ethers)[\\/]/,
              name: 'web3',
              priority: 10,
              chunks: 'all',
            },
            fonts: {
              test: /[\\/]node_modules[\\/](next[\\/]font|@next[\\/]font)[\\/]/,
              name: 'fonts',
              priority: 5,
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },
  // Configuración experimental para mejorar la estabilidad
  experimental: {
    optimizePackageImports: ['@reown/appkit', 'wagmi', 'viem'],
  },
  transpilePackages: ['@reown/appkit', '@reown/appkit-adapter-wagmi'],
  // Configuración para mejorar la carga de chunks
  output: 'standalone',
}

module.exports = nextConfig
