import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  serverExternalPackages: [
    "@deck.gl/core",
    "@deck.gl/layers",
    "@deck.gl/mapbox",
    "maplibre-gl"
  ],
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "paris-districts.beautiful-apps.com" }],
        destination: "https://urbanqualitymap.com/:path*",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
