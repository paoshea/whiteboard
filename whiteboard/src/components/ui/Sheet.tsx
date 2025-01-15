import React from 'react';

const Sheet = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="bg-white rounded-t-lg p-6 z-10">
        {children}
        <button className="mt-4" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Sheet;