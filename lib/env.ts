const requiredServerEnv = ['OPENAI_API_KEY'] as const;

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parsePositiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function assertServerEnv() {
  for (const key of requiredServerEnv) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

export function resolveAppUrl(request?: Request) {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  if (request) {
    const forwardedProto = request.headers.get('x-forwarded-proto');
    const forwardedHost = request.headers.get('x-forwarded-host');
    const host = forwardedHost || request.headers.get('host');

    if (host) {
      const protocol = forwardedProto || (host.includes('localhost') ? 'http' : 'https');
      return `${protocol}://${host}`;
    }

    try {
      return new URL(request.url).origin;
    } catch {
      // fall through to localhost fallback
    }
  }

  return 'http://localhost:3000';
}

export const appEnv = {
  openAiModel: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
  stripePriceId: process.env.STRIPE_PRICE_ID || '',
  hasStripeSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
  hasStripePublishableKey: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
  hasStripeKeys: Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
  stripeWebhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
  hasSupabase: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  ),
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  freeGenerations: parsePositiveInt(process.env.NEXT_PUBLIC_FREE_GENERATIONS, 3),
  paidMonthlyPrice: parsePositiveNumber(process.env.NEXT_PUBLIC_MONTHLY_PRICE_USD, 9),
  paidMonthlyMessageLimit: parsePositiveInt(process.env.NEXT_PUBLIC_MONTHLY_MESSAGE_LIMIT, 100),
  targetMaxCostPerUserUsd: parsePositiveNumber(process.env.TARGET_MAX_COST_PER_USER_USD, 4),
};
