import RevealOnScroll from "@/components/RevealOnScroll";
import AdminBlogManager from "@/components/AdminBlogManager";
import { getAdminBlogPosts } from "@/lib/blog/queries";
import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminBlogPage() {
  const { adminClient } = await requireAdmin();

  if (!adminClient) {
    return (
      <div className="text-center text-zinc-400">
        後台無法連線資料庫，請確認已設定{" "}
        <code className="text-amber-400">SUPABASE_SERVICE_ROLE_KEY</code>。
      </div>
    );
  }

  const { rows, error } = await getAdminBlogPosts(adminClient);
  const publishedCount = rows.filter((row) => row.published).length;

  return (
    <>
      <RevealOnScroll>
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-400/80">
            內容
          </p>
          <h1 className="mt-1 text-3xl font-bold text-white">Blog 管理</h1>
          <p className="mt-2 text-sm text-zinc-500">
            共 {rows.length} 篇 · 已發布 {publishedCount} 篇
          </p>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.05}>
        <AdminBlogManager rows={rows} migrationHint={error} />
      </RevealOnScroll>
    </>
  );
}
