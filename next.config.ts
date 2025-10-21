import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.bluemonstercase.com",
      },
    ],
  },
};

export default nextConfig;
