/** @type {import('next').NextConfig} */
const nextConfig = {
    api: {
    bodyParser: false, // still needed because we're using formidable
    externalResolver: true,
  },
    experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // Increase as needed
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig