
import React from 'react';
import { CartItem } from '../types';
import { formatCurrency } from '../utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onCheckout: (total: number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemoveItem, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.currentPriceAtAddition, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-6 border-b border-orange-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-serif font-bold text-orange-900">Mon Panier</h2>
            <p className="text-sm text-orange-500 font-medium">{items.length} trésor(s) trouvé(s)</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-[#FFFBF7]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-orange-50 p-6 rounded-full text-orange-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="font-bold text-stone-400 text-sm">Votre panier est vide</p>
              <button 
                onClick={onClose}
                className="text-orange-600 font-bold underline"
              >
                Retourner aux trouvailles
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex gap-4 p-3 bg-white rounded-2xl border border-orange-100 shadow-sm animate-in slide-in-from-right duration-300">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-stone-800 text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-orange-400 uppercase font-bold tracking-wide">{item.category}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-orange-700 text-lg">{formatCurrency(item.currentPriceAtAddition)}</span>
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="text-xs font-medium text-red-400 hover:text-red-600 underline"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-orange-100 bg-white space-y-6 shadow-[0_-10px_40px_rgba(234,88,12,0.05)]">
            <div className="flex justify-between items-center">
              <span className="text-stone-500 font-medium">Total Solidaire</span>
              <span className="text-3xl font-serif font-bold text-orange-800">{formatCurrency(total)}</span>
            </div>
            <button 
              onClick={() => onCheckout(total)}
              className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
            >
              <span>Valider le panier</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <p className="text-xs text-stone-400 text-center leading-tight">
              Merci de soutenir notre mission. Chaque achat aide une famille locale.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
