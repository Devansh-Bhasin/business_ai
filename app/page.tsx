import { MessageGenerator } from '@/components/message-generator';
import { PaywallCard } from '@/components/paywall-card';
import { SiteFooter } from '@/components/site-footer';
import { featureBullets } from '@/lib/constants';

export default function HomePage() {
  return (
    <main className="pageShell">
      <section className="heroSection">
        <div className="heroCopy">
          <p className="eyebrow">ClearReply</p>
          <h1>Write the business message you mean, without sounding messy, passive, or harsh.</h1>
          <p className="heroText">
            ClearReply helps founders, operators, freelancers, and client-facing teams turn awkward business moments into clean,
            credible messages they can actually send.
          </p>
          <div className="heroActions">
            <a className="primaryButton" href="#generator">
              Try the generator
            </a>
            <a className="secondaryButton" href="#pricing">
              View pricing
            </a>
          </div>
          <ul className="featureList">
            {featureBullets.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="heroCard panel">
          <p className="tinyLabel">Example use case</p>
          <h3>Overdue invoice, still want to keep the relationship warm.</h3>
          <p className="mutedText">
            Generate a professional reminder, a warmer relationship-first option, and a firmer escalation-ready note.
          </p>
          <div className="statGrid">
            <div>
              <strong>3</strong>
              <span>message variants</span>
            </div>
            <div>
              <strong>&lt;30s</strong>
              <span>from context to copy</span>
            </div>
            <div>
              <strong>MVP</strong>
              <span>designed to grow into billing and auth</span>
            </div>
          </div>
        </div>
      </section>

      <section className="contentSection" id="generator">
        <MessageGenerator />
      </section>

      <section className="contentSection pricingSection" id="pricing">
        <div className="pricingIntro">
          <p className="eyebrow">Monetization path</p>
          <h2>Built for a clean paywall later, not a rewrite later.</h2>
          <p className="mutedText">
            Stripe, Supabase, and Google Analytics hooks are intentionally left ready to wire when product decisions are final.
          </p>
        </div>
        <PaywallCard />
      </section>

      <SiteFooter />
    </main>
  );
}
