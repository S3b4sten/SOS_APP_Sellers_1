
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import InventoryCard from './components/InventoryCard';
import SalesHistory from './components/SalesHistory';
import SellForm from './components/SellForm';
import { Product } from './types';
import { formatCurrency } from './utils';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [view, setView] = useState<'inventory' | 'history'>('inventory');
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  // Stats calculées
  const activeProducts = products.filter(p => p.status === 'active');
  const soldProducts = products.filter(p => p.status === 'sold');
  const totalRevenue = soldProducts.reduce((sum, p) => sum + (p.soldPrice || 0), 0);

  const addProduct = (newProduct: Product) => {
    setProducts([{ ...newProduct, status: 'active' }, ...products]);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const markAsSold = (product: Product, price: number) => {
    setProducts(products.map(p => 
      p.id === product.id 
      ? { ...p, status: 'sold', soldPrice: price, soldAt: new Date().toISOString() } 
      : p
    ));
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#431407] font-sans selection:bg-orange-200 selection:text-orange-900">
      <Navbar 
        onSellClick={() => setIsSellModalOpen(true)} 
        onDashboardClick={() => setView('inventory')}
        onHistoryClick={() => setView('history')}
        activeView={view}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* KPI Panel - Fort contraste : Fond blanc pur + Ombres marquées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white border-2 border-[#e7e5e4] p-10 rounded-[32px] earth-shadow hover:earth-shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-100 rounded-2xl text-orange-700 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-sm font-extrabold text-[#7c2d12] uppercase tracking-widest">En Boutique</span>
            </div>
            <div className="text-6xl font-serif font-black text-[#292524]">{activeProducts.length}</div>
            <p className="text-base font-bold text-[#a8a29e] mt-2">Objets prêts à partir</p>
          </div>

          <div className="bg-white border-2 border-[#e7e5e4] p-10 rounded-[32px] earth-shadow hover:earth-shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-amber-100 rounded-2xl text-amber-700 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-extrabold text-[#7c2d12] uppercase tracking-widest">Bonheur Partagé</span>
            </div>
            <div className="text-6xl font-serif font-black text-[#78350f]">{soldProducts.length}</div>
            <p className="text-base font-bold text-[#a8a29e] mt-2">Objets revalorisés</p>
          </div>

          {/* Carte Revenus : Dégradé Ocre/Terre */}
          <div className="bg-gradient-to-br from-[#9a3412] to-[#7c2d12] text-white border border-[#7c2d12] p-10 rounded-[32px] earth-shadow-lg relative overflow-hidden group">
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl text-orange-50 border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <span className="text-sm font-extrabold text-orange-100 uppercase tracking-widest">Fonds Récoltés</span>
                </div>
                <div className="text-6xl font-serif font-black text-white tracking-tight">{formatCurrency(totalRevenue)}</div>
                <p className="text-base font-bold text-orange-200 mt-2 opacity-90">Pour soutenir nos actions</p>
            </div>
            {/* Forme décorative */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-orange-600/30 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          </div>
        </div>

        {view === 'inventory' ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-serif font-black text-[#292524] tracking-tight">Rayons Solidaires</h2>
                <p className="text-[#57534e] mt-2 font-bold text-lg">Donnez une seconde vie aux objets.</p>
              </div>
              <button 
                onClick={() => setIsSellModalOpen(true)}
                className="bg-[#292524] text-[#fafaf9] px-8 py-4 rounded-2xl font-bold text-sm hover:bg-[#1c1917] transition-all shadow-lg flex items-center gap-3 transform active:scale-95 border border-[#44403c]"
              >
                <span>+ Ajouter un objet</span>
              </button>
            </div>

            {activeProducts.length === 0 ? (
              <div className="bg-white rounded-[40px] border-2 border-[#e7e5e4] border-dashed py-32 flex flex-col items-center justify-center text-center px-6 shadow-sm">
                <div className="bg-[#fff7ed] p-8 rounded-full mb-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#fb923c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-3xl font-serif font-bold text-[#431407] mb-4">Les rayons sont vides</h3>
                <p className="text-[#78716c] max-w-lg mb-10 text-xl leading-relaxed">Utilisez notre assistant IA pour identifier et ajouter rapidement les nouveaux dons.</p>
                <button 
                   onClick={() => setIsSellModalOpen(true)}
                   className="bg-[#ea580c] text-white px-10 py-5 rounded-full font-black text-lg shadow-xl hover:bg-[#c2410c] hover:-translate-y-1 transition-all"
                >
                  Scanner un objet
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {activeProducts.map(product => (
                  <InventoryCard 
                    key={product.id} 
                    product={product} 
                    onRemove={removeProduct}
                    onMarkAsSold={markAsSold}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <SalesHistory soldProducts={soldProducts} />
        )}
      </main>

      {isSellModalOpen && (
        <SellForm 
          onClose={() => setIsSellModalOpen(false)} 
          onAddProduct={addProduct} 
        />
      )}

      <footer className="mt-32 border-t border-[#e7e5e4] py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
          <div>
            <h2 className="text-3xl font-serif font-black text-[#431407] mb-2">SOS Dépannage</h2>
            <p className="text-[#78716c] font-bold text-lg">Aider, Réparer, Réutiliser.</p>
          </div>
          <div className="flex gap-10 text-[#78716c] font-bold text-sm">
            <span className="hover:text-[#ea580c] cursor-pointer transition-colors">© 2024 Application Bénévole</span>
            <span className="hover:text-[#ea580c] cursor-pointer transition-colors">Confidentialité</span>
            <span className="hover:text-[#ea580c] cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
