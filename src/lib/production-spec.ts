import { formatPrice, getTemplateById } from "@/lib/data";
import { getDesignSelectionLabels } from "@/lib/design-options";
import { INQUIRY_STATUS_LABELS, type InquiryStatus } from "@/lib/inquiry-status";
import { getEstimatedDeliveryWeeks } from "@/lib/template-meta";
import type { DesignSelections } from "@/types";

export interface ProductionSpecInput {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  template_id?: string | null;
  template_name: string;
  selected_features?: string[] | null;
  design_selections?: Record<string, unknown> | null;
  total_price: number;
  currency: string;
  status?: InquiryStatus | null;
  admin_notes?: string | null;
  sketch_urls?: unknown;
  asset_urls?: unknown;
  created_at: string;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function asSketchUrls(value: unknown): { url: string; pageName?: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return { url: item };
      if (item && typeof item === "object" && "url" in item) {
        const row = item as { url?: string; pageName?: string };
        return row.url ? { url: row.url, pageName: row.pageName } : null;
      }
      return null;
    })
    .filter(Boolean) as { url: string; pageName?: string }[];
}

export function buildProductionSpecMarkdown(input: ProductionSpecInput): string {
  const template = input.template_id
    ? getTemplateById(input.template_id)
    : undefined;

  const designLabels = input.design_selections
    ? getDesignSelectionLabels(
        input.design_selections as unknown as DesignSelections
      )
    : null;

  const features = input.selected_features ?? [];
  const sketches = asSketchUrls(input.sketch_urls);
  const assets = asStringArray(input.asset_urls);
  const delivery = template
    ? getEstimatedDeliveryWeeks(template)
    : "4–6";

  const lines: string[] = [
    `# DesignPick 製作規格 — ${input.name}`,
    "",
    `> 詢價 ID：\`${input.id}\` · 建立時間：${new Date(input.created_at).toLocaleString("zh-HK")} · 狀態：${INQUIRY_STATUS_LABELS[input.status ?? "new"]}`,
    "",
    "## 客戶資料",
    "",
    `- **姓名**：${input.name}`,
    `- **Email**：${input.email}`,
    `- **電話**：${input.phone ?? "—"}`,
    `- **公司**：${input.company ?? "—"}`,
    "",
    "## 模板",
    "",
    `- **Template ID**：\`${input.template_id ?? "unknown"}\``,
    `- **名稱**：${input.template_name}`,
  ];

  if (template) {
    lines.push(
      `- **行業**：${template.category}`,
      `- **適合**：${template.suitableFor}`,
      `- **基礎價**：${formatPrice(template.basePrice)} ${input.currency}`,
      `- **預估工期**：${delivery} 週`,
      `- **包含頁面**：${template.includedPages.join("、")}`,
      `- **配色**：${template.colors.join("、")}`
    );
  }

  lines.push("", "## 設計選配", "");

  if (designLabels) {
    lines.push(
      `- **版面**：${designLabels.layout}`,
      `- **導航**：${designLabels.navigation.join("、") || "—"}`,
      `- **動效**：${designLabels.animationTier}`,
      `- **Hero**：${designLabels.heroType}`
    );
  } else {
    lines.push("- （未記錄設計選配）");
  }

  lines.push("", "## 功能模組", "");
  if (features.length > 0) {
    features.forEach((f) => lines.push(`- ${f}`));
  } else {
    lines.push("- （無）");
  }

  lines.push(
    "",
    "## 報價",
    "",
    `- **參考總價**：${formatPrice(input.total_price)} ${input.currency}`,
    ""
  );

  if (input.message?.trim()) {
    lines.push("## 客戶留言", "", input.message.trim(), "");
  }

  if (input.admin_notes?.trim()) {
    lines.push("## 內部備註", "", input.admin_notes.trim(), "");
  }

  if (sketches.length > 0) {
    lines.push("## 草圖", "");
    sketches.forEach((s, i) => {
      lines.push(`- [草圖 ${i + 1}${s.pageName ? ` · ${s.pageName}` : ""}](${s.url})`);
    });
    lines.push("");
  }

  if (assets.length > 0) {
    lines.push("## 客戶素材", "");
    assets.forEach((url, i) => {
      lines.push(`- [素材 ${i + 1}](${url})`);
    });
    lines.push("");
  }

  lines.push(
    "## Cursor AI 開工指令（複製貼上）",
    "",
    "```",
    `依 DesignPick 製作規格為「${input.name}」建立正式網站。`,
    `Template ID: ${input.template_id ?? "manual"}（${input.template_name}）`,
    template
      ? `頁面：${template.includedPages.join("、")}`
      : "頁面：依模板預設",
    designLabels
      ? `設計：版面 ${designLabels.layout}、導航 ${designLabels.navigation.join("+")}、動效 ${designLabels.animationTier}、Hero ${designLabels.heroType}`
      : "",
    features.length ? `功能：${features.join("、")}` : "",
    `技術：Next.js + Tailwind，繁中，RWD，SEO metadata。`,
    `品牌色：${template?.colors[0] ?? "#7c3aed"}`,
    "```",
    "",
    "## 素材待收清單",
    "",
    "- [ ] Logo（PNG/SVG）",
    "- [ ] 主視覺 / 服務照片",
    "- [ ] 各頁文案",
    "- [ ] 聯絡資料（地址、電話、WhatsApp）",
    template?.category === "醫療"
      ? "- [ ] 醫師資料與資歷（需合規審稿）"
      : "- [ ] 團隊 / 產品資料",
    ""
  );

  return lines.filter((line) => line !== undefined).join("\n");
}
