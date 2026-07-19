// frontend/src/components/layout/Header.jsx
// 125Customs Header Component with Navigation
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useCartStore from '../../stores/cartStore';

function Header() {
  const location = useLocation();
  const { cart, fetchCart, loading, error } = useCartStore((state) => ({
    cart: state.cart,
    fetchCart: state.fetchCart,
    loading: state.loading,
    error: state.error
  }));
  const itemCount = cart ? cart.items?.reduce((sum, item) => sum + item.quantity, 0) : 0;

  useEffect(() => {
    // Fetch cart on mount
    fetchCart().catch(err => console.error('Failed to fetch cart:', err));
  }, [fetchCart]);

  const isActive = (path) => {
    return location.pathname === path ? 'text-red-600' : 'text-gray-700 hover:text-red-600';
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-red-600">125</span>
            <span className="text-xl font-semibold text-gray-800">Customs</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className={`${isActive('/')} transition duration-300`}>
              Home
            </Link>
            <Link to="/products" className={`${isActive('/products')} transition duration-300`}>
              Products
            </Link>
            <Link to="/quote-request" className={`${isActive('/quote-request')} transition duration-300`}>
              B2B Quote
            </Link>
          </nav>

          {/* Cart & User */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <svg className="w-6 h-6 text-gray-700 hover:text-red-600 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button className="md:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
