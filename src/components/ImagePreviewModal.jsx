import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function ImagePreviewModal({ isOpen, onClose, imageUrl, altText }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-[101] p-3 bg-white/10 rounded-full backdrop-blur-md transition-colors"
      >
        <FaTimes size={24} />
      </button>
      
      <div 
        className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={imageUrl} 
          alt={altText} 
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}
