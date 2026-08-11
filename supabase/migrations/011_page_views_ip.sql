-- DesignPick: 瀏覽紀錄 IP（雜湊 + 遮罩顯示，不存完整 IP）

alter table public.page_views
  add column if not exists ip_hash text,
  add column if not exists ip_masked text;

create index if not exists page_views_ip_hash_idx
  on public.page_views (ip_hash);

comment on column public.page_views.ip_hash is 'IP SHA-256 雜湊（用於去重，不可逆）';
comment on column public.page_views.ip_masked is '遮罩 IP，例如 203.186.45.xxx';
