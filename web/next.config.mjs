/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true
  },
  eslint: {
    dirs: ["src"]
  },
  typescript: {
    ignoreBuildErrors: false
  }
};

export default nextConfig;

