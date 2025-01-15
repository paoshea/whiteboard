import React from 'react';

const Input = ({ className, ...props }) => {
  return (
    <input
      className={`border border-gray-300 rounded-md p-2 ${className}`}
      {...props}
    />
  );
};

export default Input;