import type { Template } from "@/types";
import {
  getCategoryComplianceNote,
  getCategoryIndustryHint,
  getEstimatedDeliveryWeeks,
} from "@/lib/template-meta";

export default function TemplateIndustryBanner({
  template,
}: {
  template: Template;
}) {
  const compliance = getCategoryComplianceNote(template.category);

  return (
    <div className="mb-6 rounded-xl border border-sky-500/25 bg-sky-500/5 px-4 py-3 text-sm text-sky-100/90">
      <p>{getCategoryIndustryHint(template)}</p>
      {compliance && (
        <p className="mt-2 text-xs text-sky-200/70">⚠ {compliance}</p>
      )}
      <p className="mt-2 text-xs text-zinc-500">
        預估工期：{getEstimatedDeliveryWeeks(template)} 週（視內容準備進度調整）
      </p>
    </div>
  );
}
