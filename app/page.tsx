import { MessageGenerator } from '@/components/message-generator';
import { PaywallCard } from '@/components/paywall-card';
import { SiteFooter } from '@/components/site-footer';
import { featureBullets, scenarioHighlights, trustSignals } from '@/lib/constants';

export default function HomePage() {
  return (
    <main className="pageShell">
      <section className="heroSection">
        <div className="heroCopy">
          <p className="eyebrow">ClearReply</p>
          <h1>Business messages that sound clear, composed, and worth taking seriously.</h1>
          <p className="heroText">
            ClearReply helps founders, operators, agencies, and support teams turn awkward asks into polished messages that move work forward.
          </p>

          <div className="heroActions">
            <a className="primaryButton" href="#generator">
              Try the generator
            </a>
            <a className="secondaryButton" href="#pricing">
              See pricing
            </a>
          </div>

          <ul className="featureList featureListInline">
            {featureBullets.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>

          <div className="trustBar panel">
            {trustSignals.map((signal) => (
              <div key={signal}>
                <p className="tinyLabel">Why it lands</p>
                <strong>{signal}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="heroStack">
          <div className="heroCard panel">
            <p className="tinyLabel">Before / after</p>
            <h3>Overdue invoice, but you still want the relationship warm.</h3>
            <p className="mutedText">
              Go from a stressed follow-up to three polished options: neutral and professional, warmer and relationship-first, or firm enough to protect scope and timelines.
            </p>
            <div className="statGrid">
              <div>
                <strong>3</strong>
                <span>message variants per request</span>
              </div>
              <div>
                <strong>&lt;30s</strong>
                <span>from brief to usable draft</span>
              </div>
              <div>
                <strong>100</strong>
                <span>paid monthly cap foundation ready</span>
              </div>
            </div>
          </div>

          <div className="panel microProofCard">
            <p className="tinyLabel">Built for believable SaaS economics</p>
            <p className="mutedText">
              Free usage is constrained by design, paid usage is capped for margin safety, and the product structure leaves room for Stripe, analytics, and account history without a rewrite.
            </p>
          </div>
        </div>
      </section>

      <section className="scenarioSection contentSection">
        <div className="sectionIntro">
          <p className="eyebrow">Where it helps</p>
          <h2>The moments where tone can quietly cost you money, trust, or momentum.</h2>
        </div>
        <div className="scenarioCardGrid">
          {scenarioHighlights.map((item) => (
            <article className="panel scenarioCard" key={item.title}>
              <p className="tinyLabel">Use case</p>
              <h3>{item.title}</h3>
              <p className="mutedText">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contentSection" id="generator">
        <MessageGenerator />
      </section>

      <section className="contentSection pricingSection" id="pricing">
        <div className="pricingIntro">
          <p className="eyebrow">Pricing</p>
          <h2>Simple enough to buy quickly. Constrained enough to stay profitable.</h2>
          <p className="mutedText">
            The foundation now supports anonymous free usage, monthly usage ceilings, and a clean upgrade path once the real Supabase project and Stripe subscription details are wired.
          </p>
        </div>
        <PaywallCard />
      </section>

      <section className="contentSection ctaSection">
        <div className="panel ctaPanel">
          <div>
            <p className="eyebrow">Phase 2 direction</p>
            <h2>Ready for checkout, webhook syncing, and account-aware usage when you are.</h2>
          </div>
          <div className="ctaActions">
            <a className="primaryButton" href="#generator">
              Generate a message
            </a>
            <a className="secondaryButton" href="#pricing">
              Review monetization setup
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
