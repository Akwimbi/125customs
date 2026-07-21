// frontend/src/stores/productStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { productsAPI } from '../services/api';

const useProductStore = create(
  persist(
    (set, get) => ({
      products: [
        // PLACEHOLDER products (will be replaced with API call)
        {
          id: 1,
          name: 'Aluminum Asset Tag',
          category: 'asset_tags',
          audienceType: 'b2b',
          basePrice: 150,
          shortDescription: 'Durable aluminum tag for equipment tracking',
          hasOptions: true,
          options: [
            { name: 'Size', type: 'select', options: ['25mm x 15mm', '50mm x 25mm', '75mm x 50mm'] },
            { name: 'Attachment', type: 'select', options: ['Adhesive', 'Rivet Hole', 'Both'] }
          ]
        },
        {
          id: 2,
          name: 'Pet ID Tag - Stainless Steel',
          category: 'pet_tags',
          audienceType: 'b2c',
          basePrice: 800,
          shortDescription: 'Laser-engraved pet ID tag that lasts',
          hasOptions: true,
          options: [
            { name: 'Shape', type: 'select', options: ['Bone', 'Circle', 'Heart'] },
            { name: 'Custom Text', type: 'text', placeholder: 'Max 3 lines' }
          ]
        },
        {
          id: 3,
          name: 'Trophy - Star Award',
          category: 'trophies',
          audienceType: 'both',
          basePrice: 2500,
          shortDescription: 'Custom engraved trophy for awards',
          hasOptions: true,
          options: [
            { name: 'Material', type: 'select', options: ['Resin', 'Metal', 'Wood Base'] },
            { name: 'Engraving Text', type: 'text', placeholder: 'Award text...' }
          ]
        }
      ],
      loading: false,
      error: null,

      fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
          const res = await productsAPI.getAll();
          if (res.success) {
            set({ products: res.products || [], loading: false });
          } else {
            set({ loading: false });
          }
        } catch (error) {
          // Keep whatever's already in state (placeholder data on first load,
          // or the last successfully fetched products) rather than clearing
          // the product list just because one fetch failed.
          set({ error: error.message, loading: false });
        }
      },

      getProductById: (id) => {
        return get().products.find(p => p.id === id);
      }
    }),
    {
      name: '125customs-products',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useProductStore;
