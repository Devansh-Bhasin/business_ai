# ClearReply — Phase 3 Stripe foundations

ClearReply is a production-leaning Next.js app for generating business-ready message variants across three styles: **Professional**, **Warm**, and **Firm**.

This pass keeps the premium landing experience intact while extending the billing foundation from “pricing placeholder” to a practical **Stripe checkout + webhook scaffold** that can sync paid plan state into Supabase.

## What changed

### Product / UX

- Premium SaaS-style landing page and generator flow preserved
- Pricing card now has a real **Upgrade to paid** CTA
- CTA creates a Stripe Checkout Session and redirects the user to Stripe-hosted checkout
- Infra checklist still shows whether Stripe/Supabase env is fully wired

### Billing foundation

- Added `stripe` SDK dependency
- Added `POST /api/stripe/checkout`
  - creates a subscription-mode Checkout Session
  - uses `STRIPE_PRICE_ID`
  - passes the anonymous browser `sessionId` through Stripe metadata / `client_reference_id`
  - derives the app base URL from request headers when `NEXT_PUBLIC_APP_URL` is missing, so checkout URLs are less brittle across preview/dev/prod
- Added `POST /api/stripe/webhook`
  - verifies Stripe signatures with `STRIPE_WEBHOOK_SECRET`
  - handles `checkout.session.completed`
  - handles `customer.subscription.created|updated|deleted`
  - updates `usage_sessions.plan` in Supabase for the current billing period
- Added billing helper utilities for syncing Stripe customer/subscription state into Supabase

### Usage / data model status

The current model still treats identity as **anonymous session-first**.

That is good enough for a lean first paid version, but there is an important limitation:

- paid state is easiest to restore when the same browser session completes checkout
- cross-device or account recovery will eventually want a proper user/account table

The webhook code includes **clear TODO notes** where that future mapping should happen.

## Included

- Next.js 14 + TypeScript + App Router
- Premium landing page + polished generator UI
- `/api/generate` route wired for OpenAI
- `/api/usage` route for usage state lookup
- `/api/stripe/checkout` for Stripe Checkout Session creation
- `/api/stripe/webhook` scaffold for Stripe event handling and Supabase plan sync
- Supabase usage ledger foundations
- Session-based free/paid monthly cap model

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file:

```bash
cp .env.example .env.local
```

3. Fill in these env vars.

### Minimum app env

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_FREE_GENERATIONS=3
NEXT_PUBLIC_MONTHLY_MESSAGE_LIMIT=100
NEXT_PUBLIC_MONTHLY_PRICE_USD=9
TARGET_MAX_COST_PER_USER_USD=4
```

### Stripe env

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Supabase env

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Start the app:

```bash
npm run dev
```

5. Open `http://localhost:3000`

## Supabase setup for usage tracking

This project still does **not** require full authentication yet.

Instead, it uses an anonymous/session-style identifier generated in the browser and sent to the API. When Supabase is configured, the server stores monthly usage against that session ID.

### 1) Add env vars

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2) Run the migrations

Apply:

```text
supabase/migrations/20260321_usage_tracking.sql
supabase/migrations/20260321_commit_usage_after_success.sql
```

This creates:

- `public.usage_sessions`
- `public.set_updated_at()` trigger helper
- `public.reserve_generation_usage(...)` RPC function (legacy)
- `public.commit_generation_usage(...)` RPC function (current)

### 3) What the schema supports now

- session-based monthly usage for anonymous users
- `plan` column with `free` / `paid`
- monthly generation counts
- storage for Stripe customer/subscription IDs
- webhook-updated billing status
- metadata for later enrichment

## Stripe setup

### 1) Create the product and recurring price

In Stripe Dashboard:

- create a product for ClearReply paid access
- create a recurring monthly price
- copy its `price_...` ID into:

```env
STRIPE_PRICE_ID=price_...
```

### 2) Start local dev

```bash
npm run dev
```

### 3) Forward webhooks from Stripe CLI

Install/login to Stripe CLI, then run:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Stripe CLI will print a webhook secret that looks like:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

Copy that into `.env.local`, then restart the Next dev server.

### 4) Trigger test events locally

You can either complete a real test checkout from the pricing card or trigger webhook events manually.

Useful Stripe CLI examples:

```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
```

Note: the most meaningful end-to-end test is still:

1. click **Upgrade to paid** in the app
2. complete checkout with Stripe test mode
3. confirm the webhook reaches `/api/stripe/webhook`
4. verify the matching `usage_sessions` row in Supabase updates to `plan = 'paid'`

## Webhook behavior today

### `checkout.session.completed`

- reads `session_id` from Stripe metadata or `client_reference_id`
- stores `stripe_customer_id`
- stores `stripe_subscription_id`
- upserts the current month’s `usage_sessions` row as paid

### `customer.subscription.created|updated|deleted`

- reads `subscription.status`
- treats `active` and `trialing` as paid
- treats other statuses as free
- syncs by:
  - `subscription.metadata.session_id` when present, otherwise
  - current-period `stripe_subscription_id` or `stripe_customer_id`

## Important limitation / TODO

Because ClearReply is still **session-based**, Stripe plan restoration is not perfect yet.

If a user pays on one browser/session and later returns from a different browser or device, there is no first-class account record yet to restore that entitlement reliably.

That is why the webhook scaffold includes TODO notes pointing toward the next clean step:

- add a real user/account table
- map Stripe customer → user
- attach sessions to that user for reliable paid-state recovery

## Safe-first behavior today

### With Supabase configured

- usage is checked server-side before generation
- usage is only committed after a successful model response passes validation
- free users are capped at **3/month** by default
- paid users can be capped at **100/month** by default
- Stripe webhooks can mark the current session/month row as paid
- in a rare concurrent edge case, a second overlapping request can be rejected after generation rather than over-consuming quota

### Without Supabase configured

- app still works for local/product iteration
- generator falls back to browser-local monthly counting
- checkout route can still exist, but durable paid-state syncing will not happen
- this is intentionally dev-friendly, not final production enforcement

## Production check

Verified locally with:

```bash
npm run build
```

## Files changed in this phase

### Updated

- `app/api/generate/route.ts`
- `app/api/stripe/checkout/route.ts`
- `components/message-generator.tsx`
- `components/paywall-card.tsx`
- `lib/env.ts`
- `lib/usage.ts`
- `README.md`

### Added

- `supabase/migrations/20260321_commit_usage_after_success.sql`

## Manual follow-up still needed

1. Create the real Stripe product + monthly recurring price
2. Set these env vars in Vercel/local:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_ID`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` only if/when you add client-side Stripe Elements or other publishable-key flows
3. In Stripe Dashboard, add a webhook endpoint for production:
   - `https://YOUR_DOMAIN/api/stripe/webhook`
4. Apply the Supabase migrations if not already applied
5. Test one full upgrade flow in Stripe test mode and confirm Supabase plan sync

## Notes

- Secrets are intentionally not stored in repo files.
- The Stripe webhook handling is intentionally minimal, practical, and easy to extend.
- The current implementation updates the **current billing period usage row**; deeper entitlement history can come later if you need it.
