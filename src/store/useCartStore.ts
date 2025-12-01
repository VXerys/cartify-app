import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: string; // Unik ID (biasanya timestamp + random)
  name: string; // Nama produk dari hasil parse Voice
  qty: number; // Jumlah barang
  price: number; // Harga satuan (Input User)
  total: number; // Subtotal (qty * price)
}

interface CartState {
  budgetLimit: number; // Batas anggaran harian user
  currentSpent: number; // Total pengeluaran saat ini
  items: CartItem[]; // Daftar belanjaan
  isOffline: boolean; // Status koneksi (simulasi atau riil)

  // Actions
  setBudget: (amount: number) => void;
  addItem: (item: Omit<CartItem, 'total'>) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  resetSession: () => void; // Menghapus item tapi menyimpan budget
  setOfflineStatus: (status: boolean) => void;
}

/**
 * Global Store untuk Cartify (Zustand)
 * Menggunakan persist middleware agar data tersimpan di AsyncStorage
 * sehingga tidak hilang saat aplikasi direstart.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      budgetLimit: 0,
      currentSpent: 0,
      items: [],
      isOffline: false,

      setBudget: (amount) => set({ budgetLimit: amount }),

      addItem: (item) => {
        const total = item.qty * item.price;
        const newItem = { ...item, total };

        set((state) => {
          const updatedItems = [...state.items, newItem];
          // Hitung ulang total spent
          const newSpent = updatedItems.reduce((acc, curr) => acc + curr.total, 0);
          return {
            items: updatedItems,
            currentSpent: newSpent,
          };
        });
      },

      removeItem: (id) => {
        set((state) => {
          const updatedItems = state.items.filter((i) => i.id !== id);
          const newSpent = updatedItems.reduce((acc, curr) => acc + curr.total, 0);
          return {
            items: updatedItems,
            currentSpent: newSpent,
          };
        });
      },

      updateItem: (id, updates) => {
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id === id) {
              const updatedItem = { ...item, ...updates };
              // Recalculate total for this item if price or qty changed
              updatedItem.total = updatedItem.qty * updatedItem.price;
              return updatedItem;
            }
            return item;
          });

          const newSpent = updatedItems.reduce((acc, curr) => acc + curr.total, 0);
          return { items: updatedItems, currentSpent: newSpent };
        });
      },

      resetSession: () => set({ items: [], currentSpent: 0 }),

      setOfflineStatus: (status) => set({ isOffline: status }),
    }),
    {
      name: 'cartify-storage', // Key di AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        budgetLimit: state.budgetLimit,
        items: state.items,
        currentSpent: state.currentSpent
      }), // Hanya persist data ini
    }
  )
);
