import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCustomizationModal from './ProductCustomizationModal';
import ImagePreviewModal from './ImagePreviewModal';
import { FaPlus, FaMinus, FaSearchPlus } from 'react-icons/fa';

export default function ProductCard({ product }) {
  if (!product) return null;

  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const handleIncrement = () => setQuantity(q => q + 1);
  const handleDecrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleAddToCartClick = () => {
    if (product.allowFlavorSelection || product.hasVariations) {
      setIsModalOpen(true);
    } else {
      addToCart(product, quantity);
      showToast(`${quantity}x ${product.name}`);
      setQuantity(1);
    }
  };

  const handleConfirmFlavors = (result) => {
    // result pode ser um array de sabores (antigo) ou objeto { flavors, size } (novo)
    if (Array.isArray(result)) {
      addToCart(product, quantity, result);
    } else {
      const { flavors, size } = result;
      // Se tiver tamanho selecionado, ajusta o produto para adicionar ao carrinho
      const productToAdd = size ? {
        ...product,
        name: `${product.name} (${size.size})`,
        price: size.price,
        id: `${product.id}-${size.size}` // ID único para variação
      } : product;
      
      addToCart(productToAdd, quantity, flavors);
    }
    
    showToast(`${quantity}x ${product.name}`);
    setQuantity(1);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
        <div 
          className="h-48 overflow-hidden relative group cursor-zoom-in"
          onClick={() => setIsImageOpen(true)}
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className={`w-full h-full transition-transform duration-500 group-hover:scale-110 ${product.imageFit === 'contain' ? 'object-contain' : 'object-cover'}`}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
            <FaSearchPlus className="text-white drop-shadow-md" size={24} />
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
          <p className="text-gray-500 text-sm mt-1 mb-4 line-clamp-2 flex-1">{product.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-primary font-bold text-xl">
              {product.hasVariations && product.variations && product.variations.length > 0
                ? `A partir de R$ ${(product.variations[0].price || 0).toFixed(2).replace('.', ',')}`
                : `R$ ${(product.price || 0).toFixed(2).replace('.', ',')}`
              }
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!product.hasVariations && (
              <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                <button 
                  onClick={handleDecrement}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-l-lg transition"
                >
                  <FaMinus size={10} />
                </button>
                <span className="w-8 text-center font-medium text-gray-700 text-sm">
                  {quantity}
                </span>
                <button 
                  onClick={handleIncrement}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-r-lg transition"
                >
                  <FaPlus size={10} />
                </button>
              </div>
            )}
            
            <button 
              onClick={handleAddToCartClick}
              className="flex-1 bg-primary hover:bg-pink-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition duration-300 shadow-sm hover:shadow-md active:scale-95"
            >
              {product.allowFlavorSelection || product.hasVariations ? 'Personalizar' : 'Adicionar'}
            </button>
          </div>
        </div>
      </div>

      <ProductCustomizationModal 
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmFlavors}
      />

      <ImagePreviewModal
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
        imageUrl={product.image}
        altText={product.name}
      />
    </>
  );
}
