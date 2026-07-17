// frontend/src/App.jsx
// 125Customs Main App Component with React Router + Layout
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Component
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import QuoteRequestPage from './pages/QuoteRequestPage';
import QuoteSuccessPage from './pages/QuoteSuccessPage';

// B2B Pages
import B2BDashboardPage from './pages/B2BDashboardPage';
import QuoteListPage from './pages/QuoteListPage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminQuotesPage from './pages/AdminQuotesPage';

// Styles
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Landing Pages */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Public Routes - Inner Pages */}
        <Route element={<Layout />}>
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/quote-request" element={<QuoteRequestPage />} />
          <Route path="/quote-success" element={<QuoteSuccessPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
        </Route>

        {/* Checkout Page */}
        <Route element={<Layout />}>
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        {/* B2B Dashboard */}
        <Route element={<Layout />}>
          <Route path="/b2b/dashboard" element={<B2BDashboardPage />} />
          <Route path="/b2b/quotes" element={<QuoteListPage />} />
        </Route>

        {/* Admin Dashboard */}
        <Route element={<Layout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/quotes" element={<AdminQuotesPage />} />
        </Route>

        {/* Catch all - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </Router>
  );
}

export default App;
