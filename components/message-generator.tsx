"use client";

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { scenarios, tones } from '@/lib/constants';
import { ScenarioId, ToneId, UsageSnapshot, VariantResult } from '@/lib/types';

const defaultContext = `Client owes two invoices from February. We want to stay polite but ask for payment by next Wednesday so the project can continue without delay.`;
const sessionStorageKey = 'clearreply.session_id';
const localUsageStorageKey = 'clearreply.local_usage';
const freeGenerations = Number.parseInt(process.env.NEXT_PUBLIC_FREE_GENERATIONS || '3', 10) || 3;

function getOrCreateSessionId() {
  if (typeof window === 'undefined') {
    return '';
  }

  const existing = window.localStorage.getItem(sessionStorageKey);
  if (existing) {
    return existing;
  }

  const next = crypto.randomUUID();
  window.localStorage.setItem(sessionStorageKey, next);
  return next;
}

function getCurrentPeriodKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function getLocalUsageSnapshot(sessionId: string): UsageSnapshot {
  const emptySnapshot: UsageSnapshot = {
    sessionId,
    plan: 'free',
    monthlyCount: 0,
    monthlyLimit: freeGenerations,
    remaining: freeGenerations,
    periodKey: getCurrentPeriodKey(),
    source: 'local-fallback',
  };

  if (typeof window === 'undefined') {
    return emptySnapshot;
  }

  try {
    const raw = window.localStorage.getItem(localUsageStorageKey);
    const parsed = raw ? JSON.parse(raw) : null;
    const periodKey = getCurrentPeriodKey();
    const monthlyCount = parsed?.periodKey === periodKey ? Number(parsed.monthlyCount || 0) : 0;

    return {
      ...emptySnapshot,
      monthlyCount,
      remaining: Math.max(freeGenerations - monthlyCount, 0),
      periodKey,
    };
  } catch {
    return emptySnapshot;
  }
}

function storeLocalUsage(monthlyCount: number) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    localUsageStorageKey,
    JSON.stringify({
      periodKey: getCurrentPeriodKey(),
      monthlyCount,
    })
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button className="copyButton" onClick={handleCopy} type="button">
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export function MessageGenerator() {
  const [sessionId, setSessionId] = useState('');
  const [scenario, setScenario] = useState<ScenarioId>('late-payment');
  const [tone, setTone] = useState<ToneId>('balanced');
  const [context, setContext] = useState(defaultContext);
  const [results, setResults] = useState<VariantResult[]>([]);
  const [usage, setUsage] = useState<UsageSnapshot | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedScenario = useMemo(() => scenarios.find((item) => item.id === scenario), [scenario]);

  useEffect(() => {
    const nextSessionId = getOrCreateSessionId();
    setSessionId(nextSessionId);

    const localSnapshot = getLocalUsageSnapshot(nextSessionId);
    setUsage(localSnapshot);

    fetch('/api/usage', {
      headers: {
        'x-session-id': nextSessionId,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Using local usage tracking until Supabase is configured.');
        }
        return response.json();
      })
      .then((data) => {
        if (data?.usage) {
          setUsage(data.usage);
        }
      })
      .catch(() => {
        setUsage(localSnapshot);
      });
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const localSnapshot = getLocalUsageSnapshot(sessionId);
    if (usage?.source === 'local-fallback' && localSnapshot.remaining <= 0) {
      setLoading(false);
      setError(`You’ve used all ${freeGenerations} free generations for this month on this browser. Connect Supabase + Stripe to enforce and upgrade usage server-side.`);
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({ scenario, tone, context }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong while generating messages.');
      }

      setResults([
        { label: 'Professional', message: data.professional },
        { label: 'Warm', message: data.warm },
        { label: 'Firm', message: data.firm },
      ]);

      if (data.usage) {
        setUsage(data.usage);
      } else {
        const nextCount = localSnapshot.monthlyCount + 1;
        storeLocalUsage(nextCount);
        setUsage({
          ...localSnapshot,
          monthlyCount: nextCount,
          remaining: Math.max(freeGenerations - nextCount, 0),
        });
      }
    } catch (submissionError) {
      setResults([]);
      setError(
        submissionError instanceof Error ? submissionError.message : 'Unable to generate messages right now.'
      );
    } finally {
      setLoading(false);
    }
  };

  const usageLabel = usage
    ? `${usage.remaining} of ${usage.monthlyLimit} ${usage.plan === 'paid' ? 'paid' : 'free'} generations left this month`
    : `${freeGenerations} free generations available`;

  return (
    <div className="generatorShell">
      <div className="generatorHeader">
        <div>
          <p className="eyebrow">ClearReply</p>
          <h2>Draft awkward business messages like a calm operator, not a stressed sender.</h2>
        </div>
        <div className="headerMeta">
          <p className="mutedText">
            Pick the scenario, set the tone, and get three polished options you can send with minimal editing.
          </p>
          <div className="usageBadge">
            <span>{usageLabel}</span>
            <small>{usage?.source === 'supabase' ? 'Server-tracked' : 'Local fallback until Supabase is connected'}</small>
          </div>
        </div>
      </div>

      <form className="generatorGrid" onSubmit={onSubmit}>
        <div className="panel formPanel">
          <label className="fieldLabel">Scenario</label>
          <div className="chipGrid">
            {scenarios.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`chip ${scenario === item.id ? 'chipActive' : ''}`}
                onClick={() => setScenario(item.id)}
              >
                <span>{item.label}</span>
                <small>{item.hint}</small>
              </button>
            ))}
          </div>

          <label className="fieldLabel">Tone preference</label>
          <div className="toneRow">
            {tones.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`toneCard ${tone === item.id ? 'toneActive' : ''}`}
                onClick={() => setTone(item.id)}
              >
                <span>{item.label}</span>
                <small>{item.hint}</small>
              </button>
            ))}
          </div>

          <label className="fieldLabel" htmlFor="context">
            Situation brief
          </label>
          <textarea
            id="context"
            className="contextArea"
            value={context}
            onChange={(event) => setContext(event.target.value)}
            placeholder="Paste the situation, include constraints, and mention the outcome you want."
            rows={8}
          />

          <div className="formFooter">
            <div>
              <p className="tinyLabel">Current scenario</p>
              <strong>{selectedScenario?.label}</strong>
              <p className="mutedInline">Best for messages where tone matters as much as the ask.</p>
            </div>
            <button className="primaryButton" disabled={loading || context.trim().length < 20} type="submit">
              {loading ? 'Generating…' : 'Generate 3 variants'}
            </button>
          </div>

          {error ? <p className="errorText">{error}</p> : null}
        </div>

        <div className="resultsColumn">
          {results.length === 0 ? (
            <div className="panel emptyState">
              <p className="tinyLabel">Preview</p>
              <h3>Your message set will appear here.</h3>
              <p className="mutedText">
                Expect three angles: one polished and neutral, one warmer and relationship-first, and one firmer for boundary-setting.
              </p>
            </div>
          ) : null}

          {results.map((result) => (
            <article className="panel resultCard" key={result.label}>
              <div className="resultHeader">
                <div>
                  <p className="tinyLabel">Variant</p>
                  <h3>{result.label}</h3>
                </div>
                <CopyButton value={result.message} />
              </div>
              <p className="resultMessage">{result.message}</p>
            </article>
          ))}
        </div>
      </form>
    </div>
  );
}
