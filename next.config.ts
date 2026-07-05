import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Wildcarded because the workspace image URL is admin-configurable
    // (via /admin/settings) and can point to any host. Safe here since
    // only an authenticated admin can set it, not public input.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
