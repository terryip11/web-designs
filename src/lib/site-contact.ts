/** 網站對外聯絡資訊（單一來源，供 contact 頁、Footer 等共用） */
export const SITE_CONTACT = {
  contactName: "Terry",
  phoneLocal: "61566060",
  phoneDisplay: "6156 6060",
  /** 香港 WhatsApp / 來電用 E.164（不含 +） */
  phoneE164: "85261566060",
  defaultWhatsAppMessage:
    "你好 Terry，我在 desigpick-digital 網站想查詢網站設計方案。",
} as const;

export function getWhatsAppUrl(message?: string): string {
  const text = encodeURIComponent(
    message ?? SITE_CONTACT.defaultWhatsAppMessage
  );
  return `https://wa.me/${SITE_CONTACT.phoneE164}?text=${text}`;
}

export function getTelUrl(): string {
  return `tel:+${SITE_CONTACT.phoneE164}`;
}
