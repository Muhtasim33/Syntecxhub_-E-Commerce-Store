import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3ebd6] text-[#02110c] px-4 text-center">
      <div className="max-w-md space-y-6">
        <Compass className="w-16 h-16 text-[#1a422f] mx-auto opacity-40" />
        <span className="text-xs uppercase tracking-widest text-[#1a422f] font-bold">
          404 Error &bull; Allocation Not Found
        </span>
        <h1 className="font-serif text-4xl text-[#02110c]">
          Uncharted Destination
        </h1>
        <p className="text-xs text-[#4a5a50] leading-relaxed">
          The creation, collection, or private dossier you are seeking is either restricted or has been moved to our historical archives.
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
