import { ScenarioId, ToneId } from '@/lib/types';

export const scenarios: Array<{ id: ScenarioId; label: string; hint: string }> = [
  {
    id: 'late-payment',
    label: 'Late payment reminder',
    hint: 'Nudge a client without sounding tense.',
  },
  {
    id: 'reschedule-meeting',
    label: 'Reschedule a meeting',
    hint: 'Shift timing while keeping trust intact.',
  },
  {
    id: 'decline-request',
    label: 'Decline a request',
    hint: 'Say no clearly and respectfully.',
  },
  {
    id: 'follow-up',
    label: 'Follow up after no response',
    hint: 'Bring the thread back to life.',
  },
  {
    id: 'customer-support',
    label: 'Customer support reply',
    hint: 'Calm a situation and move it forward.',
  },
  {
    id: 'partnership-outreach',
    label: 'Partnership outreach',
    hint: 'Open a door with confidence and warmth.',
  },
];

export const tones: Array<{ id: ToneId; label: string; hint: string }> = [
  {
    id: 'balanced',
    label: 'Balanced',
    hint: 'Professional and approachable.',
  },
  {
    id: 'empathetic',
    label: 'Empathetic',
    hint: 'More human, softer edges.',
  },
  {
    id: 'direct',
    label: 'Direct',
    hint: 'Clear, concise, assertive.',
  },
];

export const featureBullets = [
  'Generate three message styles in one click',
  'Tailor responses to real business scenarios',
  'Copy-ready output for email, SMS, or chat',
  'Structured to grow into payments, analytics, and saved history',
];
