import Image from "next/image";
import RestaurantShell from "@/components/demos/restaurant/RestaurantShell";
import { RESTAURANT_BRAND } from "@/lib/demo-sites/restaurant-data";
import { demoImage } from "@/lib/images/url";

export default function RestaurantAboutPage({ basePath }: { basePath: string }) {
  return (
    <RestaurantShell basePath={basePath}>
      <section className="relative overflow-hidden py-20">
        <Image
          src={demoImage("demos/restaurant/about-hero.jpg")}
          alt="餐廳內部"
          fill
          className="object-cover opacity-25"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-[#2D3436]">關於暖色小館</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#636E72]">
            {RESTAURANT_BRAND.tagline}。我們在中環荷李活道的一樓，以溫暖木調與開放式廚房，打造輕鬆而精緻的用餐空間。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#2D3436]">我們的理念</h2>
            <p className="mt-4 leading-relaxed text-[#636E72]">
              主廚 Marco 曾在米蘭及東京工作，回到香港後希望把歐陸料理做得更貼近本地口味 — 少油、重食材、保留原味。
            </p>
            <p className="mt-4 leading-relaxed text-[#636E72]">
              菜單每季更新，優先採用本地農場蔬菜及可持續來源海鮮。午餐提供輕食套餐，晚餐則以分享式前菜及主餐為主。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "2018", label: "開業年份" },
              { value: "48", label: "座位數目" },
              { value: "4.8", label: "OpenRice 評分" },
              { value: "100%", label: "即日手作甜品" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#E8A87C]/15 bg-white p-6 text-center shadow-sm"
              >
                <p className="text-3xl font-bold text-[#E8A87C]">{stat.value}</p>
                <p className="mt-1 text-sm text-[#636E72]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#E8A87C]/15 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold text-[#2D3436]">主廚團隊</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {[
              {
                name: "Marco Chan",
                role: "行政總廚",
                bio: "15 年歐陸料理經驗，專注地中海及現代義法菜。",
                image: demoImage("demos/restaurant/team/chef.jpg"),
              },
              {
                name: "Sofia Lam",
                role: "甜品主廚",
                bio: "巴黎藍帶畢業，每日現做提拉米蘇及季節甜品。",
                image: demoImage("demos/restaurant/team/sommelier.jpg"),
              },
            ].map((chef) => (
              <div
                key={chef.name}
                className="flex gap-5 rounded-2xl border border-[#E8A87C]/15 bg-[#FDF6EC] p-5"
              >
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl">
                  <Image src={chef.image} alt={chef.name} fill className="object-cover" sizes="112px" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2D3436]">{chef.name}</h3>
                  <p className="text-sm text-[#E8A87C]">{chef.role}</p>
                  <p className="mt-2 text-sm text-[#636E72]">{chef.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </RestaurantShell>
  );
}
