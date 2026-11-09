'use client';

import React, { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  ShieldCheck,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface OrderDetailPageProps {
  params: {
    orderNo: string;
  };
}

const TIMELINE_STEPS = [
  { key: 'pending', label: 'Order Registered', icon: Clock },
  { key: 'paid', label: 'Payment Confirmed', icon: CheckCircle2 },
  { key: 'processing', label: 'Vault Preparation', icon: Package },
  { key: 'shipped', label: 'In Diplomatic Transit', icon: Truck },
  { key: 'delivered', label: 'Safely Delivered', icon: ShieldCheck },
];

export default function CustomerOrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const mockOrders = JSON.parse(
      localStorage.getItem('ecommerce_mock_orders') || '[]'
    );
    const found = mockOrders.find((o: any) => o.orderNumber === params.orderNo);
    if (found) {
      setOrder(found);
    } else {
      // Create a fallback mock for demo
      const mock = {
        orderNumber: params.orderNo,
        email: 'genevieve.vance@luxurymail.com',
        status: 'processing',
        paymentStatus: 'paid',
        paymentMethod: 'card',
        trackingNumber: 'DIPL-US-928194',
        courier: 'Armored Diplomatic Express',
        shippingAddress: {
          fullName: 'Lady Genevieve Vance',
          phone: '+1 (555) 349-8201',
          line1: '740 Park Avenue',
          line2: 'Penthouse 14B',
          city: 'New York',
          state: 'NY',
          postalCode: '10021',
          country: 'United States',
        },
        subtotalCents: 125000,
        shippingCents: 0,
        taxCents: 10000,
        totalCents: 135000,
        items: [
          {
            productName: 'Emerald & 18k Gold Solitaire Ring',
            variantLabel: 'Size: 7, 18k Gold',
            sku: 'RNG-EM-07',
            unitPriceCents: 125000,
            quantity: 1,
            lineTotalCents: 125000,
          },
        ],
        createdAt: new Date().toISOString(),
      };
      setOrder(mock);
    }
  }, [params.orderNo]);

  if (!order) return null;

  const currentStepIndex =
    order.status === 'cancelled'
      ? -1
      : TIMELINE_STEPS.findIndex((s) => s.key === order.status);

  const canCancel = ['pending', 'paid', 'processing'].includes(order.status);

  const handleCancelOrder = () => {
    const mockOrders = JSON.parse(
      localStorage.getItem('ecommerce_mock_orders') || '[]'
    );
    const updated = mockOrders.map((o: any) =>
      o.orderNumber === order.orderNumber ? { ...o, status: 'cancelled' } : o
    );
    localStorage.setItem('ecommerce_mock_orders', JSON.stringify(updated));
    setOrder({ ...order, status: 'cancelled' });
    setShowCancelModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Navigation & Status */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#e2d7bb] pb-6">
        <div>
          <Link
            href="/account/orders"
            className="text-xs text-[#1a422f] hover:underline flex items-center gap-1.5 mb-2 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to all acquisitions
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#02110c]">
              Acquisition #{order.orderNumber}
            </h1>
            <Badge variant={order.status === 'cancelled' ? 'danger' : 'success'}>
              {order.status}
            </Badge>
          </div>
          <p className="text-xs text-[#4a5a50] mt-1">
            Registered on {formatDate(order.createdAt)}
          </p>
        </div>

        {canCancel && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCancelModal(true)}
            className="text-red-700 border-red-300 hover:bg-red-50 text-xs"
          >
            Cancel Acquisition
          </Button>
        )}
      </div>

      {/* Visual Status Timeline Machine */}
      {order.status === 'cancelled' ? (
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-700 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-xs">Acquisition Cancelled</h4>
            <p className="text-xs text-red-800/80 mt-0.5">
              This order was cancelled. Reserved vault stock has been safely released.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#f3ebd6]/40 border border-[#e2d7bb] space-y-6">
          <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#02110c]">
            Acquisition Lifecycle Timeline
          </h3>

          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {TIMELINE_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isPastOrCurrent = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step.key}
                  className="flex md:flex-col items-center gap-3 flex-1 text-left md:text-center z-10"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-[#1a422f] text-[#f3ebd6] ring-4 ring-[#1a422f]/20 scale-110 shadow-md'
                        : isPastOrCurrent
                        ? 'bg-[#2f7d4f] text-white'
                        : 'bg-white border border-[#e2d7bb] text-[#4a5a50]/40'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-semibold ${
                        isPastOrCurrent ? 'text-[#02110c]' : 'text-[#4a5a50]/60'
                      }`}
                    >
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] text-[#1a422f] font-bold uppercase tracking-wider block">
                        Current Status
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tracking info pill */}
          {order.trackingNumber && (
            <div className="p-4 rounded-xl bg-white border border-[#e2d7bb] flex flex-col sm:flex-row justify-between sm:items-center text-xs gap-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#1a422f]" />
                <span>
                  Courier: <strong className="text-[#02110c]">{order.courier}</strong>
                </span>
                <span className="text-[#e2d7bb]">&bull;</span>
                <span>
                  Waybill: <strong className="font-mono text-[#02110c]">{order.trackingNumber}</strong>
                </span>
              </div>
              <span className="text-[11px] text-[#2f7d4f] font-semibold">
                Insured Armored Transit Active
              </span>
            </div>
          )}
        </div>
      )}

      {/* Items Breakdown */}
      <div className="border border-[#e2d7bb] rounded-2xl overflow-hidden bg-white">
        <div className="px-6 py-4 bg-[#f3ebd6]/60 border-b border-[#e2d7bb] font-serif text-sm font-semibold text-[#02110c]">
          Creation Allocations ({order.items?.length || 0})
        </div>

        <div className="divide-y divide-[#e2d7bb] px-6 text-xs">
          {order.items?.map((item: any, idx: number) => (
            <div key={idx} className="py-4 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-[#02110c]">{item.productName}</h4>
                <p className="text-[#4a5a50]">{item.variantLabel}</p>
                <p className="text-[11px] text-[#4a5a50]">SKU: {item.sku}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#1a422f]">
                  {formatPrice(item.lineTotalCents)}
                </span>
                <p className="text-[11px] text-[#4a5a50]">
                  {formatPrice(item.unitPriceCents)} &times; {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Totals */}
        <div className="p-6 bg-[#f3ebd6]/20 border-t border-[#e2d7bb] space-y-2 text-xs">
          <div className="flex justify-between text-[#4a5a50]">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotalCents)}</span>
          </div>
          <div className="flex justify-between text-[#4a5a50]">
            <span>Delivery</span>
            <span>
              {order.shippingCents === 0 ? 'Complimentary' : formatPrice(order.shippingCents)}
            </span>
          </div>
          <div className="flex justify-between text-[#4a5a50]">
            <span>Taxes</span>
            <span>{formatPrice(order.taxCents)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-[#02110c] border-t border-[#e2d7bb] pt-2">
            <span>Total Investment</span>
            <span className="text-[#1a422f]">{formatPrice(order.totalCents)}</span>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        <div className="p-5 rounded-2xl border border-[#e2d7bb] bg-white space-y-1.5">
          <h4 className="font-serif text-sm font-semibold text-[#02110c]">
            Delivery Destination
          </h4>
          <p className="font-semibold text-[#02110c]">
            {order.shippingAddress?.fullName}
          </p>
          <p className="text-[#4a5a50]">{order.shippingAddress?.line1}</p>
          {order.shippingAddress?.line2 && (
            <p className="text-[#4a5a50]">{order.shippingAddress?.line2}</p>
          )}
          <p className="text-[#4a5a50]">
            {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
            {order.shippingAddress?.postalCode}
          </p>
          <p className="text-[#4a5a50]">{order.shippingAddress?.phone}</p>
        </div>

        <div className="p-5 rounded-2xl border border-[#e2d7bb] bg-white space-y-1.5">
          <h4 className="font-serif text-sm font-semibold text-[#02110c]">
            Payment Verification
          </h4>
          <p className="text-[#02110c]">
            Method:{' '}
            <strong className="uppercase">{order.paymentMethod}</strong>
          </p>
          <p className="text-[#02110c]">
            Payment Status:{' '}
            <strong className="text-[#2f7d4f] capitalize">
              {order.paymentStatus}
            </strong>
          </p>
          <p className="text-[#4a5a50] text-[11px] pt-1">
            PCI SAQ-A verification tokenized.
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#02110c]/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#e2d7bb] space-y-4">
            <h3 className="font-serif text-xl text-[#02110c]">
              Cancel Acquisition?
            </h3>
            <p className="text-xs text-[#4a5a50] leading-relaxed">
              Are you certain you wish to cancel acquisition #{order.orderNumber}? This action will release the allocated vault reserve.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Order
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleCancelOrder}
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
