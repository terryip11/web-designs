import Link from "next/link";
import RestaurantShell from "@/components/demos/restaurant/RestaurantShell";
import { MENU_ITEMS, RESTAURANT_BRAND } from "@/lib/demo-sites/restaurant-data";

export default function RestaurantReservationsPage({
  basePath,
  preselectedDish,
}: {
  basePath: string;
  preselectedDish?: string;
}) {
  return (
    <RestaurantShell basePath={basePath}>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-[#2D3436]">網上訂位</h1>
        <p className="mt-2 text-[#636E72]">
          填寫以下資料，我們會在 2 小時內確認。此為 desigpick-digital 模板展示，表單不會提交真實資料。
        </p>

        <form className="mt-10 space-y-6 rounded-2xl border border-[#E8A87C]/15 bg-white p-8 shadow-sm">
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
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#2D3436]">日期</label>
              <input
                type="date"
                className="mt-1.5 w-full rounded-lg border border-[#E8A87C]/25 px-4 py-2.5 text-sm outline-none focus:border-[#E8A87C]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2D3436]">時間</label>
              <select className="mt-1.5 w-full rounded-lg border border-[#E8A87C]/25 px-4 py-2.5 text-sm outline-none focus:border-[#E8A87C]">
                <option value="">請選擇</option>
                <option value="12:00">12:00</option>
                <option value="12:30">12:30</option>
                <option value="18:00">18:00</option>
                <option value="18:30">18:30</option>
                <option value="19:00">19:00</option>
                <option value="20:00">20:00</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2D3436]">人數</label>
            <select className="mt-1.5 w-full rounded-lg border border-[#E8A87C]/25 px-4 py-2.5 text-sm outline-none focus:border-[#E8A87C]">
              <option value="">請選擇</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} 位
                </option>
              ))}
              <option value="9+">9 位或以上（請致電）</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2D3436]">想試的菜式（選填）</label>
            <select
              defaultValue={preselectedDish ?? ""}
              className="mt-1.5 w-full rounded-lg border border-[#E8A87C]/25 px-4 py-2.5 text-sm outline-none focus:border-[#E8A87C]"
            >
              <option value="">不限</option>
              {MENU_ITEMS.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2D3436]">特殊需要</label>
            <textarea
              rows={3}
              placeholder="過敏、慶祝、高椅等（選填）"
              className="mt-1.5 w-full rounded-lg border border-[#E8A87C]/25 px-4 py-2.5 text-sm outline-none focus:border-[#E8A87C]"
            />
          </div>
          <button
            type="button"
            className="w-full rounded-full bg-[#E8A87C] py-3 font-medium text-white hover:bg-[#d4956a]"
          >
            提交訂位（展示用）
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#636E72]">
          8 位或以上請直接致電{" "}
          <a href={`tel:${RESTAURANT_BRAND.phone.replace(/\s/g, "")}`} className="text-[#E8A87C]">
            {RESTAURANT_BRAND.phone}
          </a>
          ，或{" "}
          <Link href={`${basePath}/contact`} className="text-[#E8A87C] hover:underline">
            聯絡我們
          </Link>
        </p>
      </section>
    </RestaurantShell>
  );
}
