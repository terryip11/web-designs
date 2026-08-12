import { z } from "zod";

export const adminMemberCreateSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(6).max(72),
  display_name: z.string().trim().max(100).optional().nullable(),
  phone: z.string().trim().max(30).optional().nullable(),
  company: z.string().trim().max(100).optional().nullable(),
  is_admin: z.boolean().optional(),
});

export const adminMemberUpdateSchema = z.object({
  email: z.string().trim().email().max(254).optional(),
  password: z.string().min(6).max(72).optional().nullable(),
  display_name: z.string().trim().max(100).optional().nullable(),
  phone: z.string().trim().max(30).optional().nullable(),
  company: z.string().trim().max(100).optional().nullable(),
  is_admin: z.boolean().optional(),
});

export type AdminMemberCreateInput = z.infer<typeof adminMemberCreateSchema>;
export type AdminMemberUpdateInput = z.infer<typeof adminMemberUpdateSchema>;
