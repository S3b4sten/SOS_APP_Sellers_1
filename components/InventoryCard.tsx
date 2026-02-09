
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { calculateCurrentPrice, formatCurrency, getDayCount } from '../utils';

interface InventoryCardProps {
  product: Product;
  onRemove: (id: string) => void;
  onMarkAsSold: (product: Product, price: number) => void;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ product, onRemove, onMarkAsSold }) => {
  const [currentPrice, setCurrentPrice] = useState(calculateCurrentPrice(product.originalPrice, product.createdAt));
  const day = getDayCount(product.createdAt);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPrice(calculateCurrentPrice(product.originalPrice, product.createdAt));
    }, 60000);
    return () => clearInterval(timer);
  }, [product]);

  return (
    <article className="group bg-white rounded-[24px] overflow-hidden flex flex-col h-full earth-shadow hover:earth-shadow-lg transition-all duration-300 border-2 border-[#e7e5e4] hover:border-[#d6d3d1]">
      <div className="relative aspect-video overflow-hidden bg-[#f5f5f4]">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#431407] px-3 py-1.5 rounded-xl text-xs font-black shadow-sm border border-[#e7e5e4]">
          JOUR {day}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-5">
           <span className="inline-block text-[10px] font-extrabold bg-[#f5f5f4] text-[#57534e] px-3 py-1.5 rounded-lg uppercase tracking-wider mb-2 border border-[#e7e5e4]">{product.category}</span>
           <h3 className="text-xl font-serif font-bold text-[#292524] leading-tight line-clamp-2">{product.name}</h3>
        </div>
        
        <div className="flex justify-between items-end mb-6 bg-[#fff7ed] p-4 rounded-2xl border border-orange-100">
          <div>
            <span className="text-[10px] font-extrabold text-[#a8a29e] uppercase tracking-wider block mb-0.5">Prix Solidaire</span>
            <span className="text-3xl font-black text-[#ea580c] tabular-nums tracking-tight">{formatCurrency(currentPrice)}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-extrabold text-[#a8a29e] uppercase tracking-wider block mb-0.5">Base</span>
            <span className="text-sm font-bold text-[#d6d3d1] line-through decoration-orange-300 decoration-2">{formatCurrency(product.originalPrice)}</span>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3">
          <button 
            onClick={() => onMarkAsSold(product, currentPrice)}
            className="bg-[#15803d] text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#166534] transition-colors shadow-sm flex items-center justify-center gap-2 hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Vendu
          </button>
          <button 
            onClick={() => onRemove(product.id)}
            className="bg-white text-[#78716c] border-2 border-[#e7e5e4] py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            Retirer
          </button>
        </div>
      </div>
    </article>
  );
};

export default InventoryCard;
