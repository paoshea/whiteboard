import React from 'react';

const Button = ({ children, onClick, variant = 'default', className, ...props }) => {
  const baseStyle = 'py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50';
  const variantStyle = variant === 'outline' 
    ? 'border border-gray-300 text-gray-700 bg-transparent' 
    : 'bg-blue-500 text-white';

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;