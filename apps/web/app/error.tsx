'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Application Error Boundary Caught]:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3ebd6] text-[#02110c] px-4 text-center">
      <div className="max-w-md bg-white p-8 sm:p-12 rounded-3xl border border-[#e2d7bb] shadow-lg space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase tracking-widest text-amber-800 font-bold block">
          500 &bull; Application Exception
        </span>

        <h1 className="font-serif text-3xl text-[#02110c]">
          An Unexpected Event Occurred
        </h1>

        <p className="text-xs text-[#4a5a50] leading-relaxed">
          The atelier servers encountered an unforeseen response while processing your request. An error report has been generated.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="sm"
            className="w-full sm:w-auto rounded-xl"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-[#e2d7bb] text-xs font-semibold text-[#02110c] hover:bg-cream-100/60"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Salon
          </Link>
        </div>
      </div>
    </div>
  );
}
