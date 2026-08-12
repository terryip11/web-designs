import Image from "next/image";
import IndustryShell from "@/components/demos/industry/IndustryShell";
import { getIndustryBrand } from "@/lib/demo-sites/industry-brands";
import { demoImage } from "@/lib/images/url";

export default function IndustryAboutPage({
  templateId,
  basePath,
}: {
  templateId: string;
  basePath: string;
}) {
  const brand = getIndustryBrand(templateId);
  if (!brand) return null;

  return (
    <IndustryShell brand={brand} basePath={basePath}>
      <section className="relative overflow-hidden py-20">
        <Image
          src={demoImage(brand.aboutImage)}
          alt={brand.aboutTitle}
          fill
          className="object-cover opacity-15"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold" style={{ color: brand.textColor }}>
            {brand.aboutTitle}
          </h1>
          {brand.aboutBody.map((paragraph) => (
            <p key={paragraph} className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {brand.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center"
            >
              <p className="text-3xl font-bold" style={{ color: brand.primaryColor }}>
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </IndustryShell>
  );
}
