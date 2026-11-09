'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Check,
  CreditCard,
  Banknote,
  Truck,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { formatPrice } from '@/lib/utils';
import { BUSINESS_RULES } from '@ecommerce/shared';

type CheckoutStep = 1 | 2 | 3 | 4;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotalCents, clearCart } = useCartStore();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Gateway Hosted Simulation Modal State
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [pendingOrderNo, setPendingOrderNo] = useState('');
  const [gatewayProcessing, setGatewayProcessing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Monitor browser network connectivity for edge-case resilience
  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Step 1: Address Form State
  const [addressData, setAddressData] = useState({
    fullName: 'Lady Genevieve Vance',
    email: 'genevieve.vance@luxurymail.com',
    phone: '+1 (555) 349-8201',
    line1: '740 Park Avenue',
    line2: 'Penthouse 14B',
    city: 'New York',
    state: 'NY',
    postalCode: '10021',
    country: 'United States',
  });

  // Step 2: Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [cardData, setCardData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    expDate: '12/28',
    cvv: '888',
    nameOnCard: 'LADY GENEVIEVE VANCE',
  });

  const subtotalCents = getSubtotalCents();

  // Redirect if cart is empty
  if (items.length === 0 && currentStep !== 4 && !showGatewayModal) {
    return (
      <div className="pt-32 pb-24 max-w-xl mx-auto px-4 text-center">
        <h2 className="font-serif text-2xl text-[#02110c] mb-2">
          Your shopping bag is empty
        </h2>
        <p className="text-xs text-[#4a5a50] mb-6">
          Please select a creation to initiate private checkout.
        </p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 rounded-xl bg-[#1a422f] text-[#f3ebd6] text-xs font-semibold"
        >
          Explore Creations
        </Link>
      </div>
    );
  }

  const shippingCostCents =
    shippingMethod === 'express' ? BUSINESS_RULES.EXPRESS_SHIPPING_CENTS : 0;
  const taxCents = Math.round(subtotalCents * BUSINESS_RULES.TAX_RATE);
  const totalCents = subtotalCents + shippingCostCents + taxCents;

  const handlePlaceOrder = () => {
    const orderNo = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
    setPendingOrderNo(orderNo);

    if (paymentMethod === 'card') {
      // Step 4 online payment gateway trigger (APP_FLOW.md Section 4.1)
      setShowGatewayModal(true);
    } else {
      // Cash on Delivery (COD) immediate reservation & confirmation
      setIsSubmitting(true);
      const newOrder = {
        orderNumber: orderNo,
        email: addressData.email,
        status: 'processing',
        paymentStatus: 'unpaid',
        paymentMethod: 'cod',
        shippingAddress: addressData,
        subtotalCents,
        shippingCents: shippingCostCents,
        taxCents,
        totalCents,
        items: items.map((i) => ({
          productName: i.productName,
          variantLabel: i.variantLabel,
          sku: i.sku,
          unitPriceCents: i.priceCents,
          quantity: i.quantity,
          lineTotalCents: i.priceCents * i.quantity,
        })),
        createdAt: new Date().toISOString(),
      };

      const existingOrders = JSON.parse(
        localStorage.getItem('ecommerce_mock_orders') || '[]'
      );
      localStorage.setItem(
        'ecommerce_mock_orders',
        JSON.stringify([newOrder, ...existingOrders])
      );

      setTimeout(() => {
        clearCart();
        router.push(`/checkout/success/${orderNo}`);
      }, 1000);
    }
  };

  const handleGatewaySuccess = () => {
    setGatewayProcessing(true);

    const newOrder = {
      orderNumber: pendingOrderNo,
      email: addressData.email,
      status: 'paid',
      paymentStatus: 'paid',
      paymentMethod: 'card',
      shippingAddress: addressData,
      subtotalCents,
      shippingCents: shippingCostCents,
      taxCents,
      totalCents,
      items: items.map((i) => ({
        productName: i.productName,
        variantLabel: i.variantLabel,
        sku: i.sku,
        unitPriceCents: i.priceCents,
        quantity: i.quantity,
        lineTotalCents: i.priceCents * i.quantity,
      })),
      createdAt: new Date().toISOString(),
    };

    const existingOrders = JSON.parse(
      localStorage.getItem('ecommerce_mock_orders') || '[]'
    );
    localStorage.setItem(
      'ecommerce_mock_orders',
      JSON.stringify([newOrder, ...existingOrders])
    );

    setTimeout(() => {
      clearCart();
      router.push(`/checkout/success/${pendingOrderNo}`);
    }, 1200);
  };

  const handleGatewayFailure = () => {
    setGatewayProcessing(true);
    setTimeout(() => {
      router.push(`/checkout/failed/${pendingOrderNo}?reason=card_declined`);
    }, 800);
  };

  const handleGatewayNetworkTimeout = () => {
    setGatewayProcessing(true);
    // Create pending reserved order in localStorage before network timeout redirect
    const pendingOrder = {
      orderNumber: pendingOrderNo,
      email: addressData.email,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod: 'card',
      shippingAddress: addressData,
      subtotalCents,
      shippingCents: shippingCostCents,
      taxCents,
      totalCents,
      items: items.map((i) => ({
        productName: i.productName,
        variantLabel: i.variantLabel,
        sku: i.sku,
        unitPriceCents: i.priceCents,
        quantity: i.quantity,
        lineTotalCents: i.priceCents * i.quantity,
      })),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30-min vault reserve
    };

    const existingOrders = JSON.parse(
      localStorage.getItem('ecommerce_mock_orders') || '[]'
    );
    localStorage.setItem(
      'ecommerce_mock_orders',
      JSON.stringify([pendingOrder, ...existingOrders])
    );

    setTimeout(() => {
      router.push(`/checkout/failed/${pendingOrderNo}?reason=network_timeout`);
    }, 1000);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Real-time Offline Warning Banner */}
      {isOffline && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-900 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0" />
          <div>
            <p className="font-semibold">Network Connection Lost</p>
            <p className="text-[11px] text-amber-800">
              Your device appears to be offline. Please do not refresh. Your allocated items are safely preserved.
            </p>
          </div>
        </div>
      )}

      {/* Mobile Collapsible Order Summary Accordion */}
      <div className="lg:hidden bg-white border border-[#e2d7bb] rounded-2xl p-4 mb-6 shadow-sm">
        <button
          onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
          className="w-full flex justify-between items-center text-xs font-semibold text-[#02110c]"
        >
          <div className="flex items-center gap-2">
            <span>Summary ({items.length} items)</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                mobileSummaryOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
          <span className="text-sm font-bold text-[#1a422f]">
            {formatPrice(totalCents)}
          </span>
        </button>

        {mobileSummaryOpen && (
          <div className="pt-4 mt-3 border-t border-[#e2d7bb] space-y-3 text-xs">
            {items.map((item) => (
              <div key={item.variantId} className="flex justify-between items-center">
                <span className="truncate max-w-[200px]">
                  {item.productName} ({item.quantity}x)
                </span>
                <span className="font-semibold text-[#02110c]">
                  {formatPrice(item.priceCents * item.quantity)}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-[#e2d7bb] flex justify-between text-[#4a5a50]">
              <span>Delivery:</span>
              <span>{shippingCostCents === 0 ? 'Complimentary' : formatPrice(shippingCostCents)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Progress Stepper (Responsive) */}
      <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Address' },
            { num: 2, label: 'Delivery' },
            { num: 3, label: 'Payment' },
            { num: 4, label: 'Confirm' },
          ].map((step, idx) => (
            <React.Fragment key={step.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-colors ${
                    currentStep === step.num
                      ? 'bg-[#1a422f] text-[#f3ebd6] ring-4 ring-[#1a422f]/20'
                      : currentStep > step.num
                      ? 'bg-[#2f7d4f] text-white'
                      : 'bg-white border border-[#e2d7bb] text-[#4a5a50]'
                  }`}
                >
                  {currentStep > step.num ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  ) : (
                    step.num
                  )}
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-[#02110c] mt-1 uppercase tracking-wider">
                  {step.label}
                </span>
              </div>
              {idx < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-colors ${
                    currentStep > idx + 1 ? 'bg-[#2f7d4f]' : 'bg-[#e2d7bb]'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        {/* Main Steps Form Container */}
        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl border border-[#e2d7bb] p-5 sm:p-10 shadow-sm">
          {/* STEP 1: ADDRESS */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-[#e2d7bb] pb-4">
                <h2 className="font-serif text-xl sm:text-2xl text-[#02110c]">
                  Private Shipping Destination
                </h2>
                <p className="text-xs text-[#4a5a50] mt-1">
                  Ensure all details match your private residence or registered concierge address.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]">
                    Full Name &amp; Title
                  </label>
                  <input
                    type="text"
                    value={addressData.fullName}
                    onChange={(e) =>
                      setAddressData({ ...addressData, fullName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] text-xs text-[#02110c] focus:outline-none focus:ring-1 focus:ring-[#1a422f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={addressData.email}
                    onChange={(e) =>
                      setAddressData({ ...addressData, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] text-xs text-[#02110c] focus:outline-none focus:ring-1 focus:ring-[#1a422f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]">
                    Telephone
                  </label>
                  <input
                    type="tel"
                    value={addressData.phone}
                    onChange={(e) =>
                      setAddressData({ ...addressData, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] text-xs text-[#02110c] focus:outline-none focus:ring-1 focus:ring-[#1a422f]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]">
                    Street Address Line 1
                  </label>
                  <input
                    type="text"
                    value={addressData.line1}
                    onChange={(e) =>
                      setAddressData({ ...addressData, line1: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] text-xs text-[#02110c] focus:outline-none focus:ring-1 focus:ring-[#1a422f]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]">
                    Apartment / Suite (Optional)
                  </label>
                  <input
                    type="text"
                    value={addressData.line2}
                    onChange={(e) =>
                      setAddressData({ ...addressData, line2: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] text-xs text-[#02110c] focus:outline-none focus:ring-1 focus:ring-[#1a422f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]">
                    City
                  </label>
                  <input
                    type="text"
                    value={addressData.city}
                    onChange={(e) =>
                      setAddressData({ ...addressData, city: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] text-xs text-[#02110c] focus:outline-none focus:ring-1 focus:ring-[#1a422f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={addressData.state}
                    onChange={(e) =>
                      setAddressData({ ...addressData, state: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] text-xs text-[#02110c] focus:outline-none focus:ring-1 focus:ring-[#1a422f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]">
                    Postal / Zip Code
                  </label>
                  <input
                    type="text"
                    value={addressData.postalCode}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        postalCode: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] text-xs text-[#02110c] focus:outline-none focus:ring-1 focus:ring-[#1a422f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    value={addressData.country}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] bg-cream-100/40 text-xs text-[#02110c] font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-[#e2d7bb] flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#1a422f] hover:bg-[#25593f] text-[#f3ebd6] font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  Continue to Delivery <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SHIPPING METHOD */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-[#e2d7bb] pb-4">
                <h2 className="font-serif text-xl sm:text-2xl text-[#02110c]">
                  Select Delivery Protocol
                </h2>
                <p className="text-xs text-[#4a5a50] mt-1">
                  All transit is conducted via insured private transport with direct signature upon arrival.
                </p>
              </div>

              <div className="space-y-3">
                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`block p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    shippingMethod === 'standard'
                      ? 'border-[#1a422f] bg-[#1a422f]/5'
                      : 'border-[#e2d7bb] hover:border-[#1a422f]/40'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex gap-3">
                      <Truck className="w-5 h-5 text-[#1a422f] mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#02110c]">
                          Insured Diplomatic Courier (Standard)
                        </h4>
                        <p className="text-[11px] sm:text-xs text-[#4a5a50] mt-0.5">
                          Estimated delivery within 2 &ndash; 4 business days. Signature required.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#2f7d4f] whitespace-nowrap">
                      Free
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => setShippingMethod('express')}
                  className={`block p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    shippingMethod === 'express'
                      ? 'border-[#1a422f] bg-[#1a422f]/5'
                      : 'border-[#e2d7bb] hover:border-[#1a422f]/40'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#c9a96e] mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#02110c]">
                          White-Glove Armored Express
                        </h4>
                        <p className="text-[11px] sm:text-xs text-[#4a5a50] mt-0.5">
                          Priority next-morning arrival with dedicated diplomatic courier escort.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#1a422f] whitespace-nowrap">
                      $25.00
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-6 border-t border-[#e2d7bb] flex flex-col sm:flex-row justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto text-xs font-semibold text-[#02110c] hover:underline flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Address
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#1a422f] hover:bg-[#25593f] text-[#f3ebd6] font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD SELECTION */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-[#e2d7bb] pb-4">
                <h2 className="font-serif text-xl sm:text-2xl text-[#02110c]">
                  Select Settlement Method
                </h2>
                <p className="text-xs text-[#4a5a50] mt-1">
                  Card payments are tokenized via hosted gateway iframe. Cash on Delivery is verified upon courier arrival.
                </p>
              </div>

              {/* Payment selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#1a422f] bg-[#1a422f]/5 shadow-sm'
                      : 'border-[#e2d7bb] hover:border-[#1a422f]/30'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <CreditCard className="w-5 h-5 text-[#1a422f]" />
                    <span className="text-[10px] bg-[#2f7d4f]/10 text-[#2f7d4f] px-2 py-0.5 rounded-full font-bold uppercase">
                      Instant Online
                    </span>
                  </div>
                  <span className="font-serif text-xs font-semibold text-[#02110c] block">
                    Credit / Debit Card
                  </span>
                  <span className="text-[10px] text-[#4a5a50]">
                    Visa, MasterCard, Amex &bull; Hosted Container
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#1a422f] bg-[#1a422f]/5 shadow-sm'
                      : 'border-[#e2d7bb] hover:border-[#1a422f]/30'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <Banknote className="w-5 h-5 text-[#1a422f]" />
                    <span className="text-[10px] bg-[#1a422f]/10 text-[#1a422f] px-2 py-0.5 rounded-full font-bold uppercase">
                      Upon Arrival
                    </span>
                  </div>
                  <span className="font-serif text-xs font-semibold text-[#02110c] block">
                    Cash on Delivery (COD)
                  </span>
                  <span className="text-[10px] text-[#4a5a50]">
                    Settled upon courier inspection
                  </span>
                </button>
              </div>

              {/* Card Container Preview */}
              {paymentMethod === 'card' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#f3ebd6]/40 border border-[#e2d7bb] space-y-4">
                  <div className="flex items-center gap-2 text-[11px] text-[#2f7d4f] font-semibold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Hosted Tokenized Gateway Container (PCI SAQ-A Compliant)</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-[#02110c]">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardData.cardNumber}
                        onChange={(e) =>
                          setCardData({ ...cardData, cardNumber: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] bg-white text-xs font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-[#02110c]">
                          Expiration
                        </label>
                        <input
                          type="text"
                          value={cardData.expDate}
                          onChange={(e) =>
                            setCardData({ ...cardData, expDate: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] bg-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-[#02110c]">
                          CVV Security Code
                        </label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) =>
                            setCardData({ ...cardData, cvv: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] bg-white text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-[#02110c]">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardData.nameOnCard}
                        onChange={(e) =>
                          setCardData({ ...cardData, nameOnCard: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] bg-white text-xs uppercase"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-[#e2d7bb] flex flex-col sm:flex-row justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto text-xs font-semibold text-[#02110c] hover:underline flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Delivery
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#1a422f] hover:bg-[#25593f] text-[#f3ebd6] font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  Review Order <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & PLACE ORDER */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-[#e2d7bb] pb-4">
                <h2 className="font-serif text-xl sm:text-2xl text-[#02110c]">
                  Confirm &amp; Place Order
                </h2>
                <p className="text-xs text-[#4a5a50] mt-1">
                  Upon confirmation, stock is reserved in our secure vault for 30 minutes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#f3ebd6]/40 border border-[#e2d7bb] space-y-1">
                  <span className="font-bold text-[#1a422f] uppercase tracking-wider text-[10px]">
                    Shipping Destination
                  </span>
                  <p className="font-semibold text-[#02110c]">
                    {addressData.fullName}
                  </p>
                  <p className="text-[#4a5a50]">
                    {addressData.line1}, {addressData.line2}
                  </p>
                  <p className="text-[#4a5a50]">
                    {addressData.city}, {addressData.state} {addressData.postalCode}
                  </p>
                  <p className="text-[#4a5a50]">{addressData.phone}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#f3ebd6]/40 border border-[#e2d7bb] space-y-1">
                  <span className="font-bold text-[#1a422f] uppercase tracking-wider text-[10px]">
                    Settlement Method
                  </span>
                  <p className="text-[#02110c]">
                    <span className="font-semibold">Protocol:</span>{' '}
                    {paymentMethod === 'card' ? 'Online Card (Hosted Container)' : 'Cash on Delivery (COD)'}
                  </p>
                  <p className="text-[#02110c]">
                    <span className="font-semibold">Delivery:</span>{' '}
                    {shippingMethod === 'standard' ? 'Insured Diplomatic Courier' : 'White-Glove Armored Express'}
                  </p>
                  <p className="text-[#2f7d4f] font-semibold text-[11px] pt-1">
                    {paymentMethod === 'card' ? 'Ready for gateway authentication' : 'Funds collected upon arrival'}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-[#e2d7bb] flex flex-col sm:flex-row justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="w-full sm:w-auto text-xs font-semibold text-[#02110c] hover:underline flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Payment
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#1a422f] hover:bg-[#25593f] text-[#f3ebd6] font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-xl flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
                >
                  {isSubmitting
                    ? 'Confirming Allocation...'
                    : paymentMethod === 'card'
                    ? `Proceed to Payment Gateway • ${formatPrice(totalCents)}`
                    : `Place Order (COD) • ${formatPrice(totalCents)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Order Summary Column */}
        <div className="hidden lg:block bg-white rounded-3xl border border-[#e2d7bb] p-6 space-y-6 sticky top-28">
          <h3 className="font-serif text-lg text-[#02110c] border-b border-[#e2d7bb] pb-3">
            Your Order ({items.length})
          </h3>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-1 divide-y divide-[#e2d7bb]">
            {items.map((item) => (
              <div key={item.variantId} className="pt-3 first:pt-0 flex gap-3 items-center">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-14 h-16 rounded-lg object-cover border border-[#e2d7bb]"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-[#02110c] truncate">
                    {item.productName}
                  </h4>
                  <p className="text-[11px] text-[#4a5a50]">
                    Qty: {item.quantity} &bull; {item.variantLabel}
                  </p>
                  <p className="text-xs font-bold text-[#1a422f] mt-0.5">
                    {formatPrice(item.priceCents * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 pt-4 border-t border-[#e2d7bb] text-xs text-[#4a5a50]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#02110c]">
                {formatPrice(subtotalCents)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>
                {shippingCostCents === 0 ? (
                  <span className="text-[#2f7d4f] font-semibold">Complimentary</span>
                ) : (
                  formatPrice(shippingCostCents)
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (8%)</span>
              <span>{formatPrice(taxCents)}</span>
            </div>
            <div className="border-t border-[#e2d7bb] pt-3 flex justify-between items-baseline font-bold text-sm text-[#02110c]">
              <span>Total Investment</span>
              <span className="text-lg text-[#1a422f]">
                {formatPrice(totalCents)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* HOSTED PAYMENT GATEWAY MODAL (APP_FLOW.md Section 4.1 Flow Simulation) */}
      {showGatewayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#02110c]/85 backdrop-blur-md">
          <div className="bg-[#f3ebd6] rounded-3xl p-6 sm:p-10 max-w-lg w-full border border-[#e2d7bb] shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#e2d7bb] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1a422f] text-[#f3ebd6] flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#02110c]">
                    Sovereign Payment Gateway
                  </h3>
                  <span className="text-[10px] text-[#2f7d4f] font-semibold block">
                    PCI SAQ-A Certified Hosted Session
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[#02110c]">
                {formatPrice(totalCents)}
              </span>
            </div>

            <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#e2d7bb] text-xs">
              <div className="flex justify-between text-[#4a5a50]">
                <span>Allocation Order Ref:</span>
                <span className="font-mono font-bold text-[#02110c]">#{pendingOrderNo}</span>
              </div>
              <div className="flex justify-between text-[#4a5a50]">
                <span>Cardholder:</span>
                <span className="font-semibold text-[#02110c]">{cardData.nameOnCard}</span>
              </div>
              <div className="flex justify-between text-[#4a5a50]">
                <span>Authorized Card:</span>
                <span className="font-mono text-[#02110c]">{cardData.cardNumber}</span>
              </div>
            </div>

            <p className="text-xs text-[#4a5a50] leading-relaxed">
              In production, this hosted container securely verifies 3D Secure / biometrics with your issuing financial institution.
            </p>

            {gatewayProcessing ? (
              <div className="py-6 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#1a422f] mx-auto" />
                <p className="text-xs font-semibold text-[#02110c]">
                  Confirming cryptographic webhook signature...
                </p>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleGatewaySuccess}
                  className="w-full py-3.5 rounded-xl bg-[#1a422f] hover:bg-[#25593f] text-[#f3ebd6] font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShieldCheck className="w-4 h-4 text-[#c9a96e]" /> Authorize Payment Success (Webhook 200)
                </button>

                <button
                  type="button"
                  onClick={handleGatewayFailure}
                  className="w-full py-2.5 rounded-xl border border-red-300 text-xs text-red-700 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5 font-medium"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> Simulate Gateway Failure (Card Declined)
                </button>

                <button
                  type="button"
                  onClick={handleGatewayNetworkTimeout}
                  className="w-full py-2.5 rounded-xl border border-amber-300 bg-amber-50/50 text-xs text-amber-800 hover:bg-amber-100/70 transition-colors flex items-center justify-center gap-1.5 font-medium"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Simulate Network Interruption / Drop (Timeout Scenario)
                </button>

                <button
                  type="button"
                  onClick={() => setShowGatewayModal(false)}
                  className="w-full text-center text-xs text-[#4a5a50] hover:underline pt-1"
                >
                  Cancel and Return to Review
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
