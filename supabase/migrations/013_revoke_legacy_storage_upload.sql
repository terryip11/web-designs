-- DesignPick: 草圖已改存 Cloudflare R2，移除 Supabase Storage 匿名上傳（避免儲存濫用）

drop policy if exists "Allow anonymous upload sketches" on storage.objects;
