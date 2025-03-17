/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'ucarecdn.com',
          port: '',
        },
      ],
  },
};

export default nextConfig;