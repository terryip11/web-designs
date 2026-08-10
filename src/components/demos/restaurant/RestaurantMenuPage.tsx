import Image from "next/image";
import Link from "next/link";
import RestaurantShell from "@/components/demos/restaurant/RestaurantShell";
import {
  MENU_CATEGORY_LABELS,
  MENU_ITEMS,
  type MenuCategory,
} from "@/lib/demo-sites/restaurant-data";

const CATEGORIES: MenuCategory[] = ["starters", "mains", "desserts", "drinks"];

export default function RestaurantMenuPage({ basePath }: { basePath: string }) {
  return (
    <RestaurantShell basePath={basePath}>
      <section className="border-b border-[#E8A87C]/15 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold text-[#2D3436]">菜單</h1>
          <p className="mt-2 text-[#636E72]">
            共 {MENU_ITEMS.length} 款菜式 · 價格供參考，以店內菜單為準
          </p>
        </div>
      </section>

      {CATEGORIES.map((category) => {
        const items = MENU_ITEMS.filter((item) => item.category === category);
        return (
          <section
            key={category}
            id={category}
            className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8"
          >
            <h2 className="font-serif text-2xl font-semibold text-[#2D3436]">
              {MENU_CATEGORY_LABELS[category]}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {items.map((item) => (
                <article
                  key={item.slug}
                  className="flex flex-col overflow-hidden rounded-2xl border border-[#E8A87C]/15 bg-white shadow-sm sm:flex-row"
                >
                  <div className="relative aspect-[16/10] sm:aspect-auto sm:w-2/5 sm:min-h-[180px]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="40vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-[#2D3436]">{item.title}</h3>
                      <span className="shrink-0 font-semibold text-[#E8A87C]">{item.price}</span>
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[#636E72]">
                      {item.description}
                    </p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[#FDF6EC] px-2.5 py-0.5 text-xs text-[#E8A87C]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link
                      href={`${basePath}/reservations?dish=${item.slug}`}
                      className="mt-4 inline-flex text-sm font-medium text-[#E8A87C] hover:underline"
                    >
                      訂位時備註此菜 →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </RestaurantShell>
  );
}
