-- DesignPick: 客戶素材上傳（Logo、相片等）

alter table public.inquiries
  add column if not exists asset_urls jsonb not null default '[]'::jsonb;

insert into storage.buckets (id, name, public)
values ('client-assets', 'client-assets', true)
on conflict (id) do nothing;

create policy "Allow anonymous upload client assets"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'client-assets');

create policy "Public read client assets"
  on storage.objects
  for select
  to anon
  using (bucket_id = 'client-assets');
