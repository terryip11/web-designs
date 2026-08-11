import type { SupabaseClient } from "@supabase/supabase-js";
import type { AdminInquiryRow } from "@/components/AdminInquiryManager";

export interface AdminInquiryFilters {
  q?: string;
  status?: string;
  limit?: number;
}

export async function getAdminInquiries(
  adminClient: SupabaseClient,
  { q, status, limit = 200 }: AdminInquiryFilters = {}
): Promise<{ rows: AdminInquiryRow[]; error: string | null }> {
  let query = adminClient
    .from("inquiries")
    .select(
      "id, name, email, phone, company, template_id, template_name, total_price, currency, created_at, selected_features, design_selections, sketch_urls, asset_urls, message, status, email_customer_sent, email_notify_sent, admin_notes"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq("status", status);
  }

  if (q?.trim()) {
    const safe = q.trim().replace(/[%_,]/g, "");
    if (safe) {
      const term = `%${safe}%`;
      query = query.or(
        `name.ilike.${term},email.ilike.${term},template_name.ilike.${term},company.ilike.${term}`
      );
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Admin inquiries fetch:", error);
    return { rows: [], error: error.message };
  }

  return { rows: (data ?? []) as AdminInquiryRow[], error: null };
}
