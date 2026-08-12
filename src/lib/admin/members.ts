import type { SupabaseClient } from "@supabase/supabase-js";

export interface AdminMemberRow {
  id: string;
  email: string;
  display_name: string | null;
  phone: string | null;
  company: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  inquiry_count: number;
  saved_config_count: number;
}

export interface AdminMemberFilters {
  q?: string;
  role?: "admin" | "member";
  limit?: number;
}

function countByUserId(rows: { user_id: string | null }[] | null) {
  const map = new Map<string, number>();
  for (const row of rows ?? []) {
    if (!row.user_id) continue;
    map.set(row.user_id, (map.get(row.user_id) ?? 0) + 1);
  }
  return map;
}

export async function getAdminMembers(
  adminClient: SupabaseClient,
  { q, role, limit = 500 }: AdminMemberFilters = {}
): Promise<{ rows: AdminMemberRow[]; error: string | null }> {
  const [
    usersResult,
    profilesResult,
    inquiriesResult,
    configsResult,
  ] = await Promise.all([
    adminClient.auth.admin.listUsers({ perPage: 1000 }),
    adminClient.from("profiles").select("*"),
    adminClient.from("inquiries").select("user_id"),
    adminClient.from("saved_configs").select("user_id"),
  ]);

  if (usersResult.error) {
    console.error("Admin members list users:", usersResult.error);
    return { rows: [], error: usersResult.error.message };
  }

  if (profilesResult.error) {
    console.error("Admin members profiles:", profilesResult.error);
    return { rows: [], error: profilesResult.error.message };
  }

  const profileById = new Map(
    (profilesResult.data ?? []).map((profile) => [profile.id, profile])
  );
  const inquiryCounts = countByUserId(inquiriesResult.data);
  const configCounts = countByUserId(configsResult.data);

  let rows: AdminMemberRow[] = (usersResult.data.users ?? []).map((user) => {
    const profile = profileById.get(user.id);
    return {
      id: user.id,
      email: user.email ?? "",
      display_name: profile?.display_name ?? null,
      phone: profile?.phone ?? null,
      company: profile?.company ?? null,
      is_admin: profile?.is_admin === true,
      created_at: profile?.created_at ?? user.created_at,
      updated_at: profile?.updated_at ?? user.updated_at ?? user.created_at,
      last_sign_in_at: user.last_sign_in_at ?? null,
      inquiry_count: inquiryCounts.get(user.id) ?? 0,
      saved_config_count: configCounts.get(user.id) ?? 0,
    };
  });

  if (role === "admin") {
    rows = rows.filter((row) => row.is_admin);
  } else if (role === "member") {
    rows = rows.filter((row) => !row.is_admin);
  }

  if (q?.trim()) {
    const term = q.trim().toLowerCase();
    rows = rows.filter(
      (row) =>
        row.email.toLowerCase().includes(term) ||
        (row.display_name?.toLowerCase().includes(term) ?? false) ||
        (row.phone?.toLowerCase().includes(term) ?? false) ||
        (row.company?.toLowerCase().includes(term) ?? false)
    );
  }

  rows.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return { rows: rows.slice(0, limit), error: null };
}

export async function getAdminMemberById(
  adminClient: SupabaseClient,
  id: string
): Promise<{ row: AdminMemberRow | null; error: string | null }> {
  const { rows, error } = await getAdminMembers(adminClient, { limit: 1000 });
  if (error) return { row: null, error };
  return { row: rows.find((row) => row.id === id) ?? null, error: null };
}
