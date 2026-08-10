import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, ChefHat, Leaf, UtensilsCrossed } from "lucide-react";
import RestaurantShell from "@/components/demos/restaurant/RestaurantShell";
import {
  MENU_CATEGORY_LABELS,
  MENU_ITEMS,
  RESTAURANT_BRAND,
} from "@/lib/demo-sites/restaurant-data";

export default function RestaurantHomePage({ basePath }: { basePath: string }) {
  const featuredDishes = MENU_ITEMS.filter((item) =>
    ["burrata-tomato", "sea-bass", "lamb-rack", "tiramisu"].includes(item.slug),
  );

  return (
    <RestaurantShell basePath={basePath}>
      <section className="relative overflow-hidden bg-[#FDF6EC]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2 lg:items-stretch">
          <div className="order-2 flex flex-col justify-center bg-white px-4 py-12 sm:px-6 lg:order-1 lg:bg-transparent lg:px-8 lg:py-24">
            <p className="text-sm font-medium uppercase tracking-wider text-[#E8A87C]">
              {RESTAURANT_BRAND.englishName}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#2D3436] sm:text-5xl">
              溫暖風味
              <br />
              <span className="text-[#E8A87C]">每一口都是故事</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#636E72]">
              {RESTAURANT_BRAND.tagline}。開放式廚房、精選酒單，適合約會、聚餐及慶祝。
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`${basePath}/reservations`}
                className="inline-flex items-center gap-2 rounded-full bg-[#E8A87C] px-7 py-3.5 font-medium text-white hover:bg-[#d4956a]"
              >
                <Calendar className="h-4 w-4" />
                網上訂位
              </Link>
              <Link
                href={`${basePath}/menu`}
                className="inline-flex items-center gap-2 rounded-full border border-[#E8A87C]/40 px-7 py-3.5 font-medium text-[#E8A87C] hover:bg-[#E8A87C]/10"
              >
                查看菜單
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative order-1 min-h-[280px] sm:min-h-[360px] lg:order-2 lg:min-h-[560px]">
            <Image
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80"
              alt="餐廳用餐環境"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: ChefHat, title: "開放式廚房", desc: "主廚團隊即場烹調，透明而安心" },
            { icon: Leaf, title: "季節食材", desc: "每週更新菜單，配合本地及進口優質原料" },
            { icon: UtensilsCrossed, title: "精選配酒", desc: "侍酒師配對紅白酒，提升用餐體驗" },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#E8A87C]/15 bg-white p-6 shadow-sm"
            >
              <Icon className="h-8 w-8 text-[#E8A87C]" />
              <h3 className="mt-4 font-semibold text-[#2D3436]">{title}</h3>
              <p className="mt-2 text-sm text-[#636E72]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#E8A87C]">Menu Highlights</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-[#2D3436]">招牌菜式</h2>
            </div>
            <Link
              href={`${basePath}/menu`}
              className="text-sm font-medium text-[#E8A87C] hover:underline"
            >
              完整菜單 →
            </Link>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredDishes.map((item) => (
              <article
                key={item.slug}
                className="overflow-hidden rounded-2xl border border-[#E8A87C]/15 bg-[#FDF6EC]"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#E8A87C]">
                    {MENU_CATEGORY_LABELS[item.category]}
                  </p>
                  <h3 className="mt-1 font-semibold text-[#2D3436]">{item.title}</h3>
                  <p className="mt-2 font-medium text-[#E8A87C]">{item.price}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-[#2D3436] text-white">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[240px] lg:min-h-[360px]">
              <Image
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80"
                alt="餐廳內部"
                fill
                className="object-cover opacity-90"
                sizes="50vw"
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="text-sm font-medium uppercase tracking-wider text-[#E8A87C]">About Us</p>
              <h2 className="mt-3 font-serif text-3xl font-bold">關於暖色小館</h2>
              <p className="mt-4 leading-relaxed text-white/75">
                2018 年在中環開業，以地中海及現代歐陸料理為主軸。我們相信好料理來自好食材與耐心，每道菜都經過反覆測試才上架。
              </p>
              <Link
                href={`${basePath}/about`}
                className="mt-6 inline-flex w-fit text-sm font-medium text-[#E8A87C] hover:underline"
              >
                了解更多 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#E8A87C] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold">今晚想來用餐？</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/90">
            週末及公眾假期建議提前訂位。我們會在 2 小時內確認您的預約。
          </p>
          <Link
            href={`${basePath}/reservations`}
            className="mt-8 inline-flex rounded-full bg-white px-8 py-3.5 font-medium text-[#E8A87C] hover:bg-[#FDF6EC]"
          >
            立即訂位
          </Link>
        </div>
      </section>
    </RestaurantShell>
  );
}
