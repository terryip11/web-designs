import { NextResponse } from "next/server";
import { adminMemberUpdateSchema } from "@/lib/admin/member-schema";
import { getAdminMemberById } from "@/lib/admin/members";
import { requireAdminApi } from "@/lib/auth/admin";

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
  const { row, error } = await getAdminMemberById(admin.adminClient, id);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  if (!row) {
    return NextResponse.json({ error: "找不到會員" }, { status: 404 });
  }

  return NextResponse.json({ member: row });
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
  const parsed = adminMemberUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "資料格式不正確" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (data.is_admin === false && admin.user.id === id) {
    return NextResponse.json({ error: "無法移除自己的管理員權限" }, { status: 400 });
  }

  const authUpdate: {
    email?: string;
    password?: string;
    user_metadata?: { display_name?: string };
  } = {};

  if (data.email) authUpdate.email = data.email;
  if (data.password) authUpdate.password = data.password;
  if (data.display_name !== undefined) {
    authUpdate.user_metadata = { display_name: data.display_name ?? undefined };
  }

  if (Object.keys(authUpdate).length > 0) {
    const { error: authError } = await admin.adminClient.auth.admin.updateUserById(
      id,
      authUpdate
    );
    if (authError) {
      console.error("Admin member auth update:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }
  }

  const profileUpdate: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (data.display_name !== undefined) profileUpdate.display_name = data.display_name;
  if (data.phone !== undefined) profileUpdate.phone = data.phone;
  if (data.company !== undefined) profileUpdate.company = data.company;
  if (data.is_admin !== undefined) profileUpdate.is_admin = data.is_admin;

  const { error: profileError } = await admin.adminClient
    .from("profiles")
    .update(profileUpdate)
    .eq("id", id);

  if (profileError) {
    console.error("Admin member profile update:", profileError);
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
  if (admin.user.id === id) {
    return NextResponse.json({ error: "無法刪除自己的帳號" }, { status: 400 });
  }

  const { error } = await admin.adminClient.auth.admin.deleteUser(id);
  if (error) {
    console.error("Admin member delete:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
