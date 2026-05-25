import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Client-only aliasing was added to dedupe React in the browser bundles.
    // Temporarily disable it while debugging hydration/runtime errors.
    if (!isServer && false) {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        react: path.resolve(__dirname, "node_modules/react"),
        "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      };
    }
    return config;
  },
};

export default nextConfig;
