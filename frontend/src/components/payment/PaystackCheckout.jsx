// frontend/src/components/payment/PaystackCheckout.jsx
// Paystack payment integration for 125Customs
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../stores/cartStore';
import useAuthStore from '../../stores/authStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

const PaystackCheckout = ({ orderData, onSuccess, onClose }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Pre-fill email if user is logged in
    if (user?.email) {
      setEmail(user.email);
    }
    if (user?.phone) {
      setPhone(user.phone);
    }
  }, [user]);

  const initializePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Validate inputs
      if (!email || !phone) {
        throw new Error('Please provide email and phone number');
      }

      // Format phone number (ensure it starts with 254)
      let formattedPhone = phone.replace(/\D/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.slice(1);
      } else if (!formattedPhone.startsWith('254')) {
        formattedPhone = '254' + formattedPhone;
      }

      // Call backend to initialize Paystack payment
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/paystack/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          email,
          amount: orderData.total * 100, // Paystack expects amount in cents
          currency: 'KES',
          callback_url: `${window.location.origin}/checkout/success`,
          metadata: {
            order_id: orderData.id,
            customer_phone: formattedPhone,
            custom_fields: [
              {
                display_name: "Customer Phone",
                variable_name: "customer_phone",
                value: formattedPhone
              }
            ]
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initialize payment');
      }

      // Redirect to Paystack payment page
      window.location.href = data.data.authorization_url;

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleMpesaPayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Validate inputs
      if (!phone) {
        throw new Error('Please provide phone number for M-Pesa payment');
      }

      // Format phone number
      let formattedPhone = phone.replace(/\D/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.slice(1);
      } else if (!formattedPhone.startsWith('254')) {
        formattedPhone = '254' + formattedPhone;
      }

      // Call backend to initiate M-Pesa STK Push
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/paystack/mpesa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: orderData.total,
          order_id: orderData.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initiate M-Pesa payment');
      }

      alert('Please check your phone and enter your M-Pesa PIN to complete payment.');

      // Poll for payment confirmation
      const checkPayment = setInterval(async () => {
        const verifyResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/paystack/verify/${data.data.reference}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        const verifyData = await verifyResponse.json();

        if (verifyData.data.status === 'success') {
          clearInterval(checkPayment);
          onSuccess(verifyData.data);
        }
      }, 5000); // Check every 5 seconds

      // Stop polling after 2 minutes
      setTimeout(() => clearInterval(checkPayment), 120000);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Card variant="default" padding="lg" className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

      <div className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />

        <Input
          label="Phone Number (for M-Pesa)"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="07XX XXX XXX"
          helperText="Format: 07XX XXX XXX or +254 XXX XXX XXX"
          required
        />

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium">Order Total:</p>
          <p className="text-2xl font-bold text-red-600">
            KES {orderData.total.toLocaleString()}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            onClick={initializePayment}
          >
            Pay with Card / Bank Transfer
          </Button>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            loading={loading}
            onClick={handleMpesaPayment}
          >
            Pay with M-Pesa
          </Button>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>Secure payment powered by Paystack</p>
          <p>Accepted: Visa, Mastercard, M-Pesa, Airtel Money</p>
        </div>
      </div>
    </Card>
  );
};

export default PaystackCheckout;
