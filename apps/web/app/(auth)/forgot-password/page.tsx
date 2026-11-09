'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <Link href="/login" className="text-xs text-[#1a422f] hover:underline flex items-center gap-1 mb-2 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
        <h1 className="font-serif text-3xl text-[#02110c]">Reset Security Key</h1>
        <p className="text-xs text-[#4a5a50]">
          Enter your registered email address and we will dispatch a confidential password reset token.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 rounded-2xl bg-white border border-[#e2d7bb] text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-[#2f7d4f] mx-auto" />
          <h3 className="font-serif text-lg text-[#02110c]">
            Dispatch Transmitted
          </h3>
          <p className="text-xs text-[#4a5a50] leading-relaxed">
            If an active sovereign account exists for <strong className="text-[#02110c]">{email}</strong>, a single-use expiring cryptographic reset link has been dispatched.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 rounded-xl bg-[#1a422f] text-[#f3ebd6] text-xs font-semibold"
            >
              Return to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Registered Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@luxurymail.com"
          />

          <Button
            type="submit"
            isLoading={isLoading}
            variant="primary"
            className="w-full py-3 text-xs uppercase tracking-wider font-semibold rounded-xl"
          >
            Dispatch Reset Token <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      )}
    </div>
  );
}
