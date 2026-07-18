// frontend/src/stores/cartStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { cartAPI } from '../services/api';

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      cart: null, // full cart object from backend
      loading: false,
      error: null,

      // Actions
      fetchCart: async () => {
        set({ loading: true, error: null });
        try {
          const cart = await cartAPI.get();
          set({ cart, loading: false });
          return cart;
        } catch (err) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      addItem: async (item) => {
        set({ loading: true, error: null });
        try {
          const cart = await cartAPI.addItem(item);
          set({ cart, loading: false });
          return cart;
        } catch (err) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      updateItem: (itemId, updates) => async () => {
        set({ loading: true, error: null });
        try {
          const cart = await cartAPI.updateItem(itemId, updates);
          set({ cart, loading: false });
          return cart;
        } catch (err) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      removeItem: (itemId) => async () => {
        set({ loading: true, error: null });
        try {
          const cart = await cartAPI.removeItem(itemId);
          set({ cart, loading: false });
          return cart;
        } catch (err) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      clearCart: async () => {
        set({ loading: true, error: null });
        try {
          const cart = await cartAPI.clear();
          set({ cart, loading: false });
          return cart;
        } catch (err) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      getSummary: async () => {
        set({ loading: true, error: null });
        try {
          const summary = await cartAPI.getSummary();
          set({ loading: false });
          return summary;
        } catch (err) {
          set({ error: err.message, loading: false });
          throw err;
        }
      }
    }),
    {
      name: '125customs-cart',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useCartStore;
