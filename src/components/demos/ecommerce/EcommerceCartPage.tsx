import Image from "next/image";
import Link from "next/link";
import EcommerceShell from "@/components/demos/ecommerce/EcommerceShell";
import { ECOMMERCE_PRODUCTS } from "@/lib/demo-sites/ecommerce-data";

export default function EcommerceCartPage({
  basePath,
  addedSlug,
}: {
  basePath: string;
  addedSlug?: string;
}) {
  const items = addedSlug
    ? ECOMMERCE_PRODUCTS.filter((p) => p.slug === addedSlug)
    : ECOMMERCE_PRODUCTS.slice(0, 2);

  const total = items.length * 680;

  return (
    <EcommerceShell basePath={basePath}>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white">購物車</h1>
        <p className="mt-2 text-white/60">此為 desigpick-digital 模板展示，不會進行真實結帳。</p>

        <div className="mt-10 space-y-4">
          {items.map((item) => (
            <div
              key={item.slug}
              className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
              </div>
              <div className="flex-1">
                <h2 className="font-medium text-white">{item.name}</h2>
                <p className="text-sm text-[#E94560]">{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
          <span className="text-white/70">示範合計</span>
          <span className="text-xl font-bold text-[#E94560]">HK${total.toLocaleString()}</span>
        </div>

        <button
          type="button"
          className="mt-6 w-full rounded-full bg-[#E94560] py-3.5 font-medium text-white hover:bg-[#d63850]"
        >
          結帳（展示用）
        </button>

        <Link
          href={`${basePath}/products`}
          className="mt-4 block text-center text-sm text-white/60 hover:text-[#E94560]"
        >
          繼續購物
        </Link>
      </section>
    </EcommerceShell>
  );
}
