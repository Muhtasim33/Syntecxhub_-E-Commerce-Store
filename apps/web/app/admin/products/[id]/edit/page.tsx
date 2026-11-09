'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Trash2 } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function AdminEditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const product = INITIAL_PRODUCTS.find((p) => p.id === params.id) || INITIAL_PRODUCTS[0];

  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [basePriceDollars, setBasePriceDollars] = useState(
    (product?.basePriceCents ? product.basePriceCents / 100 : 450).toString()
  );
  const [status, setStatus] = useState(product?.status || 'active');
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      router.push('/admin/products');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-[#e2d7bb] pb-4">
        <div>
          <Link
            href="/admin/products"
            className="text-xs text-[#1a422f] hover:underline flex items-center gap-1.5 mb-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          <h1 className="font-serif text-2xl text-[#02110c]">
            Edit Creation: {product?.name}
          </h1>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2f7d4f]" />
          <span>Product alterations saved. Redirecting to catalog...</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 bg-white p-8 rounded-3xl border border-[#e2d7bb]">
        <Input
          label="Product Name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]">
            Description
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] bg-cream-100/60 text-xs text-[#02110c] focus:outline-none focus:ring-1 focus:ring-[#1a422f]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Base Price (USD)"
            type="number"
            required
            value={basePriceDollars}
            onChange={(e) => setBasePriceDollars(e.target.value)}
          />

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]">
              Catalog Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] bg-cream-100/60 text-xs text-[#02110c]"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-[#e2d7bb] flex justify-end">
          <Button type="submit" variant="primary" className="rounded-xl px-8">
            Update Creation
          </Button>
        </div>
      </form>
    </div>
  );
}
