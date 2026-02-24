import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const DATA_VERSION = 'v7_fix_image_path'; // Mesma versão do ProductContext

  const [cart, setCart] = useState(() => {
    try {
      const savedVersion = localStorage.getItem('cart_version');
      
      // Se a versão mudou, limpa o carrinho antigo para evitar inconsistências
      if (savedVersion !== DATA_VERSION) {
        localStorage.removeItem('cart');
        localStorage.setItem('cart_version', DATA_VERSION);
        return [];
      }

      const savedCart = localStorage.getItem('cart');
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      
      // Migration: Ensure all items have cartItemId and valid price
      return parsedCart.map(item => ({
        ...item,
        price: typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0, // Garante que preço é número válido
        cartItemId: item.cartItemId || `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        selectedFlavors: item.selectedFlavors || []
      }));
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cart_version', DATA_VERSION);
  }, [cart]);

  const addToCart = (product, quantity, selectedFlavors = []) => {
    // Validação de segurança para preço
    if (typeof product.price !== 'number' || isNaN(product.price)) {
      console.warn('Tentativa de adicionar produto com preço inválido ao carrinho:', product);
      // Tenta recuperar preço da primeira variação se disponível
      if (product.variations && product.variations.length > 0) {
        product.price = product.variations[0].price;
      } else {
        product.price = 0; // Fallback final
      }
    }

    setCart(prevCart => {
      // Create a signature to identify identical items (same ID and same flavors)
      const flavorSignature = [...selectedFlavors].sort().join(',');
      
      const existingItemIndex = prevCart.findIndex(item => 
        item.id === product.id && 
        (item.selectedFlavors || []).sort().join(',') === flavorSignature
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }
      
      return [...prevCart, { 
        ...product, 
        quantity, 
        selectedFlavors,
        cartItemId: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
