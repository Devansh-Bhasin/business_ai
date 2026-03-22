import { ScenarioId, ToneId } from '@/lib/types';

const scenarioDescriptions: Record<ScenarioId, string> = {
  'late-payment': 'A business message requesting payment from a client with overdue invoice(s).',
  'reschedule-meeting': 'A note that needs to reschedule a meeting while preserving momentum and trust.',
  'decline-request': 'A respectful but clear decline for a request, pitch, favor, or scope expansion.',
  'follow-up': 'A follow-up message after no response that should feel useful, not needy.',
  'customer-support': 'A customer support reply that acknowledges concern and proposes next steps.',
  'partnership-outreach': 'An outbound message to start a partnership or collaboration conversation.',
};

const toneDescriptions: Record<ToneId, string> = {
  balanced: 'Keep the overall voice professional, practical, and easy to send immediately.',
  empathetic: 'Lean more human and understanding without becoming vague or overly apologetic.',
  direct: 'Prioritize clarity, brevity, and confidence while staying respectful.',
};

export function buildPrompt({
  scenario,
  tone,
  context,
}: {
  scenario: ScenarioId;
  tone: ToneId;
  context: string;
}) {
  return `You are an elite business communication assistant.

Task:
Create three polished message variants for the user: Professional, Warm, and Firm.

Requirements:
- Scenario: ${scenarioDescriptions[scenario]}
- Tone preference: ${toneDescriptions[tone]}
- Use the user context below and infer missing details conservatively.
- Each variant should be 70-140 words unless the context clearly calls for shorter copy.
- Keep the content specific, credible, and business-ready.
- Avoid placeholders like [Name] unless the user explicitly used them.
- Do not use markdown in the message text.
- Return valid JSON only with this exact shape:
{
  "professional": "...",
  "warm": "...",
  "firm": "..."
}

User context:
${context.trim()}`;
}
