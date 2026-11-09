'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setAuth(
        {
          id: `usr-${Date.now()}`,
          name,
          email,
          role: 'customer',
          emailVerifiedAt: new Date().toISOString(),
          isBlocked: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        'mock-registered-jwt-token'
      );
      router.push('/account');
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <Link href="/" className="lg:hidden font-serif text-2xl text-[#02110c] block mb-4">
          AURELIA &amp; CO.
        </Link>
        <h1 className="font-serif text-3xl text-[#02110c]">Create Client Account</h1>
        <p className="text-xs text-[#4a5a50]">
          Register to receive bespoke allocations, save private addresses, and track acquisitions.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-100 border border-red-300 text-red-900 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          label="Full Legal Name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Lady Genevieve Vance"
        />

        <Input
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
        />

        <Input
          label="Create Security Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          helperText="Must be at least 8 characters with numbers and letters"
        />

        <Button
          type="submit"
          isLoading={isLoading}
          variant="primary"
          className="w-full py-3 text-xs uppercase tracking-wider font-semibold rounded-xl"
        >
          Create Sovereign Account <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <div className="text-center pt-4 border-t border-[#e2d7bb] text-xs text-[#4a5a50]">
        Already have a private account?{' '}
        <Link href="/login" className="text-[#1a422f] font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
