import { Mail, MapPin, Phone } from "lucide-react";
import RestaurantShell from "@/components/demos/restaurant/RestaurantShell";
import { RESTAURANT_BRAND } from "@/lib/demo-sites/restaurant-data";

export default function RestaurantContactPage({ basePath }: { basePath: string }) {
  return (
    <RestaurantShell basePath={basePath}>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#2D3436]">聯絡我們</h1>
            <p className="mt-4 text-[#636E72]">
              歡迎致電、電郵或親臨餐廳。此為 DesignPick 模板展示，表單不會提交真實資料。
            </p>
            <ul className="mt-10 space-y-6">
              <li className="flex gap-4">
                <Phone className="mt-0.5 h-5 w-5 text-[#E8A87C]" />
                <div>
                  <p className="font-medium text-[#2D3436]">電話</p>
                  <p className="text-sm text-[#636E72]">{RESTAURANT_BRAND.phone}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Mail className="mt-0.5 h-5 w-5 text-[#E8A87C]" />
                <div>
                  <p className="font-medium text-[#2D3436]">Email</p>
                  <p className="text-sm text-[#636E72]">{RESTAURANT_BRAND.email}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <MapPin className="mt-0.5 h-5 w-5 text-[#E8A87C]" />
                <div>
                  <p className="font-medium text-[#2D3436]">地址</p>
                  <p className="text-sm text-[#636E72]">{RESTAURANT_BRAND.address}</p>
                  <p className="mt-1 text-sm text-[#636E72]">{RESTAURANT_BRAND.hours}</p>
                </div>
              </li>
            </ul>
          </div>

          <form className="rounded-2xl border border-[#E8A87C]/15 bg-white p-8 shadow-sm">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#2D3436]">姓名</label>
                <input
                  type="text"
                  placeholder="您的姓名"
                  className="mt-1.5 w-full rounded-lg border border-[#E8A87C]/25 px-4 py-2.5 text-sm outline-none focus:border-[#E8A87C]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436]">電話</label>
                <input
                  type="tel"
                  placeholder="+852"
                  className="mt-1.5 w-full rounded-lg border border-[#E8A87C]/25 px-4 py-2.5 text-sm outline-none focus:border-[#E8A87C]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D3436]">查詢內容</label>
                <textarea
                  rows={4}
                  placeholder="私人活動、媒體合作或其他查詢"
                  className="mt-1.5 w-full rounded-lg border border-[#E8A87C]/25 px-4 py-2.5 text-sm outline-none focus:border-[#E8A87C]"
                />
              </div>
              <button
                type="button"
                className="w-full rounded-full bg-[#E8A87C] py-3 font-medium text-white hover:bg-[#d4956a]"
              >
                提交查詢（展示用）
              </button>
            </div>
          </form>
        </div>
      </section>
    </RestaurantShell>
  );
}
