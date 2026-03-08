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

// PWA configuration - conditionally applied
const withPWA = (config: NextConfig): NextConfig => {
  if (process.env.NODE_ENV === "production") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const withPWAInit = require("next-pwa").default;
      return withPWAInit({
        dest: "public",
        register: true,
        skipWaiting: true,
      })(config);
    } catch {
      // PWA package not available, return config as-is
      return config;
    }
  }
  return config;
};

export default withPWA(nextConfig);
