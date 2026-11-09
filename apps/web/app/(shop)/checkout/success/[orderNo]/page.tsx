'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderSuccessPageProps {
  params: {
    orderNo: string;
  };
}

export default function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const [order, setOrder] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    // Retrieve from localStorage if present
    const mockOrders = JSON.parse(
      localStorage.getItem('ecommerce_mock_orders') || '[]'
    );
    const found = mockOrders.find((o: any) => o.orderNumber === params.orderNo);
    if (found) {
      setOrder(found);
      if (found.status === 'pending') {
        setIsConfirming(true);
        // Simulate webhook arriving within 3 seconds as required by APP_FLOW 7.1
        const timer = setTimeout(() => {
          found.status = 'paid';
          found.paymentStatus = 'paid';
          localStorage.setItem('ecommerce_mock_orders', JSON.stringify(mockOrders));
          setOrder({ ...found });
          setIsConfirming(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [params.orderNo]);

  return (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-4 sm:px-6 text-center">
      <div className="bg-white rounded-3xl border border-[#e2d7bb] p-8 sm:p-14 shadow-lg space-y-6">
        {/* Animated Check or Polling Spinner */}
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${
            isConfirming
              ? 'bg-amber-100 text-amber-700 animate-pulse'
              : 'bg-[#2f7d4f]/10 text-[#2f7d4f] animate-bounce'
          }`}
        >
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span
          className={`text-xs uppercase tracking-widest font-bold ${
            isConfirming ? 'text-amber-800' : 'text-[#1a422f]'
          }`}
        >
          {isConfirming
            ? 'Confirming Payment Handshake...'
            : 'Acquisition Confirmed'}
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#02110c]">
          {isConfirming
            ? 'Awaiting Bank Webhook Confirmation'
            : 'Thank you for your patronage'}
        </h1>

        <p className="text-xs sm:text-sm text-[#4a5a50] max-w-lg mx-auto leading-relaxed">
          {isConfirming ? (
            <span>
              Your card authorization is currently synchronizing with the secure banking network. This page will update automatically once verified (polling up to 60s).
            </span>
          ) : (
            <span>
              Your order{' '}
              <span className="font-mono font-bold text-[#02110c]">
                #{params.orderNo}
              </span>{' '}
              has been confirmed. A formal receipt and verification dossier have been dispatched to your email.
            </span>
          )}
        </p>

        {order && (
          <div className="bg-[#f3ebd6]/40 rounded-2xl border border-[#e2d7bb] p-6 text-left space-y-4 my-6">
            <div className="flex justify-between items-center border-b border-[#e2d7bb] pb-3 text-xs">
              <span className="font-bold text-[#1a422f] uppercase tracking-wider">
                Order Summary
              </span>
              <span className="font-bold text-[#02110c]">
                Total: {formatPrice(order.totalCents)}
              </span>
            </div>

            <div className="divide-y divide-[#e2d7bb]/60 space-y-2 text-xs">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="pt-2 flex justify-between">
                  <span>
                    {item.productName} ({item.variantLabel}) &times; {item.quantity}
                  </span>
                  <span className="font-semibold text-[#02110c]">
                    {formatPrice(item.lineTotalCents)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#e2d7bb] text-[11px] text-[#4a5a50] flex justify-between">
              <span>Delivery destination:</span>
              <span className="text-right">
                {order.shippingAddress?.line1}, {order.shippingAddress?.city}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href={`/account/orders/${params.orderNo}`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1a422f] hover:bg-[#25593f] text-[#f3ebd6] font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" /> Track Order Status
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-[#e2d7bb] text-xs font-semibold text-[#02110c] hover:bg-cream-100/60 transition-colors flex items-center justify-center gap-2"
          >
            Continue Browsing <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="pt-6 border-t border-[#e2d7bb] flex items-center justify-center gap-2 text-xs text-[#4a5a50]">
          <ShieldCheck className="w-4 h-4 text-[#1a422f]" />
          <span>Lifetime authenticity warrantee and bespoke concierge support active</span>
        </div>
      </div>
    </div>
  );
}
