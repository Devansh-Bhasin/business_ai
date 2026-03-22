import { NextResponse } from 'next/server';
import { appEnv, resolveAppUrl } from '@/lib/env';
import { getStripeClient } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const stripe = getStripeClient();

    if (!stripe) {
      return NextResponse.json({ error: 'Stripe is not configured yet.' }, { status: 500 });
    }

    if (!appEnv.stripePriceId) {
      return NextResponse.json({ error: 'Missing STRIPE_PRICE_ID.' }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const sessionId = String(body?.sessionId || request.headers.get('x-session-id') || '').trim();

    if (!sessionId || sessionId.length < 12) {
      return NextResponse.json({ error: 'Missing session identifier.' }, { status: 400 });
    }

    const appUrl = resolveAppUrl(request);

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: appEnv.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/?checkout=success#pricing`,
      cancel_url: `${appUrl}/?checkout=cancelled#pricing`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      subscription_data: {
        metadata: {
          session_id: sessionId,
          product_area: 'clearreply',
        },
      },
      metadata: {
        session_id: sessionId,
        product_area: 'clearreply',
      },
      client_reference_id: sessionId,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected Stripe checkout error.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
