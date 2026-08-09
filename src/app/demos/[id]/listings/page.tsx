import { notFound } from "next/navigation";
import PropertyListingCard from "@/components/demos/property/PropertyListingCard";
import PropertyShell from "@/components/demos/property/PropertyShell";
import { resolveLiveDemo } from "@/lib/demo-sites/resolve-demo";
import { PROPERTY_LISTINGS } from "@/lib/demo-sites/property-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (resolveLiveDemo(id)?.variant !== "property") {
    return { title: "Demo — DesignPick" };
  }
  return { title: "樓盤搜尋 — 麗致物業" };
}

export default async function DemoListingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved || resolved.variant !== "property") notFound();

  const basePath = resolved.basePath;

  return (
    <PropertyShell basePath={basePath}>
      <section className="border-b border-[#92400E]/10 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-semibold text-[#1C1917]">樓盤搜尋</h1>
          <p className="mt-2 text-[#57534E]">
            共 {PROPERTY_LISTINGS.length} 個放盤 · 出售及出租
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PROPERTY_LISTINGS.map((listing) => (
            <PropertyListingCard
              key={listing.slug}
              listing={listing}
              basePath={basePath}
            />
          ))}
        </div>
      </section>
    </PropertyShell>
  );
}
