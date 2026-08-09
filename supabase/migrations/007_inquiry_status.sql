-- DesignPick: 詢價狀態 + Email 發送紀錄

alter table public.inquiries
  add column if not exists status text not null default 'new'
    check (status in ('new', 'contacted', 'quoted', 'won', 'lost'));

alter table public.inquiries
  add column if not exists email_customer_sent boolean not null default false,
  add column if not exists email_notify_sent boolean not null default false;

create index if not exists inquiries_status_idx
  on public.inquiries (status, created_at desc);
