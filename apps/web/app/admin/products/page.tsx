'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Eye, Filter } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/mockData';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function AdminProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filtered = products.filter((p) => {
    if (categoryFilter && p.categoryId !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'active' ? 'draft' : 'active' }
          : p
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#e2d7bb] pb-4">
        <div>
          <h1 className="font-serif text-2xl text-[#02110c]">Catalog Products</h1>
          <p className="text-xs text-[#4a5a50] mt-1">
            Manage your fine jewelry, apparel, fragrances, and home goods allocations.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a422f] hover:bg-[#25593f] text-[#f3ebd6] font-semibold text-xs transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Creation
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-[#e2d7bb]">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#e2d7bb] bg-white focus:outline-none focus:ring-1 focus:ring-[#1a422f]"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5a50]" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#e2d7bb] bg-white text-[#02110c] focus:outline-none focus:ring-1 focus:ring-[#1a422f] cursor-pointer"
          >
            <option value="">All Categories</option>
            {INITIAL_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2d7bb] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f3ebd6]/60 border-b border-[#e2d7bb] text-[#02110c] uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Creation</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Total Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2d7bb]">
              {filtered.map((product) => {
                const totalStock = product.variants.reduce(
                  (acc, v) => acc + v.stockQuantity,
                  0
                );
                const category = INITIAL_CATEGORIES.find(
                  (c) => c.id === product.categoryId
                );

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-[#f3ebd6]/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]?.url}
                          alt=""
                          className="w-12 h-14 rounded-lg object-cover border border-[#e2d7bb] flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-[#02110c] block truncate max-w-xs">
                            {product.name}
                          </span>
                          <span className="text-[11px] text-[#4a5a50]">
                            {product.variants.length} variant(s)
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-[#4a5a50]">
                      {category?.name || 'Maison'}
                    </td>

                    <td className="p-4 font-bold text-[#1a422f]">
                      {formatPrice(product.basePriceCents)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`font-semibold ${
                          totalStock === 0
                            ? 'text-red-600'
                            : totalStock < 5
                            ? 'text-amber-700'
                            : 'text-[#02110c]'
                        }`}
                      >
                        {totalStock} units
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(product.id)}
                        title="Click to toggle status"
                      >
                        <Badge
                          variant={product.status === 'active' ? 'success' : 'default'}
                        >
                          {product.status}
                        </Badge>
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="p-1.5 text-[#4a5a50] hover:text-[#02110c] hover:bg-cream-100/60 rounded"
                          title="Preview in Storefront"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-[#4a5a50] hover:text-red-700 hover:bg-red-50 rounded"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
