// frontend/src/components/layout/Layout.jsx
// Main Layout Component - Wraps all pages with Header + Main + Footer
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({
  showHeader = true,
  showFooter = true,
  containerWidth = 'default', // 'narrow', 'default', 'wide', 'full'
  className = ''
}) => {
  const containerClasses = {
    narrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
    default: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    wide: 'max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8',
    full: 'w-full px-4 sm:px-6 lg:px-8'
  };

  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {/* Header */}
      {showHeader && <Header />}

      {/* Main Content - Outlet renders whichever route matched, e.g. HomePage */}
      <main className="flex-1">
        <div className={containerClasses[containerWidth]}>
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
