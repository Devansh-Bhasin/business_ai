import { appEnv } from '@/lib/env';

export function PaywallCard() {
  return (
    <div className="panel paywallCard">
      <div>
        <p className="tinyLabel">Pricing placeholder</p>
        <h3>$9/month, with hard usage guardrails.</h3>
      </div>
      <p className="mutedText">
        The intended plan is cheap, self-serve, and capped so usage stays profitable. Start with a few free generations, then unlock a monthly allowance.
      </p>
      <div className="pricingRow">
        <div>
          <span className="price">${appEnv.paidMonthlyPrice}</span>
          <span className="mutedText">/month</span>
        </div>
        <button className="secondaryButton" type="button">
          Join waitlist
        </button>
      </div>
      <ul className="statusList">
        <li>{appEnv.freeGenerations} free generations before paywall</li>
        <li>{appEnv.paidMonthlyMessageLimit} paid generations per month target</li>
        <li>Target max model cost per user: ${appEnv.targetMaxCostPerUserUsd.toFixed(0)}</li>
        <li>Stripe configured: {appEnv.hasStripeKeys ? 'ready to connect' : 'pending env values'}</li>
        <li>Supabase configured: {appEnv.hasSupabase ? 'ready to connect' : 'pending env values'}</li>
        <li>Analytics: {appEnv.gaMeasurementId ? 'measurement ID present' : 'pending env value'}</li>
      </ul>
    </div>
  );
}
