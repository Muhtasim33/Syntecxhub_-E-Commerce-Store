import React from 'react';
import Link from 'next/link';
import { Hammer, Shield } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02110c] text-[#f3ebd6] px-4 text-center">
      <div className="max-w-md space-y-6">
        <Hammer className="w-16 h-16 text-[#c9a96e] mx-auto animate-pulse" />
        <span className="text-xs uppercase tracking-widest text-[#c9a96e] font-bold block">
          Vault Reorganization in Progress
        </span>
        <h1 className="font-serif text-4xl text-[#f3ebd6]">
          Scheduled Maintenance
        </h1>
        <p className="text-xs sm:text-sm text-[#f3ebd6]/70 leading-relaxed font-light">
          Our digital salons are temporarily offline while we calibrate inventory allocations and audit vault reserves. Storefront operations will resume shortly.
        </p>
        <div className="pt-4 border-t border-cream-300/10">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs text-[#c9a96e] hover:underline font-semibold"
          >
            <Shield className="w-3.5 h-3.5" /> Staff &amp; Administrator Clearance
          </Link>
        </div>
      </div>
    </div>
  );
}
