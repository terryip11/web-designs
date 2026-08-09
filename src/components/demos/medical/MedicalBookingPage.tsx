import Link from "next/link";
import MedicalShell from "@/components/demos/medical/MedicalShell";
import { MEDICAL_BRAND, MEDICAL_DOCTORS, MEDICAL_SERVICES } from "@/lib/demo-sites/medical-data";

export default function MedicalBookingPage({
  basePath,
  preselectedService,
  preselectedDoctor,
}: {
  basePath: string;
  preselectedService?: string;
  preselectedDoctor?: string;
}) {
  return (
    <MedicalShell basePath={basePath}>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#334155]">網上預約</h1>
        <p className="mt-2 text-[#64748B]">
          填寫以下資料，我們會在 24 小時內確認。此為 DesignPick 模板展示，表單不會提交真實資料。
        </p>

        <form className="mt-10 space-y-6 rounded-2xl border border-[#0EA5E9]/10 bg-white p-8 shadow-sm">
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
            <label className="block text-sm font-medium text-[#334155]">服務項目</label>
            <select
              defaultValue={preselectedService ?? ""}
              className="mt-1.5 w-full rounded-lg border border-[#0EA5E9]/20 px-4 py-2.5 text-sm outline-none focus:border-[#0EA5E9]"
            >
              <option value="">請選擇</option>
              {MEDICAL_SERVICES.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#334155]">偏好醫護人員（選填）</label>
            <select
              defaultValue={preselectedDoctor ?? ""}
              className="mt-1.5 w-full rounded-lg border border-[#0EA5E9]/20 px-4 py-2.5 text-sm outline-none focus:border-[#0EA5E9]"
            >
              <option value="">不限</option>
              {MEDICAL_DOCTORS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#334155]">偏好日期</label>
            <input
              type="date"
              className="mt-1.5 w-full rounded-lg border border-[#0EA5E9]/20 px-4 py-2.5 text-sm outline-none focus:border-[#0EA5E9]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#334155]">備註</label>
            <textarea
              rows={3}
              placeholder="特殊需要或過敏史（選填）"
              className="mt-1.5 w-full rounded-lg border border-[#0EA5E9]/20 px-4 py-2.5 text-sm outline-none focus:border-[#0EA5E9]"
            />
          </div>
          <button
            type="button"
            className="w-full rounded-full bg-[#0EA5E9] py-3 font-medium text-white hover:bg-[#0284C7]"
          >
            提交預約（展示用）
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#64748B]">
          急症請直接致電{" "}
          <a href={`tel:${MEDICAL_BRAND.phone.replace(/\s/g, "")}`} className="text-[#0EA5E9]">
            {MEDICAL_BRAND.phone}
          </a>
          ，或{" "}
          <Link href={`${basePath}/contact`} className="text-[#0EA5E9] hover:underline">
            聯絡我們
          </Link>
        </p>
      </section>
    </MedicalShell>
  );
}
