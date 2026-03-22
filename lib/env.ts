const requiredServerEnv = ['OPENAI_API_KEY'] as const;

export function assertServerEnv() {
  for (const key of requiredServerEnv) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

export const appEnv = {
  openAiModel: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  stripePriceId: process.env.STRIPE_PRICE_ID || '',
  hasStripeKeys: Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
  stripeWebhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
  hasSupabase: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  ),
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  freeGenerations: Number(process.env.NEXT_PUBLIC_FREE_GENERATIONS || 3),
  paidMonthlyPrice: Number(process.env.NEXT_PUBLIC_MONTHLY_PRICE_USD || 9),
  paidMonthlyMessageLimit: Number(process.env.NEXT_PUBLIC_MONTHLY_MESSAGE_LIMIT || 100),
  targetMaxCostPerUserUsd: Number(process.env.TARGET_MAX_COST_PER_USER_USD || 4),
};
