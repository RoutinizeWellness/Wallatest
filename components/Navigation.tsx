import React from 'react';
import { Logo } from './Logo';

interface NavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navigation: React.FC<NavProps> = ({ currentView, onNavigate }) => {
  // SVG Icons definidos inline para máxima portabilidad
  const Icons = {
    home: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24" strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
    search: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'stroke-2 text-emerald-600' : 'stroke-current'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    ),
    create: (active: boolean) => (
      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    ),
    chat: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24" strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    ),
    profile: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24" strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    )
  };

  const navItems = [
    { id: 'home', icon: Icons.home, label: 'Inicio' },
    { id: 'search', icon: Icons.search, label: 'Buscar' },
    { id: 'create', icon: Icons.create, label: 'Vender', highlight: true },
    { id: 'chat', icon: Icons.chat, label: 'Chat' },
    { id: 'profile', icon: Icons.profile, label: 'Perfil' },
  ];

  return (
    <>
      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-50 pb-safe">
        <div className="flex justify-around items-end h-[60px] pb-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            
            if (item.highlight) {
               return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="relative -top-5 group"
                >
                  <div className="bg-emerald-600 rounded-2xl w-14 h-14 flex items-center justify-center shadow-lg shadow-emerald-200 ring-4 ring-white transform transition-all active:scale-95 group-hover:bg-emerald-700">
                    {item.icon(isActive)}
                  </div>
                  <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Vender
                  </span>
                </button>
               );
            }

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center w-16 space-y-1 transition-colors duration-200
                  ${isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <div className="transition-transform duration-200 active:scale-90">
                    {item.icon(isActive)}
                </div>
                <span className={`text-[10px] font-medium leading-none ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                    {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Top Bar */}
      <nav className="hidden md:block sticky top-0 bg-white/95 backdrop-blur shadow-sm z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <Logo className="w-8 h-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">
              Terrassa<span className="text-emerald-600">Market</span>
            </span>
          </div>
          
          <div className="flex space-x-2">
             {navItems.map((item) => {
               const isActive = currentView === item.id;
               return (
                 <button
                   key={item.id}
                   onClick={() => onNavigate(item.id)}
                   className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200
                     ${item.highlight 
                       ? 'bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-md shadow-emerald-200 hover:shadow-lg ml-4' 
                       : isActive 
                         ? 'text-emerald-600 bg-emerald-50 font-semibold' 
                         : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'}`}
                 >
                   <span className={item.highlight ? "" : (isActive ? "text-emerald-600" : "text-gray-400")}>
                      {item.icon(isActive || !!item.highlight)}
                   </span>
                   <span>{item.label}</span>
                 </button>
               )
             })}
          </div>
        </div>
      </nav>
    </>
  );
};