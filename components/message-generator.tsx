"use client";

import { FormEvent, useMemo, useState } from 'react';
import { scenarios, tones } from '@/lib/constants';
import { ScenarioId, ToneId, VariantResult } from '@/lib/types';

const defaultContext = `Client owes two invoices from February. We want to stay polite but ask for payment by next Wednesday so the project can continue without delay.`;

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
  const [scenario, setScenario] = useState<ScenarioId>('late-payment');
  const [tone, setTone] = useState<ToneId>('balanced');
  const [context, setContext] = useState(defaultContext);
  const [results, setResults] = useState<VariantResult[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedScenario = useMemo(
    () => scenarios.find((item) => item.id === scenario),
    [scenario]
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    } catch (submissionError) {
      setResults([]);
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to generate messages right now.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generatorShell">
      <div className="generatorHeader">
        <div>
          <p className="eyebrow">ClearReply</p>
          <h2>Draft difficult business messages in a calmer voice.</h2>
        </div>
        <p className="mutedText">
          Choose a scenario, nudge the tone, add context, and get three ready-to-send options.
        </p>
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
            Context
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
            </div>
            <button className="primaryButton" disabled={loading || context.trim().length < 20} type="submit">
              {loading ? 'Generating…' : 'Generate messages'}
            </button>
          </div>

          {error ? <p className="errorText">{error}</p> : null}
        </div>

        <div className="resultsColumn">
          {results.length === 0 ? (
            <div className="panel emptyState">
              <p className="tinyLabel">Preview</p>
              <h3>Your generated variants will appear here.</h3>
              <p className="mutedText">
                The output is designed for email, chat, and customer communication workflows.
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
