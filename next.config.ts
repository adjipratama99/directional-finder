import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['http://192.168.1.57:3000'],
  turbopack: {
    root: path.join(__dirname, '..')
  }
};

export default nextConfig;
