-- DesignPick: 網站瀏覽紀錄（供管理後台統計）

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  path text not null,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx
  on public.page_views (created_at desc);

create index if not exists page_views_visitor_id_idx
  on public.page_views (visitor_id);

create index if not exists page_views_path_idx
  on public.page_views (path);

alter table public.page_views enable row level security;
