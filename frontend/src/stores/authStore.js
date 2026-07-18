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
          const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await response.json();
          if (data.success) {
            set({ 
              user: data.user, 
              isAuthenticated: true, 
              loading: false 
            });
            // Store token
            localStorage.setItem('125customs_auth_token', data.token);
          } else {
            set({ error: data.error || 'Login failed', loading: false });
          }
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
          const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          });
          const data = await response.json();
          if (data.success) {
            set({ 
              user: data.user, 
              isAuthenticated: true, 
              loading: false 
            });
            // Store token
            localStorage.setItem('125customs_auth_token', data.token);
          } else {
            set({ error: data.error || 'Registration failed', loading: false });
          }
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
