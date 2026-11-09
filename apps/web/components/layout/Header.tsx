'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Heart,
  Menu,
  X,
  ChevronDown,
  Shield,
  LogOut,
  Package,
  Compass,
} from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { INITIAL_CATEGORIES } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);

  const cartCount = useCartStore((state) => state.getTotalCount());
  const openCartDrawer = useCartStore((state) => state.openDrawer);
  const { user, isAuthenticated, logout } = useAuthStore();

  // Scroll detection: transparent over hero, solid after 80px, hide on scroll down, show on scroll up (PRD ANI-7)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide header on scroll down, reveal on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const isSolid = !isHome || isScrolled;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300 select-none',
          isVisible ? 'translate-y-0' : '-translate-y-full',
          isSolid
            ? 'bg-[#02110c] text-[#f3ebd6] shadow-lg border-b border-[#02110c]/80 py-3 sm:py-3.5'
            : 'bg-transparent text-[#f3ebd6] py-4 sm:py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Mobile Menu Toggle & Desktop Navigation */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-[#f3ebd6] hover:text-white transition-colors focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav className="hidden md:flex items-center gap-6 text-xs lg:text-sm font-medium tracking-wide">
              <Link
                href="/products"
                className="text-[#f3ebd6]/90 hover:text-white transition-colors"
              >
                All Creations
              </Link>

              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-[#f3ebd6]/90 hover:text-white transition-colors py-1">
                  Collections{' '}
                  <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                <div className="absolute top-full left-0 mt-2 w-56 bg-[#02110c] border border-cream-300/20 rounded-xl shadow-2xl py-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200">
                  {INITIAL_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="block px-4 py-2.5 text-xs uppercase tracking-wider text-[#f3ebd6]/80 hover:text-[#f3ebd6] hover:bg-[#1a422f]/40 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/about"
                className="text-[#f3ebd6]/90 hover:text-white transition-colors"
              >
                Maison
              </Link>
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group text-center">
            <span className="font-serif text-xl sm:text-2xl lg:text-3xl tracking-tight text-[#f3ebd6] font-normal group-hover:opacity-90 transition-opacity whitespace-nowrap">
              AURELIA &amp; CO.
            </span>
          </Link>

          {/* Right Actions: Search, Wishlist, Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(
                        searchQuery.trim()
                      )}`;
                    }
                  }}
                  className="flex items-center bg-[#1a422f] rounded-full pl-3 pr-1 py-1 border border-cream-300/30 shadow-inner"
                >
                  <input
                    type="text"
                    placeholder="Search creations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs text-[#f3ebd6] placeholder:text-[#f3ebd6]/60 focus:outline-none w-28 sm:w-44"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-[#f3ebd6]/90 hover:text-white transition-colors"
                  aria-label="Search Catalog"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>

            {/* Wishlist (Hidden on ultra-small screens) */}
            <Link
              href="/account/wishlist"
              className="p-2 text-[#f3ebd6]/90 hover:text-white transition-colors hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="p-2 text-[#f3ebd6]/90 hover:text-white transition-colors flex items-center gap-1"
                aria-label="Account Menu"
              >
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {isAccountMenuOpen && (
                <div
                  className="absolute right-0 mt-3 w-48 sm:w-52 bg-[#02110c] border border-cream-300/20 rounded-2xl shadow-2xl py-2 z-50 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setIsAccountMenuOpen(false)}
                >
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-2 border-b border-cream-300/10 mb-1">
                        <p className="text-[10px] text-[#f3ebd6]/60 uppercase tracking-wider">
                          Signed in as
                        </p>
                        <p className="font-semibold text-xs text-[#f3ebd6] truncate">
                          {user.name}
                        </p>
                      </div>

                      <Link
                        href="/account"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#f3ebd6]/90 hover:text-white hover:bg-[#1a422f]/50"
                      >
                        <UserIcon className="w-3.5 h-3.5" /> Dashboard
                      </Link>

                      <Link
                        href="/account/orders"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#f3ebd6]/90 hover:text-white hover:bg-[#1a422f]/50"
                      >
                        <Package className="w-3.5 h-3.5" /> Acquisitions
                      </Link>

                      {(user.role === 'admin' || user.role === 'staff') && (
                        <Link
                          href="/admin"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#c9a96e] hover:bg-[#1a422f]/50 font-semibold"
                        >
                          <Shield className="w-3.5 h-3.5" /> Admin Suite
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-[#1a422f]/50 border-t border-cream-300/10 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="block px-4 py-2.5 text-xs text-[#f3ebd6]/90 hover:text-white hover:bg-[#1a422f]/50 font-semibold"
                      >
                        Client Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="block px-4 py-2.5 text-xs text-[#f3ebd6]/90 hover:text-white hover:bg-[#1a422f]/50"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Bag Icon & Count */}
            <button
              onClick={openCartDrawer}
              className="relative p-2 text-[#f3ebd6] hover:opacity-90 transition-opacity"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#1a422f] border border-[#c9a96e] text-[#f3ebd6] text-[9px] sm:text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* FULL RESPONSIVE MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#02110c]/80 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-sm bg-[#02110c] text-[#f3ebd6] h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto border-r border-cream-300/20">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-cream-300/10">
                <span className="font-serif text-xl tracking-tight text-[#f3ebd6]">
                  AURELIA &amp; CO.
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-cream-100 hover:text-white rounded-lg"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    setIsMobileMenuOpen(false);
                    window.location.href = `/search?q=${encodeURIComponent(
                      searchQuery.trim()
                    )}`;
                  }
                }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1a422f]/60 border border-cream-300/30 rounded-xl pl-9 pr-3 py-2 text-xs text-[#f3ebd6] placeholder:text-[#f3ebd6]/50 focus:outline-none"
                />
                <Search className="w-4 h-4 text-[#f3ebd6]/60 absolute left-3 top-1/2 -translate-y-1/2" />
              </form>

              {/* Mobile Navigation List */}
              <nav className="space-y-2 text-sm font-medium">
                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-[#1a422f]/40 transition-colors"
                >
                  All Creations
                </Link>

                {/* Collapsible Collections */}
                <div>
                  <button
                    onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
                    className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#1a422f]/40 transition-colors"
                  >
                    <span>Collections</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        mobileCollectionsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {mobileCollectionsOpen && (
                    <div className="pl-6 pt-1 space-y-1 border-l border-cream-300/10 ml-3">
                      {INITIAL_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/categories/${cat.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-2 text-xs text-[#f3ebd6]/80 hover:text-[#c9a96e]"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/account/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-[#1a422f]/40 transition-colors"
                >
                  Wishlist
                </Link>

                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-[#1a422f]/40 transition-colors"
                >
                  The Maison
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-[#1a422f]/40 transition-colors"
                >
                  Contact Concierge
                </Link>
              </nav>
            </div>

            {/* Mobile Footer Area */}
            <div className="pt-6 border-t border-cream-300/10 space-y-3">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#1a422f]/40 rounded-xl">
                    <UserIcon className="w-4 h-4 text-[#c9a96e]" />
                    <span className="text-xs truncate font-medium">{user.name}</span>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center py-2 text-xs bg-[#1a422f] rounded-xl font-semibold text-[#f3ebd6]"
                  >
                    Client Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-1.5 text-xs text-red-400 hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 rounded-xl border border-cream-300/30 text-xs text-center font-semibold hover:bg-white/10"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 rounded-xl bg-[#1a422f] text-xs text-center font-semibold hover:bg-[#25593f]"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
