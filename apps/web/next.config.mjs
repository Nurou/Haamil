/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export
  images: {
    unoptimized: true,
  },
  trailingSlash: true, // Needed to enable navigating to <page> instead of <page.html>
  /* As we're using static export, this only works in development */
  async rewrites() {
    return [
      {
        source: '/api',
        destination: 'http://localhost:3001/api',
      },
    ]
  },
  distDir: '../api/public', // Have API serve static files from here
};

export default nextConfig;
