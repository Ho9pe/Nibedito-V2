/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dzrgyxroo/**',
      },
    ],
    domains: ['res.cloudinary.com'],
    unoptimized: true,
  },
};

export default nextConfig;
