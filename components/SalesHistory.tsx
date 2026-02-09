
import React, { useMemo } from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils';

interface SalesHistoryProps {
  soldProducts: Product[];
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ soldProducts }) => {
  // Calcul des statistiques
  const stats = useMemo(() => {
    const totalRevenue = soldProducts.reduce((sum, p) => sum + (p.soldPrice || 0), 0);
    const totalItems = soldProducts.length;
    const avgPrice = totalItems > 0 ? totalRevenue / totalItems : 0;

    // Calcul du temps moyen de vente
    let totalDays = 0;
    soldProducts.forEach(p => {
      if (p.soldAt && p.createdAt) {
        const start = new Date(p.createdAt).getTime();
        const end = new Date(p.soldAt).getTime();
        const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        totalDays += days;
      }
    });
    const avgDaysToSell = totalItems > 0 ? Math.round(totalDays / totalItems) : 0;

    // Répartition par catégorie
    const categories: Record<string, { count: number; revenue: number }> = {};
    soldProducts.forEach(p => {
      const cat = p.category || 'Divers';
      if (!categories[cat]) categories[cat] = { count: 0, revenue: 0 };
      categories[cat].count += 1;
      categories[cat].revenue += (p.soldPrice || 0);
    });

    const sortedCategories = Object.entries(categories)
      .sort(([, a], [, b]) => b.revenue - a.revenue)
      .map(([name, data]) => ({ name, ...data }));

    return { totalRevenue, totalItems, avgPrice, avgDaysToSell, sortedCategories };
  }, [soldProducts]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      
      {/* Header du Dashboard */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-serif font-black text-[#431407]">Tableau de Bord</h2>
          <p className="text-[#78716c] font-bold text-lg mt-1">Analyse de la performance de votre boutique.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border-2 border-[#e7e5e4] text-xs font-bold text-[#78716c] uppercase tracking-wider shadow-sm">
          Données en temps réel
        </div>
      </div>

      {/* Grid des KPIs Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Revenu */}
        <div className="bg-white p-6 rounded-[24px] border-2 border-[#e7e5e4] earth-shadow hover:border-orange-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-100 rounded-2xl text-orange-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[10px] font-extrabold text-green-600 bg-green-50 px-2 py-1 rounded-lg uppercase">+12%</span>
          </div>
          <p className="text-xs font-extrabold text-[#a8a29e] uppercase tracking-widest mb-1">Chiffre d'Affaires</p>
          <p className="text-3xl font-black text-[#431407]">{formatCurrency(stats.totalRevenue)}</p>
        </div>

        {/* KPI 2: Volume Ventes */}
        <div className="bg-white p-6 rounded-[24px] border-2 border-[#e7e5e4] earth-shadow hover:border-blue-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-extrabold text-[#a8a29e] uppercase tracking-widest mb-1">Objets Vendus</p>
          <p className="text-3xl font-black text-[#431407]">{stats.totalItems}</p>
        </div>

        {/* KPI 3: Panier Moyen */}
        <div className="bg-white p-6 rounded-[24px] border-2 border-[#e7e5e4] earth-shadow hover:border-emerald-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-extrabold text-[#a8a29e] uppercase tracking-widest mb-1">Prix Moyen</p>
          <p className="text-3xl font-black text-[#431407]">{formatCurrency(stats.avgPrice)}</p>
        </div>

        {/* KPI 4: Vélocité */}
        <div className="bg-white p-6 rounded-[24px] border-2 border-[#e7e5e4] earth-shadow hover:border-amber-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-extrabold text-[#a8a29e] uppercase tracking-widest mb-1">Temps de vente</p>
          <p className="text-3xl font-black text-[#431407]">{stats.avgDaysToSell} <span className="text-lg font-bold text-[#a8a29e]">jours</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section Catégories */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[32px] border-2 border-[#e7e5e4] earth-shadow">
          <h3 className="text-xl font-serif font-black text-[#431407] mb-6">Top Catégories</h3>
          {stats.sortedCategories.length === 0 ? (
            <p className="text-[#a8a29e] font-medium text-sm">Pas assez de données.</p>
          ) : (
            <div className="space-y-5">
              {stats.sortedCategories.slice(0, 5).map((cat, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-bold text-[#57534e]">{cat.name}</span>
                    <span className="text-xs font-extrabold text-[#ea580c]">{formatCurrency(cat.revenue)}</span>
                  </div>
                  <div className="w-full bg-[#f5f5f4] h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#ea580c] h-full rounded-full group-hover:bg-[#c2410c] transition-all duration-500" 
                      style={{ width: `${(cat.revenue / stats.totalRevenue) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-[#a8a29e] mt-1 font-medium">{cat.count} ventes</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section Historique Détaillé */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border-2 border-[#e7e5e4] earth-shadow">
          <h3 className="text-xl font-serif font-black text-[#431407] mb-6">Dernières Ventes</h3>
          {soldProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[#a8a29e] font-bold">Aucune vente enregistrée.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {soldProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl border border-[#f5f5f4] hover:bg-[#fafaf9] hover:border-orange-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#f5f5f4] border border-[#e7e5e4] flex-shrink-0">
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#431407] text-sm line-clamp-1">{p.name}</h4>
                      <p className="text-xs font-medium text-[#a8a29e]">{new Date(p.soldAt!).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-[#ea580c]">{formatCurrency(p.soldPrice || 0)}</div>
                    <div className="text-[10px] font-bold text-[#a8a29e] uppercase tracking-wide">{p.category}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;
