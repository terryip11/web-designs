import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Check, MapPin, Maximize2, Phone } from "lucide-react";
import PropertyShell from "@/components/demos/property/PropertyShell";
import { resolveLiveDemo } from "@/lib/demo-sites/resolve-demo";
import {
  getPropertyBySlug,
  PROPERTY_BRAND,
  PROPERTY_LISTINGS,
} from "@/lib/demo-sites/property-data";

const PROPERTY_TEMPLATE_ID = "property-luxe-09";

export function generateStaticParams() {
  return PROPERTY_LISTINGS.map((p) => ({
    id: PROPERTY_TEMPLATE_ID,
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  return { title: property ? `${property.title} — 麗致物業` : "物業詳情" };
}

export default async function DemoPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved || resolved.variant !== "property") notFound();

  const property = getPropertyBySlug(slug);
  if (!property) notFound();

  const basePath = resolved.basePath;

  return (
    <PropertyShell basePath={basePath}>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={property.image}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-[#92400E]">
              <MapPin className="h-4 w-4" />
              {property.district} · {property.type}
            </div>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-[#1C1917]">
              {property.title}
            </h1>
            <p className="mt-4 text-3xl font-bold text-[#92400E]">
              {property.priceLabel}
            </p>
            <p className="mt-6 leading-relaxed text-[#57534E]">{property.summary}</p>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-[#57534E]">
              {property.beds > 0 && (
                <span className="inline-flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-[#92400E]" />
                  {property.beds} 睡房
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <Bath className="h-5 w-5 text-[#92400E]" />
                {property.baths} 浴室
              </span>
              <span className="inline-flex items-center gap-2">
                <Maximize2 className="h-5 w-5 text-[#92400E]" />
                {property.area.toLocaleString()} 平方呎
              </span>
            </div>
            <ul className="mt-8 space-y-2">
              {property.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-[#1C1917]"
                >
                  <Check className="h-4 w-4 text-[#92400E]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`${basePath}/contact`}
                className="inline-flex items-center gap-2 rounded-full bg-[#92400E] px-6 py-3 font-medium text-[#FFFBEB] hover:bg-[#78350F]"
              >
                <Phone className="h-4 w-4" />
                預約睇樓
              </Link>
              <Link
                href={`${basePath}/listings`}
                className="rounded-full border border-[#92400E]/30 px-6 py-3 text-sm text-[#92400E] hover:bg-[#92400E]/5"
              >
                ← 返回列表
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#92400E]/10 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">放盤顧問</h2>
          <div className="mt-6 flex flex-wrap items-center gap-6 rounded-2xl border border-[#92400E]/10 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#92400E] text-xl font-bold text-[#FFFBEB]">
              T
            </div>
            <div>
              <p className="font-semibold text-[#1C1917]">Terry Ip · 高級物業顧問</p>
              <p className="text-sm text-[#57534E]">{PROPERTY_BRAND.phone}</p>
              <p className="text-sm text-[#57534E]">{PROPERTY_BRAND.email}</p>
            </div>
          </div>
        </div>
      </section>
    </PropertyShell>
  );
}
