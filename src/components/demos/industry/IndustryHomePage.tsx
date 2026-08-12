import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import IndustryShell from "@/components/demos/industry/IndustryShell";
import { getIndustryBrand } from "@/lib/demo-sites/industry-brands";
import { demoImage } from "@/lib/images/url";

export default function IndustryHomePage({
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
      <section
        className="bg-gradient-to-br to-white"
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${brand.primaryColor}12, white)`,
        }}
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: brand.primaryColor }}
            >
              {brand.englishName}
            </p>
            <h1
              className="mt-4 text-4xl font-bold leading-tight sm:text-5xl"
              style={{ color: brand.textColor }}
            >
              {brand.heroTitle}
              <br />
              <span style={{ color: brand.primaryColor }}>{brand.heroHighlight}</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              {brand.heroDescription}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`${basePath}/contact`}
                className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 font-medium text-white"
                style={{ backgroundColor: brand.primaryColor }}
              >
                {brand.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`${basePath}/services`}
                className="inline-flex items-center gap-2 rounded-lg border px-7 py-3.5 font-medium hover:bg-slate-50"
                style={{ borderColor: `${brand.primaryColor}40`, color: brand.primaryColor }}
              >
                了解服務
              </Link>
            </div>
          </div>
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl shadow-xl lg:min-h-[420px]">
            <Image
              src={demoImage(brand.heroImage)}
              alt={brand.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold" style={{ color: brand.textColor }}>
          服務項目
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {brand.services.map((service) => (
            <div
              key={service.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div
                className="h-1 w-10 rounded-full"
                style={{ backgroundColor: brand.primaryColor }}
              />
              <h3 className="mt-4 font-semibold" style={{ color: brand.textColor }}>
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{service.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {brand.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
              >
                <p className="text-3xl font-bold" style={{ color: brand.primaryColor }}>
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </IndustryShell>
  );
}
