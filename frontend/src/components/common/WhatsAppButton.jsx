// frontend/src/components/common/WhatsAppButton.jsx
// WhatsApp integration component for 125Customs
import React from 'react';
import { MessageCircleIcon } from 'lucide-react';

const WhatsAppButton = ({
  phoneNumber = '+254700000000', // Default: 125Customs number
  message = '',
  productName = '',
  variant = 'default', // 'default', 'floating', 'inline'
  size = 'md',
  className = ''
}) => {
  // Construct the pre-filled message
  const constructMessage = () => {
    let fullMessage = 'Hello 125Customs! ';
    
    if (productName) {
      fullMessage += `I'm interested in: ${productName}. `;
    }
    
    if (message) {
      fullMessage += message;
    } else {
      fullMessage += 'Please provide more information about your custom engraving services.';
    }
    
    return encodeURIComponent(fullMessage);
  };

  // Generate WhatsApp URL
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${constructMessage()}`;

  // Variant styles
  const variants = {
    default: 'bg-green-500 hover:bg-green-600 text-white',
    outline: 'border-2 border-green-500 text-green-600 hover:bg-green-50',
    ghost: 'text-green-600 hover:bg-green-50'
  };

  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  if (variant === 'floating') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 ${sizes[size]} bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all`}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircleIcon className="w-5 h-5" />
        <span className="hidden md:inline">Chat with us</span>
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 ${sizes[size]} ${variants[variant]} rounded-lg font-medium transition-colors ${className}`}
    >
      <MessageCircleIcon className="w-4 h-4" />
      <span>WhatsApp</span>
    </a>
  );
};

// Predefined message templates
export const WhatsAppTemplates = {
  productInquiry: (productName, productId) =>
    `Hello! I'm interested in: ${productName} (ID: ${productId}). Please provide more details about pricing, customization options, and delivery timeline.`,
  
  quoteRequest: (companyName) =>
    `Hello! I represent ${companyName} and would like to request a quote for bulk custom engraving services. Please provide your B2B pricing and compliance documentation.`,
  
  orderSupport: (orderId) =>
    `Hello! I need support with my order #${orderId}. Please assist.`,
  
  generalInquiry: () =>
    `Hello 125Customs! I have a question about your custom engraving services. Please get back to me.`
};

export default WhatsAppButton;
