import Link from "next/link";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/session";
import { requireAdmin } from "@/lib/auth/admin";
import RevealOnScroll from "@/components/RevealOnScroll";

export default async function AdminPage() {
  const { authorized, adminClient } = await requireAdmin();

  if (!authorized) {
    const user = await getCurrentUser();
    redirect(user ? "/account" : "/login?next=/admin");
  }

  if (!adminClient) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center text-zinc-400">
        後台無法連線資料庫，請確認已設定{" "}
        <code className="text-amber-400">SUPABASE_SERVICE_ROLE_KEY</code>。
      </div>
    );
  }

  const { data: inquiries, error } = await adminClient
    .from("inquiries")
    .select(
      "id, name, email, phone, company, template_name, total_price, currency, created_at, selected_features, sketch_urls, message"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Admin inquiries fetch:", error);
  }

  const rows = inquiries ?? [];
  const totalValue = rows.reduce((sum, r) => sum + (r.total_price ?? 0), 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <RevealOnScroll>
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-amber-400/80">
              管理後台
            </p>
            <h1 className="mt-1 text-3xl font-bold text-white">客戶詢價管理</h1>
            <p className="mt-2 text-sm text-zinc-500">
              共 {rows.length} 筆紀錄 · 參考總額{" "}
              {formatPrice(totalValue)} HKD
            </p>
          </div>
          <Link
            href="/account"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:text-white"
          >
            返回會員中心
          </Link>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.05}>
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 p-12 text-center text-zinc-500">
            尚無詢價紀錄
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-800">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs text-zinc-500">
                  <th className="px-4 py-3 font-medium">時間</th>
                  <th className="px-4 py-3 font-medium">客戶</th>
                  <th className="px-4 py-3 font-medium">介面</th>
                  <th className="px-4 py-3 font-medium">參考價</th>
                  <th className="px-4 py-3 font-medium">草圖</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-800/80 hover:bg-zinc-900/40"
                  >
                    <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">
                      {new Date(row.created_at).toLocaleString("zh-HK")}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{row.name}</p>
                      <p className="text-xs text-zinc-500">{row.email}</p>
                      {row.phone && (
                        <p className="text-xs text-zinc-600">{row.phone}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{row.template_name}</td>
                    <td className="px-4 py-3 text-violet-400 whitespace-nowrap">
                      {formatPrice(row.total_price)} {row.currency}
                    </td>
                    <td className="px-4 py-3">
                      {Array.isArray(row.sketch_urls) && row.sketch_urls.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {(row.sketch_urls as string[]).map((url, i) => (
                            <a
                              key={url}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-emerald-400 hover:underline"
                            >
                              圖{i + 1}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </RevealOnScroll>
    </div>
  );
}
