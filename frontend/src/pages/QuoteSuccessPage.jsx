// frontend/src/pages/QuoteSuccessPage.jsx
// 125Customs Quote Request Success Page
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

function QuoteSuccessPage() {
  const quoteNumber = `Q-2024-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  const estimatedResponse = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString();

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card variant="default" padding="lg">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m4-8a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Quote Request Submitted!</h1>
            <p className="text-gray-600">Thank you for your B2B quote request. We'll review it shortly.</p>
          </div>

          {/* Quote Details */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="font-semibold mb-4">Quote Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Quote Number</span>
                <span className="font-medium">{quoteNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Response</span>
                <span className="font-medium">{estimatedResponse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="text-yellow-600 font-medium">Pending Review</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">What's Next?</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">1.</span>
                <span>Our team will review your requirements within 24 hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">2.</span>
                <span>You'll receive a detailed quote via email.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">3.</span>
                <span>Once approved, we'll send an invoice for payment.</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              as={Link}
              to="/products?audience=b2b"
              variant="primary"
              size="lg"
              className="flex-1"
            >
              Continue Shopping
            </Button>
            <Button
              as={Link}
              to="/b2b/quotes"
              variant="outline"
              size="lg"
              className="flex-1"
            >
              View My Quotes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default QuoteSuccessPage;
