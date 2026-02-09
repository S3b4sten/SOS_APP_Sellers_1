
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { calculateCurrentPrice, formatCurrency, getDayCount } from '../utils';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, currentPrice: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAddToCart }) => {
  const [currentPrice, setCurrentPrice] = useState(calculateCurrentPrice(product.originalPrice, product.createdAt));
  const day = getDayCount(product.createdAt);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPrice(calculateCurrentPrice(product.originalPrice, product.createdAt));
    }, 60000);
    return () => clearInterval(timer);
  }, [product]);

  const discountPercent = Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100);

  const handleComparePrice = () => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(product.name + " prix neuf")}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100] overflow-y-auto flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] w-full max-w-5xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-stone-100 transition-colors"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Section */}
          <div className="relative bg-stone-100 aspect-square lg:aspect-auto">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <div className="absolute bottom-6 left-6 bg-orange-600 text-white px-4 py-2 rounded-2xl text-2xl font-bold shadow-lg transform -rotate-2">
                -{discountPercent}%
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.category}
                </span>
                <span className="bg-stone-100 text-stone-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  JOUR {day}
                </span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-stone-900 leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-stone-400 font-medium text-sm">Don de : {product.sellerName}</p>
            </div>

            <p className="text-stone-600 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Price Box */}
            <div className="bg-orange-50 rounded-2xl p-6 mb-8 flex justify-between items-center border border-orange-100">
                <div>
                  <span className="text-xs font-bold text-orange-400 uppercase block mb-1">Prix d'origine</span>
                  <span className="text-lg font-medium text-stone-400 line-through">{formatCurrency(product.originalPrice)}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-orange-600 uppercase block mb-1">PRIX SOLIDAIRE</span>
                  <span className="text-4xl font-serif font-bold text-orange-700 tabular-nums">{formatCurrency(currentPrice)}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => onAddToCart(product, currentPrice)}
                className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 hover:bg-orange-700 hover:-translate-y-1 transition-all"
              >
                Ajouter au panier
              </button>
              
              <button 
                onClick={handleComparePrice}
                className="w-full py-3 bg-white text-stone-600 rounded-2xl border border-stone-200 font-bold text-sm hover:bg-stone-50 transition-all"
              >
                Comparer le prix en ligne
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
