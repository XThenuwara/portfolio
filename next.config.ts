import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: 'akamai',
    path: '',
    unoptimized: true
  },
  output: 'export'
};

export default nextConfig;
