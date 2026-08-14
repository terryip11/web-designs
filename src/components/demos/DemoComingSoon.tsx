import Link from "next/link";
import { notFound } from "next/navigation";
import { getDemoByTemplateId } from "@/lib/demo-sites/registry";
import { getTemplateById } from "@/lib/data";

export function DemoComingSoon({ templateId }: { templateId: string }) {
  const demo = getDemoByTemplateId(templateId);
  const template = getTemplateById(templateId);
  if (!demo || !template) notFound();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center">
      <p className="text-sm text-violet-400">desigpick-digital 模板展示</p>
      <h1 className="mt-4 text-3xl font-bold text-white">{template.name}</h1>
      <p className="mt-3 max-w-md text-zinc-400">
        完整 Demo 網站製作中。此模板將很快以獨立展示站形式上線。
      </p>
      <Link
        href={`/templates/${templateId}`}
        className="mt-8 rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-500"
      >
        返回介面詳情
      </Link>
    </div>
  );
}
