import path from "node:path";
import type { NextConfig } from "next";

const testDistDir = process.env.NEXT_TEST_DIST_DIR;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(process.cwd()),
  ...(testDistDir
    ? {
        distDir: testDistDir,
        // The test suite builds repeatedly into throwaway dist directories. webpack's
        // persistent filesystem cache can poison one of them: a corrupt cache pack makes
        // every later build fail while hashing, until the directory is deleted by hand.
        // These builds are disposable, so they never keep a cache to go stale.
        webpack: (config: { cache?: unknown }) => {
          config.cache = false;
          return config;
        },
      }
    : {}),
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
      // The capability statement is now a PDF, downloadable from /about.
      { source: "/capability", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
