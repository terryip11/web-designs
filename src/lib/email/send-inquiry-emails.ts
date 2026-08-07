interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.log("[Email - Dev Mode]", {
      to: options.to,
      subject: options.subject,
    });
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
    return false;
  }

  return true;
}

export interface InquiryEmailPayload {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  templateName: string;
  summaryHtml: string;
}

export async function sendInquiryConfirmationEmail(
  payload: InquiryEmailPayload
): Promise<boolean> {
  const contactName = process.env.CONTACT_NAME ?? "Terry";
  const html = `
    <div style="font-family:sans-serif;max-width:560px;line-height:1.6;color:#333">
      <h2 style="color:#7c3aed">DesignPick — 需求已收到</h2>
      <p>${payload.name} 您好，</p>
      <p>我們已收到您的網站設計方案需求，${contactName} 將盡快與您聯繫。</p>
      <p><strong>選定介面：</strong>${payload.templateName}</p>
      ${payload.summaryHtml}
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
      <p style="font-size:13px;color:#666">
        此為自動確認信。如需即時溝通，歡迎 WhatsApp 我們。
      </p>
    </div>
  `;

  return sendEmail({
    to: payload.email,
    subject: "DesignPick — 您的方案需求已收到",
    html,
  });
}

export async function sendInquiryNotifyEmail(
  payload: InquiryEmailPayload
): Promise<boolean> {
  const notifyTo = process.env.NOTIFY_EMAIL;
  if (!notifyTo) return false;

  const html = `
    <div style="font-family:sans-serif;max-width:560px;line-height:1.6;color:#333">
      <h2 style="color:#059669">新方案需求</h2>
      <p><strong>姓名：</strong>${payload.name}</p>
      <p><strong>Email：</strong>${payload.email}</p>
      ${payload.phone ? `<p><strong>電話：</strong>${payload.phone}</p>` : ""}
      ${payload.company ? `<p><strong>公司：</strong>${payload.company}</p>` : ""}
      <p><strong>介面：</strong>${payload.templateName}</p>
      ${payload.summaryHtml}
    </div>
  `;

  return sendEmail({
    to: notifyTo,
    subject: `[DesignPick] 新需求 — ${payload.name}`,
    html,
  });
}

export { isEmailConfigured };
