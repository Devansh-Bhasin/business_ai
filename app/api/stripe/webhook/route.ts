import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { syncSubscriptionPlanByStripeIdentity, upsertSubscriptionPlanForSession } from '@/lib/billing';
import { getStripeClient } from '@/lib/stripe';

function getSessionIdFromMetadata(metadata: Stripe.Metadata | null | undefined) {
  const sessionId = metadata?.session_id;
  return typeof sessionId === 'string' ? sessionId : '';
}

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook is not configured yet.' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature header.' }, { status: 400 });
  }

  try {
    const payload = await request.text();
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const sessionId =
          getSessionIdFromMetadata(checkoutSession.metadata) ||
          (typeof checkoutSession.client_reference_id === 'string' ? checkoutSession.client_reference_id : '');

        if (sessionId) {
          await upsertSubscriptionPlanForSession({
            sessionId,
            customerId: typeof checkoutSession.customer === 'string' ? checkoutSession.customer : null,
            subscriptionId: typeof checkoutSession.subscription === 'string' ? checkoutSession.subscription : null,
            billingStatus: 'active',
          });
        }

        // TODO: optionally store checkout email/customer details in a first-class users table
        // once ClearReply moves beyond session-only identity.
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const sessionId = getSessionIdFromMetadata(subscription.metadata);

        await syncSubscriptionPlanByStripeIdentity({
          customerId: typeof subscription.customer === 'string' ? subscription.customer : null,
          subscriptionId: subscription.id,
          billingStatus: subscription.status,
          sessionId,
        });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected Stripe webhook error.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
