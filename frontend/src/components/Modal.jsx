import React from 'react';

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 m-4 max-w-2xl w-full transform transition-transform duration-300 ease-out scale-95 hover:scale-100">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-800 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-lg"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;