import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EcommerceShell from "@/components/demos/ecommerce/EcommerceShell";
import { ECOMMERCE_BRAND, ECOMMERCE_PRODUCTS } from "@/lib/demo-sites/ecommerce-data";
import { demoImage } from "@/lib/images/url";

export default function EcommerceHomePage({ basePath }: { basePath: string }) {
  const featured = ECOMMERCE_PRODUCTS.slice(0, 4);

  return (
    <EcommerceShell basePath={basePath}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={demoImage("demos/ecommerce/hero.jpg")}
            alt="店內陳列"
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#E94560]">New Season</p>
          <h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight text-white sm:text-5xl">
            質感選物
            <br />
            從細節開始
          </h1>
          <p className="mt-6 max-w-lg text-lg text-white/70">{ECOMMERCE_BRAND.tagline}</p>
          <Link
            href={`${basePath}/products`}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#E94560] px-8 py-3.5 font-medium text-white hover:bg-[#d63850]"
          >
            瀏覽商品
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-white">精選商品</h2>
          <Link href={`${basePath}/products`} className="text-sm text-[#E94560] hover:underline">
            全部 →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <Link
              key={product.slug}
              href={`${basePath}/products/${product.slug}`}
              className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:border-[#E94560]/50"
            >
              <div className="relative aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="25vw"
                />
                {product.tags?.[0] && (
                  <span className="absolute left-3 top-3 rounded-full bg-[#E94560] px-2.5 py-0.5 text-xs text-white">
                    {product.tags[0]}
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-white/50">{product.category}</p>
                <h3 className="mt-1 font-medium text-white group-hover:text-[#E94560]">
                  {product.name}
                </h3>
                <p className="mt-2 font-semibold text-[#E94560]">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </EcommerceShell>
  );
}
