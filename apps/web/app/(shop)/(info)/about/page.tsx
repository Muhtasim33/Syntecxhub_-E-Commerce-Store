import React from 'react';

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#1a422f] font-bold">
          The Aurelia Legacy
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#02110c]">
          An Atelier of Permanence
        </h1>
        <p className="text-sm text-[#4a5a50] max-w-xl mx-auto leading-relaxed">
          Founded on the uncompromising pursuit of provenance, sustainability, and transcendent beauty.
        </p>
      </div>

      <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-[#e2d7bb] shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=80"
          alt="Atelier workshop"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="prose prose-stone max-w-none text-xs sm:text-sm text-[#4a5a50] leading-relaxed space-y-6">
        <h2 className="font-serif text-2xl text-[#02110c]">Ethical Provenance</h2>
        <p>
          At Aurelia &amp; Co., we believe true luxury cannot exist without absolute integrity. Our Colombian emeralds are mined through fair-wage artisan cooperatives that actively restore regional biodiversity. Every precious stone is individually analyzed, cataloged, and hand-set into recycled 18k solid gold.
        </p>

        <h2 className="font-serif text-2xl text-[#02110c]">Botanical Artisanship</h2>
        <p>
          Our textile atelier works exclusively with organic mulberry silk, European flax linen, and wild-harvested botanical extracts. We reject seasonal obsolescence, creating wardrobe pillars that drape with graceful authority season after season.
        </p>
      </div>
    </div>
  );
}
