"use client";

import { MessageCircle, Phone, User } from "lucide-react";
import { useWhatsAppInquiryUrl } from "@/hooks/use-inquiry-whatsapp";
import {
  SITE_CONTACT,
  getTelUrl,
} from "@/lib/site-contact";

export default function ContactDirectCard() {
  const whatsappUrl = useWhatsAppInquiryUrl();

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-emerald-400/80">
        直接聯絡
      </p>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
          <User className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-white">{SITE_CONTACT.contactName}</p>
          <a
            href={getTelUrl()}
            className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-emerald-300"
          >
            <Phone className="h-3.5 w-3.5" />
            {SITE_CONTACT.phoneDisplay}
          </a>
        </div>
      </div>
      <p className="mt-3 text-sm text-zinc-500">
        想先聊聊再填表？WhatsApp 會自動帶入你目前的選配方案摘要。
      </p>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#20bd5a]"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp 聯絡 {SITE_CONTACT.contactName}
      </a>
    </div>
  );
}
