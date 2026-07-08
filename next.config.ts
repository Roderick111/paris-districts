import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  serverExternalPackages: [
    "@deck.gl/core",
    "@deck.gl/layers",
    "@deck.gl/mapbox",
    "maplibre-gl"
  ]
};

export default nextConfig;
