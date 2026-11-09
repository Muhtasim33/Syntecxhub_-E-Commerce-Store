'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
  const {
    isDrawerOpen,
    closeDrawer,
    items,
    updateQuantity,
    removeItem,
    getSubtotalCents,
  } = useCartStore();

  if (!isDrawerOpen) return null;

  const subtotalCents = getSubtotalCents();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-[#02110c]/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel (Mobile full width, max-w-md on tablet+) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#f3ebd6] text-[#02110c] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#e2d7bb] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 sm:w-5 h-4 sm:h-5 text-[#1a422f]" />
              <h2 className="font-serif text-base sm:text-lg tracking-tight">Shopping Bag</h2>
              <span className="text-[11px] sm:text-xs bg-[#1a422f]/10 text-[#1a422f] px-2 py-0.5 rounded-full font-medium">
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 text-[#02110c]/70 hover:text-[#02110c] hover:bg-[#e2d7bb]/40 rounded-full transition-colors"
              aria-label="Close Shopping Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 divide-y divide-[#e2d7bb]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-[#1a422f]/30 mb-3" />
                <p className="font-serif text-lg text-[#02110c] mb-1">
                  Your bag is empty
                </p>
                <p className="text-xs text-[#4a5a50] max-w-xs mb-6">
                  Discover our timeless collections of fine jewelry and organic luxury garments.
                </p>
                <Button
                  onClick={closeDrawer}
                  variant="primary"
                  size="sm"
                  className="rounded-full"
                >
                  <Link href="/products">Explore Collections</Link>
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.variantId} className="py-4 flex gap-3 sm:gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-16 sm:w-20 h-20 sm:h-24 rounded-lg overflow-hidden bg-cream-300/40 flex-shrink-0 border border-[#e2d7bb]">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-[#02110c] truncate">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-[#4a5a50] hover:text-red-700 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] sm:text-xs text-[#4a5a50] mt-0.5 truncate">
                        {item.variantLabel}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1">
                      {/* Quantity Modifiers */}
                      <div className="flex items-center border border-[#e2d7bb] rounded-md bg-white">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1 hover:bg-[#e2d7bb]/30 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 text-[#02110c]" />
                        </button>
                        <span className="w-6 sm:w-7 text-center text-xs font-medium text-[#02110c]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-1 hover:bg-[#e2d7bb]/30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 text-[#02110c]" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-xs font-bold text-[#1a422f]">
                        {formatPrice(item.priceCents * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Actions */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-[#e2d7bb] bg-[#f3ebd6]/95 space-y-4">
              <div className="space-y-1 text-xs text-[#4a5a50]">
                <div className="flex justify-between text-sm font-semibold text-[#02110c]">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotalCents)}</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#4a5a50]/80">
                  Taxes and complimentary courier delivery calculated at checkout.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2.5 rounded-xl border border-[#1a422f] text-xs font-semibold text-[#1a422f] hover:bg-[#1a422f]/10 transition-colors text-center"
                >
                  View Bag
                </Link>

                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2.5 rounded-xl bg-[#1a422f] text-xs font-semibold text-[#f3ebd6] hover:bg-[#25593f] transition-colors text-center gap-1.5"
                >
                  Checkout <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
