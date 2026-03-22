import { getServiceSupabaseClient } from '@/lib/supabase';

function getCurrentPeriodKey(now = new Date()) {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

function isActiveSubscription(status: string | null | undefined) {
  return ['active', 'trialing'].includes(String(status || ''));
}

export async function upsertSubscriptionPlanForSession({
  sessionId,
  customerId,
  subscriptionId,
  billingStatus,
}: {
  sessionId: string;
  customerId?: string | null;
  subscriptionId?: string | null;
  billingStatus?: string | null;
}) {
  const supabase = getServiceSupabaseClient();

  if (!supabase || !sessionId) {
    return;
  }

  const periodKey = getCurrentPeriodKey();
  const plan = isActiveSubscription(billingStatus) ? 'paid' : 'free';

  const { error } = await supabase.from('usage_sessions').upsert(
    {
      session_id: sessionId,
      period_key: periodKey,
      plan,
      stripe_customer_id: customerId || null,
      stripe_subscription_id: subscriptionId || null,
      billing_status: billingStatus || null,
      metadata: {
        stripe_sync_source: 'webhook',
        updated_via: 'upsertSubscriptionPlanForSession',
      },
    },
    {
      onConflict: 'session_id,period_key',
    }
  );

  if (error) {
    throw new Error(`Unable to sync billing for session ${sessionId}: ${error.message}`);
  }
}

export async function syncSubscriptionPlanByStripeIdentity({
  customerId,
  subscriptionId,
  billingStatus,
  sessionId,
}: {
  customerId?: string | null;
  subscriptionId?: string | null;
  billingStatus?: string | null;
  sessionId?: string | null;
}) {
  const supabase = getServiceSupabaseClient();

  if (!supabase) {
    return;
  }

  const plan = isActiveSubscription(billingStatus) ? 'paid' : 'free';

  if (sessionId) {
    await upsertSubscriptionPlanForSession({
      sessionId,
      customerId,
      subscriptionId,
      billingStatus,
    });
    return;
  }

  if (!customerId && !subscriptionId) {
    return;
  }

  let query = supabase
    .from('usage_sessions')
    .update({
      plan,
      stripe_customer_id: customerId || null,
      stripe_subscription_id: subscriptionId || null,
      billing_status: billingStatus || null,
      metadata: {
        stripe_sync_source: 'webhook',
        updated_via: 'syncSubscriptionPlanByStripeIdentity',
      },
    })
    .eq('period_key', getCurrentPeriodKey());

  if (subscriptionId) {
    query = query.eq('stripe_subscription_id', subscriptionId);
  } else if (customerId) {
    query = query.eq('stripe_customer_id', customerId);
  }

  const { error } = await query;

  if (error) {
    throw new Error(`Unable to sync billing by Stripe identity: ${error.message}`);
  }

  // TODO: if you want reliable cross-device restoration without session metadata,
  // introduce a first-class user/account record and map Stripe customer -> user there.
}
