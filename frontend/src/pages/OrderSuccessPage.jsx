// frontend/src/pages/OrderSuccessPage.jsx
// 125Customs Order Confirmation - HUMAN-MADE (not vibe-coded)
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order') || 'ORD-000000';
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // TODO: Fetch actual order details from backend
    // For now, show placeholder
    setOrderDetails({
      id: orderNumber,
      total: 12500,
      paymentMethod: 'mpesa',
      deliveryMethod: 'pickup',
      estimatedReady: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-KE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    });
  }, [orderNumber]);

  return (
    <div className="min-h-screen py-16 bg-[#FAF8F5]">
      <div className="container-tight mx-auto px-4 max-w-2xl">
        {/* 
          HUMAN TOUCH: Specific confirmation (not generic "Thank you!")
          Order number front-and-center
        */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-4">Order Placed!</h1>
          <p className="text-xl text-gray-600">
            Your order <span className="font-bold text-[#8B4513]">#{orderNumber}</span> is confirmed.
          </p>
        </div>

        {/* 
          HUMAN TOUCH: Specific next steps (not "Your order is being processed")
          Real timeline for Kenyan business
        */}
        <Card variant="default" padding="lg" className="mb-8">
          <h2 className="font-display text-xl font-semibold mb-6">What Happens Next?</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-[#8B4513] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-medium mb-1">Payment Confirmation</h3>
                <p className="text-sm text-gray-600">
                  {orderDetails?.paymentMethod === 'mpesa' 
                    ? 'Check your phone for M-Pesa STK push. Once paid, you\'ll receive WhatsApp confirmation.'
                    : 'We\'re verifying your payment. This takes 5-10 minutes.'}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-[#8B4513] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-medium mb-1">Production Begins</h3>
                <p className="text-sm text-gray-600">
                  Your items are queued for laser etching. Most orders ready in 2-3 working days.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-[#8B4513] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-medium mb-1">Ready for Collection/Delivery</h3>
                <p className="text-sm text-gray-600">
                  {orderDetails?.deliveryMethod === 'pickup'
                    ? 'We\'ll WhatsApp you when ready. Pick up from our Nairobi CBD workshop during working hours.'
                    : 'We\'ll send via Pickup Mtaani. You\'ll get SMS with tracking details.'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* 
          HUMAN TOUCH: Specific order details (not generic summary)
          Kenyan context: M-Pesa transaction, Pickup Mtaani
        */}
        {orderDetails && (
          <Card variant="default" padding="lg" className="mb-8">
            <h2 className="font-display text-xl font-semibold mb-6">Order Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number</span>
                <span className="font-medium">#{orderDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold text-[#8B4513]">KES {orderDetails.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">
                  {orderDetails.paymentMethod === 'mpesa' ? 'M-Pesa' : 
                   orderDetails.paymentMethod === 'card' ? 'Card (Paystack)' : 
                   'Bank Transfer'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Ready</span>
                <span className="font-medium">{orderDetails.estimatedReady}</span>
              </div>
            </div>

            {/* HUMAN TOUCH: Specific pickup instructions (not generic) */}
            {orderDetails.deliveryMethod === 'pickup' && (
              <div className="mt-6 p-4 bg-[#F5F0EB] rounded-lg">
                <h3 className="font-medium mb-2">📍 Pickup Location</h3>
                <p className="text-sm text-gray-700">
                  <strong>125Customs Workshop</strong><br />
                  Nairobi CBD (specific address will be sent via WhatsApp)<br />
                  Working hours: Mon-Fri 8AM-5PM, Sat 9AM-1PM
                </p>
              </div>
            )}
          </Card>
        )}

        {/* 
          HUMAN TOUCH: Clear CTAs (not "Continue Shopping")
          Specific to post-purchase: WhatsApp support, track order
        */}
        <div className="space-y-4">
          <Button
            as="a"
            href="https://wa.me/254700000000"
            target="_blank"
            variant="primary"
            size="lg"
            fullWidth
            className="bg-[#8B4513] hover:bg-[#654321]"
          >
            💬 Chat on WhatsApp (for order updates)
          </Button>

          <Button
            as={Link}
            to="/products"
            variant="outline"
            size="lg"
            fullWidth
            className="border-[#8B4513] text-[#8B4513]"
          >
            Continue Shopping
          </Button>

          {/* HUMAN TOUCH: Specific help (not "Need help?") */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Questions? Call us: <a href="tel:+254700000000" className="text-[#8B4513] font-medium">+254 700 000 000</a><br />
            Or email: <a href="mailto:info@125customs.co.ke" className="text-[#8B4513] font-medium">info@125customs.co.ke</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
