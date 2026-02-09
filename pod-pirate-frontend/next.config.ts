import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: process.env.NEXT_IMAGES_REMOTE_PATTERN || "",
      },
    ],
  },
};

export default nextConfig;
