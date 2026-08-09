import { Mail, MapPin, Phone } from "lucide-react";
import MedicalShell from "@/components/demos/medical/MedicalShell";
import { MEDICAL_BRAND } from "@/lib/demo-sites/medical-data";

export default function MedicalContactPage({ basePath }: { basePath: string }) {
  return (
    <MedicalShell basePath={basePath}>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold text-[#334155]">聯絡我們</h1>
            <p className="mt-4 text-[#64748B]">
              歡迎致電、電郵或親臨診所。此為 DesignPick 模板展示，表單不會提交真實資料。
            </p>
            <ul className="mt-10 space-y-6">
              <li className="flex gap-4">
                <Phone className="mt-0.5 h-5 w-5 text-[#0EA5E9]" />
                <div>
                  <p className="font-medium text-[#334155]">電話</p>
                  <p className="text-sm text-[#64748B]">{MEDICAL_BRAND.phone}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Mail className="mt-0.5 h-5 w-5 text-[#0EA5E9]" />
                <div>
                  <p className="font-medium text-[#334155]">Email</p>
                  <p className="text-sm text-[#64748B]">{MEDICAL_BRAND.email}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <MapPin className="mt-0.5 h-5 w-5 text-[#0EA5E9]" />
                <div>
                  <p className="font-medium text-[#334155]">地址</p>
                  <p className="text-sm text-[#64748B]">{MEDICAL_BRAND.address}</p>
                  <p className="mt-1 text-sm text-[#64748B]">{MEDICAL_BRAND.hours}</p>
                </div>
              </li>
            </ul>
          </div>

          <form className="rounded-2xl border border-[#0EA5E9]/10 bg-white p-8 shadow-sm">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#334155]">姓名</label>
                <input
                  type="text"
                  placeholder="您的姓名"
                  className="mt-1.5 w-full rounded-lg border border-[#0EA5E9]/20 px-4 py-2.5 text-sm outline-none focus:border-[#0EA5E9]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155]">電話</label>
                <input
                  type="tel"
                  placeholder="+852"
                  className="mt-1.5 w-full rounded-lg border border-[#0EA5E9]/20 px-4 py-2.5 text-sm outline-none focus:border-[#0EA5E9]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155]">查詢內容</label>
                <textarea
                  rows={4}
                  placeholder="請描述您的需要"
                  className="mt-1.5 w-full rounded-lg border border-[#0EA5E9]/20 px-4 py-2.5 text-sm outline-none focus:border-[#0EA5E9]"
                />
              </div>
              <button
                type="button"
                className="w-full rounded-full bg-[#0EA5E9] py-3 font-medium text-white hover:bg-[#0284C7]"
              >
                提交查詢（展示用）
              </button>
            </div>
          </form>
        </div>
      </section>
    </MedicalShell>
  );
}
