// frontend/src/stores/cartStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      totalItems: 0,
      totalPrice: 0,
      loading: false,
      error: null,

      // Actions
      addItem: (product, quantity = 1, options = {}) => {
        const existingItemIndex = get().items.findIndex(
          item => item.product.id === product.id && 
                   JSON.stringify(item.options) === JSON.stringify(options)
        );

        if (existingItemIndex > -1) {
          // Update quantity if item exists
          const updatedItems = [...get().items];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ 
            items: updatedItems,
            totalItems: get().totalItems + quantity,
            totalPrice: get().totalPrice + (product.basePrice * quantity)
          });
        } else {
          // Add new item
          const newItem = {
            product,
            quantity,
            options,
            price: product.basePrice
          };
          set({ 
            items: [...get().items, newItem],
            totalItems: get().totalItems + quantity,
            totalPrice: get().totalPrice + (product.basePrice * quantity)
          });
        }
      },

      removeItem: (index) => {
        const item = get().items[index];
        const updatedItems = get().items.filter((_, i) => i !== index);
        set({
          items: updatedItems,
          totalItems: get().totalItems - item.quantity,
          totalPrice: get().totalPrice - (item.price * item.quantity)
        });
      },

      updateQuantity: (index, newQuantity) => {
        if (newQuantity < 1) return;
        
        const item = get().items[index];
        const quantityDiff = newQuantity - item.quantity;
        const updatedItems = [...get().items];
        updatedItems[index].quantity = newQuantity;
        
        set({
          items: updatedItems,
          totalItems: get().totalItems + quantityDiff,
          totalPrice: get().totalPrice + (item.price * quantityDiff)
        });
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },

      // Calculate totals (call this after any cart change)
      calculateTotals: () => {
        const { items } = get();
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        set({ totalItems, totalPrice });
      }
    }),
    {
      name: '125customs-cart',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useCartStore;
