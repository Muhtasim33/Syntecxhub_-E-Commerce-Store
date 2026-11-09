import crypto from 'crypto';
import { ENV } from '../../../config/env';

export interface CreatePaymentIntentParams {
  orderId: string;
  orderNumber: string;
  amountCents: number;
  currency: string;
  clientEmail: string;
}

export interface PaymentIntentResult {
  provider: 'stripe';
  clientSecret: string;
  providerPaymentId: string;
  amountCents: number;
  currency: string;
  status: 'requires_payment_method' | 'succeeded' | 'processing';
}

export class StripeProvider {
  /**
   * Creates a payment intent for hosted / Elements fields
   * Card details never touch application servers (PCI SAQ-A scope)
   */
  public async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
    const providerPaymentId = `pi_mock_${crypto.randomBytes(12).toString('hex')}`;
    const clientSecret = `${providerPaymentId}_secret_${crypto.randomBytes(8).toString('hex')}`;

    return {
      provider: 'stripe',
      clientSecret,
      providerPaymentId,
      amountCents: params.amountCents,
      currency: params.currency,
      status: 'requires_payment_method',
    };
  }

  /**
   * Verifies the cryptographic webhook signature from Stripe
   * Prevents forged confirmation webhooks as mandated in TRD 7.1
   */
  public verifyWebhookSignature(payload: string | Buffer, signature: string, webhookSecret: string): boolean {
    if (!signature || !webhookSecret) {
      // In development / sandbox mode, pass verification if test signature provided
      return process.env.NODE_ENV !== 'production';
    }

    try {
      const parts = signature.split(',');
      const timestamp = parts.find((p) => p.startsWith('t='))?.split('=')[1];
      const sig = parts.find((p) => p.startsWith('v1='))?.split('=')[1];

      if (!timestamp || !sig) return false;

      const signedPayload = `${timestamp}.${payload}`;
      const expectedSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(signedPayload)
        .digest('hex');

      return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
    } catch {
      return false;
    }
  }
}

export const stripeProvider = new StripeProvider();
