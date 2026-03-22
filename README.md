# ClearReply — Phase 1 MVP

A production-leaning Next.js MVP for generating business-ready message variants across three styles: **Professional**, **Warm**, and **Firm**.

## Included

- Next.js 14 + TypeScript + App Router
- Landing page with polished, simple UI
- Scenario selector
- Tone selector
- Context textarea
- `/api/generate` route wired for OpenAI
- Copy buttons for each generated variant
- Basic pricing/paywall placeholder
- Ready-to-wire environment placeholders for Stripe, Supabase, and Google Analytics

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
```

4. Start the app:

```bash
npm run dev
```

5. Open `http://localhost:3000`

## Production check

Verified locally with:

```bash
npm run build
```

## Env vars prepared but not fully wired

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`

## Missing / should be confirmed

- Final OpenAI model choice and usage limits
- Correct Stripe price ID and webhook secret for the actual product plan
- Confirmed Supabase project URL format and whether auth/history should be added in Phase 2
- Final GA measurement ID
- Billing rules for free usage vs paywalled usage

## Notes

- The API route expects structured JSON from OpenAI and returns three message variants.
- Secrets are intentionally not stored in repo files.
- The pricing block is a placeholder UI, not an active checkout flow.
