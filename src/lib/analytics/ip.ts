import { createHash } from "node:crypto";

const PRIVATE_IP_PATTERN =
  /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|fc|fd)/i;

export function resolveClientIp(
  forwardedFor: string | null,
  realIp: string | null
): string | null {
  const raw = forwardedFor?.split(",")[0]?.trim() || realIp?.trim() || null;
  if (!raw || raw === "unknown") return null;
  return raw.slice(0, 45);
}

export function maskIp(ip: string): string | null {
  if (PRIVATE_IP_PATTERN.test(ip)) return "本機/內網";

  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    }
  }

  if (ip.includes(":")) {
    const head = ip.split(":").filter(Boolean).slice(0, 2).join(":");
    return head ? `${head}:…` : null;
  }

  return null;
}

export function hashIp(ip: string): string {
  const salt = process.env.ANALYTICS_IP_SALT ?? "designpick-analytics";
  return createHash("sha256")
    .update(`${salt}:${ip}`)
    .digest("hex")
    .slice(0, 24);
}

export function buildIpFields(ip: string | null): {
  ip_hash: string | null;
  ip_masked: string | null;
  ip_address: string | null;
} {
  if (!ip) return { ip_hash: null, ip_masked: null, ip_address: null };
  return {
    ip_hash: hashIp(ip),
    ip_masked: maskIp(ip),
    ip_address: ip,
  };
}
