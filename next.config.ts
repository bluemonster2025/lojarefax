import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.lojarefax.com.br",
      },
    ],
  },
};

export default nextConfig;
