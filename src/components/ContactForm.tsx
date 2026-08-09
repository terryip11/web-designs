"use client";



import { useEffect, useState } from "react";

import Link from "next/link";

import { Loader2, MessageCircle, Send } from "lucide-react";

import { useWhatsAppInquiryUrl } from "@/hooks/use-inquiry-whatsapp";

import { useConfiguratorStore } from "@/store/configurator-store";

import { getFeatureById } from "@/lib/data";

import { CURRENCY_CODE } from "@/lib/currency";

import {

  CONTACT_LIMITS,

  formatHKPhoneDisplay,

  validateContactForm,

  type ContactFieldErrors,

} from "@/lib/contact-validation";

import { getDesignSelectionLabels } from "@/lib/design-options";

import { buildInquiryWhatsAppMessage } from "@/lib/inquiry-summary";

import { exportAllSketchPages } from "@/lib/sketch-export";

import { readFileAsDataUrl } from "@/lib/read-file-data-url";

import { getWhatsAppUrl, SITE_CONTACT } from "@/lib/site-contact";

import MaterialChecklist from "@/components/MaterialChecklist";

import { createBrowserClient } from "@/lib/supabase/client";

import { useSketchStore } from "@/store/sketch-store";



function FieldError({ message }: { message?: string }) {

  if (!message) return null;

  return <p className="mt-1 text-xs text-red-400">{message}</p>;

}



