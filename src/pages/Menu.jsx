import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import CartModal from '../components/CartModal';
import { Link } from 'react-router-dom';

export default function Menu({ type }) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();
  const { products: normalProducts, easterProducts } = useProducts();

  const products = type === 'pascoa' ? easterProducts : normalProducts;
  const title = type === 'pascoa' ? 'Cardápio de Páscoa 🐰' : 'Cardápio Tradicional';
  // Ajuste para o novo tema: Fundo creme para tradicional, Fundo dourado suave para pascoa
  const headerBg = type === 'pascoa' ? 'bg-[#FFF8E1]' : 'bg-[#FFF8E1]'; 
  const categoryActiveBg = type === 'pascoa' ? 'bg-[#D4AF37]' : 'bg-primary';
  const pageBg = 'bg-[#FFF8E1]';

  const categories = ['Todos', ...new Set(products.map(p => p.category))];

  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className={`min-h-screen ${pageBg} pb-20`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 ${headerBg} shadow-sm border-b border-secondary/20 py-4 px-6 flex items-center justify-between transition-colors`}>
        <Link to="/" className={`${type === 'pascoa' ? 'text-accent' : 'text-primary'} hover:opacity-80 transition`}>
          <FaArrowLeft size={24} />
        </Link>
        <h1 className={`text-xl font-bold ${type === 'pascoa' ? 'text-accent' : 'text-accent'} font-serif`}>
          {title}
        </h1>
        <button 
          onClick={() => setIsCartOpen(true)}
          className={`relative ${type === 'pascoa' ? 'text-accent' : 'text-primary'} hover:opacity-80 transition`}
        >
          <FaShoppingCart size={24} />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
              {cartItemCount}
            </span>
          )}
        </button>
      </header>

      {/* Category Filter */}
      <div className={`py-4 px-4 overflow-x-auto whitespace-nowrap ${headerBg} mb-6 sticky top-[60px] z-30 transition-colors`}>
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 border border-transparent
                ${selectedCategory === category 
                  ? `${categoryActiveBg} text-white shadow-md transform scale-105` 
                  : 'bg-white text-accent border-secondary/30 hover:bg-secondary/20'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Floating Cart Button (Mobile) */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40 md:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className={`${categoryActiveBg} text-white p-4 rounded-full shadow-lg hover:opacity-90 transition transform hover:scale-110 flex items-center justify-center relative`}
          >
            <FaShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white">
              {cartItemCount}
            </span>
          </button>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </div>
  );
}
