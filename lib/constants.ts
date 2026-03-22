import { ScenarioId, ToneId } from '@/lib/types';

export const scenarios: Array<{ id: ScenarioId; label: string; hint: string }> = [
  {
    id: 'late-payment',
    label: 'Late payment reminder',
    hint: 'Protect cash flow without making the relationship tense.',
  },
  {
    id: 'reschedule-meeting',
    label: 'Reschedule a meeting',
    hint: 'Move timing without looking disorganized.',
  },
  {
    id: 'decline-request',
    label: 'Decline a request',
    hint: 'Say no cleanly without burning goodwill.',
  },
  {
    id: 'follow-up',
    label: 'Follow up after no response',
    hint: 'Revive the thread with confidence, not neediness.',
  },
  {
    id: 'customer-support',
    label: 'Customer support reply',
    hint: 'Steady a frustrated customer and move to resolution.',
  },
  {
    id: 'partnership-outreach',
    label: 'Partnership outreach',
    hint: 'Start the conversation sounding credible from line one.',
  },
];

export const tones: Array<{ id: ToneId; label: string; hint: string }> = [
  {
    id: 'balanced',
    label: 'Balanced',
    hint: 'Professional, clear, commercially aware.',
  },
  {
    id: 'empathetic',
    label: 'Empathetic',
    hint: 'Warmer, softer edges, still decisive.',
  },
  {
    id: 'direct',
    label: 'Direct',
    hint: 'Concise, confident, escalation-ready.',
  },
];

export const featureBullets = [
  'Three polished variants per brief: professional, warm, and firm',
  'Built for founders, operators, agencies, and support teams',
  'Copy-ready output for email, client chat, and internal follow-ups',
  'Usage guardrails designed for free limits now and paid caps next',
];

export const trustSignals = [
  'No bloated CRM workflow to get value',
  'Optimized for awkward, high-stakes business moments',
  'Practical usage controls for profitable self-serve growth',
];

export const scenarioHighlights = [
  {
    title: 'Collections without friction',
    description: 'Turn a tense overdue invoice follow-up into a message that protects both cash flow and the client relationship.',
  },
  {
    title: 'Support replies that de-escalate',
    description: 'Respond with empathy, accountability, and next steps instead of sounding canned or defensive.',
  },
  {
    title: 'Clear no’s, cleaner boundaries',
    description: 'Decline requests, reset scope, or push back on timing without sounding cold, vague, or apologetic.',
  },
];
