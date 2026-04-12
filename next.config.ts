import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pixelfed.de",
      },
      {
        protocol: "https",
        hostname: "pxlfdde.fsn1.your-objectstorage.com",
      },
    ],
  },
};

export default nextConfig;
