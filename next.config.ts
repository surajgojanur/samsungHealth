import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(process.cwd()),
  allowedDevOrigins: ["http://10.20.200.205:3000"]
};

export default nextConfig;
