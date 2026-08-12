import IndustryShell from "@/components/demos/industry/IndustryShell";
import { getIndustryBrand } from "@/lib/demo-sites/industry-brands";

export default function IndustryServicesPage({
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
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold" style={{ color: brand.textColor }}>
          服務項目
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">{brand.tagline}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {brand.services.map((service, index) => (
            <div
              key={service.title}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: brand.primaryColor }}
              >
                {index + 1}
              </span>
              <h2 className="mt-4 text-xl font-semibold" style={{ color: brand.textColor }}>
                {service.title}
              </h2>
              <p className="mt-3 leading-relaxed text-slate-600">{service.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </IndustryShell>
  );
}
