/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // 🔥 IMPORTANT FIX
  trailingSlash: true,

  images: {
    domains: [
      "images.unsplash.com",
      "via.placeholder.com",
      "res.cloudinary.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
