/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "elearningnew.cybersoft.edu.vn",
      },
    ],
  },
};

module.exports = nextConfig;
