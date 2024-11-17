/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
