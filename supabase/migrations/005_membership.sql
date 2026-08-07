-- DesignPick: 會員系統（profiles、saved_configs、inquiries 關聯 user）

-- 會員資料
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  phone text,
  company text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users insert own profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

-- 註冊時自動建立 profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- inquiries 關聯會員
alter table public.inquiries
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists inquiries_user_id_idx
  on public.inquiries (user_id, created_at desc);

drop policy if exists "Allow authenticated read" on public.inquiries;

create policy "Users read own inquiries"
  on public.inquiries for select to authenticated
  using (user_id = auth.uid());

-- 已儲存方案
create table if not exists public.saved_configs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  template_id text,
  selected_features jsonb not null default '[]'::jsonb,
  design_selections jsonb not null default '{}'::jsonb,
  sketch_snapshot jsonb,
  total_price integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.saved_configs enable row level security;

create policy "Users manage own saved configs"
  on public.saved_configs for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create index if not exists saved_configs_user_id_idx
  on public.saved_configs (user_id, updated_at desc);
