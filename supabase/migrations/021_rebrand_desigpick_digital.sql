-- 品牌統一為 desigpick-digital（與網域一致）

update public.blog_posts
set
  title = replace(title, 'DesignPick', 'desigpick-digital'),
  description = replace(description, 'DesignPick', 'desigpick-digital'),
  content = replace(content::text, 'DesignPick', 'desigpick-digital')::jsonb
where
  title like '%DesignPick%'
  or description like '%DesignPick%'
  or content::text like '%DesignPick%';

update public.blog_posts
set tags = (
  select coalesce(array_agg(case when t = 'DesignPick' then 'desigpick-digital' else t end), array[]::text[])
  from unnest(tags) as t
)
where 'DesignPick' = any (tags);

-- 更新「DesignPick 是什麼」文章標題（保留原 slug 以免連結失效）
update public.blog_posts
set title = 'desigpick-digital 是什麼？香港網站設計選配平台完整指南'
where slug = 'what-is-designpick-hong-kong';
