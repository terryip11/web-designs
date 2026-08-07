export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 50,
  emailMax: 120,
  companyMax: 100,
  messageMax: 2000,
  phoneMax: 20,
} as const;

export type ContactFieldErrors = Partial<
  Record<"name" | "email" | "phone" | "company" | "message" | "privacy" | "form", string>
>;

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  privacyAccepted: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 正規化香港本地 8 位電話；空字串回傳 null；無效回傳 undefined */
export function normalizeHKPhone(
  input: string | undefined
): string | null | undefined {
  const trimmed = input?.trim() ?? "";
  if (!trimmed) return null;

  const digits = trimmed.replace(/\D/g, "");
  let local = digits;

  if (local.startsWith("852")) {
    local = local.slice(3);
  }

  if (local.length === 8 && /^[2-9]/.test(local)) {
    return local;
  }

  return undefined;
}

export function formatHKPhoneDisplay(local: string): string {
  return `${local.slice(0, 4)} ${local.slice(4)}`;
}

export function validateContactForm(
  data: ContactFormData
): { ok: true; phone: string | null } | { ok: false; errors: ContactFieldErrors } {
  const errors: ContactFieldErrors = {};
  const name = data.name.trim();
  const email = data.email.trim();
  const company = data.company?.trim() ?? "";
  const message = data.message?.trim() ?? "";

  if (name.length < CONTACT_LIMITS.nameMin) {
    errors.name = `姓名至少 ${CONTACT_LIMITS.nameMin} 個字`;
  } else if (name.length > CONTACT_LIMITS.nameMax) {
    errors.name = `姓名不可超過 ${CONTACT_LIMITS.nameMax} 個字`;
  }

  if (!email) {
    errors.email = "請填寫 Email";
  } else if (email.length > CONTACT_LIMITS.emailMax) {
    errors.email = "Email 過長";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Email 格式不正確";
  }

  const phoneResult = normalizeHKPhone(data.phone);
  let normalizedPhone: string | null = null;
  if (phoneResult === undefined) {
    errors.phone = "請輸入有效香港電話（8 位，可含 +852）";
  } else {
    normalizedPhone = phoneResult;
  }

  if (company.length > CONTACT_LIMITS.companyMax) {
    errors.company = `公司名稱不可超過 ${CONTACT_LIMITS.companyMax} 個字`;
  }

  if (message.length > CONTACT_LIMITS.messageMax) {
    errors.message = `補充說明不可超過 ${CONTACT_LIMITS.messageMax} 字`;
  }

  if (!data.privacyAccepted) {
    errors.privacy = "請同意私隱政策後再提交";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, phone: normalizedPhone };
}
