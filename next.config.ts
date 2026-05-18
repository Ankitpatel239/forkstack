import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable scroll restoration (keeps scroll position on navigation)
  experimental: {
    scrollRestoration: true,
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  // Allowed origins for development (ngrok, local network, etc.)
  allowedDevOrigins: ['192.168.1.15', '7df1-2401-4900-1ca3-5220-6061-4f92-e10d-fcc.ngrok-free.app'],
};

export default nextConfig;