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
    loader: 'default',
    // Will be changed to Cloudinary loader later
  },
};

export default nextConfig;
