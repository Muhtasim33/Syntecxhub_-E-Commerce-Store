'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { formatPrice } from '@/lib/utils';
import { BUSINESS_RULES } from '@ecommerce/shared';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotalCents } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const subtotalCents = getSubtotalCents();

  // Shipping calculation
  const shippingCents =
    subtotalCents >= BUSINESS_RULES.FREE_SHIPPING_THRESHOLD_CENTS || subtotalCents === 0
      ? 0
      : BUSINESS_RULES.STANDARD_SHIPPING_CENTS;

  // Tax calculation
  const taxCents = Math.round((subtotalCents - appliedDiscount) * BUSINESS_RULES.TAX_RATE);
  const totalCents = Math.max(0, subtotalCents - appliedDiscount + shippingCents + taxCents);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'AURELIA10') {
      const discount = Math.round(subtotalCents * 0.1);
      setAppliedDiscount(discount);
      setCouponMsg({ text: 'Private Gazette VIP code applied: 10% privilege discount!' });
    } else {
      setCouponMsg({ text: 'Invalid or expired promotional code.', error: true });
    }
  };

  return (
    <div className="pt-24 sm:pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="border-b border-[#e2d7bb] pb-5 sm:pb-6 mb-8 sm:mb-10">
        <h1 className="font-serif text-2xl sm:text-4xl text-[#02110c]">
          Your Shopping Bag
        </h1>
        <p className="text-xs text-[#4a5a50] mt-1">
          Review your chosen creations before proceeding to private checkout
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-20 sm:py-24 text-center bg-white/50 rounded-3xl border border-[#e2d7bb] p-6 sm:p-8 max-w-lg mx-auto">
          <ShoppingBag className="w-14 sm:w-16 h-14 sm:h-16 text-[#1a422f]/30 mx-auto mb-4" />
          <h2 className="font-serif text-xl sm:text-2xl text-[#02110c] mb-2">
            Your bag is currently empty
          </h2>
          <p className="text-xs text-[#4a5a50] mb-6 sm:mb-8 leading-relaxed">
            We invite you to explore our limited allocations of ethically crafted emerald jewelry and botanical luxury apparel.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-[#1a422f] text-[#f3ebd6] font-semibold text-xs hover:bg-[#25593f] transition-colors"
          >
            Explore Creations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Items Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#e2d7bb] overflow-hidden shadow-sm">
              <div className="px-5 sm:px-6 py-4 bg-[#f3ebd6]/60 border-b border-[#e2d7bb] flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-[#02110c]">
                <span>Creations ({items.length})</span>
                <button
                  onClick={clearCart}
                  className="text-xs text-[#4a5a50] hover:text-red-700 font-normal hover:underline"
                >
                  Clear Bag
                </button>
              </div>

              <div className="divide-y divide-[#e2d7bb] px-4 sm:px-6">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="py-5 sm:py-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between"
                  >
                    <div className="flex gap-3.5 sm:gap-4 items-center w-full sm:w-auto">
                      <div className="relative w-16 sm:w-20 h-20 sm:h-24 rounded-xl overflow-hidden bg-cream-300/30 border border-[#e2d7bb] flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                        <h3 className="font-serif text-xs sm:text-sm font-semibold text-[#02110c] truncate">
                          {item.productName}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-[#4a5a50] truncate">{item.variantLabel}</p>
                        <p className="text-[10px] sm:text-xs text-[#4a5a50]">SKU: {item.sku}</p>
                        <p className="text-xs font-bold text-[#1a422f] sm:hidden">
                          {formatPrice(item.priceCents * item.quantity)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity modifier and Line Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#e2d7bb]/40">
                      <div className="flex items-center border border-[#e2d7bb] rounded-lg bg-white p-0.5 sm:p-1">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-6 sm:w-7 h-6 sm:h-7 flex items-center justify-center text-[#02110c] hover:bg-[#e2d7bb]/30 rounded transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                        <span className="w-7 sm:w-8 text-center text-xs font-semibold text-[#02110c]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-6 sm:w-7 h-6 sm:h-7 flex items-center justify-center text-[#02110c] hover:bg-[#e2d7bb]/30 rounded transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>

                      <span className="hidden sm:inline text-sm font-bold text-[#1a422f] min-w-[70px] text-right">
                        {formatPrice(item.priceCents * item.quantity)}
                      </span>

                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-[#4a5a50] hover:text-red-700 transition-colors p-1.5"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back to shopping */}
            <div className="pt-2">
              <Link
                href="/products"
                className="text-xs font-semibold text-[#1a422f] hover:underline"
              >
                &larr; Continue Exploring Collections
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#e2d7bb] p-5 sm:p-6 space-y-5 sm:space-y-6 shadow-sm">
              <h2 className="font-serif text-lg text-[#02110c] border-b border-[#e2d7bb] pb-3 sm:pb-4">
                Summary of Investment
              </h2>

              {/* Subtotal, Shipping, Tax, Total */}
              <div className="space-y-3 text-xs text-[#4a5a50]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-[#02110c]">
                    {formatPrice(subtotalCents)}
                  </span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-[#2f7d4f]">
                    <span>VIP Privilege Discount</span>
                    <span>-{formatPrice(appliedDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insured Courier Delivery</span>
                  <span>
                    {shippingCents === 0 ? (
                      <span className="text-[#2f7d4f] font-semibold">Complimentary</span>
                    ) : (
                      formatPrice(shippingCents)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Sales Tax (8%)</span>
                  <span>{formatPrice(taxCents)}</span>
                </div>

                <div className="border-t border-[#e2d7bb] pt-4 flex justify-between items-baseline text-sm font-bold text-[#02110c]">
                  <span>Total</span>
                  <span className="text-xl text-[#1a422f]">
                    {formatPrice(totalCents)}
                  </span>
                </div>
              </div>

              {/* Promo code input */}
              <form onSubmit={handleApplyCoupon} className="space-y-2 pt-1">
                <label className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-[#02110c]">
                  Privilege / Concierge Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="e.g. AURELIA10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#e2d7bb] bg-white focus:outline-none focus:ring-1 focus:ring-[#1a422f] uppercase"
                    />
                    <Tag className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4a5a50]" />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 sm:px-4 py-2 bg-[#f3ebd6] border border-[#e2d7bb] text-xs font-semibold text-[#02110c] hover:bg-[#e2d7bb]/50 rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && (
                  <p
                    className={`text-[11px] ${
                      couponMsg.error ? 'text-red-600' : 'text-[#2f7d4f]'
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </form>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full py-3.5 sm:py-4 rounded-xl bg-[#1a422f] hover:bg-[#25593f] text-[#f3ebd6] font-semibold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-98 text-center"
              >
                Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Reassurance */}
            <div className="p-4 rounded-xl bg-white/40 border border-[#e2d7bb] text-xs text-[#4a5a50] space-y-2">
              <div className="flex items-center gap-2 text-[#02110c] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#1a422f]" />
                <span>Bank-Grade 256-Bit SSL Encryption</span>
              </div>
              <p className="text-[11px]">
                Your transactions and personal details are handled with sovereign data protection standards.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
