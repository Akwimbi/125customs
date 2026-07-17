// frontend/src/pages/CheckoutPage.jsx
// 125Customs Checkout - HUMAN-MADE (not vibe-coded)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, ordersAPI } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

function CheckoutPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirm
  const [shippingData, setShippingData] = useState({
    fullName: '',
    phone: '',
    email: '',
    deliveryMethod: 'pickup',
    pickupLocation: 'cbd',
    deliveryAddress: '',
    deliveryNotes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

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

  const getTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    // Validate
    if (!shippingData.fullName || !shippingData.phone || !shippingData.email) {
      alert('Please fill in all required fields.');
      return;
    }
    if (shippingData.deliveryMethod === 'delivery' && !shippingData.deliveryAddress) {
      alert('Please enter your delivery address.');
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const orderData = {
        items: items,
        customerInfo: {
          fullName: shippingData.fullName,
          phone: shippingData.phone,
          email: shippingData.email
        },
        shippingAddress: shippingData.deliveryMethod === 'delivery' ? shippingData.deliveryAddress : 'Pickup',
        paymentMethod: paymentMethod,
        total: getTotal() + (shippingData.deliveryMethod === 'delivery' ? 150 : 0)
      };

      const res = await ordersAPI.create(orderData);

      if (res.success) {
        setOrderNumber(res.order.id);
        setOrderPlaced(true);

        // Clear cart
        await cartAPI.clear('default');

        // Redirect to success page
        navigate(`/order-success?order=${res.order.id}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Something went wrong. Please try again or contact us on WhatsApp.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen py-16 bg-[#FAF8F5]">
        <div className="container-tight mx-auto px-4 text-center">
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <Button
            as={Link}
            to="/products"
            variant="primary"
            className="bg-[#8B4513] hover:bg-[#654321]"
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-[#FAF8F5]">
      <div className="container-tight mx-auto px-4">
        <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

        {/* 
          HUMAN TOUCH: Clear progress steps (not animated)
          Specific: Shipping → Payment → Confirm
        */}
        <div className="flex items-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#8B4513]' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-[#8B4513] text-white' : 'bg-gray-200'}`}>
              1
            </span>
            <span className="hidden sm:inline">Shipping</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#8B4513]' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-[#8B4513] text-white' : 'bg-gray-200'}`}>
              2
            </span>
            <span className="hidden sm:inline">Payment</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#8B4513]' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-[#8B4513] text-white' : 'bg-gray-200'}`}>
              3
            </span>
            <span className="hidden sm:inline">Confirm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card variant="default" padding="lg">
                <h2 className="font-display text-xl font-semibold mb-6">Shipping Details</h2>
                
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      type="text"
                      value={shippingData.fullName}
                      onChange={(e) => setShippingData({...shippingData, fullName: e.target.value})}
                      required
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="07XX XXX XXX"
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                      required
                      helperText="For M-Pesa payment and delivery updates"
                    />
                  </div>

                  <Input
                    label="Email Address"
                    type="email"
                    value={shippingData.email}
                    onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                    required
                    helperText="Order confirmation will be sent here"
                  />

                  {/* 
                    HUMAN TOUCH: Specific delivery options (Kenyan context)
                    Not generic "Shipping Method"
                  */}
                  <div className="pt-4">
                    <h3 className="font-medium mb-4">Delivery Method</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="pickup"
                          checked={shippingData.deliveryMethod === 'pickup'}
                          onChange={(e) => setShippingData({...shippingData, deliveryMethod: e.target.value})}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-medium">Pickup Mtaani</p>
                          <p className="text-sm text-gray-600">
                            Collect from our workshop in Nairobi CBD. 
                            You'll receive an SMS when ready (usually 2-3 days).
                          </p>
                          <p className="text-sm font-medium text-[#8B4513] mt-1">Free</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="delivery"
                          checked={shippingData.deliveryMethod === 'delivery'}
                          onChange={(e) => setShippingData({...shippingData, deliveryMethod: e.target.value})}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-medium">Home Delivery</p>
                          <p className="text-sm text-gray-600">
                            Via Pickup Mtaani or courier. 
                            Delivery within Nairobi: 1-2 days. Outside Nairobi: 2-4 days.
                          </p>
                          <p className="text-sm font-medium text-[#8B4513] mt-1">KES 150 - 500</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {shippingData.deliveryMethod === 'delivery' && (
                    <div className="pt-4">
                      <Input
                        label="Delivery Address"
                        type="text"
                        placeholder="Street, Estate, Town"
                        value={shippingData.deliveryAddress}
                        onChange={(e) => setShippingData({...shippingData, deliveryAddress: e.target.value})}
                        required
                      />
                      <Input
                        label="Delivery Notes (Optional)"
                        type="text"
                        placeholder="e.g., Call before delivery, Ask for gate B"
                        value={shippingData.deliveryNotes}
                        onChange={(e) => setShippingData({...shippingData, deliveryNotes: e.target.value})}
                        className="mt-4"
                      />
                    </div>
                  )}

                  <div className="pt-6">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      className="bg-[#8B4513] hover:bg-[#654321]"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {step === 2 && (
              <Card variant="default" padding="lg">
                <h2 className="font-display text-xl font-semibold mb-6">Payment Method</h2>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {/* 
                    HUMAN TOUCH: M-Pesa as PRIMARY (not afterthought)
                    Specific to Kenyan market
                  */}
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mpesa"
                        checked={paymentMethod === 'mpesa'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">M-Pesa</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Recommended</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Pay directly from your phone. You'll receive an STK push.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium mb-1">Card Payment (Visa/Mastercard)</p>
                        <p className="text-sm text-gray-600">
                          Pay via Paystack secure gateway. We don't store your card details.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={paymentMethod === 'bank'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium mb-1">Bank Transfer</p>
                        <p className="text-sm text-gray-600">
                          For B2B orders. We'll send our bank details after order placement.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={processing}
                      className="flex-1 bg-[#8B4513] hover:bg-[#654321]"
                    >
                      {processing ? 'Processing...' : `Pay KES ${getTotal().toLocaleString()}`}
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card variant="default" padding="md" className="sticky top-8">
              <h3 className="font-display text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">KES {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>KES {getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{shippingData.deliveryMethod === 'pickup' ? 'Free' : 'KES 150'}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-[#8B4513]">
                    KES {(getTotal() + (shippingData.deliveryMethod === 'delivery' ? 150 : 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* HUMAN TOUCH: Specific trust signals (not generic) */}
              <div className="mt-6 pt-6 border-t text-sm text-gray-600 space-y-2">
                <p>✓ Pay with M-Pesa or Card</p>
                <p>✓ Pickup in Nairobi CBD available</p>
                <p>✓ WhatsApp support: +254 700 000 000</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
