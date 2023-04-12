/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/portfolio",
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        hostname: '*.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
