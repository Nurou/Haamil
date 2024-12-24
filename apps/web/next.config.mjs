/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export", // Static export
	images: {
		unoptimized: true,
	},
	trailingSlash: true, // Needed to enable navigating to <page> instead of <page.html>
};

export default nextConfig;
