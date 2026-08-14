import { formatPrice } from "@/lib/currency";
import { getDesignSelectionLabels } from "@/lib/design-options";
import { SITE_CONTACT } from "@/lib/site-contact";

export type DesignSelectionLabels = ReturnType<typeof getDesignSelectionLabels>;

export interface InquirySummaryInput {
  templateName?: string;
  templateCategory?: string;
  designSelectionLabels?: DesignSelectionLabels;
  selectedFeatures?: string[];
  totalPrice?: number;
  currency?: string;
  sketchTitle?: string;
  sketchPageCount?: number;
  customerName?: string;
  customerMessage?: string;
}

/** 純文字方案摘要（WhatsApp、Email 共用） */
export function buildInquiryTextSummary(input: InquirySummaryInput): string {
  const lines: string[] = [
    `你好 ${SITE_CONTACT.contactName}，我在 desigpick-digital 想查詢網站設計方案。`,
  ];

  if (input.customerName?.trim()) {
    lines.push(`姓名：${input.customerName.trim()}`);
  }

  lines.push("");
  lines.push("【方案摘要】");

  if (input.templateName) {
    const cat = input.templateCategory ? `（${input.templateCategory}）` : "";
    lines.push(`介面：${input.templateName}${cat}`);
  } else {
    lines.push("介面：尚未選擇");
  }

  const labels = input.designSelectionLabels;
  if (labels) {
    lines.push(`版面：${labels.layout}`);
    if (labels.navigation.length > 0) {
      lines.push(`導航：${labels.navigation.join("、")}`);
    }
    lines.push(`動效：${labels.animationTier}`);
    lines.push(`Hero：${labels.heroType}`);
  }

  if (input.selectedFeatures && input.selectedFeatures.length > 0) {
    lines.push(`功能：${input.selectedFeatures.join("、")}`);
  }

  if (input.totalPrice != null && input.currency) {
    lines.push(`參考總價：${formatPrice(input.totalPrice)} ${input.currency}`);
  }

  if (input.sketchPageCount && input.sketchPageCount > 0) {
    const title = input.sketchTitle?.trim() || "介面草圖";
    lines.push(`草圖：${title}（${input.sketchPageCount} 頁）`);
  }

  if (input.customerMessage?.trim()) {
    lines.push("");
    lines.push("【補充】");
    lines.push(input.customerMessage.trim());
  }

  return lines.join("\n");
}

const WHATSAPP_MAX_CHARS = 1500;

export function buildInquiryWhatsAppMessage(input: InquirySummaryInput): string {
  let text = buildInquiryTextSummary(input);
  if (text.length > WHATSAPP_MAX_CHARS) {
    text = `${text.slice(0, WHATSAPP_MAX_CHARS - 3)}...`;
  }
  return text;
}

export function buildInquiryHtmlSummary(input: InquirySummaryInput): string {
  const text = buildInquiryTextSummary(input);
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
  return `<div style="font-family:sans-serif;line-height:1.6;color:#333">${escaped}</div>`;
}
