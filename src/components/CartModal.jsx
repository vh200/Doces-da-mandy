import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { FaTrash, FaTimes, FaWhatsapp, FaInstagram } from 'react-icons/fa';

export default function CartModal({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const [copySuccess, setCopySuccess] = useState('');

  if (!isOpen) return null;

  const generateMessage = () => {
    let message = "Olá! Gostaria de fazer um pedido:\n\n";
    cart.forEach(item => {
      const itemTotal = (item.price * item.quantity).toFixed(2).replace('.', ',');
      message += `• ${item.quantity}x ${item.name} - R$ ${itemTotal}\n`;
      if (item.selectedFlavors && item.selectedFlavors.length > 0) {
        message += `  Sabores: ${item.selectedFlavors.join(', ')}\n`;
      }
    });
    const totalFormatted = total.toFixed(2).replace('.', ',');
    message += `\nTotal: R$ ${totalFormatted}`;
    return message;
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const message = generateMessage();
    const phoneNumber = "5551985877572";
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  const handleInstagramCheckout = async () => {
    if (cart.length === 0) return;
    const message = generateMessage();
    try {
      await navigator.clipboard.writeText(message);
      setCopySuccess('Pedido copiado! Abra o Direct e cole a mensagem.');
      
      // Wait 2.5 seconds before opening Instagram so the user can read the message
      setTimeout(() => {
        window.open("https://www.instagram.com/brigadeiros.da.mandy/", '_blank');
        setCopySuccess('');
      }, 2500);
      
    } catch (err) {
      console.error('Falha ao copiar:', err);
      window.open("https://www.instagram.com/brigadeiros.da.mandy/", '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col relative animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Seu Carrinho</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Seu carrinho está vazio.</p>
              <button 
                onClick={onClose}
                className="mt-4 text-primary font-medium hover:underline"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.cartItemId || item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  {item.selectedFlavors && item.selectedFlavors.length > 0 && (
                    <p className="text-gray-500 text-xs mt-1">
                      {item.selectedFlavors.join(', ')}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                    <button 
                      onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                    >
                      -
                    </button>
                    <span className="px-2 py-1 text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.cartItemId || item.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t bg-gray-50 rounded-b-xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Total:</span>
              <span className="text-2xl font-bold text-primary">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={handleWhatsAppCheckout}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2"
              >
                <FaWhatsapp size={20} />
                <span>Finalizar no WhatsApp</span>
              </button>

              <button 
                onClick={handleInstagramCheckout}
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2 relative"
              >
                <FaInstagram size={20} />
                <span>Finalizar no Instagram</span>
              </button>
              
              {copySuccess && (
                <div className="text-center bg-green-100 text-green-700 p-2 rounded-lg text-sm font-medium animate-fade-in">
                  {copySuccess}
                </div>
              )}
              
              <p className="text-xs text-center text-gray-400 mt-2">
                Ao escolher Instagram, o pedido será copiado e o perfil abrirá para você colar na mensagem.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
