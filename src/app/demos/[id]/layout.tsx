import { Suspense } from "react";
import { notFound } from "next/navigation";
import DemoShowcaseBar from "@/components/demos/DemoShowcaseBar";
import { getDemoByTemplateId } from "@/lib/demo-sites/registry";

export default async function DemoSiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const demo = getDemoByTemplateId(id);
  if (!demo) notFound();

  return (
    <div className="demo-site-root">
      <Suspense fallback={null}>
        <DemoShowcaseBar templateId={id} />
      </Suspense>
      {children}
    </div>
  );
}
