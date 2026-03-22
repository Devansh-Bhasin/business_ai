create or replace function public.commit_generation_usage(
  p_session_id text,
  p_period_key text,
  p_free_limit integer,
  p_paid_limit integer
)
returns table (plan text, monthly_count integer)
language plpgsql
security definer
as $$
declare
  v_plan text;
  v_monthly_count integer;
  v_limit integer;
begin
  insert into public.usage_sessions (session_id, period_key)
  values (p_session_id, p_period_key)
  on conflict (session_id, period_key) do nothing;

  select us.plan, us.monthly_count
  into v_plan, v_monthly_count
  from public.usage_sessions us
  where us.session_id = p_session_id
    and us.period_key = p_period_key
  for update;

  v_limit := case when v_plan = 'paid' then p_paid_limit else p_free_limit end;

  if v_monthly_count >= v_limit then
    raise exception 'USAGE_LIMIT_REACHED';
  end if;

  update public.usage_sessions
  set monthly_count = monthly_count + 1
  where session_id = p_session_id
    and period_key = p_period_key
  returning usage_sessions.plan, usage_sessions.monthly_count
  into plan, monthly_count;

  return next;
end;
$$;

comment on function public.commit_generation_usage(text, text, integer, integer)
  is 'Commits one successful generation for a given session and month, respecting free/paid plan limits.';
