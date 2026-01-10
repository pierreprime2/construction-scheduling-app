/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return {
      // beforeFiles rewrites are checked before pages/public files
      // allowing page routes to override
      beforeFiles: [],
      // afterFiles rewrites are checked after pages/public files
      // but before dynamic routes
      afterFiles: [
        // Proxy /api/backend/* to Symfony /api/*
        // This is handled by the route handler in app/api/backend/[...path]/route.ts
        // but we need to exclude it from the fallback rewrite below
      ],
      // fallback rewrites are checked after all pages/public files and dynamic routes
      fallback: [
        // Only proxy direct API calls that don't have a local route handler
        // Local route handlers in app/api/* will take precedence
      ],
    }
  },
}

export default nextConfig
