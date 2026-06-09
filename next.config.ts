import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s4.advantme.ru",
      },
      {
        protocol: "https",
        hostname: "**.on-advantshop.net",
      },
      {
        protocol: "https",
        hostname: "synonym-jewelry.ru",
      },
      {
        protocol: "https",
        hostname: "www.synonym-jewelry.ru",
      },
    ],
  },
};

export default nextConfig;
