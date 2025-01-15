import React from 'react';

const Dialog = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="bg-white rounded p-6 z-10">
        <h2 className="text-lg font-bold">{title}</h2>
        {children}
        <button className="mt-4" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Dialog;