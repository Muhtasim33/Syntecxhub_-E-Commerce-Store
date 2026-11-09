import React from 'react';

export default function TermsPage() {
  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-[#e2d7bb] pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#02110c]">
          Terms of Sovereign Service
        </h1>
        <p className="text-xs text-[#4a5a50] mt-1">
          Effective Date: November 2026 &bull; Aurelia &amp; Co. Luxury Maison
        </p>
      </div>

      <div className="prose prose-stone text-xs sm:text-sm text-[#4a5a50] leading-relaxed space-y-6">
        <h3 className="font-serif text-lg text-[#02110c]">1. Atelier Purchase Agreement</h3>
        <p>
          By placing an acquisition order through Aurelia &amp; Co., the client enters into a binding covenant for the bespoke allocation of ethically sourced gemstones, fine tailored textiles, or artisanal creations. Prices are denominated in integer minor units and are guaranteed at the moment of checkout.
        </p>

        <h3 className="font-serif text-lg text-[#02110c]">2. Stock Reservations &amp; Allocations</h3>
        <p>
          Online purchases temporarily reserve allocated vault stock for a duration of 30 minutes. In the event of non-completion or payment failure, reserves are restored to the public catalog.
        </p>

        <h3 className="font-serif text-lg text-[#02110c]">3. Intellectual Property</h3>
        <p>
          All jewelry settings, textile cuts, branding marks, and visual imagery are sovereign intellectual property protected under international design conventions.
        </p>
      </div>
    </div>
  );
}
