'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, MapPin, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { formatPrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export default function AccountDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const mockOrders = JSON.parse(
      localStorage.getItem('ecommerce_mock_orders') || '[]'
    );
    // Provide a sample order if empty
    if (mockOrders.length === 0) {
      const sample = [
        {
          orderNumber: 'AUR-829103',
          email: user?.email || 'genevieve.vance@luxurymail.com',
          status: 'processing',
          paymentStatus: 'paid',
          paymentMethod: 'card',
          totalCents: 125000,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          items: [
            {
              productName: 'Emerald & 18k Gold Solitaire Ring',
              variantLabel: 'Size: 7, 18k Gold',
              quantity: 1,
              lineTotalCents: 125000,
            },
          ],
        },
      ];
      localStorage.setItem('ecommerce_mock_orders', JSON.stringify(sample));
      setOrders(sample);
    } else {
      setOrders(mockOrders);
    }
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="border-b border-[#e2d7bb] pb-6">
        <span className="text-xs uppercase tracking-widest text-[#1a422f] font-bold">
          Sovereign Membership
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#02110c] mt-1">
          Welcome back, {user?.name || 'Lady Genevieve'}
        </h1>
        <p className="text-xs text-[#4a5a50] mt-1">
          Review your private orders, saved estates, and confidential acquisitions dossier.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#f3ebd6]/50 border border-[#e2d7bb] flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#1a422f] text-[#f3ebd6]">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#4a5a50] uppercase tracking-wider font-semibold">
              Acquisitions
            </span>
            <p className="font-serif text-xl font-bold text-[#02110c]">
              {orders.length} Orders
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#f3ebd6]/50 border border-[#e2d7bb] flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#1a422f] text-[#f3ebd6]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#4a5a50] uppercase tracking-wider font-semibold">
              Destinations
            </span>
            <p className="font-serif text-xl font-bold text-[#02110c]">
              2 Residences
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#f3ebd6]/50 border border-[#e2d7bb] flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#1a422f] text-[#f3ebd6]">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#4a5a50] uppercase tracking-wider font-semibold">
              Curated Wishlist
            </span>
            <p className="font-serif text-xl font-bold text-[#02110c]">
              4 Creations
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-lg text-[#02110c]">
            Recent Acquisitions
          </h2>
          <Link
            href="/account/orders"
            className="text-xs text-[#1a422f] hover:underline font-semibold flex items-center gap-1"
          >
            View all ({orders.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-[#e2d7bb] border border-[#e2d7bb] rounded-2xl overflow-hidden bg-white">
          {orders.slice(0, 3).map((order) => (
            <div
              key={order.orderNumber}
              className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-[#f3ebd6]/20 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#02110c]">
                    #{order.orderNumber}
                  </span>
                  <Badge variant={order.status === 'delivered' ? 'success' : 'default'}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-xs text-[#4a5a50]">
                  Placed on {formatDate(order.createdAt)} &bull; {order.items?.length || 1} creation(s)
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                <span className="text-sm font-bold text-[#1a422f]">
                  {formatPrice(order.totalCents)}
                </span>
                <Link
                  href={`/account/orders/${order.orderNumber}`}
                  className="px-3.5 py-1.5 rounded-lg border border-[#e2d7bb] text-xs font-semibold text-[#02110c] hover:bg-cream-100/60 transition-colors"
                >
                  Inspect Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Concierge Guarantee Badge */}
      <div className="p-4 rounded-2xl bg-[#02110c] text-[#f3ebd6] flex items-center gap-4 shadow-sm">
        <ShieldCheck className="w-6 h-6 text-[#c9a96e] flex-shrink-0" />
        <p className="text-xs text-[#f3ebd6]/80">
          Your personal client concierge is available 24/7 for bespoke alteration inquiries, private viewing bookings, and international insured transits.
        </p>
      </div>
    </div>
  );
}
