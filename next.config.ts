import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],
  outputFileTracingIncludes: {
    "/**": ["./node_modules/better-sqlite3/prebuilds/*.node"],
  },
};

export default nextConfig;
