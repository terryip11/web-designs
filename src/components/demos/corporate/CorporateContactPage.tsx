import { Mail, MapPin, Phone } from "lucide-react";
import CorporateShell from "@/components/demos/corporate/CorporateShell";
import { CORPORATE_BRAND } from "@/lib/demo-sites/corporate-data";

export default function CorporateContactPage({ basePath }: { basePath: string }) {
  return (
    <CorporateShell basePath={basePath}>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold text-[#1E293B]">聯絡我們</h1>
            <p className="mt-4 text-slate-600">
              歡迎預約諮詢或查詢合作。此為 DesignPick 模板展示，表單不會提交真實資料。
            </p>
            <ul className="mt-10 space-y-6">
              <li className="flex gap-4">
                <Phone className="mt-0.5 h-5 w-5 text-[#2563EB]" />
                <div>
                  <p className="font-medium text-[#1E293B]">電話</p>
                  <p className="text-sm text-slate-600">{CORPORATE_BRAND.phone}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Mail className="mt-0.5 h-5 w-5 text-[#2563EB]" />
                <div>
                  <p className="font-medium text-[#1E293B]">Email</p>
                  <p className="text-sm text-slate-600">{CORPORATE_BRAND.email}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <MapPin className="mt-0.5 h-5 w-5 text-[#2563EB]" />
                <div>
                  <p className="font-medium text-[#1E293B]">地址</p>
                  <p className="text-sm text-slate-600">{CORPORATE_BRAND.address}</p>
                </div>
              </li>
            </ul>
          </div>
          <form className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#1E293B]">姓名</label>
                <input
                  type="text"
                  placeholder="您的姓名"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B]">公司</label>
                <input
                  type="text"
                  placeholder="公司名稱"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B]">查詢內容</label>
                <textarea
                  rows={4}
                  placeholder="請描述您的需要"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                />
              </div>
              <button
                type="button"
                className="w-full rounded-lg bg-[#2563EB] py-3 font-medium text-white hover:bg-blue-700"
              >
                提交查詢（展示用）
              </button>
            </div>
          </form>
        </div>
      </section>
    </CorporateShell>
  );
}
