-- DesignPick: 後台瀏覽統計（SQL 聚合，避免大量 row 傳輸）

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
    select id, path, referrer, ip_masked, created_at
    from page_views
    order by created_at desc
    limit 15
  ) t;

  select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
  into recent_ips
  from (
    select
      ip_hash,
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

comment on function public.admin_analytics_summary() is
  'Admin dashboard analytics; service_role only. Run via server-side admin client.';
