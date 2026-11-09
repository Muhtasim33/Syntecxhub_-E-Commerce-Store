'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowUpRight, Filter } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const mockOrders = JSON.parse(
      localStorage.getItem('ecommerce_mock_orders') || '[]'
    );
    if (mockOrders.length === 0) {
      const sample = [
        {
          orderNumber: 'AUR-829103',
          email: 'genevieve.vance@luxurymail.com',
          status: 'processing',
          paymentStatus: 'paid',
          paymentMethod: 'card',
          totalCents: 125000,
          createdAt: new Date().toISOString(),
          items: [
            {
              productName: 'Emerald & 18k Gold Solitaire Ring',
              quantity: 1,
              lineTotalCents: 125000,
            },
          ],
        },
        {
          orderNumber: 'AUR-718290',
          email: 'arthur.pendleton@estateholdings.com',
          status: 'paid',
          paymentStatus: 'paid',
          paymentMethod: 'card',
          totalCents: 68000,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          items: [
            {
              productName: 'Tailored Olive Silk Trench Coat',
              quantity: 1,
              lineTotalCents: 68000,
            },
          ],
        },
      ];
      localStorage.setItem('ecommerce_mock_orders', JSON.stringify(sample));
      setOrders(sample);
    } else {
      setOrders(mockOrders);
    }
  }, []);

  const filtered = orders.filter((o) => {
    if (statusFilter && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-[#e2d7bb] pb-4">
        <h1 className="font-serif text-2xl text-[#02110c]">Order Fulfillment Manager</h1>
        <p className="text-xs text-[#4a5a50] mt-1">
          Monitor incoming purchases, dispatch diplomatic couriers, and manage lifecycle states.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-[#e2d7bb]">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by order # or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#e2d7bb] bg-white focus:outline-none focus:ring-1 focus:ring-[#1a422f]"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5a50]" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#e2d7bb] bg-white text-[#02110c] focus:outline-none focus:ring-1 focus:ring-[#1a422f] cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#e2d7bb] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f3ebd6]/60 border-b border-[#e2d7bb] text-[#02110c] uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Client Email</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Order Status</th>
                <th className="p-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2d7bb]">
              {filtered.map((order) => (
                <tr
                  key={order.orderNumber}
                  className="hover:bg-[#f3ebd6]/20 transition-colors"
                >
                  <td className="p-4 font-mono font-bold text-[#02110c]">
                    #{order.orderNumber}
                  </td>
                  <td className="p-4 text-[#4a5a50]">{order.email}</td>
                  <td className="p-4 text-[#4a5a50]">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="p-4 font-bold text-[#1a422f]">
                    {formatPrice(order.totalCents)}
                  </td>
                  <td className="p-4">
                    <span className="capitalize text-[11px] font-semibold text-[#2f7d4f]">
                      {order.paymentStatus} ({order.paymentMethod})
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        order.status === 'delivered'
                          ? 'success'
                          : order.status === 'cancelled'
                          ? 'danger'
                          : 'default'
                      }
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/orders/${order.orderNumber}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#e2d7bb] hover:bg-[#1a422f] hover:text-[#f3ebd6] font-semibold transition-colors"
                    >
                      Manage <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
