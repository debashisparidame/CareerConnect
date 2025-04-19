import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

function ModalBox({ show, close, header, body, btn, confirmAction, btnClass = "bg-red-600 hover:bg-red-700" }) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [show]);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [close]);

  if (!show) return null;

  // Use createPortal to render modal outside of normal DOM hierarchy
  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={close}
      ></div>
      
      {/* Modal container with animation */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className="relative w-full max-w-md bg-white rounded-lg shadow-xl animate-modal-appear"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b rounded-t md:p-5">
            <h3 className="text-xl font-semibold text-gray-800">
              {header}
            </h3>
            <button
              onClick={close}
              className="flex items-center justify-center w-8 h-8 text-sm text-gray-400 transition-colors bg-transparent rounded-full hover:bg-gray-100 hover:text-gray-600"
            >
              <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          
          {/* Body */}
          <div className="p-4 md:p-5">
            {typeof body === 'string' ? (
              <p className="text-base text-gray-700">{body}</p>
            ) : (
              body
            )}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-4 border-t md:p-5">
            <button
              onClick={close}
              className="px-5 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={confirmAction}
              className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${btnClass}`}
            >
              {btn}
            </button>
          </div>
        </div>
      </div>
      
      {/* Animation styles */}
      <style jsx>{`
        @keyframes modalAppear {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-modal-appear {
          animation: modalAppear 0.3s ease-out forwards;
        }
      `}</style>
    </div>,
    document.body
  );
}

export default ModalBox;