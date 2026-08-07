-- 為 inquiries 表新增幣別欄位（HKD）
alter table public.inquiries
  add column if not exists currency text not null default 'HKD';
