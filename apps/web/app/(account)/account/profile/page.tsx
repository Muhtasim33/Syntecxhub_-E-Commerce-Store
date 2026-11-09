'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();

  const [name, setName] = useState(user?.name || 'Lady Genevieve Vance');
  const [email, setEmail] = useState(user?.email || 'genevieve.vance@luxurymail.com');
  const [phone, setPhone] = useState('+1 (555) 349-8201');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="border-b border-[#e2d7bb] pb-4">
        <h1 className="font-serif text-2xl text-[#02110c]">Profile Details</h1>
        <p className="text-xs text-[#4a5a50] mt-1">
          Maintain your formal sovereign record with the Maison.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2f7d4f]" />
          <span>Profile records successfully updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <Input
          label="Full Legal Name & Title"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Registered Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Primary Telephone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="pt-4">
          <Button type="submit" variant="primary" size="md" className="rounded-xl">
            Save Modifications
          </Button>
        </div>
      </form>
    </div>
  );
}
