// frontend/src/stores/authStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          // TODO: Replace with actual API call
          // const response = await axios.post('/api/auth/login', { email, password });
          // set({ user: response.data.user, isAuthenticated: true, loading: false });
          
          // Placeholder
          set({ 
            user: { id: 1, name: 'Demo User', email }, 
            isAuthenticated: true, 
            loading: false 
          });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      logout: () => {
        // TODO: API call
        set({ user: null, isAuthenticated: false });
      },

      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          // TODO: API call
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: '125customs-auth',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useAuthStore;
