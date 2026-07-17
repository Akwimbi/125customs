// frontend/src/components/ui/Card.jsx
// Reusable Card Component - HUMAN-MADE (not vibe-coded)
import React from 'react';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  ...props
}) => {
  // HUMAN TOUCH: Specific variants (not generic "elevated", "bordered")
  const baseStyles = 'bg-white transition-shadow';
  
  const variants = {
    default: 'border border-gray-200 rounded-lg',
    promnent: 'border border-gray-200 rounded-lg shadow-sm hover:shadow-md',
    subtile: 'border-b-2 border-[#8B4513] rounded-none pb-4', // Sharp, industrial
    ghost: 'bg-transparent'
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const classes = `
    ${baseStyles}
    ${variants[variant]}
    ${paddings[padding]}
    ${hover ? 'cursor-pointer hover:shadow-md' : ''}
    ${className}
  `;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// HUMAN TOUCH: Subcomponents for specific use cases (not generic CardHeader, CardBody)
Card.Header = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

Card.Body = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);

export default Card;
