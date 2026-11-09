'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Mock instant verification
    const timer = setTimeout(() => {
      setVerified(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [token]);

  return (
    <div className="space-y-6 text-center">
      <div className="p-8 rounded-3xl bg-white border border-[#e2d7bb] shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#2f7d4f] flex items-center justify-center mx-auto">
          {verified ? (
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          ) : (
            <ShieldCheck className="w-10 h-10 animate-pulse text-[#1a422f]" />
          )}
        </div>

        <span className="text-xs uppercase tracking-widest text-[#1a422f] font-bold block">
          Clientele Authentication
        </span>

        <h1 className="font-serif text-3xl text-[#02110c]">
          {verified ? 'Email Verified Successfully' : 'Verifying Security Token...'}
        </h1>

        <p className="text-xs text-[#4a5a50] max-w-sm mx-auto leading-relaxed">
          {verified
            ? 'Your email address has been formally verified. You now enjoy unhindered access to private allocations and sovereign checkout.'
            : 'Validating cryptographic cryptographic proof against our sovereign directory...'}
        </p>

        {verified && (
          <div className="pt-4">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#1a422f] hover:bg-[#25593f] text-[#f3ebd6] font-semibold text-xs transition-colors"
            >
              Enter Client Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
