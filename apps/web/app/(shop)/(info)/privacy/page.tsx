import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-[#e2d7bb] pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#02110c]">
          Confidentiality &amp; Privacy Protocol
        </h1>
        <p className="text-xs text-[#4a5a50] mt-1">
          Effective Date: November 2026 &bull; Strict Discretion Assured
        </p>
      </div>

      <div className="prose prose-stone text-xs sm:text-sm text-[#4a5a50] leading-relaxed space-y-6">
        <h3 className="font-serif text-lg text-[#02110c]">1. Sovereign Data Protection</h3>
        <p>
          Aurelia &amp; Co. enforces bank-grade data security protocols. We never trade, license, or monetize clientele details to third-party commercial marketing platforms. Personal information is held solely for order fulfillment, diplomatic courier dispatches, and private client communications.
        </p>

        <h3 className="font-serif text-lg text-[#02110c]">2. Tokenized Payment Security</h3>
        <p>
          Card data never traverses or resides upon our application servers. All transactions are processed under PCI SAQ-A compliant hosted iframe containers, ensuring complete cryptographic tokenization.
        </p>

        <h3 className="font-serif text-lg text-[#02110c]">3. Right to Erasure</h3>
        <p>
          Under international privacy standards (including GDPR and CCPA), clients retain the absolute right to request an encrypted export or total sovereign erasure of their account records at any time.
        </p>
      </div>
    </div>
  );
}
