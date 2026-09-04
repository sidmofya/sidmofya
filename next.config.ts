import path from "node:path";
import type { NextConfig } from "next";

const testDistDir = process.env.NEXT_TEST_DIST_DIR;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(process.cwd()),
  ...(testDistDir ? { distDir: testDistDir } : {}),
  async redirects() {
    // The old services architecture. Kept as permanent redirects rather than
    // deletions, since these URLs may be indexed or externally linked.
    return [
      { source: "/market-legibility", destination: "/23-south", permanent: true },
      { source: "/room-to-results", destination: "https://motif54.com", permanent: true },
      { source: "/work-with-me", destination: "/contact", permanent: true },
      { source: "/briefings", destination: "/speaking", permanent: true },
      { source: "/sovereigngeometry", destination: "/23-south", permanent: true },
      { source: "/reinvention", destination: "/contact", permanent: true },
      { source: "/ai-music-rights", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
