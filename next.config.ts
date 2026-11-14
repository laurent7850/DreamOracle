import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to satisfy Next.js 16
  turbopack: {},
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
