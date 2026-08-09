-- DesignPick: 後台內部備註

alter table public.inquiries
  add column if not exists admin_notes text;
