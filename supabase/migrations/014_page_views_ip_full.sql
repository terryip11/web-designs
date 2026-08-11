-- DesignPick: 後台完整 IP（僅 service_role / 管理後台讀取，保留 30 天）

alter table public.page_views
  add column if not exists ip_address text;

comment on column public.page_views.ip_address is
  '完整 IP，僅供管理後台；與 ip_hash 一併於 30 天後刪除';

create or replace function public.admin_analytics_summary()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  since5m timestamptz := now() - interval '5 minutes';
  since24h timestamptz := now() - interval '24 hours';
  since7d timestamptz := now() - interval '7 days';
  counts jsonb;
  top_pages jsonb;
  recent_views jsonb;
  recent_ips jsonb;
begin
  select jsonb_build_object(
    'online_now',
    coalesce(
      (select count(distinct visitor_id)::int from page_views where created_at >= since5m),
      0
    ),
    'views_24h',
    coalesce(
      (select count(*)::int from page_views where created_at >= since24h),
      0
    ),
    'visitors_24h',
    coalesce(
      (select count(distinct visitor_id)::int from page_views where created_at >= since24h),
      0
    ),
    'unique_ips_24h',
    coalesce(
      (
        select count(distinct ip_hash)::int
        from page_views
        where created_at >= since24h and ip_hash is not null
      ),
      0
    ),
    'views_7d',
    coalesce(
      (select count(*)::int from page_views where created_at >= since7d),
      0
    )
  )
  into counts;

  select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
  into top_pages
  from (
    select path, count(*)::int as views
    from page_views
    where created_at >= since24h
    group by path
    order by count(*) desc
    limit 8
  ) t;

  select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
  into recent_views
  from (
    select id, path, referrer, ip_address, ip_masked, created_at
    from page_views
    order by created_at desc
    limit 15
  ) t;

  select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
  into recent_ips
  from (
    select
      ip_hash,
      max(ip_address) as ip_address,
      max(ip_masked) as ip_masked,
      (array_agg(path order by created_at desc))[1] as last_path,
      max(created_at) as last_seen,
      count(*)::int as hits
    from page_views
    where created_at >= since24h and ip_hash is not null
    group by ip_hash
    order by max(created_at) desc
    limit 10
  ) t;

  return jsonb_build_object(
    'counts', counts,
    'top_pages', top_pages,
    'recent_views', recent_views,
    'recent_ips', recent_ips
  );
end;
$$;

revoke all on function public.admin_analytics_summary() from public;
revoke all on function public.admin_analytics_summary() from anon;
revoke all on function public.admin_analytics_summary() from authenticated;
grant execute on function public.admin_analytics_summary() to service_role;
