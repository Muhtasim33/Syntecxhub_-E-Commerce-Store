'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Settings,
  ArrowLeft,
  Shield,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Catalog Products', href: '/admin/products', icon: Package },
    { label: 'Collections', href: '/admin/categories', icon: Layers },
    { label: 'Customer Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Clientele Users', href: '/admin/customers', icon: Users },
    { label: 'Maison Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f3ebd6]">
      {/* Mobile Admin Topbar Header */}
      <div className="md:hidden bg-[#02110c] text-[#f3ebd6] px-4 py-3 flex items-center justify-between border-b border-cream-300/10 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg text-[#f3ebd6] hover:bg-[#1a422f]"
            aria-label="Open Admin Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-serif text-base tracking-tight text-[#f3ebd6]">
            AURELIA ADMIN
          </span>
        </div>

        <Link
          href="/"
          className="text-xs text-[#c9a96e] hover:underline flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-3 h-3" /> Store
        </Link>
      </div>

      {/* Desktop Admin Sidebar (Dark Emerald #02110c as per APP_FLOW 9.1) */}
      <aside className="hidden md:flex w-64 bg-[#02110c] text-[#f3ebd6] p-6 flex-col justify-between border-r border-[#02110c] flex-shrink-0 min-h-screen sticky top-0">
        <div className="space-y-6">
          <div className="border-b border-cream-300/10 pb-4">
            <Link href="/" className="font-serif text-xl tracking-tight text-[#f3ebd6] block">
              AURELIA &amp; CO.
            </Link>
            <div className="flex items-center gap-1.5 text-[10px] text-[#c9a96e] uppercase tracking-wider font-bold mt-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Executive Admin Control</span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1a422f] text-[#f3ebd6] font-semibold shadow-sm'
                      : 'text-[#f3ebd6]/80 hover:bg-[#1a422f]/40 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#c9a96e]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-cream-300/10 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-[#f3ebd6]/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors text-left pt-2 border-t border-cream-300/10"
          >
            <LogOut className="w-3.5 h-3.5" /> Exit Session
          </button>
        </div>
      </aside>

      {/* Mobile Slide-Out Admin Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="relative w-4/5 max-w-xs bg-[#02110c] text-[#f3ebd6] h-full p-6 flex flex-col justify-between z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-cream-300/10">
                <span className="font-serif text-lg tracking-tight text-[#f3ebd6]">
                  AURELIA ADMIN
                </span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-[#1a422f] text-[#f3ebd6] font-semibold'
                          : 'text-[#f3ebd6]/80'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#c9a96e]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-cream-300/10 space-y-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-xs text-[#f3ebd6]/80"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileSidebarOpen(false);
                }}
                className="w-full text-left text-xs text-red-400 pt-2"
              >
                Exit Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Content Pane */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
