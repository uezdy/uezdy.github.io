import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/new-approach',
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
