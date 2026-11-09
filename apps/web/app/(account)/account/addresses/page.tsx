'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Check, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      fullName: 'Lady Genevieve Vance',
      phone: '+1 (555) 349-8201',
      line1: '740 Park Avenue',
      line2: 'Penthouse 14B',
      city: 'New York',
      state: 'NY',
      postalCode: '10021',
      country: 'United States',
      isDefault: true,
    },
    {
      id: 'addr-2',
      fullName: 'Lady Genevieve Vance (Summer Villa)',
      phone: '+1 (555) 349-8201',
      line1: '82 Ocean Pathway',
      line2: '',
      city: 'Newport',
      state: 'RI',
      postalCode: '02840',
      country: 'United States',
      isDefault: false,
    },
  ]);

  const setDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const removeAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#e2d7bb] pb-4">
        <div>
          <h1 className="font-serif text-2xl text-[#02110c]">
            Saved Destinations
          </h1>
          <p className="text-xs text-[#4a5a50] mt-1">
            Registered residences for courier and diplomatic white-glove dispatches.
          </p>
        </div>

        <Button size="sm" variant="primary" className="text-xs gap-1.5 rounded-xl">
          <Plus className="w-4 h-4" /> Add Destination
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-6 rounded-2xl border-2 transition-all space-y-4 ${
              addr.isDefault
                ? 'border-[#1a422f] bg-[#1a422f]/5 shadow-sm'
                : 'border-[#e2d7bb] bg-white'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1a422f]" />
                <h4 className="font-serif text-sm font-semibold text-[#02110c]">
                  {addr.fullName}
                </h4>
              </div>
              {addr.isDefault && (
                <span className="text-[10px] bg-[#1a422f] text-[#f3ebd6] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                  Default
                </span>
              )}
            </div>

            <div className="text-xs text-[#4a5a50] space-y-0.5">
              <p>{addr.line1}</p>
              {addr.line2 && <p>{addr.line2}</p>}
              <p>
                {addr.city}, {addr.state} {addr.postalCode}
              </p>
              <p>{addr.country}</p>
              <p className="pt-1 text-[#02110c]">{addr.phone}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#e2d7bb] text-xs">
              {!addr.isDefault ? (
                <button
                  onClick={() => setDefault(addr.id)}
                  className="text-xs font-semibold text-[#1a422f] hover:underline"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-[#2f7d4f] font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Primary Estate
                </span>
              )}

              <button
                onClick={() => removeAddress(addr.id)}
                className="text-[#4a5a50] hover:text-red-700 transition-colors p-1"
                title="Remove address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
