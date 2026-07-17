// frontend/src/components/layout/Layout.jsx
// Main Layout Component - Wraps all pages with Header + Main + Footer
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({
  children,
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

      {/* Main Content */}
      <main className="flex-1">
        <div className={containerClasses[containerWidth]}>
          {children}
        </div>
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

// Layout variants for different page types
Layout.Landing = ({ children }) => (
  <Layout showHeader={true} showFooter={true} containerWidth="full">
    {children}
  </Layout>
);

Layout.Dashboard = ({ children }) => (
  <Layout showHeader={true} showFooter={false} containerWidth="default">
    {children}
  </Layout>
);

Layout.Auth = ({ children }) => (
  <Layout showHeader={false} showFooter={false} containerWidth="narrow">
    {children}
  </Layout>
);

Layout.Checkout = ({ children }) => (
  <Layout showHeader={true} showFooter={false} containerWidth="default">
    {children}
  </Layout>
);

export default Layout;
