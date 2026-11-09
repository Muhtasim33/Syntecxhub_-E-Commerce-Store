'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Shield, Package } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface CustomerDetailPageProps {
  params: {
    id: string;
  };
}

export default function AdminCustomerDetailPage({ params }: CustomerDetailPageProps) {
  const customer = {
    id: params.id,
    name: 'Lady Genevieve Vance',
    email: 'genevieve.vance@luxurymail.com',
    phone: '+1 (555) 349-8201',
    role: 'customer',
    isBlocked: false,
    joined: 'October 12, 2025',
    totalSpent: '$14,200',
    orders: [
      { orderNumber: 'AUR-829103', date: 'Nov 4, 2026', total: '$1,250.00', status: 'processing' },
      { orderNumber: 'AUR-612984', date: 'Aug 19, 2026', total: '$890.00', status: 'delivered' },
    ],
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center border-b border-[#e2d7bb] pb-4">
        <div>
          <Link
            href="/admin/customers"
            className="text-xs text-[#1a422f] hover:underline flex items-center gap-1.5 mb-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Clientele Directory
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl text-[#02110c]">
              {customer.name}
            </h1>
            <Badge variant="success">Active VIP</Badge>
          </div>
        </div>

        <Button variant="outline" size="sm" className="text-red-700 border-red-300">
          Lock Account Access
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-[#e2d7bb] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#4a5a50]">
            Lifetime Investment
          </span>
          <p className="font-serif text-xl font-bold text-[#1a422f]">
            {customer.totalSpent}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e2d7bb] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#4a5a50]">
            Total Acquisitions
          </span>
          <p className="font-serif text-xl font-bold text-[#02110c]">
            {customer.orders.length} Orders
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e2d7bb] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#4a5a50]">
            Client Since
          </span>
          <p className="font-serif text-xl font-bold text-[#02110c]">
            {customer.joined}
          </p>
        </div>
      </div>

      {/* Historical Orders */}
      <div className="bg-white rounded-2xl border border-[#e2d7bb] p-6 space-y-4">
        <h3 className="font-serif text-base font-semibold text-[#02110c] border-b border-[#e2d7bb] pb-2">
          Recorded Acquisitions
        </h3>

        <div className="divide-y divide-[#e2d7bb] text-xs">
          {customer.orders.map((order) => (
            <div key={order.orderNumber} className="py-3 flex justify-between items-center">
              <div>
                <span className="font-mono font-bold text-[#02110c]">
                  #{order.orderNumber}
                </span>
                <span className="text-[#4a5a50] ml-3">{order.date}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-[#1a422f]">{order.total}</span>
                <Badge variant={order.status === 'delivered' ? 'success' : 'default'}>
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
