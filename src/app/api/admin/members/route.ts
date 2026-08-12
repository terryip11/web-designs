import { NextResponse } from "next/server";
import { adminMemberCreateSchema } from "@/lib/admin/member-schema";
import { getAdminMembers } from "@/lib/admin/members";
import { requireAdminApi } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const roleParam = searchParams.get("role");
  const role =
    roleParam === "admin" || roleParam === "member" ? roleParam : undefined;

  const { rows, error } = await getAdminMembers(admin.adminClient, { q, role });
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ members: rows });
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = adminMemberCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "資料格式不正確" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const { data: created, error: createError } =
    await admin.adminClient.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        display_name: data.display_name ?? undefined,
      },
    });

  if (createError || !created.user) {
    console.error("Admin member create:", createError);
    return NextResponse.json(
      { error: createError?.message ?? "建立會員失敗" },
      { status: 400 }
    );
  }

  const { error: profileError } = await admin.adminClient
    .from("profiles")
    .update({
      display_name: data.display_name ?? null,
      phone: data.phone ?? null,
      company: data.company ?? null,
      is_admin: data.is_admin ?? false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", created.user.id);

  if (profileError) {
    console.error("Admin member profile update:", profileError);
    return NextResponse.json({ error: "會員已建立，但資料更新失敗" }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: created.user.id });
}