export default function ContactForm() {

  const template = useConfiguratorStore((s) => s.getTemplate());

  const selectedFeatureIds = useConfiguratorStore((s) => s.selectedFeatureIds);

  const designSelections = useConfiguratorStore((s) => s.designSelections);

  const totalPrice = useConfiguratorStore((s) => s.getTotalPrice());

  const sketchTitle = useSketchStore((s) => s.title);

  const pages = useSketchStore((s) => s.pages);

  const hasSketch = useSketchStore((s) => s.hasSketch());



  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [assetFiles, setAssetFiles] = useState<File[]>([]);

  const [message, setMessage] = useState("");

  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const [errorMsg, setErrorMsg] = useState("");

  const [successWhatsAppUrl, setSuccessWhatsAppUrl] = useState("");



  const liveWhatsAppUrl = useWhatsAppInquiryUrl({

    customerName: name.trim() || undefined,

    customerMessage: message.trim() || undefined,

  });



  useEffect(() => {

    const supabase = createBrowserClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {

      if (!user) return;

      setEmail((prev) => prev || user.email || "");

      const { data: profile } = await supabase

        .from("profiles")

        .select("display_name, phone, company")

        .eq("id", user.id)

        .single();

      if (profile) {

        setName((prev) => prev || profile.display_name || "");

        setPhone((prev) => prev || profile.phone || "");

        setCompany((prev) => prev || profile.company || "");

      }

    });

  }, []);



  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    setFieldErrors({});

    setErrorMsg("");



    const validation = validateContactForm({

      name,

      email,

      phone,

      company,

      message,

      privacyAccepted,

    });



    if (!validation.ok) {

      setFieldErrors(validation.errors);

      setStatus("error");

      return;

    }



    setStatus("loading");



    const normalizedPhone = validation.phone

      ? formatHKPhoneDisplay(validation.phone)

      : undefined;



    const designSelectionLabels = getDesignSelectionLabels(designSelections);

    const sketchPageCount = hasSketch

      ? pages.filter((p) => p.elements.length > 0).length

      : 0;



    const whatsappMessage = buildInquiryWhatsAppMessage({

      templateName: template?.name,

      templateCategory: template?.category,

      designSelectionLabels,

      selectedFeatures: selectedFeatureIds.map(

        (id) => getFeatureById(id)?.name ?? id

      ),

      totalPrice,

      currency: CURRENCY_CODE,

      sketchTitle: hasSketch ? sketchTitle : undefined,

      sketchPageCount: sketchPageCount || undefined,

      customerName: name.trim(),

      customerMessage: message.trim() || undefined,

    });



    try {

      const sketchPages = hasSketch

        ? exportAllSketchPages(pages).map((p) => ({

            pageName: p.pageName,

            device: p.device,

            dataUrl: p.dataUrl,

          }))

        : [];



      const clientAssets = await Promise.all(

        assetFiles.map(async (file) => ({

          fileName: file.name,

          dataUrl: await readFileAsDataUrl(file),

        }))

      );



      const res = await fetch("/api/inquiries", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          name: name.trim(),

          email: email.trim(),

          phone: normalizedPhone,

          company: company.trim() || undefined,

          message: [

            hasSketch

              ? `【附介面草圖「${sketchTitle}」共 ${sketchPages.length} 頁】`

              : null,

            message.trim() || null,

          ]

            .filter(Boolean)

            .join("\n\n") || undefined,

          templateId: template?.id ?? "pending",

          templateName: template?.name ?? "尚未選擇介面",

          templateCategory: template?.category,

          selectedFeatures: selectedFeatureIds.map((id) => {

            const f = getFeatureById(id);

            return f?.name ?? id;

          }),

          designSelections,

          designSelectionLabels,

          totalPrice,

          currency: CURRENCY_CODE,

          sketchPages,

          clientAssets,

          privacyAccepted: true,

          website,

        }),

      });



      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "提交失敗");



      setSuccessWhatsAppUrl(getWhatsAppUrl(whatsappMessage));

      setStatus("success");

      setName("");

      setEmail("");

      setPhone("");

      setCompany("");

      setMessage("");

      setPrivacyAccepted(false);

    } catch (err) {

      setStatus("error");

      setErrorMsg(err instanceof Error ? err.message : "提交失敗，請稍後再試");

    }

  }



  if (status === "success") {

    return (

      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">

        <h3 className="text-lg font-semibold text-emerald-400">需求已送出！</h3>

        <p className="mt-2 text-sm text-zinc-400">

          我們已收到您的方案需求，確認信將寄至您填寫的 Email。
          {SITE_CONTACT.contactName} 將盡快與您聯繫。

        </p>

        <a

          href={successWhatsAppUrl || liveWhatsAppUrl}

          target="_blank"

          rel="noopener noreferrer"

          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#20bd5a]"

        >

          <MessageCircle className="h-4 w-4" />

          或立即 WhatsApp {SITE_CONTACT.contactName}（含方案摘要）

        </a>

      </div>

    );

  }



  const inputClass = (field: keyof ContactFieldErrors) =>

    `w-full rounded-lg border bg-zinc-950 px-4 py-2.5 text-white focus:outline-none focus:ring-1 ${

      fieldErrors[field]

        ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/30"

        : "border-zinc-700 focus:border-violet-500 focus:ring-violet-500"

    }`;



  return (

    <form onSubmit={handleSubmit} className="space-y-5" noValidate>

      {!template && (

        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">

          您尚未選擇介面，仍可提交一般詢問；建議先{" "}

          <Link href="/templates" className="underline hover:text-amber-200">

            選擇介面

          </Link>{" "}

          或{" "}

          <Link href="/configure" className="underline hover:text-amber-200">

            完成選配

          </Link>{" "}

          以獲得更精準報價。

        </div>

      )}



      <div className="grid gap-5 sm:grid-cols-2">

        <div>

          <label htmlFor="contact-name" className="mb-1.5 block text-sm text-zinc-400">

            姓名 <span className="text-red-400">*</span>

          </label>

          <input

            id="contact-name"

            required

            maxLength={CONTACT_LIMITS.nameMax}

            value={name}

            onChange={(e) => setName(e.target.value)}

            className={inputClass("name")}

            autoComplete="name"

          />

          <FieldError message={fieldErrors.name} />

        </div>

        <div>

          <label htmlFor="contact-email" className="mb-1.5 block text-sm text-zinc-400">

            Email <span className="text-red-400">*</span>

          </label>

          <input

            id="contact-email"

            required

            type="email"

            maxLength={CONTACT_LIMITS.emailMax}

            value={email}

            onChange={(e) => setEmail(e.target.value)}

            className={inputClass("email")}

            autoComplete="email"

          />

          <FieldError message={fieldErrors.email} />

        </div>

        <div>

          <label htmlFor="contact-phone" className="mb-1.5 block text-sm text-zinc-400">

            電話

            <span className="ml-1 text-xs text-zinc-600">（香港 8 位，選填）</span>

          </label>

          <input

            id="contact-phone"

            type="tel"

            maxLength={CONTACT_LIMITS.phoneMax}

            value={phone}

            onChange={(e) => setPhone(e.target.value)}

            placeholder="例如 6156 6060 或 +852 61566060"

            className={inputClass("phone")}

            autoComplete="tel"

          />

          <FieldError message={fieldErrors.phone} />

        </div>

        <div>

          <label htmlFor="contact-company" className="mb-1.5 block text-sm text-zinc-400">

            公司 / 品牌

          </label>

          <input

            id="contact-company"

            maxLength={CONTACT_LIMITS.companyMax}

            value={company}

            onChange={(e) => setCompany(e.target.value)}

            className={inputClass("company")}

            autoComplete="organization"

          />

          <FieldError message={fieldErrors.company} />

        </div>

      </div>



      <div>

        <label htmlFor="contact-message" className="mb-1.5 block text-sm text-zinc-400">

          補充說明

          <span className="ml-2 text-xs text-zinc-600">

            {message.length}/{CONTACT_LIMITS.messageMax}

          </span>

        </label>

        <textarea

          id="contact-message"

          rows={4}

          maxLength={CONTACT_LIMITS.messageMax}

          value={message}

          onChange={(e) => setMessage(e.target.value)}

          placeholder="描述您的品牌、目標客群或其他特殊需求…"

          className={`${inputClass("message")} placeholder:text-zinc-600`}

        />

        <FieldError message={fieldErrors.message} />

      </div>



      <div>

        <label className="flex cursor-pointer items-start gap-3">

          <input

            type="checkbox"

            checked={privacyAccepted}

            onChange={(e) => setPrivacyAccepted(e.target.checked)}

            className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-950 text-violet-600 focus:ring-violet-500"

          />

          <span className="text-sm text-zinc-400">

            我已閱讀並同意{" "}

            <Link

              href="/privacy"

              target="_blank"

              className="text-violet-400 underline hover:text-violet-300"

            >

              私隱政策

            </Link>

            ，並同意 DesignPick 為回覆查詢而處理上述個人資料。

            <span className="text-red-400"> *</span>

          </span>

        </label>

        <FieldError message={fieldErrors.privacy} />

      </div>



      <MaterialChecklist />



      <div>

        <label htmlFor="contact-assets" className="mb-1.5 block text-sm text-zinc-400">

          上傳 Logo / 參考圖（選填，最多 5 張，每張 5MB）

        </label>

        <input

          id="contact-assets"

          type="file"

          accept="image/png,image/jpeg,image/webp,image/svg+xml"

          multiple

          onChange={(e) => setAssetFiles(Array.from(e.target.files ?? []).slice(0, 5))}

          className="block w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-zinc-200"

        />

        {assetFiles.length > 0 && (

          <p className="mt-1 text-xs text-zinc-500">已選 {assetFiles.length} 個檔案</p>

        )}

      </div>



      {status === "error" && errorMsg && (

        <p className="text-sm text-red-400">{errorMsg}</p>

      )}



      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">

        <label htmlFor="contact-website">Website</label>

        <input

          id="contact-website"

          name="website"

          type="text"

          tabIndex={-1}

          autoComplete="off"

          value={website}

          onChange={(e) => setWebsite(e.target.value)}

        />

      </div>



      <button

        type="submit"

        disabled={status === "loading"}

        className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-3 font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-60"

      >

        {status === "loading" ? (

          <Loader2 className="h-5 w-5 animate-spin" />

        ) : (

          <>

            <Send className="h-4 w-4" />

            提交需求

          </>

        )}

      </button>

    </form>

  );

}


