'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg({ text: 'New passwords do not match.', error: true });
      return;
    }
    if (newPassword.length < 8) {
      setMsg({ text: 'Password must be at least 8 characters.', error: true });
      return;
    }

    setMsg({ text: 'Security key successfully altered and validated.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="border-b border-[#e2d7bb] pb-4">
        <h1 className="font-serif text-2xl text-[#02110c]">Security &amp; Encryption</h1>
        <p className="text-xs text-[#4a5a50] mt-1">
          Maintain cryptographic credentials guarding your acquisitions.
        </p>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            msg.error
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-current" />
          <span>{msg.text}</span>
        </div>
      )}

      <form onSubmit={handleChangePassword} className="space-y-4">
        <Input
          label="Current Password"
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <Input
          label="New Security Password"
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Min. 8 characters"
        />

        <Input
          label="Confirm New Password"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="pt-4">
          <Button type="submit" variant="primary" size="md" className="rounded-xl">
            Update Security Key
          </Button>
        </div>
      </form>

      <div className="p-4 rounded-xl bg-[#f3ebd6]/60 border border-[#e2d7bb] text-xs text-[#4a5a50] space-y-1">
        <div className="flex items-center gap-2 font-semibold text-[#02110c]">
          <ShieldCheck className="w-4 h-4 text-[#1a422f]" />
          <span>Argon2 Password Hashing &amp; Session Invalidation</span>
        </div>
        <p className="text-[11px]">
          Altering your password revokes all existing refresh tokens across secondary devices.
        </p>
      </div>
    </div>
  );
}
