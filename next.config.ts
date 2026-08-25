import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [{ url: "/offline", revision: process.env.VERCEL_GIT_COMMIT_SHA ?? "development" }],
  reloadOnOnline: false,
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSerwist(nextConfig);
