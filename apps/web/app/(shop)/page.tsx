'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Compass, Leaf } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { ProductCard } from '@/components/product/ProductCard';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/lib/mockData';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* 1. HERO SECTION (Dark Emerald / Olive #1a422f with Cream) */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center bg-[#02110c] text-[#f3ebd6] overflow-hidden pt-24 sm:pt-28 pb-16 sm:pb-20">
        {/* Ambient atmospheric layers */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02110c] via-[#02110c]/80 to-transparent" />
        <div className="absolute -top-40 -left-40 w-72 sm:w-96 h-72 sm:h-96 bg-[#1a422f]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#1a422f]/80 border border-[#c9a96e]/30 text-[#f3ebd6] text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#c9a96e]" />
            <span>Maison Collection &bull; Edition 2026</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-[#f3ebd6] max-w-4xl leading-[1.15] mb-4 sm:mb-6">
            Timeless Elegance, <br />
            <span className="italic font-light text-[#c9a96e]">Ethically Crafted</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#f3ebd6]/80 max-w-2xl font-light leading-relaxed mb-8 sm:mb-10 px-2">
            From Colombian emeralds set in recycled 18k solid gold to organic mulberry silk and botanical essences. Rare creations designed for generations.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[#f3ebd6] text-[#02110c] font-semibold text-xs sm:text-sm hover:bg-white transition-all shadow-xl active:scale-95 text-center"
            >
              Explore Creations <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/categories/fine-jewelry"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-transparent border border-[#f3ebd6]/30 text-[#f3ebd6] font-medium text-xs sm:text-sm hover:bg-[#1a422f]/60 transition-colors text-center"
            >
              The Emerald Atelier
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CURATED COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <Reveal className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#1a422f] font-bold">
            Curated Universes
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#02110c] mt-1.5 sm:mt-2 mb-3 sm:mb-4">
            Explore By Collection
          </h2>
          <div className="w-12 h-0.5 bg-[#c9a96e] mx-auto" />
        </Reveal>

        {/* 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {INITIAL_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[3/4] bg-[#e2d7bb] border border-[#e2d7bb] shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={category.imageUrl || ''}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#02110c]/90 via-[#02110c]/30 to-transparent" />
              <div className="absolute bottom-3 sm:bottom-5 inset-x-3 sm:inset-x-5 flex flex-col justify-end text-[#f3ebd6]">
                <h3 className="font-serif text-sm sm:text-xl tracking-tight text-[#f3ebd6] group-hover:text-[#c9a96e] transition-colors line-clamp-1">
                  {category.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-[#f3ebd6]/80 mt-0.5 sm:mt-1 uppercase tracking-wider">
                  View Series <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED NEW ARRIVALS (2 cols mobile, 3 tablet, 4 desktop per PRD 4.10.3) */}
      <section className="bg-white/60 border-y border-[#e2d7bb] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#1a422f] font-bold">
                Spring / Summer Releases
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#02110c] mt-1 sm:mt-2">
                New Arrivals
              </h2>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#1a422f] hover:text-[#25593f] transition-colors"
            >
              View Full Catalog ({INITIAL_PRODUCTS.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {INITIAL_PRODUCTS.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* 4. ATELIER FEATURE BAND (Dark Emerald & Gold Banner) */}
      <section className="bg-[#02110c] text-[#f3ebd6] py-16 sm:py-24 border-y border-[#02110c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <Reveal className="space-y-4 sm:space-y-6">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#c9a96e] font-semibold">
                The Aurelia Philosophy
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#f3ebd6] leading-tight font-normal">
                Conscious Craftsmanship, <br />
                Uncompromising Beauty.
              </h2>
              <p className="text-xs sm:text-sm text-[#f3ebd6]/80 leading-relaxed font-light">
                Every creation begins with pure provenance: gemstones individually certified by gemological institutes, botanical dyes extracted from native plants, and 100% recycled precious metals worked by generational goldsmiths.
              </p>

              <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-cream-300/20">
                <div>
                  <h4 className="font-serif text-xl sm:text-2xl text-[#c9a96e]">100%</h4>
                  <p className="text-[11px] sm:text-xs text-[#f3ebd6]/70 mt-1">
                    Traceable conflict-free origin
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-xl sm:text-2xl text-[#c9a96e]">18 Karat</h4>
                  <p className="text-[11px] sm:text-xs text-[#f3ebd6]/70 mt-1">
                    Recycled solid gold standard
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2} className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl border border-cream-300/20">
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80"
                alt="Generational goldsmith crafting emerald ring"
                className="w-full h-full object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. BRAND PROMISES / ASSURANCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          <div className="flex items-start gap-3.5 p-3 sm:p-4 rounded-xl">
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#1a422f]/10 text-[#1a422f] flex-shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#02110c]">
                Certified Authenticity
              </h4>
              <p className="text-[11px] sm:text-xs text-[#4a5a50] mt-0.5 sm:mt-1">
                Each piece arrives with a certificate of gemological verification.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 sm:p-4 rounded-xl">
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#1a422f]/10 text-[#1a422f] flex-shrink-0">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#02110c]">
                Worldwide Armored Courier
              </h4>
              <p className="text-[11px] sm:text-xs text-[#4a5a50] mt-0.5 sm:mt-1">
                Fully insured complimentary door-to-door transit on orders over $150.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 sm:p-4 rounded-xl">
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#1a422f]/10 text-[#1a422f] flex-shrink-0">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#02110c]">
                Eco-Conscious Packaging
              </h4>
              <p className="text-[11px] sm:text-xs text-[#4a5a50] mt-0.5 sm:mt-1">
                FSC-certified timber boxes and 100% biodegradable keepsake ribbons.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 sm:p-4 rounded-xl">
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#1a422f]/10 text-[#1a422f] flex-shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#02110c]">
                Lifetime Concierge Care
              </h4>
              <p className="text-[11px] sm:text-xs text-[#4a5a50] mt-0.5 sm:mt-1">
                Complimentary annual polishing and prong inspection at our ateliers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
