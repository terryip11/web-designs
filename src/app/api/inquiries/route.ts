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

import {

  buildInquiryHtmlSummary,

  buildInquiryTextSummary,

} from "@/lib/inquiry-summary";

import { uploadSketchPages } from "@/lib/sketch-upload";

import { createAuthServerClient, createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";



export async function POST(request: Request) {

  try {

    const body = await request.json();

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

      privacyAccepted,

    } = body;



    if (!privacyAccepted) {

      return NextResponse.json(

        { error: "請同意私隱政策後再提交" },

        { status: 400 }

      );

    }



    const validation = validateContactForm({

      name: name ?? "",

      email: email ?? "",

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



    const sketchUrls = Array.isArray(sketchPages)

      ? await uploadSketchPages(sketchPages)

      : [];



    const summaryInput = {

      templateName: resolvedTemplateName,

      templateCategory,

      designSelectionLabels,

      selectedFeatures: selectedFeatures ?? [],

      totalPrice,

      currency,

      sketchTitle: sketchPages?.length

        ? `草圖（${sketchPages.length} 頁）`

        : undefined,

      sketchPageCount: sketchPages?.length ?? 0,

      customerName: String(name).trim(),

      customerMessage: message ?? undefined,

    };



    const summaryHtml = buildInquiryHtmlSummary(summaryInput);

    const authClient = await createAuthServerClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!isSupabaseConfigured()) {

      console.log("[Inquiry - Dev Mode]", {

        name: String(name).trim(),

        email: String(email).trim(),

        phone: normalizedPhone,

        templateId: resolvedTemplateId,

        templateName: resolvedTemplateName,

        selectedFeatures,

        designSelections,

        designSelectionLabels,

        totalPrice,

        currency,

        sketchUrls,

        summary: buildInquiryTextSummary(summaryInput),

      });



      await sendInquiryConfirmationEmail({

        name: String(name).trim(),

        email: String(email).trim(),

        phone: normalizedPhone,

        company: company?.trim() ?? null,

        templateName: resolvedTemplateName,

        summaryHtml,

      });



      return NextResponse.json({

        success: true,

        message: "開發模式：需求已記錄至 console",

        sketchUrls,

      });

    }



    const supabase = createServerClient();

    const { error } = await supabase.from("inquiries").insert({

      name: String(name).trim(),

      email: String(email).trim(),

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

    });



    if (error) {

      console.error("Supabase insert error:", error);

      return NextResponse.json(

        { error: "儲存失敗，請稍後再試" },

        { status: 500 }

      );

    }



    await Promise.all([

      sendInquiryConfirmationEmail({

        name: String(name).trim(),

        email: String(email).trim(),

        phone: normalizedPhone,

        company: company?.trim() ?? null,

        templateName: resolvedTemplateName,

        summaryHtml,

      }),

      sendInquiryNotifyEmail({

        name: String(name).trim(),

        email: String(email).trim(),

        phone: normalizedPhone,

        company: company?.trim() ?? null,

        templateName: resolvedTemplateName,

        summaryHtml,

      }),

    ]);



    return NextResponse.json({ success: true });

  } catch {

    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });

  }

}

