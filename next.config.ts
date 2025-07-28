import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['http://192.168.1.57:3000'],
  webpack: (config, { isServer }) => {
    config.externals = config.externals || []
    config.externals.push({
      'react-native-sqlite-storage': 'commonjs react-native-sqlite-storage',
      '@sap/hana-client': 'commonjs @sap/hana-client',
    })
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      tls: false,
      net: false,
      dns: false,
      crypto: false,
    }

    return config
  },
};

export default nextConfig;
