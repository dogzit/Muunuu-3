import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This folder sits inside another Next.js project; keep Turbopack rooted here.
  turbopack: { root: __dirname },
};

export default nextConfig;
