import { type NextRequest } from "next/server";
import { enqueuePageViewTrack } from "@/lib/analytics/track-request";
import { resolveDemoRewrite } from "@/lib/demo-sites/routing";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const demoRewrite = resolveDemoRewrite(request);
  if (demoRewrite) return demoRewrite;

  const response = await updateSession(request);
  response.headers.set("x-next-pathname", request.nextUrl.pathname);
  if (response.status < 300 || response.status >= 400) {
    enqueuePageViewTrack(request, response);
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
