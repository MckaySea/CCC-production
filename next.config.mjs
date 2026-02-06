/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ['@radix-ui/react-select', '@radix-ui/react-popper', 'lucide-react'],
}

export default nextConfig
