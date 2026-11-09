import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-[#e2d7bb] pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#02110c]">
          30-Day Returns &amp; Exchange Privilege
        </h1>
        <p className="text-xs text-[#4a5a50] mt-1">
          Effective Date: November 2026 &bull; Uncompromised Client Satisfaction
        </p>
      </div>

      <div className="prose prose-stone text-xs sm:text-sm text-[#4a5a50] leading-relaxed space-y-6">
        <h3 className="font-serif text-lg text-[#02110c]">1. Sovereign 30-Day Return Window</h3>
        <p>
          We offer complimentary returns and exchanges within 30 days of confirmed delivery for all unworn creations in their original timber packaging accompanied by the unaltered gemological verification certificate.
        </p>

        <h3 className="font-serif text-lg text-[#02110c]">2. Return Protocol</h3>
        <p>
          To initiate a return or resizing, contact your concierge at concierge@aurelia.com or via your account dashboard. We will dispatch an insured courier pickup to your residence with prepaid documentation.
        </p>

        <h3 className="font-serif text-lg text-[#02110c]">3. Reimbursement Processing</h3>
        <p>
          Once received and inspected by our master gemologists in our vault, refunds are processed within 48 hours directly to the original settlement method.
        </p>
      </div>
    </div>
  );
}
