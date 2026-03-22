"use client";

import { useState } from 'react';

const sessionStorageKey = 'clearreply.session_id';

function getSessionId() {
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

export function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: getSessionId() }),
      });

      const data = await response.json();

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || 'Unable to start checkout right now.');
      }

      window.location.href = data.url;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Unable to start checkout right now.');
      setLoading(false);
    }
  };

  return (
    <div className="upgradeButtonWrap">
      <button className="secondaryButton" disabled={loading} onClick={handleCheckout} type="button">
        {loading ? 'Redirecting…' : 'Upgrade to paid'}
      </button>
      {error ? <p className="errorText">{error}</p> : null}
    </div>
  );
}
