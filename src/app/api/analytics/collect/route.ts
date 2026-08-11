import { NextResponse } from "next/server";
import { z } from "zod";
import { buildIpFields, resolveClientIp } from "@/lib/analytics/ip";
import { shouldTrackPageView } from "@/lib/analytics/paths";
import { isValidVisitorId } from "@/lib/analytics/visitor-id";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

const bodySchema = z.object({
  path: z.string().min(1).max(500),
  visitorId: z.string().min(8).max(64),
  clientIp: z.string().max(45).nullable().optional(),
  referrer: z.string().max(500).nullable().optional(),
  userAgent: z.string().max(200).nullable().optional(),
});

async function purgeOldPageViews(
  supabase: NonNullable<ReturnType<typeof createServiceRoleClient>>
) {
  const cleanupRate = checkRateLimit("analytics:cleanup", 1, 60 * 60 * 1000);
  if (!cleanupRate.ok) return;

  const cutoff = new Date(Date.now() - RETENTION_MS).toISOString();
  const { error } = await supabase
    .from("page_views")
    .delete()
    .lt("created_at", cutoff);

  if (error) {
    console.error("[analytics/collect] purge:", error.message);
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`analytics:${ip}`, 120, 60 * 1000);
    if (!rate.ok) {
      return NextResponse.json({ ok: false }, { status: 429 });
    }

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const { path, visitorId, clientIp, referrer, userAgent } = parsed.data;

    if (!shouldTrackPageView(path) || !isValidVisitorId(visitorId)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const visitorRate = checkRateLimit(
      `analytics:visitor:${visitorId}`,
      60,
      60 * 1000
    );
    if (!visitorRate.ok) {
      return NextResponse.json({ ok: false }, { status: 429 });
    }

    const supabase = createServiceRoleClient();
    if (!supabase) {
      return NextResponse.json({ ok: true });
    }

    const resolvedIp =
      resolveClientIp(clientIp ?? null, null) ??
      resolveClientIp(request.headers.get("x-forwarded-for"), ip);
    const { ip_hash, ip_masked, ip_address } = buildIpFields(resolvedIp);

    const { error } = await supabase.from("page_views").insert({
      visitor_id: visitorId,
      path,
      referrer: referrer ?? null,
      user_agent: userAgent ?? null,
      ip_hash,
      ip_masked,
      ip_address,
    });

    if (error) {
      if (error.message.includes("does not exist")) {
        return NextResponse.json({ ok: true });
      }
      console.error("[analytics/collect]", error.message);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    void purgeOldPageViews(supabase);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[analytics/collect]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
