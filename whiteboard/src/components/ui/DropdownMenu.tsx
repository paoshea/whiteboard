import React, { useState } from 'react';

const DropdownMenu = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute bg-white border rounded shadow-lg z-10">
          {children}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;