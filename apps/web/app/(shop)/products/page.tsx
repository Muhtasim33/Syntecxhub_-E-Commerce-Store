'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/mockData';
import { ProductCard } from '@/components/product/ProductCard';
import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState<string>(queryParam);
  const [maxPrice, setMaxPrice] = useState<number>(150000); // in cents, up to $1,500
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating'>('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory) {
        const cat = INITIAL_CATEGORIES.find((c) => c.slug === selectedCategory);
        if (cat && product.categoryId !== cat.id) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }

      // Price filter
      if (product.basePriceCents > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePriceCents - b.basePriceCents;
      if (sortBy === 'price-desc') return b.basePriceCents - a.basePriceCents;
      if (sortBy === 'rating') return b.avgRating - a.avgRating;
      return 0; // newest / default
    });
  }, [selectedCategory, searchQuery, maxPrice, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setMaxPrice(150000);
    setSortBy('newest');
    setIsMobileFilterOpen(false);
  };

  const hasActiveFilters = Boolean(selectedCategory || searchQuery || maxPrice < 150000);

  return (
    <div className="pt-24 sm:pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Title */}
      <div className="border-b border-[#e2d7bb] pb-6 sm:pb-8 mb-6 sm:mb-8">
        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#1a422f] font-semibold">
          The Full Atelier
        </span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
          <div>
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#02110c]">
              All Creations
            </h1>
            <p className="text-xs sm:text-sm text-[#4a5a50] mt-1 sm:mt-2">
              Showing {filteredProducts.length} certified masterpieces
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e2d7bb] bg-white text-xs font-semibold text-[#02110c] shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#1a422f]" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#1a422f]" />
              )}
            </button>

            <div className="flex items-center gap-2 bg-white border border-[#e2d7bb] rounded-xl px-3 py-2 text-xs shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#1a422f]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-transparent focus:outline-none text-[#02110c] font-semibold cursor-pointer text-xs"
              >
                <option value="newest">Featured &amp; Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid & Responsive Sticky Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block sticky top-28 bg-white/70 p-6 rounded-2xl border border-[#e2d7bb] space-y-6">
          <div className="flex items-center justify-between border-b border-[#e2d7bb] pb-3">
            <div className="flex items-center gap-2 font-serif text-base text-[#02110c]">
              <Filter className="w-4 h-4 text-[#1a422f]" />
              <h3>Refine Selection</h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[11px] text-[#1a422f] hover:underline font-semibold"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Search in Catalog */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]/80">
              Keyword
            </label>
            <input
              type="text"
              placeholder="Search gems, silk, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#e2d7bb] bg-white focus:outline-none focus:ring-1 focus:ring-[#1a422f]"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]/80">
              Collections
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  selectedCategory === ''
                    ? 'bg-[#1a422f] text-[#f3ebd6]'
                    : 'text-[#02110c] hover:bg-[#e2d7bb]/40'
                }`}
              >
                All Collections
              </button>
              {INITIAL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-[#1a422f] text-[#f3ebd6]'
                      : 'text-[#02110c] hover:bg-[#e2d7bb]/40'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 pt-2 border-t border-[#e2d7bb]">
            <div className="flex justify-between items-center text-xs">
              <label className="uppercase tracking-wider font-semibold text-[#02110c]/80">
                Max Price
              </label>
              <span className="font-bold text-[#1a422f]">
                {formatPrice(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="150000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#1a422f] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#4a5a50]">
              <span>$100</span>
              <span>$1,500</span>
            </div>
          </div>
        </aside>

        {/* Product Cards Grid: 2 columns on mobile, 3 on tablet/desktop (PRD 4.10.3) */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 sm:py-24 bg-white/40 rounded-2xl border border-dashed border-[#e2d7bb] p-6 sm:p-8">
              <h3 className="font-serif text-lg sm:text-xl text-[#02110c] mb-2">
                No matching creations found
              </h3>
              <p className="text-xs text-[#4a5a50] mb-6">
                Try loosening your filters or resetting search criteria.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 rounded-xl bg-[#1a422f] text-[#f3ebd6] text-xs font-semibold hover:bg-[#25593f] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </StaggerGroup>
          )}
        </div>
      </div>

      {/* FULL RESPONSIVE MOBILE FILTER SHEET / DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-[#02110c]/70 backdrop-blur-sm"
          />

          {/* Slide-Up Sheet */}
          <div className="relative mt-auto w-full max-h-[85vh] bg-[#f3ebd6] text-[#02110c] rounded-t-3xl shadow-2xl flex flex-col p-6 overflow-y-auto border-t border-[#e2d7bb]">
            <div className="flex items-center justify-between pb-4 border-b border-[#e2d7bb]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#1a422f]" />
                <h3 className="font-serif text-lg text-[#02110c]">
                  Refine Creations
                </h3>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-full hover:bg-cream-300/40"
              >
                <X className="w-5 h-5 text-[#02110c]" />
              </button>
            </div>

            <div className="py-6 space-y-6 flex-1 overflow-y-auto">
              {/* Search */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#02110c]">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Gems, metals, silk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2d7bb] bg-white text-xs"
                />
              </div>

              {/* Collections pills */}
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#02110c]">
                  Collection
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      selectedCategory === ''
                        ? 'bg-[#1a422f] text-[#f3ebd6]'
                        : 'bg-white border border-[#e2d7bb] text-[#02110c]'
                    }`}
                  >
                    All
                  </button>
                  {INITIAL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        selectedCategory === cat.slug
                          ? 'bg-[#1a422f] text-[#f3ebd6]'
                          : 'bg-white border border-[#e2d7bb] text-[#02110c]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Maximum Price</span>
                  <span className="text-[#1a422f] font-bold">
                    {formatPrice(maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="150000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#1a422f]"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#e2d7bb] flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 rounded-xl border border-[#e2d7bb] text-xs font-semibold text-[#02110c]"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-xl bg-[#1a422f] text-xs font-semibold text-[#f3ebd6]"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
