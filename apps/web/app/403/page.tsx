import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3ebd6] text-[#02110c] px-4 text-center">
      <div className="max-w-md space-y-6">
        <ShieldAlert className="w-16 h-16 text-amber-700 mx-auto" />
        <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
          403 Forbidden &bull; Sovereign Vault Restricted
        </span>
        <h1 className="font-serif text-4xl text-[#02110c]">
          Privilege Access Required
        </h1>
        <p className="text-xs text-[#4a5a50] leading-relaxed">
          Your current credentials lack executive administrative clearance to inspect this section.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a422f] text-[#f3ebd6] text-xs font-semibold hover:bg-[#25593f] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Salon
          </Link>
        </div>
      </div>
    </div>
  );
}
