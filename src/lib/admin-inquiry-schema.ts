import { z } from "zod";
import { inquiryStatusSchema } from "@/lib/inquiry-schema";

export const adminInquiryWriteSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional().nullable(),
  company: z.string().trim().max(100).optional().nullable(),
  message: z.string().trim().max(5000).optional().nullable(),
  template_id: z.string().trim().max(100).optional(),
  template_name: z.string().trim().min(1).max(200),
  selected_features: z.array(z.string()).optional(),
  total_price: z.number().int().min(0).optional(),
  currency: z.string().trim().max(8).optional(),
  status: inquiryStatusSchema.optional(),
  admin_notes: z.string().trim().max(5000).optional().nullable(),
});

export type AdminInquiryWriteInput = z.infer<typeof adminInquiryWriteSchema>;

export function parseFeatureLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function formatFeatureLines(features: string[] | null | undefined): string {
  return (features ?? []).join("\n");
}
