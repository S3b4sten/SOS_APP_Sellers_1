
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { calculateCurrentPrice, formatCurrency, getDayCount } from '../utils';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [currentPrice, setCurrentPrice] = useState(calculateCurrentPrice(product.originalPrice, product.createdAt));
  const day = getDayCount(product.createdAt);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPrice(calculateCurrentPrice(product.originalPrice, product.createdAt));
    }, 60000);
    return () => clearInterval(timer);
  }, [product]);

  const discountPercent = Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100);

  return (
    <article 
      onClick={() => onSelect(product)}
      className="group bg-white rounded-[24px] border border-stone-100 overflow-hidden flex flex-col h-full warm-shadow warm-shadow-hover transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-stone-600 shadow-sm border border-stone-100">
          Jour {day}
        </div>
        {discountPercent > 0 && (
          <div className="absolute bottom-3 left-3 bg-orange-600 text-white px-3 py-1 rounded-xl text-lg font-bold shadow-lg transform -rotate-2">
            -{discountPercent}%
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col justify-between flex-grow">
        <h3 className="text-lg font-serif font-bold text-stone-800 mb-2 leading-tight line-clamp-2">{product.name}</h3>
        <div className="flex justify-between items-end">
          <span className="text-stone-400 line-through text-xs font-bold mb-1">{formatCurrency(product.originalPrice)}</span>
          <span className="text-3xl font-bold text-orange-600 tabular-nums leading-none">{formatCurrency(currentPrice)}</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
