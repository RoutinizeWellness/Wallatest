import React, { useEffect, useState } from 'react';
import { api, subscribe } from '../services/mockBackend';
import { Listing, Category, Neighborhood } from '../types';

interface HomeProps {
  onSelectListing: (listing: Listing) => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectListing }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [activeNeighborhood, setActiveNeighborhood] = useState<string>('Todos');

  const categories = ['Todos', ...Object.values(Category)];
  const neighborhoods = ['Todos', ...Object.values(Neighborhood)];

  const fetchListings = async () => {
    setLoading(true);
    const data = await api.getListings(undefined, activeCategory, activeNeighborhood);
    setListings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
    const unsubscribe = subscribe(fetchListings);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, activeNeighborhood]);

  return (
    <div className="pb-24 pt-4 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">TerrassaMarket 🏘️</h1>
        <p className="text-sm text-gray-500 mb-4">Compra y vende a tus vecinos. Sin envíos, sin sustos.</p>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar 'Mesa de luz' en Terrassa..." 
            className="w-full bg-gray-100 border-none rounded-2xl py-3 px-12 text-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Filters Area */}
      <div className="space-y-3 mb-6">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
           {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-colors border
                ${activeCategory === cat 
                  ? 'bg-gray-900 text-white border-gray-900' 
                  : 'bg-white border-gray-200 text-gray-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* Neighborhoods (Pills) */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {neighborhoods.map(hood => (
            <button
              key={hood}
              onClick={() => setActiveNeighborhood(hood)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${activeNeighborhood === hood 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-gray-50 text-gray-500 border border-gray-100'}`}
            >
              📍 {hood}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-2xl mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.length === 0 ? (
            <div className="col-span-2 text-center py-10 text-gray-500">
              <p>No hay productos en esta zona/categoría aún.</p>
            </div>
          ) : (
            listings.map(item => (
              <div 
                key={item.id} 
                onClick={() => onSelectListing(item)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-100 border border-gray-100">
                  <img 
                    src={item.images[0]} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  {item.sellerVerified && (
                     <div className="absolute bottom-2 left-2 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                       <span>✓</span> Vecino Verificado
                     </div>
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900">{item.price} €</h3>
                </div>
                <p className="text-sm text-gray-700 truncate font-medium">{item.title}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <span>📍</span> {item.neighborhood}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};