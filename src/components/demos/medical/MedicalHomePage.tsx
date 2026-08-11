import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Heart, Shield, Stethoscope } from "lucide-react";
import MedicalShell from "@/components/demos/medical/MedicalShell";
import {
  MEDICAL_BRAND,
  MEDICAL_DOCTORS,
  MEDICAL_SERVICES,
} from "@/lib/demo-sites/medical-data";
import { demoImage } from "@/lib/images/url";

export default function MedicalHomePage({ basePath }: { basePath: string }) {
  const featuredServices = MEDICAL_SERVICES.slice(0, 3);
  const featuredDoctors = MEDICAL_DOCTORS.slice(0, 2);

  return (
    <MedicalShell basePath={basePath}>
      <section className="relative overflow-hidden bg-[#F0FDFA]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2 lg:items-stretch">
          <div className="order-2 flex flex-col justify-center bg-white px-4 py-12 sm:px-6 lg:order-1 lg:bg-transparent lg:px-8 lg:py-24">
            <p className="text-sm font-medium uppercase tracking-wider text-sky-500">
              {MEDICAL_BRAND.englishName}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-800 sm:text-5xl">
              專業醫療
              <br />
              <span className="text-sky-500">值得信賴</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              一站式家庭醫學、牙科及物理治療服務。經驗團隊、清晰流程，讓您安心就醫。
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`${basePath}/booking`}
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-7 py-3.5 font-medium text-white hover:bg-sky-600"
              >
                <Calendar className="h-4 w-4" />
                網上預約
              </Link>
              <Link
                href={`${basePath}/services`}
                className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 px-7 py-3.5 font-medium text-sky-600 hover:bg-sky-50"
              >
                查看服務
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative order-1 min-h-[280px] sm:min-h-[360px] lg:order-2 lg:min-h-[560px]">
            <Image
              src={demoImage("demos/medical/hero.jpg")}
              alt="醫療中心"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: Shield, title: "合規審稿", desc: "內容符合香港醫療廣告相關規定" },
            { icon: Stethoscope, title: "跨專科團隊", desc: "家庭醫學、牙科、物理治療一站式" },
            { icon: Heart, title: "以病人為本", desc: "清晰解釋療程，重視私隱及跟進" },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#0EA5E9]/10 bg-white p-6 shadow-sm"
            >
              <Icon className="h-8 w-8 text-[#0EA5E9]" />
              <h3 className="mt-4 font-semibold text-[#334155]">{title}</h3>
              <p className="mt-2 text-sm text-[#64748B]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#0EA5E9]">Services</p>
              <h2 className="mt-2 text-3xl font-bold text-[#334155]">服務項目</h2>
            </div>
            <Link href={`${basePath}/services`} className="text-sm font-medium text-[#0EA5E9] hover:underline">
              全部服務 →
            </Link>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {featuredServices.map((service) => (
              <div
                key={service.slug}
                className="overflow-hidden rounded-2xl border border-[#0EA5E9]/10 bg-[#F0FDFA]"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#334155]">{service.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[#64748B]">{service.summary}</p>
                  <p className="mt-3 text-sm font-medium text-[#0EA5E9]">{service.priceFrom}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#0EA5E9]">Our Team</p>
            <h2 className="mt-2 text-3xl font-bold text-[#334155]">醫師團隊</h2>
          </div>
          <Link href={`${basePath}/doctors`} className="text-sm font-medium text-[#0EA5E9] hover:underline">
            認識團隊 →
          </Link>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {featuredDoctors.map((doctor) => (
            <div
              key={doctor.slug}
              className="flex gap-5 rounded-2xl border border-[#0EA5E9]/10 bg-white p-5 shadow-sm"
            >
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl">
                <Image src={doctor.image} alt={doctor.name} fill className="object-cover" sizes="112px" />
              </div>
              <div>
                <h3 className="font-semibold text-[#334155]">{doctor.name}</h3>
                <p className="text-sm text-[#0EA5E9]">{doctor.title}</p>
                <p className="mt-1 text-sm text-[#64748B]">{doctor.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#0EA5E9] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">準備好預約診症？</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            選擇服務及時段，我們會在 24 小時內確認預約。
          </p>
          <Link
            href={`${basePath}/booking`}
            className="mt-8 inline-flex rounded-full bg-white px-8 py-3.5 font-medium text-[#0EA5E9] hover:bg-[#F0FDFA]"
          >
            立即預約
          </Link>
        </div>
      </section>
    </MedicalShell>
  );
}
