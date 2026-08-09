import { NextResponse } from "next/server";
import {
  formatHKPhoneDisplay,
  validateContactForm,
} from "@/lib/contact-validation";
import { CURRENCY_CODE } from "@/lib/currency";
import {
  sendInquiryConfirmationEmail,
  sendInquiryNotifyEmail,
} from "@/lib/email/send-inquiry-emails";
import { inquiryBodySchema } from "@/lib/inquiry-schema";
import {
  buildInquiryHtmlSummary,
  buildInquiryTextSummary,
  type InquirySummaryInput,
} from "@/lib/inquiry-summary";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { uploadSketchPages } from "@/lib/sketch-upload";
import {
  createAuthServerClient,
  createServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`inquiry:${ip}`, 5, 60 * 60 * 1000);
    if (!rate.ok) {
      return NextResponse.json(
        { error: "提交過於頻繁，請稍後再試" },
        {
          status: 429,
          headers: rate.retryAfterSec
            ? { "Retry-After": String(rate.retryAfterSec) }
            : undefined,
        }
      );
    }

    const body = await request.json();
    const parsed = inquiryBodySchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "表單資料不正確" },
        { status: 400 }
      );
    }

    if (parsed.data.website) {
      return NextResponse.json({ success: true });
    }

    const {
      name,
      email,
      phone,
      company,
      message,
      templateId,
      templateName,
      templateCategory,
      selectedFeatures,
      designSelections,
      designSelectionLabels,
      totalPrice,
      currency = CURRENCY_CODE,
      sketchPages,
    } = parsed.data;

    const validation = validateContactForm({
      name,
      email,
      phone,
      company,
      message,
      privacyAccepted: true,
    });

    if (!validation.ok) {
      const firstError =
        validation.errors.form ??
        validation.errors.name ??
        validation.errors.email ??
        validation.errors.phone ??
        validation.errors.privacy ??
        "表單資料不正確";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const resolvedTemplateId = templateId ?? "pending";
    const resolvedTemplateName = templateName ?? "尚未選擇介面";
    const normalizedPhone = validation.phone
      ? formatHKPhoneDisplay(validation.phone)
      : null;

    const sketchUrls = sketchPages?.length
      ? await uploadSketchPages(sketchPages)
      : [];

    const summaryInput: InquirySummaryInput = {
      templateName: resolvedTemplateName,
      templateCategory,
      designSelectionLabels:
        designSelectionLabels as InquirySummaryInput["designSelectionLabels"],
      selectedFeatures: selectedFeatures ?? [],
      totalPrice,
      currency,
      sketchTitle: sketchPages?.length
        ? `草圖（${sketchPages.length} 頁）`
        : undefined,
      sketchPageCount: sketchPages?.length ?? 0,
      customerName: name,
      customerMessage: message,
    };

    const summaryHtml = buildInquiryHtmlSummary(summaryInput);

    const authClient = await createAuthServerClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!isSupabaseConfigured()) {
      console.log("[Inquiry - Dev Mode]", {
        name,
        email,
        phone: normalizedPhone,
        templateId: resolvedTemplateId,
        templateName: resolvedTemplateName,
        summary: buildInquiryTextSummary(summaryInput),
      });

      const customerSent = await sendInquiryConfirmationEmail({
        name,
        email,
        phone: normalizedPhone,
        company: company?.trim() ?? null,
        templateName: resolvedTemplateName,
        summaryHtml,
      });

      return NextResponse.json({
        success: true,
        message: "開發模式：需求已記錄至 console",
        sketchUrls,
        emailCustomerSent: customerSent,
      });
    }

    const supabase = createServerClient();
    const { data: inserted, error } = await supabase
      .from("inquiries")
      .insert({
        name,
        email,
        phone: normalizedPhone,
        company: company?.trim() ?? null,
        message: message ?? null,
        template_id: resolvedTemplateId,
        template_name: resolvedTemplateName,
        selected_features: selectedFeatures ?? [],
        design_selections: designSelections ?? {},
        total_price: totalPrice ?? 0,
        currency: currency ?? CURRENCY_CODE,
        sketch_urls: sketchUrls,
        user_id: user?.id ?? null,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "儲存失敗，請稍後再試" }, { status: 500 });
    }

    const [customerSent, notifySent] = await Promise.all([
      sendInquiryConfirmationEmail({
        name,
        email,
        phone: normalizedPhone,
        company: company?.trim() ?? null,
        templateName: resolvedTemplateName,
        summaryHtml,
      }),
      sendInquiryNotifyEmail({
        name,
        email,
        phone: normalizedPhone,
        company: company?.trim() ?? null,
        templateName: resolvedTemplateName,
        summaryHtml,
      }),
    ]);

    if (inserted?.id) {
      await supabase
        .from("inquiries")
        .update({
          email_customer_sent: customerSent,
          email_notify_sent: notifySent,
        })
        .eq("id", inserted.id);
    }

    if (!notifySent) {
      console.warn("[Inquiry] internal notify email failed for", email);
    }

    return NextResponse.json({
      success: true,
      emailCustomerSent: customerSent,
      emailNotifySent: notifySent,
    });
  } catch (error) {
    console.error("[Inquiry] POST error:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
