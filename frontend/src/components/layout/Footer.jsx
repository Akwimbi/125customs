// frontend/src/components/layout/Footer.jsx
// 125Customs Footer Component
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">125Customs</h3>
            <p className="text-gray-400 text-sm">
              Kenya's leading custom engraving platform for businesses and individuals.
              We specialize in B2B asset tagging and B2C personalized gifts.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition duration-300">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/quote-request" className="text-gray-400 hover:text-white transition duration-300">
                  B2B Quote
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-white transition duration-300">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📍 Nairobi, Kenya</li>
              <li>📞 +254 712 345 678</li>
              <li>✉️ info@125customs.co.ke</li>
              <li>
                💬 <a href="https://wa.me/254712345678" className="hover:text-white transition duration-300">
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} 125Customs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
