import type { NextConfig } from "next";

/**
 * GitHub **project** Pages URL: `https://<user>.github.io/<repo>/`
 * Set `NEXT_BASE_PATH=/<repo>` when building for Pages (see `build:pages` & CI workflow).
 * Leave unset for local `next dev` or hosting at domain root.
 */
const basePath = process.env.NEXT_BASE_PATH?.trim() || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
