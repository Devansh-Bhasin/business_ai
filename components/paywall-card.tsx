import { UpgradeButton } from '@/components/upgrade-button';
import { appEnv } from '@/lib/env';

export function PaywallCard() {
  return (
    <div className="panel paywallCard">
      <div className="planHeader">
        <div>
          <p className="tinyLabel">Simple pricing</p>
          <h3>Start free, then upgrade when ClearReply becomes part of your weekly workflow.</h3>
        </div>
        <div className="planPill">Premium micro-SaaS model</div>
      </div>

      <p className="mutedText">
        The offer is intentionally straightforward: enough free usage to feel the value, then a clean monthly plan for people who want reliable access whenever a sensitive message needs to go out fast.
      </p>

      <div className="pricingGrid">
        <div className="pricingTier pricingTierAccent">
          <p className="tinyLabel">Free</p>
          <div className="priceLockup">
            <span className="price">$0</span>
            <span className="mutedText">to test the fit</span>
          </div>
          <ul className="statusList">
            <li>{appEnv.freeGenerations} generations per month</li>
            <li>Full three-variant drafting experience</li>
            <li>Best for first-use validation and light occasional needs</li>
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
            <li>Designed for recurring client, support, and ops communication</li>
            <li>Stripe checkout and webhook foundations already in place</li>
          </ul>
        </div>
      </div>

      <div className="wiringChecklist">
        <div>
          <p className="tinyLabel">Current build readiness</p>
          <ul className="statusList compactList">
            <li>Supabase: {appEnv.hasSupabase ? 'server-ready' : 'needs real URL, anon key, and service role key'}</li>
            <li>Stripe secret key: {appEnv.hasStripeSecretKey ? 'present' : 'needed for checkout + webhooks'}</li>
            <li>Stripe publishable key: {appEnv.hasStripePublishableKey ? 'present' : 'optional right now unless client-side Stripe UI is added later'}</li>
            <li>Stripe webhook: {appEnv.stripeWebhookConfigured ? 'present' : 'needs webhook secret for subscription sync'}</li>
            <li>Price ID: {appEnv.stripePriceId ? 'present' : 'needs monthly plan price ID'}</li>
          </ul>
        </div>

        <div className="upgradeButtonWrap">
          <UpgradeButton />
          <p className="mutedInline">Best for teams who send enough important messages that a single awkward draft already costs more than the subscription.</p>
        </div>
      </div>
    </div>
  );
}
