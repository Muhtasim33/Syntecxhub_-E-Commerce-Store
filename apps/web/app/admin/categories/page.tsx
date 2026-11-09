'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#e2d7bb] pb-4">
        <div>
          <h1 className="font-serif text-2xl text-[#02110c]">Collections &amp; Categories</h1>
          <p className="text-xs text-[#4a5a50] mt-1">
            Organize catalog hierarchies, curated universe banners, and public navigation taxonomy.
          </p>
        </div>

        <Button size="sm" variant="primary" className="rounded-xl text-xs gap-1.5">
          <Plus className="w-4 h-4" /> Add Collection
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-2xl border border-[#e2d7bb] bg-white overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] bg-cream-300/30">
              <img
                src={cat.imageUrl || ''}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 bg-[#02110c]/80 text-[#f3ebd6] text-[10px] font-mono px-2 py-0.5 rounded-full">
                /{cat.slug}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <h4 className="font-serif text-base text-[#02110c]">{cat.name}</h4>

              <div className="flex justify-between items-center pt-2 border-t border-[#e2d7bb] text-xs">
                <span className="text-[#2f7d4f] font-semibold text-[11px]">
                  Active in Navigation
                </span>
                <div className="flex gap-1 text-[#4a5a50]">
                  <button className="p-1 hover:text-[#02110c]">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 hover:text-red-700">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
