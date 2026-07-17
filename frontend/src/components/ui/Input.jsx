// frontend/src/components/ui/Input.jsx
// Reusable Input Component - HUMAN-MADE (not vibe-coded)
import React from 'react';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'w-full px-4 py-2 border rounded-md font-inherit text-base focus:outline-none transition-colors';
  const borderStyles = error 
    ? 'border-red-500 focus:border-red-500' 
    : 'border-gray-300 focus:border-[#8B4513]';
  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {type === 'textarea' ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          rows={4}
          className={`${baseStyles} ${borderStyles} ${disabledStyles} resize-vertical`}
          {...props}
        />
      ) : (
        <div className="relative">
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${baseStyles} ${borderStyles} ${disabledStyles}`}
            {...props}
          />
          {error && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-red-500 text-sm">⚠</span>
            </div>
          )}
        </div>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
