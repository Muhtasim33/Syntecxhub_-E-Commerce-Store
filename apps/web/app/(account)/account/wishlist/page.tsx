'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/mockData';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';

export default function WishlistPage() {
  const addItem = useCartStore((state) => state.addItem);
  // Show 3 curated wishlist items
  const wishlistProducts = INITIAL_PRODUCTS.slice(0, 3);

  const handleQuickAdd = (product: any) => {
    const variant = product.variants[0];
    if (!variant) return;

    addItem({
      variantId: variant.id,
      quantity: 1,
      productName: product.name,
      variantLabel: 'Selected Variation',
      sku: variant.sku,
      priceCents: variant.priceCents,
      imageUrl: product.images[0]?.url || '',
      stockQuantity: variant.stockQuantity,
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#e2d7bb] pb-4">
        <h1 className="font-serif text-2xl text-[#02110c]">Private Wishlist</h1>
        <p className="text-xs text-[#4a5a50] mt-1">
          Masterpieces you have earmarked for future acquisition or special private commissions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-[#e2d7bb] bg-white overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-[4/5] bg-[#e2d7bb]/20">
              <img
                src={product.images[0]?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h4 className="font-serif text-xs font-semibold text-[#02110c] line-clamp-1">
                  {product.name}
                </h4>
                <p className="text-xs font-bold text-[#1a422f] mt-1">
                  {formatPrice(product.basePriceCents)}
                </p>
              </div>

              <div className="flex gap-2 pt-1 border-t border-[#e2d7bb]">
                <button
                  onClick={() => handleQuickAdd(product)}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#1a422f] hover:bg-[#25593f] text-[#f3ebd6] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
