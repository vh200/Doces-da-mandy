import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaEgg, FaStar } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      
      {/* Elementos Decorativos de Fundo (Abstratos) */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-lg w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 space-y-8 border border-white/50 relative z-10">
        
        {/* Cabeçalho Elegante */}
        <div className="space-y-2">
          <p className="font-script text-3xl text-primary transform -rotate-2">Confeitaria Artesanal</p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-accent tracking-tight leading-tight">
            Brigadeiros<br/>da Mandy
          </h1>
          <div className="flex justify-center gap-2 text-gold text-sm pt-2">
            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
          </div>
        </div>
        
        <p className="text-gray-600 text-lg font-light italic border-t border-b border-secondary/30 py-4 mx-4">
          "Adoçando seus momentos mais especiais com o verdadeiro sabor do brigadeiro gourmet."
        </p>
        
        {/* Botões de Ação */}
        <div className="pt-4 space-y-4">
          <Link 
            to="/pascoa" 
            className="group relative block w-full overflow-hidden rounded-xl bg-[#D4AF37] text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div className="relative flex items-center justify-center gap-3 py-4 px-6">
              <FaEgg className="text-2xl animate-bounce" />
              <div className="text-left">
                <span className="block text-xs font-medium uppercase tracking-wider text-white/90">Edição Limitada</span>
                <span className="block text-xl font-serif font-bold">Cardápio de Páscoa</span>
              </div>
            </div>
          </Link>

          <Link 
            to="/menu" 
            className="group block w-full rounded-xl border-2 border-primary bg-transparent text-primary transition-all hover:bg-primary hover:text-white"
          >
            <div className="flex items-center justify-center py-4 px-6">
              <span className="text-lg font-medium tracking-wide uppercase">Ver Cardápio Tradicional</span>
            </div>
          </Link>
        </div>

        {/* Rodapé Social */}
        <div className="flex justify-center space-x-8 pt-6 border-t border-gray-100">
          <a 
            href="https://wa.me/5551985877572" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-3 bg-green-100 text-green-600 rounded-full transition-transform group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white">
              <FaWhatsapp className="text-2xl" />
            </div>
            <span className="text-xs text-gray-500 font-medium">WhatsApp</span>
          </a>
          <a 
            href="https://www.instagram.com/brigadeiros.da.mandy?igsh=MTNqZHpqZzB2YTJ0bA==" 
            target="_blank"
            rel="noopener noreferrer" 
            className="flex flex-col items-center gap-1 group"
          >
             <div className="p-3 bg-pink-100 text-primary rounded-full transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
              <FaInstagram className="text-2xl" />
            </div>
            <span className="text-xs text-gray-500 font-medium">Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
}
