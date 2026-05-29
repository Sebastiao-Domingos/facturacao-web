import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // se usar imagens externas
  },
};

module.exports = {
  allowedDevOrigins: ["192.168.0.*"],
};

export default nextConfig;
