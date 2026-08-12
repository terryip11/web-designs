import IndustryShell from "@/components/demos/industry/IndustryShell";
import { getIndustryBrand } from "@/lib/demo-sites/industry-brands";

export default function IndustryContactPage({
  templateId,
  basePath,
}: {
  templateId: string;
  basePath: string;
}) {
  const brand = getIndustryBrand(templateId);
  if (!brand) return null;

  return (
    <IndustryShell brand={brand} basePath={basePath}>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold" style={{ color: brand.textColor }}>
          聯絡我們
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          歡迎查詢服務詳情，我們會在 1 個工作天內回覆。
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <dl className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                電話
              </dt>
              <dd className="mt-2 text-lg text-slate-800">{brand.phone}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
              </dt>
              <dd className="mt-2 text-lg text-slate-800">{brand.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                地址
              </dt>
              <dd className="mt-2 text-lg text-slate-800">{brand.address}</dd>
            </div>
          </dl>

          <form className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="mb-6 text-sm text-slate-500">
              此為 DesignPick 展示表單，正式網站可連接真實詢價系統。
            </p>
            <div className="space-y-4">
              <input
                placeholder="姓名"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
                disabled
              />
              <input
                placeholder="Email"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
                disabled
              />
              <textarea
                placeholder="查詢內容"
                rows={4}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
                disabled
              />
              <button
                type="button"
                className="w-full rounded-lg py-3 text-sm font-medium text-white opacity-80"
                style={{ backgroundColor: brand.primaryColor }}
                disabled
              >
                {brand.ctaLabel}（展示）
              </button>
            </div>
          </form>
        </div>
      </section>
    </IndustryShell>
  );
}
