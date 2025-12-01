/**
 * Cartify Global State Management - Zustand Store
 * "The Brain" - Central state untuk shopping session
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Interface untuk item di keranjang belanja
 */
export interface CartItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  total: number; // qty * price
  timestamp: number; // Kapan item ditambahkan
}

/**
 * Interface untuk seluruh state cart
 */
interface CartState {
  // State Data
  budgetLimit: number;
  currentSpent: number;
  items: CartItem[];
  isOffline: boolean;
  
  // Actions
  setBudget: (amount: number) => void;
  addItem: (item: Omit<CartItem, 'id' | 'total' | 'timestamp'>) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, newQty: number) => void;
  resetSession: () => void;
  setOfflineStatus: (status: boolean) => void;
  
  // Computed Helpers
  getRemainingBudget: () => number;
  isOverBudget: () => boolean;
}

/**
 * Zustand Store dengan Persistence
 * Data akan tersimpan di AsyncStorage sehingga bertahan setelah app ditutup
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial State
      budgetLimit: 0,
      currentSpent: 0,
      items: [],
      isOffline: false,

      /**
       * Set budget limit pengguna
       */
      setBudget: (amount) => {
        set({ budgetLimit: amount });
      },

      /**
       * Tambah item ke keranjang
       * Otomatis kalkulasi total dan update currentSpent
       */
      addItem: (item) => {
        const newItem: CartItem = {
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: item.name,
          qty: item.qty,
          price: item.price,
          total: item.qty * item.price,
          timestamp: Date.now(),
        };

        set((state) => {
          const newItems = [...state.items, newItem];
          // Hitung ulang total pengeluaran (currentSpent)
          const newSpent = newItems.reduce((sum, item) => sum + item.total, 0);
          
          return {
            items: newItems,
            currentSpent: newSpent,
          };
        });
      },

      /**
       * Hapus item dari keranjang berdasarkan ID
       */
      removeItem: (id) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id);
          const newSpent = newItems.reduce((sum, item) => sum + item.total, 0);
          
          return {
            items: newItems,
            currentSpent: newSpent,
          };
        });
      },

      /**
       * Update jumlah quantity item dan recalculate total
       */
      updateItemQuantity: (id, newQty) => {
        set((state) => {
          const newItems = state.items.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                qty: newQty,
                total: newQty * item.price,
              };
            }
            return item;
          });
          
          const newSpent = newItems.reduce((sum, item) => sum + item.total, 0);
          
          return {
            items: newItems,
            currentSpent: newSpent,
          };
        });
      },

      /**
       * Reset session (clear items tapi keep budget settings)
       * Digunakan setelah checkout atau start new shopping session
       */
      resetSession: () => {
        set({
          items: [],
          currentSpent: 0,
          // budgetLimit TIDAK direset agar user tidak perlu input ulang
        });
      },

      /**
       * Update status koneksi internet
       */
      setOfflineStatus: (status) => {
        set({ isOffline: status });
      },

      /**
       * Helper: Hitung sisa budget
       */
      getRemainingBudget: () => {
        const state = get();
        return state.budgetLimit - state.currentSpent;
      },

      /**
       * Helper: Cek apakah sudah melebihi budget
       */
      isOverBudget: () => {
        const state = get();
        return state.currentSpent > state.budgetLimit;
      },
    }),
    {
      name: 'cartify-storage', // Key di AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      // Hanya persist state tertentu (tidak perlu persist isOffline)
      partialize: (state) => ({
        budgetLimit: state.budgetLimit,
        currentSpent: state.currentSpent,
        items: state.items,
      }),
    }
  )
);
