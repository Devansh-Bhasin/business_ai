create table if not exists public.usage_sessions (
  id bigserial primary key,
  session_id text not null,
  period_key text not null,
  plan text not null default 'free' check (plan in ('free', 'paid')),
  monthly_count integer not null default 0,
  stripe_customer_id text,
  stripe_subscription_id text,
  billing_status text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (session_id, period_key)
);

create index if not exists usage_sessions_period_idx on public.usage_sessions (period_key);
create index if not exists usage_sessions_plan_idx on public.usage_sessions (plan);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists usage_sessions_set_updated_at on public.usage_sessions;
create trigger usage_sessions_set_updated_at
before update on public.usage_sessions
for each row execute function public.set_updated_at();

create or replace function public.reserve_generation_usage(
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

comment on table public.usage_sessions is 'Anonymous/session usage ledger for ClearReply free and paid monthly caps.';
comment on function public.reserve_generation_usage(text, text, integer, integer)
  is 'Atomically reserves one generation for a given session and month, respecting free/paid plan limits.';
