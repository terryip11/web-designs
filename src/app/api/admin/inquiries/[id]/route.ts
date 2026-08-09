import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/admin";
import { inquiryStatusSchema } from "@/lib/inquiry-schema";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = inquiryStatusSchema.safeParse(body.status);

  if (!parsed.success) {
    return NextResponse.json({ error: "無效的狀態" }, { status: 400 });
  }

  const { error } = await admin.adminClient
    .from("inquiries")
    .update({ status: parsed.data })
    .eq("id", id);

  if (error) {
    console.error("Admin inquiry update:", error);
    return NextResponse.json({ error: "更新失敗" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
