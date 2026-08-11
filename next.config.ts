import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

function getR2ImageHostname(): string | null {
  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (!publicUrl) return null;
  try {
    return new URL(publicUrl).hostname;
  } catch {
    return null;
  }
}

const r2Hostname = getR2ImageHostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(r2Hostname
        ? [{ protocol: "https" as const, hostname: r2Hostname }]
        : [{ protocol: "https" as const, hostname: "images.unsplash.com" }]),
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
