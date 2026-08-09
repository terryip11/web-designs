import { z } from "zod";

const sketchPageSchema = z.object({
  pageName: z.string(),
  device: z.string(),
  dataUrl: z.string().max(6_000_000),
});

export const inquiryBodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().max(5000).optional(),
  templateId: z.string().optional(),
  templateName: z.string().optional(),
  templateCategory: z.string().optional(),
  selectedFeatures: z.array(z.string()).optional(),
  designSelections: z.record(z.string(), z.string()).optional(),
  designSelectionLabels: z
    .object({
      layout: z.string(),
      navigation: z.array(z.string()),
      animationTier: z.string(),
      heroType: z.string(),
    })
    .partial()
    .optional(),
  totalPrice: z.number().int().min(0).optional(),
  currency: z.string().max(8).optional(),
  sketchPages: z.array(sketchPageSchema).max(20).optional(),
  clientAssets: z
    .array(
      z.object({
        fileName: z.string(),
        dataUrl: z.string().max(6_000_000),
      })
    )
    .max(5)
    .optional(),
  privacyAccepted: z.literal(true),
  website: z.string().optional(),
});

export type InquiryBody = z.infer<typeof inquiryBodySchema>;

export const inquiryStatusSchema = z.enum([
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
]);
