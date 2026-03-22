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
  'Three send-ready variants in one pass: professional, warm, and firm',
  'Built for founders, client teams, operators, and support leads',
  'Made for email, Slack, client chat, and any message where tone matters',
  'Faster than rewriting drafts from scratch and safer than winging it',
];

export const trustSignals = [
  'Feels polished without sounding robotic',
  'Useful in the awkward moments generic AI usually fumbles',
  'Lean enough for self-serve conversion, structured enough to monetize cleanly',
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

export const audienceCards = [
  {
    title: 'Founders and operators',
    description: 'When every client message carries brand weight and there is no comms team to clean it up after you.',
  },
  {
    title: 'Agencies and freelancers',
    description: 'For scope pushback, payment follow-ups, timeline resets, and keeping relationships warm while holding boundaries.',
  },
  {
    title: 'Support and success teams',
    description: 'For replies that sound calm, thoughtful, and accountable even when the thread is tense.',
  },
];

export const workflowSteps = [
  {
    step: '01',
    title: 'Drop in the situation',
    description: 'Paste the context, the constraint, and the outcome you want — no prompt gymnastics required.',
  },
  {
    step: '02',
    title: 'Choose the tone',
    description: 'Pick balanced, empathetic, or direct depending on the relationship, urgency, and commercial reality.',
  },
  {
    step: '03',
    title: 'Send the best version',
    description: 'Get three usable drafts, copy the one that fits, and ship the message without second-guessing every line.',
  },
];

export const valueProps = [
  {
    title: 'Protects relationships while keeping the ask clear',
    description: 'The point is not just “nicer wording.” It is sending a message that preserves trust without diluting what needs to happen next.',
  },
  {
    title: 'Built for real business tension, not generic writing prompts',
    description: 'Late payments, no-response follow-ups, support friction, and scope boundaries are where tone actually changes outcomes.',
  },
  {
    title: 'Premium feel, low-friction workflow',
    description: 'No templates maze. No bloated dashboard. Just a fast drafting surface that feels credible enough to pay for.',
  },
];

export const testimonialCards = [
  {
    quote: 'Exactly the kind of tool you reach for when the message matters more than people think.',
    role: 'Placeholder feedback style',
  },
  {
    quote: 'The best part is getting three angles instantly instead of rewriting the same email five times.',
    role: 'Representative early-user sentiment',
  },
  {
    quote: 'Feels more like a tone co-pilot than a generic AI writer.',
    role: 'Positioning-ready proof block',
  },
];
