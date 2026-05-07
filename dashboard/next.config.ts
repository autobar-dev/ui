import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['pc.lan', 'pc'],
  output: "standalone",
};

export default nextConfig;
