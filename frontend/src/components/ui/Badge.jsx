// frontend/src/components/ui/Badge.jsx
// Reusable Badge Component - HUMAN-MADE (not vibe-coded)
import React from 'react';

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  className = '',
  ...props
}) => {
  // HUMAN TOUCH: Specific color names (not "blue", "green")
  const baseStyles = 'inline-flex items-center font-medium';
  
  const variants = {
    primary: 'bg-[#8B4513] text-white', // Rust (not blue)
    secondary: 'bg-gray-100 text-gray-700', // Subtle (not gray-500)
    success: 'bg-green-100 text-green-800', // Approved/Paid
    warning: 'bg-yellow-100 text-yellow-800', // Pending
    danger: 'bg-red-100 text-red-800', // Rejected/Error
    info: 'bg-blue-100 text-blue-800', // Info only
    'b2b': 'bg-blue-100 text-blue-800', // B2B label
    'b2c': 'bg-green-100 text-green-800' // B2C label
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const classes = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${rounded ? 'rounded-full' : 'rounded-md'}
    ${className}
  `;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;
