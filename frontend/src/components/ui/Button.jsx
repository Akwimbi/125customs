// frontend/src/components/ui/Button.jsx
// Reusable Button Component - HUMAN-MADE (not vibe-coded)
import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  as: Component = 'button',
  href,
  className = '',
  ...props
}) => {
  // HUMAN TOUCH: Specific color (rust, not AI red)
  const baseStyles = 'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#8B4513] hover:bg-[#654321] text-white border-transparent rounded-md uppercase tracking-wide text-sm',
    secondary: 'bg-transparent hover:bg-[#8B4513]/10 text-[#8B4513] border-2 border-[#8B4513] rounded-lg',
    outline: 'bg-transparent hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 rounded-lg',
    danger: 'bg-red-600 hover:bg-red-700 text-white rounded-md'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const classes = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${loading ? 'opacity-75 cursor-wait' : ''}
    ${className}
  `;

  // Handle loading state (simple, not animated)
  const content = loading ? (
    <span className="flex items-center justify-center gap-2">
      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block"></span>
      Processing...
    </span>
  ) : children;

  if (Component === 'a' && href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" disabled={disabled || loading} className={classes} {...props}>
      {content}
    </button>
  );
};

export default Button;
