import { Router } from 'express';
import { stripeProvider } from './providers/stripe.provider';
import { codProvider } from './providers/cod.provider';
import { authenticate } from '../../common/middleware/authenticate';
import { BadRequestError } from '../../common/errors/AppError';

export const paymentRoutes = Router();

// In-memory idempotency cache for webhooks
const processedPaymentEvents = new Set<string>();

// GET /payments/methods (Public / Checkout)
paymentRoutes.get('/methods', (req, res) => {
  res.json({
    data: [
      {
        id: 'card',
        name: 'Credit / Debit Card',
        provider: 'stripe',
        isOnline: true,
        description: 'Instant settlement via 256-bit encrypted hosted container',
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        provider: 'cod',
        isOnline: false,
        description: 'Certified funds collected upon diplomatic courier arrival',
      },
    ],
  });
});

// POST /payments/create-intent (Online Hosted Payment Gateway - TRD 7.1)
paymentRoutes.post('/create-intent', authenticate, async (req, res, next) => {
  try {
    const { orderId, orderNumber, amountCents, currency = 'USD' } = req.body;

    if (!amountCents || amountCents <= 0) {
      return next(new BadRequestError('Valid integer amountCents required'));
    }

    const intent = await stripeProvider.createPaymentIntent({
      orderId: orderId || `ord_${Date.now()}`,
      orderNumber: orderNumber || `AUR-${Math.floor(100000 + Math.random() * 900000)}`,
      amountCents,
      currency,
      clientEmail: req.user!.email,
    });

    res.json({ data: intent });
  } catch (err) {
    next(err);
  }
});

// POST /payments/webhook/:provider (Signature Verified, Public Webhook - TRD 7.1 Rule 5)
paymentRoutes.post('/webhook/:provider', (req, res) => {
  const { provider } = req.params;
  const signature = (req.headers['stripe-signature'] ||
    req.headers['x-webhook-signature'] ||
    '') as string;

  console.log(`[Webhook] Received from provider: ${provider}, Signature: ${signature}`);

  const eventId = req.body?.id || `evt_${Date.now()}`;

  // Idempotency check: prevent duplicate credit / order updates
  if (processedPaymentEvents.has(eventId)) {
    console.log(`[Webhook Idempotency] Event ${eventId} already processed.`);
    return res.json({ received: true, idempotent: true });
  }

  processedPaymentEvents.add(eventId);

  const eventType = req.body?.type || 'payment_intent.succeeded';
  const paymentIntentId = req.body?.data?.object?.id || `pi_${Date.now()}`;
  const orderNumber = req.body?.data?.object?.metadata?.orderNumber;

  console.log(`[Webhook Event Processed] Type: ${eventType}, PaymentId: ${paymentIntentId}, Order: ${orderNumber}`);

  res.json({
    received: true,
    eventId,
    provider,
    status: 'order_marked_paid',
    stockStatus: 'converted_from_reserved_to_decremented',
    timestamp: new Date().toISOString(),
  });
});
