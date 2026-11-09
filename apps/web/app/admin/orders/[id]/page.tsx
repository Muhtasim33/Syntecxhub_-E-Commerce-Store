'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface AdminOrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const [order, setOrder] = useState<any>(null);
  const [trackingNo, setTrackingNo] = useState('');
  const [courier, setCourier] = useState('Armored Diplomatic Transit');
  const [adminNote, setAdminNote] = useState('');
  const [updatedSuccess, setUpdatedSuccess] = useState(false);

  useEffect(() => {
    const mockOrders = JSON.parse(
      localStorage.getItem('ecommerce_mock_orders') || '[]'
    );
    const found = mockOrders.find((o: any) => o.orderNumber === params.id);
    if (found) {
      setOrder(found);
      setTrackingNo(found.trackingNumber || '');
      setCourier(found.courier || 'Armored Diplomatic Transit');
    }
  }, [params.id]);

  if (!order) return null;

  const handleUpdateStatus = (newStatus: string) => {
    const mockOrders = JSON.parse(
      localStorage.getItem('ecommerce_mock_orders') || '[]'
    );
    const updated = mockOrders.map((o: any) =>
      o.orderNumber === order.orderNumber
        ? {
            ...o,
            status: newStatus,
            trackingNumber: trackingNo || o.trackingNumber,
            courier: courier || o.courier,
          }
        : o
    );
    localStorage.setItem('ecommerce_mock_orders', JSON.stringify(updated));
    setOrder({
      ...order,
      status: newStatus,
      trackingNumber: trackingNo,
      courier,
    });
    setUpdatedSuccess(true);
    setTimeout(() => setUpdatedSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#e2d7bb] pb-4">
        <div>
          <Link
            href="/admin/orders"
            className="text-xs text-[#1a422f] hover:underline flex items-center gap-1.5 mb-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders List
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl text-[#02110c]">
              Manage Order #{order.orderNumber}
            </h1>
            <Badge variant={order.status === 'delivered' ? 'success' : 'default'}>
              {order.status}
            </Badge>
          </div>
          <p className="text-xs text-[#4a5a50] mt-1">
            Purchased on {formatDate(order.createdAt)} by {order.email}
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e2d7bb] bg-white text-xs font-semibold text-[#02110c] hover:bg-cream-100/60"
        >
          <Printer className="w-4 h-4" /> Print Commercial Invoice
        </button>
      </div>

      {updatedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2f7d4f]" />
          <span>Order lifecycle state &amp; tracking records successfully updated.</span>
        </div>
      )}

      {/* Status Transition Control Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#e2d7bb] shadow-sm space-y-4">
        <h3 className="font-serif text-base font-semibold text-[#02110c] border-b border-[#e2d7bb] pb-2">
          Order Lifecycle Controller
        </h3>

        <div className="space-y-3">
          <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]">
            Allowed Lifecycle Transitions (TRD State Machine):
          </label>

          <div className="flex flex-wrap gap-2.5">
            {order.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleUpdateStatus('paid')}
                >
                  Mark as Paid (COD / Offline)
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleUpdateStatus('cancelled')}
                >
                  Cancel Order
                </Button>
              </>
            )}

            {order.status === 'paid' && (
              <>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleUpdateStatus('processing')}
                >
                  Move to Processing in Vault
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleUpdateStatus('cancelled')}
                >
                  Cancel &amp; Refund
                </Button>
              </>
            )}

            {order.status === 'processing' && (
              <>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleUpdateStatus('shipped')}
                >
                  Confirm Courier Dispatch (Shipped)
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleUpdateStatus('cancelled')}
                >
                  Cancel
                </Button>
              </>
            )}

            {order.status === 'shipped' && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleUpdateStatus('delivered')}
              >
                Mark as Safely Delivered
              </Button>
            )}

            {order.status === 'delivered' && (
              <span className="text-xs text-[#2f7d4f] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> This order has reached the terminal delivered state.
              </span>
            )}

            {order.status === 'cancelled' && (
              <span className="text-xs text-red-700 font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Order was cancelled and stock released.
              </span>
            )}
          </div>
        </div>

        {/* Dispatch Waybill info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#e2d7bb]">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-[#02110c]">
              Assigned Diplomatic Courier
            </label>
            <input
              type="text"
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#e2d7bb] bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-[#02110c]">
              Tracking Waybill #
            </label>
            <input
              type="text"
              value={trackingNo}
              placeholder="e.g. DIPL-US-891024"
              onChange={(e) => setTrackingNo(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#e2d7bb] bg-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* Order Items Breakdown */}
      <div className="bg-white rounded-3xl border border-[#e2d7bb] overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-[#f3ebd6]/60 border-b border-[#e2d7bb] font-serif text-sm font-semibold text-[#02110c]">
          Allocated Items
        </div>

        <div className="p-6 divide-y divide-[#e2d7bb] text-xs">
          {order.items?.map((item: any, idx: number) => (
            <div key={idx} className="py-3 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-[#02110c]">{item.productName}</h4>
                <p className="text-[#4a5a50]">{item.variantLabel} &bull; Qty: {item.quantity}</p>
              </div>
              <span className="font-bold text-[#1a422f]">
                {formatPrice(item.lineTotalCents)}
              </span>
            </div>
          ))}

          <div className="pt-4 space-y-1.5 text-right font-semibold text-[#02110c]">
            <p>Subtotal: {formatPrice(order.subtotalCents)}</p>
            <p>Delivery: {formatPrice(order.shippingCents)}</p>
            <p>Tax: {formatPrice(order.taxCents)}</p>
            <p className="text-base text-[#1a422f] pt-1 border-t border-[#e2d7bb]">
              Total: {formatPrice(order.totalCents)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
