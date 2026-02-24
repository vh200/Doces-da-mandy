import React, { createContext, useContext, useState, useCallback } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-max max-w-[90vw] transition-all duration-300 ease-out">
          <div className="bg-white/95 backdrop-blur-md border border-pink-200 shadow-xl rounded-2xl px-6 py-4 flex items-center gap-3">
             <div className="bg-green-100 p-2 rounded-full">
               <FaCheckCircle className="text-green-600 text-xl" />
             </div>
             <div>
               <p className="font-bold text-gray-800 text-sm">Adicionado ao carrinho!</p>
               <p className="text-gray-500 text-xs">{toast.message}</p>
             </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
