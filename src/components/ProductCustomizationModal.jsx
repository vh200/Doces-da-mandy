import React, { useState } from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';

export default function ProductCustomizationModal({ product, isOpen, onClose, onConfirm }) {
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [selectedSize, setSelectedSize] = useState(product?.variations ? product.variations[0] : null);

  // Atualiza o tamanho selecionado quando o produto muda
  // MOVIDO PARA ANTES DO IF PARA EVITAR ERRO DE HOOKS
  React.useEffect(() => {
    if (product?.variations) {
      setSelectedSize(product.variations[0]);
    } else {
      setSelectedSize(null);
    }
    setSelectedFlavors([]);
  }, [product]);

  if (!isOpen || !product) return null;

  const toggleFlavor = (flavor) => {
    // Determina o limite de sabores baseado no tamanho selecionado ou no padrão do produto
    // Garante que maxFlavors seja um número, pois pode vir como string do localStorage
    let maxFlavors = selectedSize ? selectedSize.maxFlavors : product.maxFlavors;
    maxFlavors = parseInt(maxFlavors, 10);

    if (selectedFlavors.includes(flavor)) {
      setSelectedFlavors(prev => prev.filter(f => f !== flavor));
    } else {
      if (maxFlavors === 1) {
        // Se o limite for 1, troca automaticamente
        setSelectedFlavors([flavor]);
      } else if (selectedFlavors.length < maxFlavors) {
        // Se ainda couber mais sabores, adiciona
        setSelectedFlavors(prev => [...prev, flavor]);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedFlavors.length > 0) {
      onConfirm({
        flavors: selectedFlavors,
        size: selectedSize
      });
      setSelectedFlavors([]); // Reset for next time
    }
  };

  const currentMaxFlavors = selectedSize ? selectedSize.maxFlavors : (product.maxFlavors || 0);
  const currentPrice = selectedSize ? selectedSize.price : (product.price || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col relative animate-fade-in-up max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Personalize seu Pedido</h2>
            <p className="text-sm text-gray-500">
              {product.name}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          
          {/* Size Selection */}
          {product.variations && product.variations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-700 mb-2">Escolha o Tamanho:</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.variations.map((variation) => (
                  <button
                    key={variation.size}
                    onClick={() => {
                      setSelectedSize(variation);
                      setSelectedFlavors([]); // Limpa sabores ao mudar tamanho pois o limite muda
                    }}
                    className={`p-3 rounded-lg border-2 text-center transition-all
                      ${selectedSize?.size === variation.size
                        ? 'border-primary bg-pink-50 text-primary font-bold'
                        : 'border-gray-100 hover:border-pink-200 text-gray-600'
                      }
                    `}
                  >
                    <div className="text-lg">{variation.size}</div>
                    <div className="text-sm opacity-80">R$ {(variation.price || 0).toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Flavor List */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-2">
              Escolha os Sabores (até {currentMaxFlavors}):
            </h3>
            <div className="space-y-2">
              {product.availableFlavors?.map(flavor => {
                const isSelected = selectedFlavors.includes(flavor);
                const isDisabled = !isSelected && selectedFlavors.length >= currentMaxFlavors;
                
                return (
                  <button
                    key={flavor}
                    onClick={() => toggleFlavor(flavor)}
                    disabled={isDisabled}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between
                      ${isSelected 
                        ? 'border-primary bg-pink-50 text-primary font-medium' 
                        : isDisabled
                          ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'border-gray-200 hover:border-primary hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <span>{flavor}</span>
                    {isSelected && <FaCheck className="text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 font-medium">
              {selectedFlavors.length} de {currentMaxFlavors} selecionados
            </span>
            <span className="text-lg font-bold text-primary">
              Total: R$ {(currentPrice || 0).toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleConfirm}
            disabled={selectedFlavors.length === 0 || (product.variations && product.variations.length > 0 && !selectedSize)}
            className={`px-6 py-2 rounded-full font-bold transition-all shadow-lg
              ${selectedFlavors.length > 0 && (!product.variations || product.variations.length === 0 || selectedSize)
                ? 'bg-primary text-white hover:bg-pink-600 hover:shadow-pink-200'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Adicionar
          </button>
        </div>

      </div>
    </div>
  );
}
