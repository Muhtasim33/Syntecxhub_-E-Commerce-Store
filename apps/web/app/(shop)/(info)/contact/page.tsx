'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-28 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#1a422f] font-bold">
          Bespoke Concierge
        </span>
        <h1 className="font-serif text-4xl text-[#02110c]">Connect With Our Atelier</h1>
        <p className="text-xs sm:text-sm text-[#4a5a50] max-w-md mx-auto">
          For private showings, bespoke emerald commissions, or order assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact info cards */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#e2d7bb] space-y-3">
            <div className="flex items-center gap-3 text-[#1a422f]">
              <MapPin className="w-5 h-5" />
              <h3 className="font-serif text-base font-semibold text-[#02110c]">
                Flagship Atelier
              </h3>
            </div>
            <p className="text-xs text-[#4a5a50] leading-relaxed">
              740 Park Avenue &bull; Suite 400<br />
              New York, NY 10021, United States
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#e2d7bb] space-y-3">
            <div className="flex items-center gap-3 text-[#1a422f]">
              <Mail className="w-5 h-5" />
              <h3 className="font-serif text-base font-semibold text-[#02110c]">
                Private Client Concierge
              </h3>
            </div>
            <p className="text-xs text-[#4a5a50]">
              concierge@aurelia.com &bull; Mon &ndash; Sat, 9am &ndash; 7pm EST
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#e2d7bb] space-y-3">
            <div className="flex items-center gap-3 text-[#1a422f]">
              <Phone className="w-5 h-5" />
              <h3 className="font-serif text-base font-semibold text-[#02110c]">
                Direct Line
              </h3>
            </div>
            <p className="text-xs text-[#4a5a50]">
              +1 (800) 892-0194 (International Toll-Free)
            </p>
          </div>
        </div>

        {/* Message form */}
        <div className="bg-white p-8 rounded-3xl border border-[#e2d7bb] shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#2f7d4f] mx-auto" />
              <h3 className="font-serif text-xl text-[#02110c]">
                Message Transmitted
              </h3>
              <p className="text-xs text-[#4a5a50] max-w-xs mx-auto">
                A senior maison concierge will review your dispatch and respond within four business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Your Name" required placeholder="Lady Genevieve Vance" />
              <Input label="Email Address" type="email" required placeholder="name@domain.com" />
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]">
                  Your Dispatch or Inquiry
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] bg-cream-100/60 text-xs text-[#02110c] focus:outline-none focus:ring-1 focus:ring-[#1a422f]"
                  placeholder="Detail your request..."
                />
              </div>
              <Button type="submit" variant="primary" className="w-full rounded-xl py-3 text-xs">
                Transmit Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
