import { MessageGenerator } from '@/components/message-generator';
import { PaywallCard } from '@/components/paywall-card';
import { SiteFooter } from '@/components/site-footer';
import {
  audienceCards,
  featureBullets,
  scenarioHighlights,
  testimonialCards,
  trustSignals,
  valueProps,
  workflowSteps,
} from '@/lib/constants';

export default function HomePage() {
  return (
    <main className="pageShell">
      <section className="heroSection">
        <div className="heroCopy">
          <p className="eyebrow">ClearReply</p>
          <h1>Write the message you actually mean — clear, polished, and commercially smart.</h1>
          <p className="heroText">
            ClearReply helps busy teams turn awkward business situations into confident messages that protect trust, speed up replies, and move work forward.
          </p>

          <div className="heroActions">
            <a className="primaryButton" href="#generator">
              Try ClearReply free
            </a>
            <a className="secondaryButton" href="#pricing">
              View pricing
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
                <p className="tinyLabel">Why it converts</p>
                <strong>{signal}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="heroStack">
          <div className="heroCard panel">
            <p className="tinyLabel">Before / after</p>
            <h3>When the draft in your head feels either too soft, too blunt, or just not good enough.</h3>
            <p className="mutedText">
              Go from stressed, second-guessed wording to three polished options you can actually send: neutral and professional, warm and relationship-first, or firm enough to protect scope, timelines, and payment.
            </p>
            <div className="statGrid">
              <div>
                <strong>3</strong>
                <span>message variants per request</span>
              </div>
              <div>
                <strong>&lt;30s</strong>
                <span>from rough brief to usable draft</span>
              </div>
              <div>
                <strong>100</strong>
                <span>monthly paid cap target</span>
              </div>
            </div>
          </div>

          <div className="panel microProofCard">
            <p className="tinyLabel">Positioning note</p>
            <p className="mutedText">
              ClearReply is shaped like a premium micro-SaaS: instant utility on first use, strong free-to-paid logic, and a focused problem people already feel every week.
            </p>
          </div>
        </div>
      </section>

      <section className="contentSection valueSection">
        <div className="sectionIntro">
          <p className="eyebrow">Why people pay for this</p>
          <h2>Because tone is not a cosmetic detail when money, timelines, and relationships are on the line.</h2>
        </div>
        <div className="infoCardGrid valueGrid">
          {valueProps.map((item) => (
            <article className="panel infoCard" key={item.title}>
              <p className="tinyLabel">Value prop</p>
              <h3>{item.title}</h3>
              <p className="mutedText">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="scenarioSection contentSection">
        <div className="sectionIntro">
          <p className="eyebrow">Where it helps</p>
          <h2>The moments where a poorly written message quietly costs you money, trust, or momentum.</h2>
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

      <section className="contentSection audienceSection">
        <div className="sectionIntro">
          <p className="eyebrow">Who it’s for</p>
          <h2>Made for people who send important messages without wanting to sound messy, vague, or robotic.</h2>
        </div>
        <div className="infoCardGrid audienceGrid">
          {audienceCards.map((item) => (
            <article className="panel infoCard" key={item.title}>
              <p className="tinyLabel">Best fit</p>
              <h3>{item.title}</h3>
              <p className="mutedText">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contentSection howItWorksSection">
        <div className="sectionIntro">
          <p className="eyebrow">How it works</p>
          <h2>Fast enough for daily use. Sharp enough to feel like a real advantage.</h2>
        </div>
        <div className="infoCardGrid workflowGrid">
          {workflowSteps.map((item) => (
            <article className="panel infoCard workflowCard" key={item.step}>
              <p className="stepLabel">{item.step}</p>
              <h3>{item.title}</h3>
              <p className="mutedText">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contentSection" id="generator">
        <MessageGenerator />
      </section>

      <section className="contentSection socialProofSection">
        <div className="sectionIntro">
          <p className="eyebrow">Social proof block</p>
          <h2>Tasteful placeholder proof, so the page feels sellable now without pretending traction you do not have yet.</h2>
          <p className="mutedText">
            These are positioning-style proof cards meant to show the kind of feedback this product is built to earn. Swap in real names, logos, and outcomes once customer quotes exist.
          </p>
        </div>
        <div className="infoCardGrid testimonialGrid">
          {testimonialCards.map((item) => (
            <article className="panel testimonialCard" key={item.quote}>
              <p className="testimonialQuote">“{item.quote}”</p>
              <p className="tinyLabel">{item.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contentSection pricingSection" id="pricing">
        <div className="pricingIntro">
          <p className="eyebrow">Pricing</p>
          <h2>Easy to try in minutes. Easy to justify once it saves a few awkward threads every month.</h2>
          <p className="mutedText">
            The free tier proves the value fast. The paid tier is positioned for people who want ClearReply in their weekly workflow — not as another bloated writing suite, but as a focused tool worth keeping open.
          </p>
        </div>
        <PaywallCard />
      </section>

      <section className="contentSection ctaSection">
        <div className="panel ctaPanel">
          <div>
            <p className="eyebrow">Final CTA</p>
            <h2>Stop overthinking high-stakes messages. Draft one you can send in the next minute.</h2>
            <p className="mutedText">
              If the product helps once on a tense client email, a payment follow-up, or a delicate support reply, it already makes sense.
            </p>
          </div>
          <div className="ctaActions">
            <a className="primaryButton" href="#generator">
              Generate my message
            </a>
            <a className="secondaryButton" href="#pricing">
              See the paid plan
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
