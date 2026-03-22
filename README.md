# ClearReply — Phase 1.5 polish + Phase 2 foundations

ClearReply is a production-leaning Next.js app for generating business-ready message variants across three styles: **Professional**, **Warm**, and **Firm**.

This pass upgrades the product from a plain MVP into a more premium SaaS landing experience while also laying practical groundwork for **usage limits, paid monthly caps, and later billing sync**.

## What changed

### Product / UX

- Sharper premium landing page copy and hierarchy
- Stronger trust signals and business-credible positioning
- Scenario highlight cards for high-stakes use cases
- Cleaner pricing section with explicit free vs paid plan framing
- Better CTA structure across hero, pricing, and end-of-page sections
- Generator header now shows remaining usage context

### Usage tracking foundation

- Added **anonymous/session-based usage tracking** model
- Added a `usage_sessions` table + SQL migration for Supabase
- Added an atomic `reserve_generation_usage(...)` Postgres function for server-side limit enforcement
- Added `/api/usage` for loading current usage state
- Updated `/api/generate` to reserve usage before generation
- Supports the default limit model:
  - **3 free generations / month**
  - **100 paid generations / month**
- Safe fallback when Supabase is not configured:
  - browser-local usage counting for local/dev testing
  - keeps the product usable without requiring auth on day one

## Included

- Next.js 14 + TypeScript + App Router
- Landing page with polished premium UI
- Scenario selector + tone selector + context textarea
- `/api/generate` route wired for OpenAI
- `/api/usage` route for usage state lookup
- Copy buttons for each generated variant
- Pricing/paywall section with infrastructure readiness status
- Ready-to-wire environment placeholders for Stripe, Supabase, and Google Analytics
- Supabase migration for usage ledger foundations

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file:

```bash
cp .env.example .env.local
```

3. Fill in at minimum:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_FREE_GENERATIONS=3
NEXT_PUBLIC_MONTHLY_MESSAGE_LIMIT=100
NEXT_PUBLIC_MONTHLY_PRICE_USD=9
```

4. Start the app:

```bash
npm run dev
```

5. Open `http://localhost:3000`

## Supabase setup for usage tracking

This project does **not** require full authentication yet.

Instead, it uses an anonymous/session-style identifier generated in the browser and sent to the API. When Supabase is configured, the server stores monthly usage against that session ID.

### 1) Add env vars

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2) Run the migration

Apply:

```text
supabase/migrations/20260321_usage_tracking.sql
```

This creates:

- `public.usage_sessions`
- `public.set_updated_at()` trigger helper
- `public.reserve_generation_usage(...)` RPC function

### 3) What the schema supports now

- session-based monthly usage for anonymous users
- `plan` column with `free` / `paid`
- monthly generation counts
- storage for future Stripe customer/subscription IDs
- metadata for future enrichment

## Stripe wiring still needed

The codebase now has the right shape for monthly caps, but it still needs the **real billing identifiers** before paid upgrades can work end-to-end.

Required env vars:

```env
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
```

### Production work still to do

- Create the real Stripe monthly product/price
- Set `STRIPE_PRICE_ID`
- Add checkout/session creation endpoint
- Add webhook handler that maps active subscriptions to `usage_sessions.plan = 'paid'`
- Decide whether upgrade state stays session-based, email-linked, or moves to full auth

## Safe-first behavior today

### With Supabase configured

- usage is checked server-side
- one generation is reserved atomically before calling OpenAI
- free users are capped at **3/month** by default
- paid users can be capped at **100/month** by default

### Without Supabase configured

- app still works for local/product iteration
- generator falls back to browser-local monthly counting
- this is intentionally a dev-friendly fallback, not final production enforcement

## Production check

Verified locally with:

```bash
npm run build
```

## Files added / updated in this phase

### Updated

- `app/page.tsx`
- `app/globals.css`
- `app/api/generate/route.ts`
- `components/message-generator.tsx`
- `components/paywall-card.tsx`
- `components/site-footer.tsx`
- `lib/constants.ts`
- `lib/env.ts`
- `lib/types.ts`
- `.env.example`
- `README.md`
- `package.json`
- `package-lock.json`

### Added

- `app/api/usage/route.ts`
- `lib/supabase.ts`
- `lib/usage.ts`
- `supabase/migrations/20260321_usage_tracking.sql`

## Remaining recommended next steps

1. Wire Stripe checkout + webhook sync
2. Decide how paid state should persist across devices
3. Add auth only if saved history / account recovery becomes important
4. Add analytics events around generator submit, limit hit, and upgrade intent
5. Optionally add rate limiting / abuse protection beyond monthly usage caps

## Notes

- Secrets are intentionally not stored in repo files.
- The pricing section is still a productized placeholder, not a live checkout.
- The usage ledger is designed to be extended rather than rewritten when billing goes live.
