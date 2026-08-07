-- DesignPick: 客戶需求提交表
-- 在 Supabase Dashboard → SQL Editor 執行此腳本

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  message text,
  template_id text not null,
  template_name text not null,
  selected_features jsonb not null default '[]'::jsonb,
  design_selections jsonb not null default '{}'::jsonb,
  total_price integer not null default 0,
  currency text not null default 'HKD',
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

-- 允許匿名用戶提交需求
create policy "Allow anonymous insert"
  on public.inquiries
  for insert
  to anon
  with check (true);

-- 僅 authenticated 用戶可讀（後台管理用）
create policy "Allow authenticated read"
  on public.inquiries
  for select
  to authenticated
  using (true);

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);
