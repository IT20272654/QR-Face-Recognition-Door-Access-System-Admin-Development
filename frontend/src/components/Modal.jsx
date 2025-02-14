import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={handleClose}>
      <div className="relative bg-white dark:bg-slate-700 p-6 rounded-lg shadow-lg w-1/2">
        <button className="absolute top-2 right-2 text-gray-400" onClick={onClose}>
          <FaTimes />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;