'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem } from '@ecommerce/shared';

export interface LocalCartItem {
  variantId: string;
  quantity: number;
  productName: string;
  variantLabel: string;
  sku: string;
  priceCents: number;
  imageUrl: string;
  stockQuantity: number;
}

interface CartStoreState {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  items: LocalCartItem[];
  addItem: (item: LocalCartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;

  // Derived getters
  getTotalCount: () => number;
  getSubtotalCents: () => number;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      isDrawerOpen: false,
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.variantId === newItem.variantId
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            const existing = updated[existingIndex];
            const newQty = Math.min(
              existing.quantity + newItem.quantity,
              newItem.stockQuantity
            );
            updated[existingIndex] = { ...existing, quantity: newQty };
            return { items: updated, isDrawerOpen: true };
          }

          return {
            items: [...state.items, newItem],
            isDrawerOpen: true,
          };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity: Math.min(quantity, item.stockQuantity) }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotalCents: () => {
        return get().items.reduce(
          (total, item) => total + item.priceCents * item.quantity,
          0
        );
      },
    }),
    {
      name: 'ecommerce_guest_cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
