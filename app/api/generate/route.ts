import { NextResponse } from 'next/server';
import { buildPrompt } from '@/lib/prompt';
import { assertServerEnv, appEnv } from '@/lib/env';
import { getOpenAIClient } from '@/lib/openai';
import { ScenarioId, ToneId } from '@/lib/types';

function isValidScenario(value: string): value is ScenarioId {
  return [
    'late-payment',
    'reschedule-meeting',
    'decline-request',
    'follow-up',
    'customer-support',
    'partnership-outreach',
  ].includes(value);
}

function isValidTone(value: string): value is ToneId {
  return ['balanced', 'empathetic', 'direct'].includes(value);
}

export async function POST(request: Request) {
  try {
    assertServerEnv();

    const body = await request.json();
    const scenario = String(body.scenario || '');
    const tone = String(body.tone || '');
    const context = String(body.context || '').trim();

    if (!isValidScenario(scenario) || !isValidTone(tone) || context.length < 20 || context.length > 1200) {
      return NextResponse.json(
        { error: 'Please provide a valid scenario, tone, and 20-1200 characters of context.' },
        { status: 400 }
      );
    }

    const completion = await getOpenAIClient().chat.completions.create({
      model: appEnv.openAiModel,
      temperature: 0.65,
      max_tokens: 600,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You write polished business messages and return only valid JSON. Keep each message concise, high-quality, and immediately usable.',
        },
        {
          role: 'user',
          content: buildPrompt({ scenario, tone, context }),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('OpenAI returned an empty response.');
    }

    const parsed = JSON.parse(content) as {
      professional?: string;
      warm?: string;
      firm?: string;
    };

    if (!parsed.professional || !parsed.warm || !parsed.firm) {
      throw new Error('OpenAI response did not include all required variants.');
    }

    return NextResponse.json({
      professional: parsed.professional,
      warm: parsed.warm,
      firm: parsed.firm,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
