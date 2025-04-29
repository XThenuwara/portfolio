import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'development' ? '/portfolio' : '/portfolio',
  assetPrefix: process.env.NODE_ENV === 'development' ? '/portfolio' : './'
};

export default nextConfig;
