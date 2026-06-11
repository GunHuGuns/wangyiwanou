/** @type {import('next').NextConfig} */
const nextConfig = {
  // 删掉 output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },
}

export default nextConfig