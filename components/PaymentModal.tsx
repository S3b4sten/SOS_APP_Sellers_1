
import React, { useState } from 'react';
import { CartItem } from '../types';
import { formatCurrency } from '../utils';

interface PaymentModalProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
  onConfirmPayment: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ items, total, onClose, onConfirmPayment }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      onConfirmPayment();
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-stone-900/40 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-0 md:p-6 lg:p-10">
      <div className="absolute inset-0 z-0" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-6xl h-auto min-h-full md:min-h-0 bg-white md:rounded-[40px] overflow-hidden shadow-2xl flex flex-col lg:flex-row animate-in zoom-in-95 duration-300 my-auto">
        
        {/* Panneau Récapitulatif */}
        <aside className="w-full lg:w-5/12 bg-[#FFF7ED] p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-orange-100 flex flex-col">
          <div className="mb-10">
            <div className="bg-orange-100 text-orange-800 inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              Panier Sécurisé
            </div>
            <h2 className="text-3xl font-serif font-bold text-orange-900">Récapitulatif</h2>
          </div>

          <div className="space-y-4 mb-10 overflow-y-auto max-h-[400px] lg:max-h-none pr-2 custom-scrollbar">
            {items.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex items-center gap-4 p-4 bg-white border border-orange-50 rounded-2xl shadow-sm">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-stone-100 bg-stone-50">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-serif font-bold text-stone-800 line-clamp-1">{item.name}</p>
                  <p className="text-lg font-bold text-orange-600">{formatCurrency(item.currentPriceAtAddition)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto space-y-6 pt-10 border-t border-orange-200">
            <div className="flex justify-between items-end text-stone-800">
              <span className="text-sm font-medium">Total à régler</span>
              <span className="text-4xl font-serif font-bold text-orange-800 tabular-nums">{formatCurrency(total)}</span>
            </div>
            <div className="bg-white text-stone-500 p-4 rounded-2xl flex items-center gap-4 border border-orange-100 text-xs leading-relaxed">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Paiement sécurisé. 100% des fonds sont reversés à nos œuvres sociales.</span>
            </div>
          </div>
        </aside>

        {/* Panneau Paiement */}
        <div className="w-full lg:w-7/12 p-8 lg:p-12 flex flex-col bg-white">
          <div className="mb-10">
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2 text-center lg:text-left">Dernière étape</h3>
            <h2 className="text-3xl font-serif font-bold text-stone-800 text-center lg:text-left">Informations de Paiement</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {['card', 'paypal', 'apple'].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method as any)}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  paymentMethod === method 
                  ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-sm' 
                  : 'bg-white text-stone-400 border-stone-100 hover:border-orange-200 hover:text-orange-600'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-widest">{method === 'card' ? 'CARTE' : method}</div>
              </button>
            ))}
          </div>

          {paymentMethod === 'card' ? (
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wide ml-2">Nom sur la carte</label>
                  <input 
                    type="text" 
                    placeholder="MARC DUPONT"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value.toUpperCase()})}
                    className="w-full px-6 py-3 rounded-2xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none font-medium text-lg transition-all"
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wide ml-2">Numéro de carte</label>
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    className="w-full px-6 py-3 rounded-2xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none font-medium text-lg transition-all tracking-widest"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wide ml-2">Échéance</label>
                    <input 
                      type="text" 
                      placeholder="MM / AA"
                      maxLength={5}
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      className="w-full px-6 py-3 rounded-2xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none font-medium text-lg transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wide ml-2">CVC</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      maxLength={3}
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                      className="w-full px-6 py-3 rounded-2xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none font-medium text-lg transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-6 pb-6 lg:pb-0">
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 hover:bg-orange-700 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Confirmer le Don</>
                  )}
                </button>
                
                <button 
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 bg-white text-stone-500 rounded-xl font-bold text-sm hover:bg-stone-50 transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-stone-50 border-2 border-dashed border-stone-200 rounded-[32px] space-y-6">
               <h4 className="text-2xl font-serif font-bold text-stone-700">Redirection...</h4>
               <p className="text-stone-500 max-w-sm leading-relaxed text-sm">Vous allez être redirigé vers {paymentMethod.toUpperCase()} pour finaliser votre achat solidaire.</p>
               <button onClick={handlePayment} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all">Continuer</button>
               <button 
                  type="button"
                  onClick={onClose}
                  className="text-stone-400 font-bold text-sm underline hover:text-stone-600"
                >
                  Annuler
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
