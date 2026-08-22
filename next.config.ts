import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    let backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
    // Check if the environment variable was injected as the string "undefined"
    if (backendUrl === "undefined" || backendUrl.includes("undefined")) {
      backendUrl = "http://localhost:8000";
    }
    
    // Ensure destination has a valid protocol to prevent build errors
    if (!backendUrl.startsWith("http")) {
      backendUrl = `https://${backendUrl}`;
    }

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
