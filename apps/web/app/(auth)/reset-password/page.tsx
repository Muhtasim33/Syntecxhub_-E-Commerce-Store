'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || 'demo-token';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="font-serif text-3xl text-[#02110c]">Establish New Password</h1>
        <p className="text-xs text-[#4a5a50]">
          Create a sovereign password for your private account.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-100 border border-red-300 text-red-900 text-xs">
          {error}
        </div>
      )}

      {success ? (
        <div className="p-6 rounded-2xl bg-white border border-[#e2d7bb] text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-[#2f7d4f] mx-auto" />
          <h3 className="font-serif text-lg text-[#02110c]">
            Password Altered
          </h3>
          <p className="text-xs text-[#4a5a50]">
            Your security key has been updated. Redirecting to login...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Security Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
          />

          <Input
            label="Confirm New Password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
          />

          <Button
            type="submit"
            isLoading={isLoading}
            variant="primary"
            className="w-full py-3 text-xs uppercase tracking-wider font-semibold rounded-xl"
          >
            Save Security Key <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      )}
    </div>
  );
}
