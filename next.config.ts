import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['http://192.168.1.57:3000'],
  webpack: (config, { isServer }) => {
    if (!config.externals) config.externals = []

    config.externals = {
      ...config.externals,
      '@sap/hana-client': 'commonjs @sap/hana-client',
      mysql: 'commonjs mysql',
      mssql: 'commonjs mssql',
      oracledb: 'commonjs oracledb',
      sqlite3: 'commonjs sqlite3',
      'react-native-sqlite-storage': 'commonjs react-native-sqlite-storage',
    }


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
