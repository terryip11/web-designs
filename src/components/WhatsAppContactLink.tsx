"use client";

import { MessageCircle } from "lucide-react";
import { useWhatsAppInquiryUrl } from "@/hooks/use-inquiry-whatsapp";
import { SITE_CONTACT } from "@/lib/site-contact";

interface WhatsAppContactLinkProps {
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export default function WhatsAppContactLink({
  className = "",
  showIcon = true,
  children,
}: WhatsAppContactLinkProps) {
  const whatsappUrl = useWhatsAppInquiryUrl();

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {showIcon && <MessageCircle className="h-3.5 w-3.5" />}
      {children ?? `WhatsApp ${SITE_CONTACT.contactName}`}
    </a>
  );
}
