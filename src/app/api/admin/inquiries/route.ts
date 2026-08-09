import { NextResponse } from "next/server";
import { adminInquiryWriteSchema } from "@/lib/admin-inquiry-schema";
import { requireAdminApi } from "@/lib/auth/admin";
import { CURRENCY_CODE } from "@/lib/currency";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = adminInquiryWriteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "資料格式不正確" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const { data: inserted, error } = await admin.adminClient
    .from("inquiries")
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      company: data.company ?? null,
      message: data.message ?? null,
      template_id: data.template_id ?? "manual",
      template_name: data.template_name,
      selected_features: data.selected_features ?? [],
      design_selections: {},
      total_price: data.total_price ?? 0,
      currency: data.currency ?? CURRENCY_CODE,
      status: data.status ?? "new",
      admin_notes: data.admin_notes ?? null,
      sketch_urls: [],
      email_customer_sent: false,
      email_notify_sent: false,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Admin inquiry create:", error);
    return NextResponse.json({ error: "新增失敗" }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: inserted.id });
}
