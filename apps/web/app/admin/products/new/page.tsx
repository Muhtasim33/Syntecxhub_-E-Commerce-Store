'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { slugify } from '@/lib/utils';

export default function AdminNewProductPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(INITIAL_CATEGORIES[0]?.id || '');
  const [basePriceDollars, setBasePriceDollars] = useState('450');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80'
  );
  const [status, setStatus] = useState<'active' | 'draft'>('active');

  const [variants, setVariants] = useState([
    {
      sku: 'NEW-PROD-01',
      optionLabel: 'Standard Size / 18k Gold',
      priceDollars: '450',
      stock: 10,
      threshold: 2,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(slugify(val));
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        sku: `NEW-PROD-0${variants.length + 1}`,
        optionLabel: 'Alternate Variant',
        priceDollars: basePriceDollars,
        stock: 5,
        threshold: 2,
      },
    ]);
  };

  const removeVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
    }, 600);
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
          <h1 className="font-serif text-2xl text-[#02110c]">Add New Creation</h1>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2f7d4f]" />
          <span>Product successfully registered into catalog! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl border border-[#e2d7bb]">
        {/* Section 1: General Info */}
        <div className="space-y-4">
          <h3 className="font-serif text-base font-semibold text-[#02110c] border-b border-[#e2d7bb] pb-2">
            General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Colombian Raw Emerald Cufflinks"
            />

            <Input
              label="URL Slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] bg-cream-100/60 text-xs text-[#02110c] focus:outline-none focus:ring-1 focus:ring-[#1a422f]"
              >
                {INITIAL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Base Price (USD)"
              type="number"
              required
              value={basePriceDollars}
              onChange={(e) => setBasePriceDollars(e.target.value)}
              placeholder="450"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider font-semibold text-[#02110c]">
              Artisanal Description
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2d7bb] bg-cream-100/60 text-xs text-[#02110c] focus:outline-none focus:ring-1 focus:ring-[#1a422f]"
              placeholder="Detail the materials, carat weight, provenance, and generational craftsmanship..."
            />
          </div>
        </div>

        {/* Section 2: Media */}
        <div className="space-y-4">
          <h3 className="font-serif text-base font-semibold text-[#02110c] border-b border-[#e2d7bb] pb-2">
            Imagery
          </h3>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-28 h-36 rounded-xl overflow-hidden bg-cream-300/30 border border-[#e2d7bb] flex-shrink-0">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 w-full space-y-2">
              <Input
                label="Primary Image URL"
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
              <p className="text-[11px] text-[#4a5a50]">
                High-resolution imagery with neutral or dark atelier backgrounds recommended.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Variants & Inventory */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-[#e2d7bb] pb-2">
            <h3 className="font-serif text-base font-semibold text-[#02110c]">
              Vault Variants &amp; Stock
            </h3>
            <button
              type="button"
              onClick={addVariant}
              className="text-xs font-semibold text-[#1a422f] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Variation
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((v, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#e2d7bb] bg-cream-100/20 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
              >
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#02110c]">
                    Variant Label
                  </label>
                  <input
                    type="text"
                    value={v.optionLabel}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[idx].optionLabel = e.target.value;
                      setVariants(updated);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-[#e2d7bb] bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#02110c]">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={v.sku}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[idx].sku = e.target.value;
                      setVariants(updated);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-[#e2d7bb] bg-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#02110c]">
                    Vault Stock
                  </label>
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[idx].stock = Number(e.target.value);
                      setVariants(updated);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-[#e2d7bb] bg-white"
                  />
                </div>

                <div className="flex justify-end">
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="p-2 text-red-700 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Publishing status */}
        <div className="pt-4 border-t border-[#e2d7bb] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-semibold text-[#02110c]">
              Catalog Status:
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-[#e2d7bb] text-xs font-semibold cursor-pointer"
            >
              <option value="active">Active (Publicly Visible)</option>
              <option value="draft">Draft (Private)</option>
            </select>
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            variant="primary"
            className="rounded-xl px-8"
          >
            Publish Creation
          </Button>
        </div>
      </form>
    </div>
  );
}
