import path from "node:path";
import type { NextConfig } from "next";

const testDistDir = process.env.NEXT_TEST_DIST_DIR;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(process.cwd()),
  ...(testDistDir ? { distDir: testDistDir } : {}),
};

export default nextConfig;
