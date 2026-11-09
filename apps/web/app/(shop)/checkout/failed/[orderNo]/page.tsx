'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  RotateCcw,
  ShoppingBag,
  HelpCircle,
  WifiOff,
  ShieldAlert,
  Banknote,
  CheckCircle2,
} from 'lucide-react';

interface PaymentFailedPageProps {
  params: {
    orderNo: string;
  };
}

export default function PaymentFailedPage({ params }: PaymentFailedPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const isNetworkTimeout = reason === 'network_timeout';

  const [convertedToCod, setConvertedToCod] = useState(false);

  const handleConvertToCod = () => {
    // Retrieve mock orders from local storage and update paymentMethod to COD
    const existingOrders = JSON.parse(
      localStorage.getItem('ecommerce_mock_orders') || '[]'
    );
    const updatedOrders = existingOrders.map((ord: any) => {
      if (ord.orderNumber === params.orderNo) {
        return {
          ...ord,
          status: 'processing',
          paymentStatus: 'unpaid',
          paymentMethod: 'cod',
        };
      }
      return ord;
    });

    localStorage.setItem(
      'ecommerce_mock_orders',
      JSON.stringify(updatedOrders)
    );
    setConvertedToCod(true);

    setTimeout(() => {
      router.push(`/checkout/success/${params.orderNo}`);
    }, 1200);
  };

  return (
    <div className="pt-32 pb-24 max-w-xl mx-auto px-4 text-center">
      <div className="bg-white rounded-3xl border border-[#e2d7bb] p-8 sm:p-12 shadow-sm space-y-6">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
            isNetworkTimeout
              ? 'bg-amber-100 text-amber-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {isNetworkTimeout ? (
            <WifiOff className="w-8 h-8" />
          ) : (
            <AlertCircle className="w-10 h-10" />
          )}
        </div>

        <span
          className={`text-xs uppercase tracking-widest font-bold block ${
            isNetworkTimeout ? 'text-amber-800' : 'text-red-800'
          }`}
        >
          {isNetworkTimeout
            ? 'Connection Interrupted'
            : 'Settlement Unsuccessful'}
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl text-[#02110c]">
          {isNetworkTimeout
            ? 'Network Drop During Handshake'
            : 'Payment Authorization Declined'}
        </h1>

        <div className="p-4 rounded-xl bg-[#f3ebd6]/60 border border-[#e2d7bb] text-left text-xs text-[#02110c] space-y-2">
          <div className="flex items-center gap-2 font-semibold text-[#1a422f]">
            <CheckCircle2 className="w-4 h-4 text-[#2f7d4f]" />
            <span>Zero Funds Deducted</span>
          </div>
          <p className="text-[11px] text-[#4a5a50] leading-relaxed">
            {isNetworkTimeout
              ? `The connection timed out before authorization could take place. No funds were debited from your card. Your vault items are safely reserved for 30 minutes under reference #${params.orderNo}.`
              : `The payment gateway was unable to settle allocation for reference #${params.orderNo}. No charges were finalized. Your reserved allocation remains held for 30 minutes.`}
          </p>
        </div>

        {isNetworkTimeout ? (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1.5">
            <p className="font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-700" /> Resolution Guidance:
            </p>
            <ul className="list-disc pl-5 text-[11px] text-amber-800 space-y-1">
              <li>Your bag and entered delivery address remain completely saved.</li>
              <li>You can retry the online gateway transaction immediately.</li>
              <li>Or switch to <strong>Cash on Delivery (COD)</strong> to eliminate network dependency.</li>
            </ul>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-left text-xs text-red-900 space-y-1">
            <p className="font-semibold">Possible causes:</p>
            <ul className="list-disc pl-5 text-[11px] text-red-800 space-y-0.5">
              <li>International bank 3D-Secure authentication failure</li>
              <li>Temporary insufficient credit line for luxury authorization</li>
              <li>Typographical mismatch in CVV or expiration date</li>
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/checkout"
            className="w-full sm:flex-1 px-6 py-3.5 rounded-xl bg-[#1a422f] hover:bg-[#25593f] text-[#f3ebd6] font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Retry Payment
          </Link>

          <button
            type="button"
            disabled={convertedToCod}
            onClick={handleConvertToCod}
            className="w-full sm:flex-1 px-6 py-3.5 rounded-xl bg-white border border-[#1a422f] text-xs font-semibold text-[#1a422f] hover:bg-[#1a422f]/5 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Banknote className="w-4 h-4" /> {convertedToCod ? 'Converting...' : 'Switch to COD'}
          </button>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-[#e2d7bb] text-xs">
          <Link
            href="/cart"
            className="text-[#4a5a50] hover:text-[#02110c] flex items-center gap-1.5 font-medium"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Return to Bag
          </Link>

          <Link
            href="/contact"
            className="text-[#1a422f] hover:underline flex items-center gap-1 font-semibold"
          >
            <HelpCircle className="w-3.5 h-3.5" /> 24/7 Concierge Support
          </Link>
        </div>
      </div>
    </div>
  );
}
