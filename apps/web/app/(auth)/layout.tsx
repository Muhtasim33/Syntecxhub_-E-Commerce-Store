import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Brand Left Panel (Dark Emerald) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[#02110c] text-[#f3ebd6] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02110c] via-[#02110c]/80 to-transparent" />

        <div className="relative z-10">
          <Link href="/" className="font-serif text-2xl tracking-tight text-[#f3ebd6]">
            AURELIA &amp; CO.
          </Link>
        </div>

        <div className="relative z-10 max-w-md space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a422f] border border-[#c9a96e]/30 text-xs text-[#c9a96e]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Client Portal</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#f3ebd6] leading-tight font-normal">
            Your Private Gateway to Rare Allocations.
          </h2>
          <p className="text-xs sm:text-sm text-[#f3ebd6]/70 leading-relaxed font-light">
            Manage your personal vault, track diplomatic delivery timelines, and maintain bespoke preferences with our master concierges.
          </p>
        </div>

        <div className="relative z-10 text-[11px] text-[#f3ebd6]/50">
          &copy; {new Date().getFullYear()} Aurelia &amp; Co. Luxury Maison. All rights reserved.
        </div>
      </div>

      {/* Form Right Panel (Cream) */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-[#f3ebd6]">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
