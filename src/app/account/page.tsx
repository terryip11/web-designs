import Link from "next/link";
import { redirect } from "next/navigation";
import AccountProfileForm from "@/components/AccountProfileForm";
import RevealOnScroll from "@/components/RevealOnScroll";
import SavedConfigsPanel from "@/components/SavedConfigsPanel";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/session";
import { formatPrice } from "@/lib/data";
import { createAuthServerClient } from "@/lib/supabase/server";
import type { SavedConfig } from "@/types";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const profile = await getCurrentProfile();
  const { tab } = await searchParams;
  const activeTab = tab === "saved" || tab === "inquiries" ? tab : "profile";

  const supabase = await createAuthServerClient();

  const { data: savedConfigs } = await supabase
    .from("saved_configs")
    .select("*")
    .order("updated_at", { ascending: false });

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select(
      "id, template_name, total_price, currency, created_at, selected_features"
    )
    .order("created_at", { ascending: false })
    .limit(20);

  const tabs = [
    { id: "profile", label: "個人資料" },
    { id: "saved", label: "已儲存方案" },
    { id: "inquiries", label: "詢價紀錄" },
  ] as const;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <RevealOnScroll>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">會員中心</h1>
          <p className="mt-2 text-zinc-500">{user.email}</p>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.03}>
        <nav className="mb-8 flex flex-wrap gap-2 border-b border-zinc-800 pb-4">
          {tabs.map((t) => (
            <Link
              key={t.id}
              href={`/account?tab=${t.id}`}
              className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                activeTab === t.id
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </RevealOnScroll>

      {activeTab === "profile" && (
        <RevealOnScroll delay={0.06}>
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
            <h2 className="mb-5 text-lg font-semibold text-white">個人資料</h2>
            <AccountProfileForm profile={profile} email={user.email ?? ""} />
          </section>
        </RevealOnScroll>
      )}

      {activeTab === "saved" && (
        <RevealOnScroll delay={0.06}>
          <section>
            <h2 className="mb-4 text-lg font-semibold text-white">已儲存方案</h2>
            <SavedConfigsPanel
              initialConfigs={(savedConfigs ?? []) as SavedConfig[]}
            />
          </section>
        </RevealOnScroll>
      )}

      {activeTab === "inquiries" && (
        <RevealOnScroll delay={0.06}>
          <section>
            <h2 className="mb-4 text-lg font-semibold text-white">詢價紀錄</h2>
            {!inquiries?.length ? (
              <div className="rounded-xl border border-dashed border-zinc-700 p-8 text-center text-sm text-zinc-500">
                尚無提交紀錄。{" "}
                <Link href="/contact" className="text-violet-400 hover:underline">
                  提交需求
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {inquiries.map((inq) => (
                  <li
                    key={inq.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-white">{inq.template_name}</p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {new Date(inq.created_at).toLocaleString("zh-HK")}
                        </p>
                      </div>
                      <span className="text-sm text-violet-400">
                        {formatPrice(inq.total_price)} {inq.currency}
                      </span>
                    </div>
                    {Array.isArray(inq.selected_features) &&
                      inq.selected_features.length > 0 && (
                        <p className="mt-2 text-xs text-zinc-600">
                          {(inq.selected_features as string[]).join(" · ")}
                        </p>
                      )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </RevealOnScroll>
      )}
    </div>
  );
}
