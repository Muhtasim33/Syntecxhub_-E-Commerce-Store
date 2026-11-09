'use client';

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/mockData';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { ProductCard } from '@/components/product/ProductCard';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = INITIAL_PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const category = INITIAL_CATEGORIES.find((c) => c.id === product.categoryId);

  // States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];

  const currentPrice = selectedVariant?.priceCents || product.basePriceCents;
  const comparePrice = selectedVariant?.compareAtPriceCents;
  const inStock = (selectedVariant?.stockQuantity || 0) > 0;
  const isLowStock =
    inStock &&
    (selectedVariant?.stockQuantity || 0) <= (selectedVariant?.lowStockThreshold || 3);

  const handleAddToCart = () => {
    if (!selectedVariant || !inStock) return;

    const variantLabel = Object.entries(selectedVariant.optionValues)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');

    addItem({
      variantId: selectedVariant.id,
      quantity,
      productName: product.name,
      variantLabel: variantLabel || 'Standard',
      sku: selectedVariant.sku,
      priceCents: selectedVariant.priceCents,
      imageUrl: product.images[0]?.url || '',
      stockQuantity: selectedVariant.stockQuantity,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const relatedProducts = INITIAL_PRODUCTS.filter(
    (p) => p.id !== product.id && p.categoryId === product.categoryId
  ).slice(0, 4);

  return (
    <div className="pt-24 sm:pt-28 pb-32 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-[#4a5a50] mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-[#02110c] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#e2d7bb] flex-shrink-0" />
        {category && (
          <>
            <Link
              href={`/categories/${category.slug}`}
              className="hover:text-[#02110c] transition-colors"
            >
              {category.name}
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#e2d7bb] flex-shrink-0" />
          </>
        )}
        <span className="text-[#02110c] font-semibold truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Left: Product Images Gallery */}
        <div className="space-y-3 sm:space-y-4">
          <div className="relative aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-[#e2d7bb] shadow-sm">
            <img
              src={product.images[activeImageIndex]?.url || product.images[0]?.url}
              alt={product.images[activeImageIndex]?.alt || product.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
            {comparePrice && (
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#1a422f] text-[#f3ebd6] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Special Edition
              </span>
            )}
          </div>

          {/* Thumbnails (Touch scrollable) */}
          {product.images.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 sm:w-20 h-20 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-[#1a422f] ring-2 ring-[#1a422f]/20'
                      : 'border-[#e2d7bb] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Sticky Product Info & Buying Panel */}
        <div className="space-y-6 lg:sticky lg:top-28">
          {/* Header Info */}
          <div className="space-y-2 border-b border-[#e2d7bb] pb-5 sm:pb-6">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#1a422f] font-bold">
              {category?.name || 'Maison Creation'}
            </span>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#02110c] font-normal leading-snug sm:leading-tight">
              {product.name}
            </h1>

            {/* Ratings & SKU */}
            <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
              <div className="flex items-center gap-1 text-[#02110c] font-semibold">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#c9a96e] text-[#c9a96e]" />
                <span>{product.avgRating.toFixed(1)}</span>
                <span className="text-[#4a5a50] font-normal">
                  ({product.reviewCount} reviews)
                </span>
              </div>
              <span className="text-[#e2d7bb] hidden sm:inline">&bull;</span>
              <span className="text-[#4a5a50]">SKU: {selectedVariant?.sku}</span>
            </div>

            {/* Price Tag */}
            <div className="flex items-baseline gap-3 pt-2 sm:pt-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#1a422f]">
                {formatPrice(currentPrice)}
              </span>
              {comparePrice && (
                <span className="text-xs sm:text-sm text-[#4a5a50] line-through">
                  {formatPrice(comparePrice)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#4a5a50] leading-relaxed">
            {product.description}
          </p>

          {/* Variant Selector */}
          <div className="space-y-3 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold uppercase tracking-wider text-[#02110c]">
                Options &amp; Variations
              </span>
              {isLowStock && (
                <span className="text-amber-700 font-semibold text-[11px] sm:text-xs">
                  Low Stock &mdash; Only {selectedVariant.stockQuantity} left
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
              {product.variants.map((variant) => {
                const label = Object.entries(variant.optionValues)
                  .map(([_, v]) => `${v}`)
                  .join(' / ');

                const isSelected = variant.id === selectedVariantId;
                const isVariantOutOfStock = variant.stockQuantity === 0;

                return (
                  <button
                    key={variant.id}
                    disabled={isVariantOutOfStock}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`p-2.5 sm:p-3 rounded-xl border text-xs text-left transition-all ${
                      isSelected
                        ? 'border-[#1a422f] bg-[#1a422f] text-[#f3ebd6] shadow-sm'
                        : isVariantOutOfStock
                        ? 'border-[#e2d7bb] bg-gray-100/60 text-[#4a5a50]/40 line-through cursor-not-allowed'
                        : 'border-[#e2d7bb] bg-white text-[#02110c] hover:border-[#1a422f]/50'
                    }`}
                  >
                    <div className="font-medium truncate">{label}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">
                      {isVariantOutOfStock ? 'Sold Out' : formatPrice(variant.priceCents)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Quantity & Action Buttons */}
          <div className="hidden sm:block space-y-4 pt-4 border-t border-[#e2d7bb]">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#e2d7bb] rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#02110c] hover:bg-[#e2d7bb]/30 rounded-lg transition-colors font-medium text-sm"
                  aria-label="Decrease quantity"
                >
                  &minus;
                </button>
                <span className="w-10 text-center text-sm font-semibold text-[#02110c]">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(selectedVariant?.stockQuantity || 1, quantity + 1)
                    )
                  }
                  className="w-8 h-8 flex items-center justify-center text-[#02110c] hover:bg-[#e2d7bb]/30 rounded-lg transition-colors font-medium text-sm"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 py-3.5 px-6 rounded-xl bg-[#1a422f] hover:bg-[#25593f] text-[#f3ebd6] font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-[#c9a96e]" /> Added to Bag
                  </>
                ) : !inStock ? (
                  'Currently Sold Out'
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Bag &bull;{' '}
                    {formatPrice(currentPrice * quantity)}
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3.5 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'border-red-400 bg-red-50 text-red-600'
                    : 'border-[#e2d7bb] bg-white text-[#02110c] hover:text-[#1a422f]'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="bg-white/60 rounded-2xl border border-[#e2d7bb] p-4 sm:p-5 space-y-3 text-xs text-[#02110c]">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-[#1a422f] flex-shrink-0" />
              <span>Complimentary insured courier delivery with discreet packaging</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#1a422f] flex-shrink-0" />
              <span>Gemological provenance certificate &amp; official hallmarking</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-[#1a422f] flex-shrink-0" />
              <span>30-day complimentary return or exchange privilege</span>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM ADD TO BAG BAR (MANDATED IN PRD 4.10.4 ANI-5) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#02110c] text-[#f3ebd6] border-t border-cream-300/20 p-3.5 shadow-2xl safe-area-pb flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-[#f3ebd6]/70 uppercase block">
            {selectedVariant?.sku}
          </span>
          <span className="text-base font-bold text-[#f3ebd6]">
            {formatPrice(currentPrice)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`p-2.5 rounded-xl border ${
              isWishlisted
                ? 'border-red-400 bg-red-900/40 text-red-400'
                : 'border-cream-300/30 text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="py-2.5 px-5 rounded-xl bg-[#1a422f] text-xs font-semibold text-[#f3ebd6] hover:bg-[#25593f] flex items-center gap-1.5 shadow-md disabled:opacity-50"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#c9a96e]" /> Added
              </>
            ) : !inStock ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
              </>
            )}
          </button>
        </div>
      </div>

      {/* Related Creations (2 cols on mobile, 4 on desktop) */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 sm:mt-28 border-t border-[#e2d7bb] pt-12 sm:pt-16">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#1a422f] font-semibold">
              Harmonious Complements
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#02110c] mt-1.5">
              You May Also Admire
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
