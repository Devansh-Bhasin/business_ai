import { appEnv } from '@/lib/env';
import { getServiceSupabaseClient } from '@/lib/supabase';
import { UsagePlan, UsageSnapshot } from '@/lib/types';

function getCurrentPeriodKey(now = new Date()) {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

function coercePlan(value: string | null | undefined): UsagePlan {
  return value === 'paid' ? 'paid' : 'free';
}

function buildSnapshot({
  sessionId,
  plan,
  monthlyCount,
  source,
}: {
  sessionId: string;
  plan: UsagePlan;
  monthlyCount: number;
  source: UsageSnapshot['source'];
}): UsageSnapshot {
  const monthlyLimit = plan === 'paid' ? appEnv.paidMonthlyMessageLimit : appEnv.freeGenerations;
  return {
    sessionId,
    plan,
    monthlyCount,
    monthlyLimit,
    remaining: Math.max(monthlyLimit - monthlyCount, 0),
    periodKey: getCurrentPeriodKey(),
    source,
  };
}

export async function getUsageSnapshot(sessionId: string): Promise<UsageSnapshot> {
  const supabase = getServiceSupabaseClient();

  if (!supabase) {
    return buildSnapshot({ sessionId, plan: 'free', monthlyCount: 0, source: 'local-fallback' });
  }

  const periodKey = getCurrentPeriodKey();
  const { data, error } = await supabase
    .from('usage_sessions')
    .select('plan, monthly_count')
    .eq('session_id', sessionId)
    .eq('period_key', periodKey)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load usage status: ${error.message}`);
  }

  return buildSnapshot({
    sessionId,
    plan: coercePlan(data?.plan),
    monthlyCount: data?.monthly_count ?? 0,
    source: 'supabase',
  });
}

export async function reserveUsage(sessionId: string): Promise<UsageSnapshot> {
  const supabase = getServiceSupabaseClient();

  if (!supabase) {
    return buildSnapshot({ sessionId, plan: 'free', monthlyCount: 0, source: 'local-fallback' });
  }

  const periodKey = getCurrentPeriodKey();
  const { data, error } = await supabase.rpc('reserve_generation_usage', {
    p_session_id: sessionId,
    p_period_key: periodKey,
    p_free_limit: appEnv.freeGenerations,
    p_paid_limit: appEnv.paidMonthlyMessageLimit,
  });

  if (error) {
    throw new Error(`Unable to reserve usage: ${error.message}`);
  }

  const row = Array.isArray(data) ? data[0] : data;

  if (!row) {
    throw new Error('Usage reservation returned no data.');
  }

  const snapshot = buildSnapshot({
    sessionId,
    plan: coercePlan(row.plan),
    monthlyCount: Number(row.monthly_count ?? 0),
    source: 'supabase',
  });

  if (snapshot.remaining < 0 || snapshot.monthlyCount > snapshot.monthlyLimit) {
    throw new Error('Usage limit reached.');
  }

  return snapshot;
}
