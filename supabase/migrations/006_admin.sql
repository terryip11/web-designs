-- DesignPick: 管理員角色 + 後台讀取所有詢價

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- 管理員可讀取所有 inquiries（一般會員仍只能讀自己的）
create policy "Admins read all inquiries"
  on public.inquiries for select to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- 將指定 Email 設為管理員（請改成你的 Email 後執行）
-- update public.profiles set is_admin = true
-- where id in (select id from auth.users where email = 'your@email.com');
