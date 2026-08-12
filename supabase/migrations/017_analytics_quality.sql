-- DesignPick: 過濾 Demo iframe、localhost、bot 等噪音，使後台流量更接近 GA4

create or replace function public.is_quality_page_view(
  p_path text,
  p_referrer text,
  p_user_agent text
) returns boolean
language sql
immutable
as $$
  select
    coalesce(p_referrer, '') not ilike '%localhost%'
    and coalesce(p_referrer, '') not ilike '%/admin%'
    and not (
      p_path like '/demos/%'
      and p_referrer is not null
      and p_referrer ~* 'desigpick-digital\.com/demos/?($|\?|#)'
    )
    and (
      p_user_agent is null
      or p_user_agent !~* 'bot|crawl|spider|slurp|headless|facebookexternalhit|preview'
    );
$$;

comment on function public.is_quality_page_view is
  '是否計入後台一般流量（排除 iframe、localhost、admin、bot）';

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
  suspicious_activity jsonb;
begin
  select jsonb_build_object(
    'online_now',
    coalesce(
      (
        select count(distinct visitor_id)::int
        from page_views
        where created_at >= since5m
          and is_suspicious = false
          and is_quality_page_view(path, referrer, user_agent)
      ),
      0
    ),
    'views_24h',
    coalesce(
      (
        select count(*)::int
        from page_views
        where created_at >= since24h
          and is_suspicious = false
          and is_quality_page_view(path, referrer, user_agent)
      ),
      0
    ),
    'visitors_24h',
    coalesce(
      (
        select count(distinct visitor_id)::int
        from page_views
        where created_at >= since24h
          and is_suspicious = false
          and is_quality_page_view(path, referrer, user_agent)
      ),
      0
    ),
    'unique_ips_24h',
    coalesce(
      (
        select count(distinct ip_hash)::int
        from page_views
        where created_at >= since24h
          and is_suspicious = false
          and ip_hash is not null
          and is_quality_page_view(path, referrer, user_agent)
      ),
      0
    ),
    'views_7d',
    coalesce(
      (
        select count(*)::int
        from page_views
        where created_at >= since7d
          and is_suspicious = false
          and is_quality_page_view(path, referrer, user_agent)
      ),
      0
    ),
    'suspicious_24h',
    coalesce(
      (
        select count(*)::int
        from page_views
        where created_at >= since24h and is_suspicious = true
      ),
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
      and is_suspicious = false
      and is_quality_page_view(path, referrer, user_agent)
    group by path
    order by count(*) desc
    limit 8
  ) t;

  select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
  into recent_views
  from (
    select id, path, referrer, ip_address, ip_masked, created_at
    from page_views
    where is_suspicious = false
      and is_quality_page_view(path, referrer, user_agent)
    order by created_at desc
    limit 10
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
    where created_at >= since24h
      and is_suspicious = false
      and ip_hash is not null
      and is_quality_page_view(path, referrer, user_agent)
    group by ip_hash
    order by max(created_at) desc
    limit 8
  ) t;

  select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
  into suspicious_activity
  from (
    select
      path,
      max(ip_address) as ip_address,
      max(ip_masked) as ip_masked,
      count(*)::int as hits,
      max(created_at) as last_seen
    from page_views
    where created_at >= since24h and is_suspicious = true
    group by path, ip_hash
    order by max(created_at) desc
    limit 15
  ) t;

  return jsonb_build_object(
    'counts', counts,
    'top_pages', top_pages,
    'recent_views', recent_views,
    'recent_ips', recent_ips,
    'suspicious_activity', suspicious_activity
  );
end;
$$;

revoke all on function public.admin_analytics_summary() from public;
revoke all on function public.admin_analytics_summary() from anon;
revoke all on function public.admin_analytics_summary() from authenticated;
grant execute on function public.admin_analytics_summary() to service_role;
