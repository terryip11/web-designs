export const dynamic = "force-static";

export function GET() {
  return new Response("google-site-verification: google1b59146166aed7ad.html\n", {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
