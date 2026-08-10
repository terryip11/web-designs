import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import EcommerceShell from "@/components/demos/ecommerce/EcommerceShell";
import { getProductBySlug } from "@/lib/demo-sites/ecommerce-data";

export default function EcommerceProductDetail({
  basePath,
  slug,
}: {
  basePath: string;
  slug: string;
}) {
  const product = getProductBySlug(slug);
  if (!product) return null;

  return (
    <EcommerceShell basePath={basePath}>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10">
            <Image src={product.image} alt={product.name} fill className="object-cover" sizes="50vw" priority />
          </div>
          <div>
            <p className="text-sm text-[#E94560]">{product.category}</p>
            <h1 className="mt-2 text-3xl font-bold text-white">{product.name}</h1>
            <p className="mt-4 text-2xl font-semibold text-[#E94560]">{product.price}</p>
            <p className="mt-6 leading-relaxed text-white/70">{product.description}</p>
            {product.tags && (
              <div className="mt-4 flex gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/20 px-3 py-0.5 text-xs text-white/70">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <Link
              href={`${basePath}/cart?add=${product.slug}`}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#E94560] px-8 py-3.5 font-medium text-white hover:bg-[#d63850]"
            >
              <ShoppingBag className="h-4 w-4" />
              加入購物車（展示用）
            </Link>
            <Link
              href={`${basePath}/products`}
              className="ml-4 inline-flex text-sm text-white/60 hover:text-[#E94560]"
            >
              ← 返回商品列表
            </Link>
          </div>
        </div>
      </section>
    </EcommerceShell>
  );
}
