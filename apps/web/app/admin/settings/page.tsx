'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle2, Sliders, ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('AURELIA & CO. MAISON');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState('8.0');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('150');
  const [standardShipping, setStandardShipping] = useState('10');
  const [codEnabled, setCodEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-[#e2d7bb] pb-4">
        <h1 className="font-serif text-2xl text-[#02110c]">Maison Store Settings</h1>
        <p className="text-xs text-[#4a5a50] mt-1">
          Configure financial rules, shipping thresholds, and transactional policies.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2f7d4f]" />
          <span>Global storefront configuration safely persisted.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 bg-white p-8 rounded-3xl border border-[#e2d7bb]">
        {/* General Store Config */}
        <div className="space-y-4">
          <h3 className="font-serif text-base font-semibold text-[#02110c] border-b border-[#e2d7bb] pb-2">
            Store Identity &amp; Financial Base
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Store Public Name"
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]">
                Operational Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] bg-cream-100/60 text-xs text-[#02110c]"
              >
                <option value="USD">USD ($) - United States Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>

            <Input
              label="Tax Rate Percentage (%)"
              type="number"
              step="0.1"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
            />
          </div>
        </div>

        {/* Shipping & Delivery Policies */}
        <div className="space-y-4">
          <h3 className="font-serif text-base font-semibold text-[#02110c] border-b border-[#e2d7bb] pb-2">
            Insured Logistics &amp; Transit Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Complimentary Courier Threshold ($)"
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              helperText="Orders exceeding this sum qualify for free diplomatic delivery."
            />

            <Input
              label="Standard Courier Fee ($)"
              type="number"
              value={standardShipping}
              onChange={(e) => setStandardShipping(e.target.value)}
            />
          </div>
        </div>

        {/* Payment Gateways */}
        <div className="space-y-4">
          <h3 className="font-serif text-base font-semibold text-[#02110c] border-b border-[#e2d7bb] pb-2">
            Settlement Providers
          </h3>

          <div className="flex items-center justify-between p-4 rounded-xl border border-[#e2d7bb] bg-cream-100/20">
            <div>
              <h4 className="text-xs font-semibold text-[#02110c]">
                Cash on Delivery (COD) Privilege
              </h4>
              <p className="text-[11px] text-[#4a5a50]">
                Allow clients to settle payment in cash or private draft upon courier arrival.
              </p>
            </div>
            <input
              type="checkbox"
              checked={codEnabled}
              onChange={(e) => setCodEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#1a422f] cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#e2d7bb] flex justify-end">
          <Button type="submit" variant="primary" size="md" className="rounded-xl px-8">
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
