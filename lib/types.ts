export type ScenarioId =
  | 'late-payment'
  | 'reschedule-meeting'
  | 'decline-request'
  | 'follow-up'
  | 'customer-support'
  | 'partnership-outreach';

export type ToneId = 'balanced' | 'empathetic' | 'direct';

export interface VariantResult {
  label: 'Professional' | 'Warm' | 'Firm';
  message: string;
}

export type UsagePlan = 'free' | 'paid';

export interface UsageSnapshot {
  sessionId: string;
  plan: UsagePlan;
  monthlyCount: number;
  monthlyLimit: number;
  remaining: number;
  periodKey: string;
  source: 'supabase' | 'local-fallback';
}
