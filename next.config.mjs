/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Serve WebP/AVIF instead of full-size JPEGs — massive egress savings
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 7 days on CDN
    minimumCacheTTL: 604800,
    // Only generate sizes we actually render
    deviceSizes: [640, 1080, 1920],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
    ],
  },
  // Cache all pages for 1 hour by default unless overridden
  experimental: {
    staleTimes: {
      dynamic: 3600,
      static: 86400,
    },
  },
}

export default nextConfig
