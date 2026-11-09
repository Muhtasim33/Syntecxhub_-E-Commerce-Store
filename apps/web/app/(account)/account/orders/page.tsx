'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ArrowRight, Eye } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const mockOrders = JSON.parse(
      localStorage.getItem('ecommerce_mock_orders') || '[]'
    );
    setOrders(mockOrders);
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#e2d7bb] pb-4">
        <h1 className="font-serif text-2xl text-[#02110c]">My Acquisitions</h1>
        <p className="text-xs text-[#4a5a50] mt-1">
          Review historical receipts, active transit logs, and order dossiers.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="w-12 h-12 text-[#1a422f]/30 mx-auto mb-3" />
          <p className="font-serif text-lg text-[#02110c]">
            No recorded acquisitions found
          </p>
          <p className="text-xs text-[#4a5a50] mt-1 mb-6">
            Explore our collections to initiate your first private acquisition.
          </p>
          <Link
            href="/products"
            className="px-6 py-2.5 rounded-xl bg-[#1a422f] text-[#f3ebd6] text-xs font-semibold"
          >
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderNumber}
              className="p-6 rounded-2xl border border-[#e2d7bb] bg-white hover:border-[#1a422f]/40 transition-all space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#e2d7bb]/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-[#02110c]">
                    #{order.orderNumber}
                  </span>
                  <Badge variant={order.status === 'delivered' ? 'success' : 'default'}>
                    {order.status}
                  </Badge>
                </div>
                <span className="text-xs text-[#4a5a50]">
                  Placed on {formatDate(order.createdAt)}
                </span>
              </div>

              {/* Items in this order */}
              <div className="divide-y divide-[#e2d7bb]/40 text-xs">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="py-2 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-[#02110c]">
                        {item.productName}
                      </span>
                      <span className="text-[#4a5a50] ml-2">
                        ({item.variantLabel}) &times; {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-[#1a422f]">
                      {formatPrice(item.lineTotalCents)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer & Actions */}
              <div className="pt-3 border-t border-[#e2d7bb]/60 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="text-xs">
                  <span className="text-[#4a5a50]">Total Investment: </span>
                  <span className="text-sm font-bold text-[#1a422f]">
                    {formatPrice(order.totalCents)}
                  </span>
                </div>

                <Link
                  href={`/account/orders/${order.orderNumber}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a422f] hover:bg-[#25593f] text-[#f3ebd6] text-xs font-semibold transition-colors text-center justify-center"
                >
                  <Eye className="w-3.5 h-3.5" /> View Timeline &amp; Tracking
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
