import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "cdn-icons-png.flaticon.com",
        protocol: "https",
      },
      { hostname: "ui-avatars.com", protocol: "https" },
      { hostname: "images.unsplash.com", protocol: "https" },
    ],
  },
};

export default nextConfig;
