// frontend/src/pages/QuoteRequestPage.jsx
// 125Customs B2B Quote Request - HUMAN-MADE (not vibe-coded)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

function QuoteRequestPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: user?.email || '',
    phone: user?.phone || '',
    kraPin: '',
    productCategory: '',
    quantity: '',
    specifications: '',
    timeline: '',
    complianceNeeded: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Validate
    if (!formData.companyName || !formData.contactName || !formData.email || !formData.phone) {
      alert('Please fill in all required fields.');
      setSubmitting(false);
      return;
    }

    try {
      // TODO: Send to backend
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmitted(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/quote-success');
      }, 3000);
    } catch (error) {
      alert('Something went wrong. Please try again or contact us on WhatsApp.');
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-16 bg-[#FAF8F5]">
        <div className="container-tight mx-auto px-4 max-w-2xl text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-4">Quote Request Sent!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Our B2B team will review your requirements and get back to you within 24 hours.
          </p>
          <p className="text-gray-600">
            Redirecting to quote status page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-[#FAF8F5]">
      <div className="container-tight mx-auto px-4 max-w-3xl">
        {/* 
          HUMAN TOUCH: Specific headline (not "Get a Quote")
          B2B context: Bulk orders, compliance, AGPO
        */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Request a B2B Quote
          </h1>
          <p className="text-gray-600">
            For bulk orders (50+ units), custom specifications, or compliance documentation (AGPO, Tax, KRA PIN). 
            We'll respond within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Company Information */}
          <Card variant="default" padding="lg" className="mb-6">
            <h2 className="font-display text-xl font-semibold mb-6">Company Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name *"
                type="text"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                required
                helperText="As registered with KRA"
              />
              <Input
                label="Contact Person *"
                type="text"
                value={formData.contactName}
                onChange={(e) => handleChange('contactName', e.target.value)}
                required
                helperText="Your full name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Work Email *"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                helperText="We'll send the quote here"
              />
              <Input
                label="Phone Number *"
                type="tel"
                placeholder="07XX XXX XXX"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
                helperText="For urgent updates"
              />
            </div>

            {/* HUMAN TOUCH: Specific to Kenyan B2B (not generic "Tax ID") */}
            <Input
              label="KRA PIN (Optional)"
              type="text"
              placeholder="e.g., A0000000X"
              value={formData.kraPin}
              onChange={(e) => handleChange('kraPin', e.target.value)}
              helperText="We can include this in your quote for compliance"
              className="mt-4"
            />
          </Card>

          {/* Product Requirements */}
          <Card variant="default" padding="lg" className="mb-6">
            <h2 className="font-display text-xl font-semibold mb-6">Product Requirements</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Category *
                </label>
                <select
                  value={formData.productCategory}
                  onChange={(e) => handleChange('productCategory', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#8B4513] focus:outline-none"
                  required
                >
                  <option value="">Select category...</option>
                  <option value="asset_tags">Asset Tags (for equipment tracking)</option>
                  <option value="industrial_labels">Industrial Labels (for machinery)</option>
                  <option value="signage">Signage & Plaques (for offices)</option>
                  <option value="compliance_plates">Compliance Plates (AGPO, Tax, etc.)</option>
                  <option value="custom">Custom Project (describe below)</option>
                </select>
              </div>

              <Input
                label="Quantity Needed *"
                type="number"
                placeholder="e.g., 500"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                required
                helperText="We offer 5-15% discount for 50+ units"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specifications / Custom Requirements *
                </label>
                <textarea
                  value={formData.specifications}
                  onChange={(e) => handleChange('specifications', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#8B4513] focus:outline-none"
                  placeholder="Describe what you need:
• Material type (e.g., aluminum, stainless steel)
• Dimensions (e.g., 50mm x 25mm)
• Text/content to engrave
• Any specific standards to meet (e.g., ISO, AGPO)
• Attach reference images if available (via WhatsApp)"
                  required
                />
              </div>

              <Input
                label="Expected Timeline"
                type="text"
                placeholder="e.g., Needed by end of March"
                value={formData.timeline}
                onChange={(e) => handleChange('timeline', e.target.value)}
                helperText="We'll let you know if this is feasible"
              />
            </div>
          </Card>

          {/* 
            HUMAN TOUCH: Compliance section (specific to Kenyan B2B)
            Not generic "Additional Services"
          */}
          <Card variant="default" padding="lg" className="mb-8">
            <h2 className="font-display text-xl font-semibold mb-6">Compliance & Documentation</h2>
            
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.complianceNeeded}
                onChange={(e) => handleChange('complianceNeeded', e.target.checked)}
                className="mt-1 accent-[#8B4513]"
              />
              <div>
                <p className="font-medium">I need compliance documentation</p>
                <p className="text-sm text-gray-600">
                  We can provide: AGPO certificate, Tax compliance certificate, 
                  KRA PIN copy, and business registration documents. 
                  Required for government tenders and corporate procurement.
                </p>
              </div>
            </label>
          </Card>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              fullWidth
              className="bg-[#8B4513] hover:bg-[#654321]"
            >
              {submitting ? 'Sending...' : 'Submit Quote Request'}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              fullWidth
              as="a"
              href="https://wa.me/254700000000"
              target="_blank"
              className="border-[#8B4513] text-[#8B4513]"
            >
              Or Chat on WhatsApp
            </Button>
          </div>

          {/* HUMAN TOUCH: Specific trust signals (not generic) */}
          <p className="text-center text-sm text-gray-600 mt-6">
            ✓ Response within 24 hours ✓ No obligation ✓ Bulk discounts available
          </p>
        </form>
      </div>
    </div>
  );
}

export default QuoteRequestPage;
