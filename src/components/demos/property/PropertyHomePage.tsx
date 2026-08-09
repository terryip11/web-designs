import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Search, Shield, Users } from "lucide-react";
import PropertyListingCard from "@/components/demos/property/PropertyListingCard";
import PropertyShell from "@/components/demos/property/PropertyShell";
import { PROPERTY_BRAND, PROPERTY_LISTINGS } from "@/lib/demo-sites/property-data";

export default function PropertyHomePage({ basePath }: { basePath: string }) {
  const featured = PROPERTY_LISTINGS.filter((p) => p.featured);

  return (
    <PropertyShell basePath={basePath}>
      <section className="relative min-h-[85vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80"
          alt="香港豪宅"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/90 via-[#1C1917]/60 to-transparent" />
        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-[0.25em] text-[#FFFBEB]/70">
            {PROPERTY_BRAND.englishName}
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight text-[#FFFBEB] sm:text-5xl lg:text-6xl">
            為您配對
            <br />
            香港最卓越嘅物業
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[#FFFBEB]/80">
            專注高端住宅、複式及甲級寫字樓。一對一顧問，從搜尋到成交全程跟進。
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`${basePath}/listings`}
              className="inline-flex items-center gap-2 rounded-full bg-[#92400E] px-7 py-3.5 font-medium text-[#FFFBEB] hover:bg-[#78350F]"
            >
              <Search className="h-4 w-4" />
              搜尋樓盤
            </Link>
            <Link
              href={`${basePath}/contact`}
              className="inline-flex items-center gap-2 rounded-full border border-[#FFFBEB]/40 px-7 py-3.5 font-medium text-[#FFFBEB] hover:bg-white/10"
            >
              預約睇樓
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { icon: Shield, title: "合規透明", desc: "所有放盤資料經核實，交易流程清晰" },
            { icon: Users, title: "專屬顧問", desc: "資深代理一對一跟進，支援中英雙語" },
            { icon: Building2, title: "高端物業", desc: "涵蓋港島、九龍及新界優質盤源" },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#92400E]/10 bg-white p-6 shadow-sm"
            >
              <Icon className="h-8 w-8 text-[#92400E]" />
              <h3 className="mt-4 font-semibold text-[#1C1917]">{title}</h3>
              <p className="mt-2 text-sm text-[#57534E]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wider text-[#92400E]">Featured</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-[#1C1917]">
                精選樓盤
              </h2>
            </div>
            <Link
              href={`${basePath}/listings`}
              className="text-sm font-medium text-[#92400E] hover:underline"
            >
              查看全部 →
            </Link>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing) => (
              <PropertyListingCard
                key={listing.slug}
                listing={listing}
                basePath={basePath}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#92400E] py-16 text-[#FFFBEB]">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-semibold">準備好搵下一個理想物業？</h2>
          <p className="mx-auto mt-4 max-w-xl text-[#FFFBEB]/80">
            留下聯絡方式，我們的顧問會在 24 小時內與您聯絡。
          </p>
          <Link
            href={`${basePath}/contact`}
            className="mt-8 inline-flex rounded-full bg-[#FFFBEB] px-8 py-3.5 font-medium text-[#92400E] hover:bg-white"
          >
            立即聯絡
          </Link>
        </div>
      </section>
    </PropertyShell>
  );
}
