import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['betteruse'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

export default nextConfig
