'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/lib/mockData';
import { ProductCard } from '@/components/product/ProductCard';
import { StaggerGroup } from '@/components/motion/StaggerGroup';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryDetailPage({ params }: CategoryPageProps) {
  const category = INITIAL_CATEGORIES.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = INITIAL_PRODUCTS.filter(
    (product) => product.categoryId === category.id
  );

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#4a5a50] mb-8">
        <Link href="/" className="hover:text-[#02110c] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#e2d7bb]" />
        <Link href="/products" className="hover:text-[#02110c] transition-colors">
          Collections
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#e2d7bb]" />
        <span className="text-[#02110c] font-semibold">{category.name}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#02110c] text-[#f3ebd6] p-8 sm:p-14 mb-14 shadow-xl border border-[#02110c]">
        {category.imageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
            style={{ backgroundImage: `url(${category.imageUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#02110c] via-[#02110c]/80 to-transparent" />

        <div className="relative max-w-xl space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#c9a96e] font-semibold">
            Dedicated Universe
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#f3ebd6]">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#f3ebd6]/80 leading-relaxed font-light">
            Indulge in our singular collection of {category.name.toLowerCase()}, designed with meticulous artisanship and enduring materials.
          </p>
        </div>
      </div>

      {/* Products Listing */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-[#e2d7bb] pb-4">
          <h2 className="font-serif text-2xl text-[#02110c]">
            Curated Creations ({categoryProducts.length})
          </h2>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs text-[#1a422f] hover:underline font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Collections
          </Link>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/40 rounded-2xl border border-dashed border-[#e2d7bb]">
            <p className="font-serif text-lg text-[#02110c]">
              New allocations for {category.name} arriving soon.
            </p>
            <Link
              href="/products"
              className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-[#1a422f] text-[#f3ebd6] text-xs font-semibold"
            >
              Explore Other Collections
            </Link>
          </div>
        ) : (
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </StaggerGroup>
        )}
      </div>
    </div>
  );
}
