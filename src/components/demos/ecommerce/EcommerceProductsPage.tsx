import Image from "next/image";
import Link from "next/link";
import EcommerceShell from "@/components/demos/ecommerce/EcommerceShell";
import { ECOMMERCE_PRODUCTS } from "@/lib/demo-sites/ecommerce-data";

export default function EcommerceProductsPage({ basePath }: { basePath: string }) {
  return (
    <EcommerceShell basePath={basePath}>
      <section className="border-b border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">商品列表</h1>
          <p className="mt-2 text-white/60">共 {ECOMMERCE_PRODUCTS.length} 件精選單品</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ECOMMERCE_PRODUCTS.map((product) => (
            <Link
              key={product.slug}
              href={`${basePath}/products/${product.slug}`}
              className="group overflow-hidden rounded-xl border border-white/10 bg-white/5"
            >
              <div className="relative aspect-square">
                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="33vw" />
              </div>
              <div className="p-5">
                <p className="text-xs text-white/50">{product.category}</p>
                <h2 className="mt-1 text-lg font-semibold text-white group-hover:text-[#E94560]">
                  {product.name}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-white/60">{product.description}</p>
                <p className="mt-3 font-semibold text-[#E94560]">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </EcommerceShell>
  );
}
