'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/mockData';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#02110c] text-[#f3ebd6] border-t border-[#02110c] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand & Manifesto */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-3 sm:space-y-4">
            <h3 className="font-serif text-2xl tracking-tight text-[#f3ebd6]">
              AURELIA &amp; CO.
            </h3>
            <p className="text-xs sm:text-sm text-[#f3ebd6]/70 leading-relaxed max-w-sm">
              An atelier dedicated to fine ethical jewelry, tailored botanical textiles, and organic artisanal living. Consciously designed for enduring permanence.
            </p>
            <div className="pt-1 sm:pt-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#c9a96e]">
                Paris &bull; Bogota &bull; New York
              </span>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#c9a96e] mb-3 sm:mb-4">
              Collections
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs text-[#f3ebd6]/80">
              {INITIAL_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="hover:text-[#f3ebd6] transition-colors py-0.5 block"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/products"
                  className="hover:text-[#f3ebd6] transition-colors py-0.5 block"
                >
                  All Creations
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Service */}
          <div>
            <h4 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#c9a96e] mb-3 sm:mb-4">
              Client Service
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs text-[#f3ebd6]/80">
              <li>
                <Link href="/about" className="hover:text-[#f3ebd6] transition-colors py-0.5 block">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#f3ebd6] transition-colors py-0.5 block">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#f3ebd6] transition-colors py-0.5 block">
                  FAQ &amp; Care
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#f3ebd6] transition-colors py-0.5 block">
                  Shipping &amp; Duties
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#f3ebd6] transition-colors py-0.5 block">
                  Returns &amp; Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-3">
            <h4 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#c9a96e]">
              Private Gazette
            </h4>
            <p className="text-xs text-[#f3ebd6]/70 leading-relaxed">
              Receive private previews of limited edition gemstone allocations and seasonal releases.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#c9a96e] pt-1">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Enrolled in our private gazette.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1a422f]/60 border border-cream-300/30 rounded-xl px-3.5 py-2.5 text-xs text-[#f3ebd6] placeholder:text-[#f3ebd6]/50 focus:outline-none focus:ring-1 focus:ring-[#c9a96e] pr-9"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-[#f3ebd6] hover:text-[#c9a96e] transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="mt-12 sm:mt-14 pt-6 sm:pt-8 border-t border-cream-300/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#f3ebd6]/60 gap-4 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} Aurelia &amp; Co. Luxury Maison. All rights reserved.</p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-[#f3ebd6]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#f3ebd6]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
