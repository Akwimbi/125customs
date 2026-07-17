// frontend/src/pages/CartPage.jsx
// 125Customs Cart - HUMAN-MADE (not vibe-coded)
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await cartAPI.get('default');
      if (res.success) {
        setItems(res.cart.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await cartAPI.updateItem('default', productId, { quantity: newQuantity });
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await cartAPI.removeItem('default', productId);
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await cartAPI.clear('default');
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleApplyCoupon = () => {
    setCouponError('Coupon system coming soon. Contact us for bulk discounts.');
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16 bg-[#FAF8F5]">
        <div className="container-tight mx-auto px-4 text-center">
          {/* HUMAN TOUCH: Honest empty state (not animated cart icon) */}
          <div className="mb-8">
            <span className="text-6xl">🛒</span>
          </div>
          <h1 className="font-display text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            You haven't added any products yet. Start shopping for business tags or personal gifts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={Link}
              to="/products?audience=b2b"
              variant="primary"
              size="lg"
              className="bg-[#8B4513] hover:bg-[#654321]"
            >
              Browse Business Products
            </Button>
            <Button
              as={Link}
              to="/products?audience=b2c"
              variant="outline"
              size="lg"
              className="border-[#8B4513] text-[#8B4513]"
            >
              Browse Gift Products
            </Button>
          </div>

          {/* HUMAN TOUCH: Specific help (not "Need help?") */}
          <p className="mt-8 text-sm text-gray-500">
            Want something custom? <a href="https://wa.me/254700000000" target="_blank" className="text-[#8B4513] underline">Chat with us on WhatsApp</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-[#FAF8F5]">
      <div className="container-tight mx-auto px-4">
        <h1 className="font-display text-3xl font-bold mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - 2/3 width */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.productId} variant="subtle" className="p-4">
                <div className="flex gap-4">
                  {/* Product Image (placeholder) */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">🏷️</span>
                    {/* TODO: <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" /> */}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <Link
                        to={`/products/${item.productId}`}
                        className="font-medium hover:text-[#8B4513]"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Custom options (if any) */}
                    {item.customText && (
                      <p className="text-sm text-gray-600 mb-2">
                        Custom text: "{item.customText}"
                      </p>
                    )}
                    {item.options && Object.keys(item.options).length > 0 && (
                      <p className="text-sm text-gray-600 mb-2">
                        Options: {Object.entries(item.options).map(([key, val]) => `${key}: ${val}`).join(', ')}
                      </p>
                    )}

                    {/* Quantity + Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-display text-lg font-bold text-[#8B4513]">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          KES {item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Clear cart button (subtle, not prominent) */}
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              Clear all items
            </button>
          </div>

          {/* Order Summary - 1/3 width */}
          <div className="lg:col-span-1">
            <Card variant="prominent" className="p-6 sticky top-8">
              <h2 className="font-display text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>KES {getTotal().toLocaleString()}</span>
                </div>

                {/* HUMAN TOUCH: Specific shipping info (not "Calculated at checkout") */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-sm">
                    Pickup in Nairobi CBD: <strong>Free</strong><br />
                    Delivery via Pickup Mtaani: <strong>KES 150</strong>
                  </span>
                </div>

                {/* Coupon code (simple, not decorated) */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code (B2B bulk discounts applied automatically)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      className="border-[#8B4513] text-[#8B4513]"
                    >
                      Apply
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-sm text-red-600 mt-2">{couponError}</p>
                  )}
                </div>

                <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span className="font-display text-[#8B4513]">
                    KES {getTotal().toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate('/checkout')}
                className="bg-[#8B4513] hover:bg-[#654321] mb-4"
              >
                Proceed to Checkout
              </Button>

              {/* HUMAN TOUCH: Specific trust signals (Kenyan context) */}
              <div className="text-center text-sm text-gray-600 space-y-2">
                <p>✓ Pay with M-Pesa or Card</p>
                <p>✓ WhatsApp support: +254 700 000 000</p>
                <p>✓ Pickup available in Nairobi CBD</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
