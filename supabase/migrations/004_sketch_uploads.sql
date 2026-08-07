-- 草圖 PNG 上傳至 Storage，並記錄 URL
alter table public.inquiries
  add column if not exists sketch_urls jsonb not null default '[]'::jsonb;

-- Storage bucket（在 Supabase Dashboard → Storage 亦可手動建立）
insert into storage.buckets (id, name, public)
values ('sketches', 'sketches', true)
on conflict (id) do nothing;

-- 匿名用戶可上傳草圖
create policy "Allow anonymous upload sketches"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'sketches');

-- 公開讀取草圖
create policy "Public read sketches"
  on storage.objects
  for select
  to anon
  using (bucket_id = 'sketches');
