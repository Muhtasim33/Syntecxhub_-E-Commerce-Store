'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  Heart,
  Lock,
  LogOut,
  LayoutDashboard,
  Shield,
  Menu,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const navItems = [
    { label: 'Dashboard', href: '/account', icon: LayoutDashboard },
    { label: 'Acquisitions', href: '/account/orders', icon: Package },
    { label: 'Destinations', href: '/account/addresses', icon: MapPin },
    { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
    { label: 'Profile', href: '/account/profile', icon: User },
    { label: 'Security', href: '/account/security', icon: Lock },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f3ebd6]">
      <Header />

      <div className="pt-24 sm:pt-28 pb-20 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Mobile Horizontal Sub-Navigation Tab Bar */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#1a422f] text-[#f3ebd6]'
                    : 'bg-white border border-[#e2d7bb] text-[#02110c]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          {/* Desktop Account Sidebar */}
          <aside className="hidden lg:block bg-white rounded-3xl border border-[#e2d7bb] p-6 shadow-sm space-y-6 sticky top-28">
            <div className="flex items-center gap-3 pb-6 border-b border-[#e2d7bb]">
              <div className="w-12 h-12 rounded-full bg-[#1a422f] text-[#f3ebd6] font-serif text-lg flex items-center justify-center font-bold">
                {user?.name ? user.name[0] : 'G'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-sm font-semibold text-[#02110c] truncate">
                  {user?.name || 'Lady Genevieve Vance'}
                </h3>
                <p className="text-[11px] text-[#4a5a50] truncate">
                  {user?.email || 'genevieve.vance@luxurymail.com'}
                </p>
                <span className="inline-block px-2 py-0.5 mt-1 rounded bg-[#1a422f]/10 text-[#1a422f] text-[10px] font-bold uppercase tracking-wider">
                  {user?.role || 'Customer'}
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1a422f] text-[#f3ebd6] font-semibold'
                        : 'text-[#02110c] hover:bg-[#e2d7bb]/40'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {(user?.role === 'admin' || user?.role === 'staff') && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#c9a96e] bg-[#02110c] hover:bg-[#1a422f] transition-colors mt-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Management</span>
                </Link>
              )}

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-red-700 hover:bg-red-50 transition-colors pt-3 border-t border-[#e2d7bb] mt-2 text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </nav>
          </aside>

          {/* Main Content Pane */}
          <main className="lg:col-span-3 bg-white rounded-2xl sm:rounded-3xl border border-[#e2d7bb] p-5 sm:p-8 lg:p-10 shadow-sm min-h-[450px]">
            {children}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
