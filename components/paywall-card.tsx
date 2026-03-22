import { appEnv } from '@/lib/env';

export function PaywallCard() {
  return (
    <div className="panel paywallCard">
      <div className="planHeader">
        <div>
          <p className="tinyLabel">Simple pricing</p>
          <h3>One low-friction plan for teams who send high-stakes messages often.</h3>
        </div>
        <div className="planPill">Phase 2 scaffolded</div>
      </div>

      <p className="mutedText">
        The monetization path stays intentionally lean: a credible free trial, a hard monthly cap, and room to add Stripe checkout and webhooks without rebuilding the product model.
      </p>

      <div className="pricingGrid">
        <div className="pricingTier pricingTierAccent">
          <p className="tinyLabel">Free</p>
          <div className="priceLockup">
            <span className="price">$0</span>
            <span className="mutedText">to validate value</span>
          </div>
          <ul className="statusList">
            <li>{appEnv.freeGenerations} generations per month</li>
            <li>Anonymous/session-based usage support</li>
            <li>Ideal for first-use conversion and onboarding</li>
          </ul>
        </div>

        <div className="pricingTier">
          <p className="tinyLabel">Paid</p>
          <div className="priceLockup">
            <span className="price">${appEnv.paidMonthlyPrice}</span>
            <span className="mutedText">/month</span>
          </div>
          <ul className="statusList">
            <li>{appEnv.paidMonthlyMessageLimit} generations per month target</li>
            <li>Structure ready for Stripe price + webhook mapping</li>
            <li>Target max model cost per user: ${appEnv.targetMaxCostPerUserUsd.toFixed(0)}</li>
          </ul>
        </div>
      </div>

      <div className="wiringChecklist">
        <div>
          <p className="tinyLabel">Infra status</p>
          <ul className="statusList compactList">
            <li>Supabase: {appEnv.hasSupabase ? 'server-ready' : 'needs real URL, anon key, and service role key'}</li>
            <li>Stripe API keys: {appEnv.hasStripeKeys ? 'present' : 'needs live/test secret + publishable keys'}</li>
            <li>Stripe webhook: {appEnv.stripeWebhookConfigured ? 'present' : 'needs webhook secret for subscription sync'}</li>
            <li>Price ID: {appEnv.stripePriceId ? 'present' : 'needs monthly plan price ID'}</li>
          </ul>
        </div>

        <button className="secondaryButton" type="button">
          Join waitlist
        </button>
      </div>
    </div>
  );
}
