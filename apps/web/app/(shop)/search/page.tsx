'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/mockData';
import { ProductCard } from '@/components/product/ProductCard';
import { StaggerGroup } from '@/components/motion/StaggerGroup';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = INITIAL_PRODUCTS.filter((product) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-[#e2d7bb] pb-6">
        <span className="text-xs uppercase tracking-widest text-[#1a422f] font-bold">
          Search Intelligence
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#02110c] mt-1">
          Results for &ldquo;{query}&rdquo;
        </h1>
        <p className="text-xs text-[#4a5a50] mt-1">
          Discovered {results.length} creation(s) matching your inquiry
        </p>
      </div>

      {results.length === 0 ? (
        <div className="py-20 text-center bg-white/40 rounded-3xl border border-dashed border-[#e2d7bb] p-8 max-w-lg mx-auto">
          <Search className="w-12 h-12 text-[#1a422f]/30 mx-auto mb-3" />
          <h2 className="font-serif text-xl text-[#02110c] mb-2">
            No exact matches in the catalog
          </h2>
          <p className="text-xs text-[#4a5a50] mb-6">
            Explore our curated collections or try searching for &ldquo;emerald&rdquo;, &ldquo;silk&rdquo;, or &ldquo;parfum&rdquo;.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-2.5 rounded-xl bg-[#1a422f] text-[#f3ebd6] text-xs font-semibold"
          >
            Browse All Creations
          </Link>
        </div>
      ) : (
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}
