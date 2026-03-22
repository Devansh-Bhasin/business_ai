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
