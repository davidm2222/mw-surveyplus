/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  // Disable server-side features not compatible with static export
  trailingSlash: true,
}

module.exports = nextConfig
