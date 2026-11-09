import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-[#e2d7bb] pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#02110c]">
          Diplomatic Shipping &amp; Insurance Policy
        </h1>
        <p className="text-xs text-[#4a5a50] mt-1">
          Effective Date: November 2026 &bull; Global Courier Transit Standards
        </p>
      </div>

      <div className="prose prose-stone text-xs sm:text-sm text-[#4a5a50] leading-relaxed space-y-6">
        <h3 className="font-serif text-lg text-[#02110c]">1. Compliant Armed &amp; Insured Logistics</h3>
        <p>
          Every shipment dispatched from our New York or Bogota vault is insured for 100% of declared value up to the moment of physical handoff. High-value jewelry allocations exceeding $5,000 are escorted in tamper-evident sealed diplomatic packages requiring biometric ID and direct signature.
        </p>

        <h3 className="font-serif text-lg text-[#02110c]">2. Dispatch Timelines</h3>
        <p>
          Standard Insured Courier transit requires 2 to 4 business days. White-Glove Armored Express is dispatched for priority next-day arrival. Customized ring sizing or bespoke inscriptions require 3 business days of preparation in our goldsmith atelier prior to dispatch.
        </p>

        <h3 className="font-serif text-lg text-[#02110c]">3. Customs, Duties &amp; International Transits</h3>
        <p>
          For deliveries outside the United States, all local import tariffs and value-added duties are pre-settled directly by Aurelia &amp; Co. to ensure seamless, delay-free delivery to your door.
        </p>
      </div>
    </div>
  );
}
