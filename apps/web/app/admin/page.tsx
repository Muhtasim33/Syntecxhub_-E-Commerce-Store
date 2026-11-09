'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/mockData';
import { formatPrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const mockOrders = JSON.parse(
      localStorage.getItem('ecommerce_mock_orders') || '[]'
    );
    setOrders(mockOrders);
  }, []);

  const totalRevenueCents = orders.reduce(
    (acc, o) => acc + (o.paymentStatus === 'paid' ? o.totalCents : 0),
    845000 // $8,450 baseline from historical
  );

  const lowStockItems = INITIAL_PRODUCTS.flatMap((p) =>
    p.variants
      .filter((v) => v.stockQuantity <= v.lowStockThreshold)
      .map((v) => ({
        productName: p.name,
        sku: v.sku,
        stockQuantity: v.stockQuantity,
        productId: p.id,
      }))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#e2d7bb] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#1a422f] font-bold">
            Executive Control Suite
          </span>
          <h1 className="font-serif text-3xl text-[#02110c] mt-1">
            Storefront Intelligence &amp; Metrics
          </h1>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-[#1a422f] hover:bg-[#25593f] text-[#f3ebd6] font-semibold text-xs transition-colors shadow-sm"
          >
            + Add New Creation
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#e2d7bb] shadow-sm space-y-2">
          <div className="flex justify-between items-center text-[#4a5a50]">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Gross Revenue
            </span>
            <DollarSign className="w-4 h-4 text-[#1a422f]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#02110c]">
            {formatPrice(totalRevenueCents)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#2f7d4f] font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs previous 30 days
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#e2d7bb] shadow-sm space-y-2">
          <div className="flex justify-between items-center text-[#4a5a50]">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Total Acquisitions
            </span>
            <ShoppingBag className="w-4 h-4 text-[#1a422f]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#02110c]">
            {orders.length + 14}
          </div>
          <div className="text-[11px] text-[#4a5a50]">
            {orders.filter((o) => o.status === 'processing').length + 2} pending dispatch
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#e2d7bb] shadow-sm space-y-2">
          <div className="flex justify-between items-center text-[#4a5a50]">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Active Clientele
            </span>
            <Users className="w-4 h-4 text-[#1a422f]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#02110c]">
            1,280
          </div>
          <div className="text-[11px] text-[#2f7d4f] font-medium">
            94% verified private buyers
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#e2d7bb] shadow-sm space-y-2">
          <div className="flex justify-between items-center text-[#4a5a50]">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Vault Stock Alerts
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#02110c]">
            {lowStockItems.length} Low Items
          </div>
          <div className="text-[11px] text-amber-700 font-medium">
            Immediate replenishment advised
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Stream */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e2d7bb] p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-[#e2d7bb] pb-3">
            <h3 className="font-serif text-lg text-[#02110c]">
              Recent Customer Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs text-[#1a422f] hover:underline font-semibold"
            >
              View all orders
            </Link>
          </div>

          <div className="divide-y divide-[#e2d7bb] text-xs">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.orderNumber}
                className="py-3.5 flex justify-between items-center hover:bg-[#f3ebd6]/20 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#02110c]">
                      #{order.orderNumber}
                    </span>
                    <Badge variant={order.status === 'delivered' ? 'success' : 'default'}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-[#4a5a50] mt-0.5">
                    {order.email} &bull; {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-[#1a422f]">
                    {formatPrice(order.totalCents)}
                  </span>
                  <Link
                    href={`/admin/orders/${order.orderNumber}`}
                    className="p-1.5 rounded-lg border border-[#e2d7bb] hover:bg-cream-100/60"
                  >
                    <ArrowUpRight className="w-4 h-4 text-[#02110c]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts Box */}
        <div className="bg-white rounded-2xl border border-[#e2d7bb] p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-[#e2d7bb] pb-3">
            <h3 className="font-serif text-lg text-[#02110c]">
              Low Vault Stock
            </h3>
            <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
              Action Required
            </span>
          </div>

          <div className="divide-y divide-[#e2d7bb] text-xs">
            {lowStockItems.map((item, idx) => (
              <div key={idx} className="py-3 space-y-1">
                <div className="flex justify-between font-medium text-[#02110c]">
                  <span className="truncate max-w-[180px]">{item.productName}</span>
                  <span
                    className={`font-bold ${
                      item.stockQuantity === 0 ? 'text-red-600' : 'text-amber-700'
                    }`}
                  >
                    {item.stockQuantity === 0 ? 'Out of stock' : `${item.stockQuantity} left`}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#4a5a50]">
                  <span>SKU: {item.sku}</span>
                  <Link
                    href={`/admin/products`}
                    className="text-[#1a422f] hover:underline font-semibold"
                  >
                    Adjust stock
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
