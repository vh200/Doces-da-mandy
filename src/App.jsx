import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ProductProvider } from './context/ProductContext';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Admin from './pages/Admin';
import './index.css';

function App() {
  return (
    <Router>
      <ToastProvider>
        <ProductProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu type="normal" />} />
              <Route path="/pascoa" element={<Menu type="pascoa" />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </CartProvider>
        </ProductProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
