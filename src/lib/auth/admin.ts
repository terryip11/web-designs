import type { SupabaseClient, User } from "@supabase/supabase-js";
import {
  createAuthServerClient,
  createServiceRoleClient,
} from "@/lib/supabase/server";

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

async function ensureAdminProfileFlag(user: User) {
  const adminEmails = getAdminEmails();
  if (!user.email || !adminEmails.includes(user.email.toLowerCase())) return;

  const service = createServiceRoleClient();
  if (!service) return;

  await service
    .from("profiles")
    .update({ is_admin: true, updated_at: new Date().toISOString() })
    .eq("id", user.id);
}

export async function isAdminWithClient(
  supabase: SupabaseClient,
  user: User
): Promise<boolean> {
  const adminEmails = getAdminEmails();
  if (user.email && adminEmails.includes(user.email.toLowerCase())) {
    return true;
  }

  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  return data?.is_admin === true;
}

export async function isAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;

  const adminEmails = getAdminEmails();
  if (user.email && adminEmails.includes(user.email.toLowerCase())) {
    return true;
  }

  const supabase = await createAuthServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  return data?.is_admin === true;
}

export async function requireAdmin() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isAdmin(user))) {
    return { user: null, authorized: false as const, adminClient: null };
  }

  await ensureAdminProfileFlag(user);

  return {
    user,
    authorized: true as const,
    supabase,
    adminClient: createServiceRoleClient(),
  };
}

export async function requireAdminApi() {
  const result = await requireAdmin();
  if (!result.authorized || !result.adminClient) {
    return null;
  }
  return { user: result.user, adminClient: result.adminClient };
}
