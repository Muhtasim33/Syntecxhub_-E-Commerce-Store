'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Lock, Mail, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/account';

  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Mock Authentication Logic / API call
    setTimeout(() => {
      if (email.toLowerCase().includes('admin')) {
        // Admin credentials
        setAuth(
          {
            id: 'usr-admin-1',
            name: 'Maison Master Admin',
            email: email,
            role: 'admin',
            emailVerifiedAt: new Date().toISOString(),
            isBlocked: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          'mock-admin-jwt-token'
        );
        router.push(redirectTarget.startsWith('/admin') ? redirectTarget : '/admin');
      } else if (password.length >= 6) {
        // Customer credentials
        setAuth(
          {
            id: 'usr-cust-1',
            name: 'Lady Genevieve Vance',
            email: email,
            role: 'customer',
            emailVerifiedAt: new Date().toISOString(),
            isBlocked: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          'mock-customer-jwt-token'
        );
        router.push(redirectTarget);
      } else {
        setError('Invalid credentials. Password must be at least 6 characters.');
        setIsLoading(false);
      }
    }, 600);
  };

  const fillQuickDemo = (type: 'admin' | 'customer') => {
    if (type === 'admin') {
      setEmail('admin@aurelia.com');
      setPassword('AdminPass123!');
    } else {
      setEmail('genevieve.vance@luxurymail.com');
      setPassword('ClientPass123!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <Link href="/" className="lg:hidden font-serif text-2xl text-[#02110c] block mb-4">
          AURELIA &amp; CO.
        </Link>
        <h1 className="font-serif text-3xl text-[#02110c]">Private Client Login</h1>
        <p className="text-xs text-[#4a5a50]">
          Enter your sovereign credentials to access your acquisitions and private vault.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-100 border border-red-300 text-red-900 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Credentials Helper for evaluation */}
      <div className="p-3 bg-[#e2d7bb]/40 rounded-xl border border-[#e2d7bb] text-xs space-y-1.5">
        <span className="font-semibold text-[#02110c] block">
          Quick Demo Credentials:
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fillQuickDemo('admin')}
            className="px-2.5 py-1 bg-[#1a422f] text-[#f3ebd6] rounded-md text-[11px] font-medium"
          >
            Fill Admin Role
          </button>
          <button
            type="button"
            onClick={() => fillQuickDemo('customer')}
            className="px-2.5 py-1 bg-white border border-[#e2d7bb] text-[#02110c] rounded-md text-[11px] font-medium"
          >
            Fill Customer Role
          </button>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <div className="flex justify-end pt-1">
            <Link
              href="/forgot-password"
              className="text-xs text-[#1a422f] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          variant="primary"
          className="w-full py-3 text-xs uppercase tracking-wider font-semibold rounded-xl"
        >
          Sign In to Account <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <div className="text-center pt-4 border-t border-[#e2d7bb] text-xs text-[#4a5a50]">
        Not yet enrolled in the private clientele?{' '}
        <Link href="/register" className="text-[#1a422f] font-semibold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}
