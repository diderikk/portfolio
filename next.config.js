/** @type {import('next').NextConfig} */
const nextConfig = {
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
