'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@ecommerce/shared';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const primaryImage = product.images[0]?.url || '';
  const secondaryImage = product.images[1]?.url || primaryImage;
  const primaryVariant = product.variants[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!primaryVariant) return;

    const variantLabel = Object.entries(primaryVariant.optionValues)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');

    addItem({
      variantId: primaryVariant.id,
      quantity: 1,
      productName: product.name,
      variantLabel: variantLabel || 'Standard',
      sku: primaryVariant.sku,
      priceCents: primaryVariant.priceCents,
      imageUrl: primaryImage,
      stockQuantity: primaryVariant.stockQuantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#e2d7bb] transition-all duration-300 hover:shadow-xl hover:border-[#1a422f]/30"
    >
      {/* Product Image Stage */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-[#e2d7bb]/20"
      >
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Rating pill */}
        {product.avgRating > 0 && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#02110c]/85 backdrop-blur-md text-[#f3ebd6] px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-medium flex items-center gap-1 shadow-sm">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#c9a96e] text-[#c9a96e]" />
            <span>{product.avgRating.toFixed(1)}</span>
          </div>
        )}

        {/* Quick Add Button (Desktop overlay + Mobile touch icon) */}
        <div className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 sm:translate-y-2 sm:group-hover:translate-y-0">
          <button
            onClick={handleQuickAdd}
            disabled={primaryVariant?.stockQuantity === 0}
            className="w-full py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl bg-[#02110c]/90 hover:bg-[#1a422f] text-[#f3ebd6] text-[10px] sm:text-xs font-semibold backdrop-blur-md transition-colors flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {added ? (
              <>
                <Check className="w-3 h-3 text-[#c9a96e]" />
                <span className="hidden sm:inline">Added to Bag</span>
                <span className="sm:hidden">Added</span>
              </>
            ) : primaryVariant?.stockQuantity === 0 ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Quick Add</span>
                <span className="sm:hidden">+ Bag</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Info Details */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-1.5 sm:gap-2">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="font-serif text-xs sm:text-sm font-medium text-[#02110c] hover:text-[#1a422f] transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
          <p className="text-[10px] sm:text-[11px] text-[#4a5a50] line-clamp-1 mt-0.5 hidden sm:block">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[#e2d7bb]/50">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-xs sm:text-sm font-bold text-[#1a422f]">
              {formatPrice(product.basePriceCents)}
            </span>
            {primaryVariant?.compareAtPriceCents && (
              <span className="text-[10px] sm:text-xs text-[#4a5a50] line-through hidden xs:inline">
                {formatPrice(primaryVariant.compareAtPriceCents)}
              </span>
            )}
          </div>

          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#4a5a50] font-semibold">
            {product.variants.length} {product.variants.length === 1 ? 'Opt' : 'Opts'}
          </span>
        </div>
      </div>
    </div>
  );
}
