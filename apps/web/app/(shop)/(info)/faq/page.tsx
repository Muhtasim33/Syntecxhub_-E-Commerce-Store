import React from 'react';

export default function FAQPage() {
  const faqs = [
    {
      q: 'How are Aurelia & Co. emeralds certified?',
      a: 'All our natural emeralds originate from ethical Colombian mines and arrive with a comprehensive report from accredited gemological laboratories verifying cut, clarity, origin, and natural oil treatment status.',
    },
    {
      q: 'Is bespoke sizing available for rings and bracelets?',
      a: 'Yes. Our goldsmiths provide complimentary custom sizing on all fine jewelry purchases. You may specify your precise ring size during checkout or contact your dedicated concierge.',
    },
    {
      q: 'How does Cash on Delivery (COD) function?',
      a: 'Clients selecting COD settle the invoice amount directly with our authorized bonded courier upon private arrival, either via cash or certified draft.',
    },
    {
      q: 'How do I care for botanical organic silk and linen garments?',
      a: 'We recommend gentle dry cleaning or delicate hand washing with botanical-safe silk wash at room temperature. Never expose natural botanical dyes to harsh direct midday sunlight for drying.',
    },
  ];

  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-[#e2d7bb] pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#02110c]">
          Frequently Addressed Inquiries
        </h1>
        <p className="text-xs text-[#4a5a50] mt-1">
          Everything you need to know about our atelier, materials, and private client service.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl border border-[#e2d7bb] bg-white space-y-2 shadow-sm"
          >
            <h3 className="font-serif text-base font-semibold text-[#02110c]">
              {faq.q}
            </h3>
            <p className="text-xs text-[#4a5a50] leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
