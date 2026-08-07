-- 儲存客戶設計選配（版面、導航、動效、Hero）
alter table public.inquiries
  add column if not exists design_selections jsonb not null default '{}'::jsonb;
