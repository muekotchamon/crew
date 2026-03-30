import type { NextConfig } from "next";

/** Set in CI for GitHub project Pages (subpath under github.io). */
const basePath = process.env.NEXT_BASE_PATH?.trim() || "";
const assetPrefix = basePath
  ? basePath.endsWith("/")
    ? basePath
    : `${basePath}/`
  : undefined;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath, assetPrefix } : {}),
};

export default nextConfig;
