import Link from "next/link";
import ContactDirectCard from "@/components/ContactDirectCard";
import ContactForm from "@/components/ContactForm";
import DesignFlowBanner from "@/components/DesignFlowBanner";
import RevealOnScroll from "@/components/RevealOnScroll";
import SketchPreviewCard from "@/components/SketchPreviewCard";
import SummarySidebar from "@/components/SummarySidebar";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <RevealOnScroll>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">提交需求</h1>
          <p className="mt-2 text-zinc-500">
            填寫聯絡資訊，我們將依您的選配方案（香港市場參考報價 HKD）與您聯繫
          </p>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.03}>
        <div className="mb-8">
          <DesignFlowBanner current="contact" />
        </div>
      </RevealOnScroll>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RevealOnScroll delay={0.06}>
            <SketchPreviewCard />
          </RevealOnScroll>
          <RevealOnScroll delay={0.09}>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
              <h2 className="mb-5 text-lg font-semibold text-white">
                需求表單
              </h2>
              <ContactForm />
            </div>
          </RevealOnScroll>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <RevealOnScroll delay={0.06}>
            <ContactDirectCard />
          </RevealOnScroll>
          <RevealOnScroll delay={0.09}>
            <SummarySidebar />
          </RevealOnScroll>
          <RevealOnScroll delay={0.12}>
            <p className="text-center text-xs text-zinc-600 lg:text-left">
              亦可先查看{" "}
              <Link href="/summary" className="text-violet-400 hover:underline">
                方案摘要
              </Link>{" "}
              再提交
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
}
