
import React from 'react';

interface NavbarProps {
  onSellClick: () => void;
  onDashboardClick: () => void;
  onHistoryClick: () => void;
  activeView: 'inventory' | 'history';
}

const Navbar: React.FC<NavbarProps> = ({ onSellClick, onDashboardClick, onHistoryClick, activeView }) => {
  return (
    <nav className="sticky top-0 z-50 bg-[#fafaf9]/80 backdrop-blur-xl border-b border-[#e7e5e4] px-6 py-5 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={onDashboardClick}>
          <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-3 rounded-2xl text-white shadow-lg shadow-orange-900/10 group-hover:scale-105 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-serif font-black text-[#431407] leading-none tracking-tight">SOS Dépannage</h1>
            <span className="text-xs font-bold text-[#9a3412] tracking-widest mt-1 uppercase">Revente Solidaire</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onHistoryClick}
            className={`hidden md:flex px-6 py-3 rounded-full font-bold text-sm transition-all items-center gap-2 border-2 ${activeView === 'history' ? 'bg-[#fff7ed] text-[#9a3412] border-orange-200' : 'text-[#57534e] border-transparent hover:bg-white hover:border-[#e7e5e4] hover:shadow-sm'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Statistiques</span>
          </button>

          <button 
            onClick={onSellClick}
            className="flex bg-[#ea580c] text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-[#c2410c] border-2 border-[#c2410c] transition-all items-center gap-2 shadow-lg hover:shadow-orange-900/20 transform active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Ajouter un don</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
