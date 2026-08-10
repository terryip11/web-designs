import Image from "next/image";
import CorporateShell from "@/components/demos/corporate/CorporateShell";
import { CORPORATE_TEAM } from "@/lib/demo-sites/corporate-data";

export default function CorporateTeamPage({ basePath }: { basePath: string }) {
  return (
    <CorporateShell basePath={basePath}>
      <section className="border-b border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#1E293B]">團隊</h1>
          <p className="mt-2 text-slate-600">資深顧問團隊，平均 12 年行業經驗</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {CORPORATE_TEAM.map((member) => (
            <article
              key={member.slug}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-square">
                <Image src={member.image} alt={member.name} fill className="object-cover" sizes="33vw" />
              </div>
              <div className="p-5">
                <h2 className="font-semibold text-[#1E293B]">{member.name}</h2>
                <p className="text-sm text-[#2563EB]">{member.title}</p>
                <p className="mt-2 text-sm text-slate-600">{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </CorporateShell>
  );
}
