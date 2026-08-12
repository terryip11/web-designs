import { NextResponse } from "next/server";
import { adminInquiryWriteSchema } from "@/lib/admin-inquiry-schema";
import { requireAdminApi } from "@/lib/auth/admin";
import { CURRENCY_CODE } from "@/lib/currency";

export const dynamic = "force-dynamic";

const INQUIRY_SELECT =
  "id, name, email, phone, company, user_id, message, template_id, template_name, total_price, currency, created_at, selected_features, sketch_urls, status, email_customer_sent, email_notify_sent, admin_notes";

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
    .select(INQUIRY_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "找不到紀錄" }, { status: 404 });
  }

  return NextResponse.json({ inquiry: data });
}

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
  const parsed = adminInquiryWriteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "資料格式不正確" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const { error } = await admin.adminClient
    .from("inquiries")
    .update({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      company: data.company ?? null,
      message: data.message ?? null,
      template_id: data.template_id ?? "manual",
      template_name: data.template_name,
      selected_features: data.selected_features ?? [],
      total_price: data.total_price ?? 0,
      currency: data.currency ?? CURRENCY_CODE,
      status: data.status ?? "new",
      admin_notes: data.admin_notes ?? null,
    })
    .eq("id", id);

  if (error) {
    console.error("Admin inquiry update:", error);
    return NextResponse.json({ error: "更新失敗" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { id } = await params;
  const { error } = await admin.adminClient.from("inquiries").delete().eq("id", id);

  if (error) {
    console.error("Admin inquiry delete:", error);
    return NextResponse.json({ error: "刪除失敗" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
