import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/admin";
import { buildProductionSpecMarkdown } from "@/lib/production-spec";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { id } = await params;
  const { data, error } = await admin.adminClient
    .from("inquiries")
    .select(
      "id, name, email, phone, company, message, template_id, template_name, selected_features, design_selections, total_price, currency, status, admin_notes, sketch_urls, asset_urls, created_at"
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "找不到紀錄" }, { status: 404 });
  }

  const markdown = buildProductionSpecMarkdown(data);

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="designpick-spec-${id.slice(0, 8)}.md"`,
    },
  });
}
