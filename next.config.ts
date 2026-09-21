import type { NextConfig } from "next";

const nextConfig: NextConfig & { allowedDevOrigins?: string[] } = {
  /* config options here */
  allowedDevOrigins: ["becki-nonstatutable-jeni.ngrok-free.dev"],
};

export default nextConfig;
