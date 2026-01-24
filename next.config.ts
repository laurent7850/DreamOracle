import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to satisfy Next.js 16
  turbopack: {},
  // Enable standalone output for Docker deployment
  output: "standalone",
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
