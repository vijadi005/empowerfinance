const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'empowerfin.com.au',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
