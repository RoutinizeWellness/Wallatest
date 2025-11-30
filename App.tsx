import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Onboarding } from './components/Onboarding';
import { Auth } from './views/Auth';
import { Home } from './views/Home';
import { CreateListing } from './views/CreateListing';
import { Chat } from './views/Chat';
import { Profile } from './views/Profile';
import { LeaveReview } from './views/LeaveReview';
import { Listing } from './types';
import { api } from './services/mockBackend';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  
  // Review Flow State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [pendingReviewTarget, setPendingReviewTarget] = useState<{id: string, name: string} | null>(null);

  // Check local storage for onboarding and auth status
  useEffect(() => {
    try {
      const onboarded = localStorage.getItem('wallaplus_onboarded');
      const token = localStorage.getItem('wallaplus_token');
      
      if (onboarded) setShowOnboarding(false);
      if (token) setIsAuthenticated(true);
    } catch (e) {
      console.warn("LocalStorage access failed", e);
    }
  }, []);

  const handleOnboardingComplete = () => {
    try {
      localStorage.setItem('wallaplus_onboarded', 'true');
    } catch (e) {
      console.warn("Could not save onboarding status", e);
    }
    setShowOnboarding(false);
  };

  const handleAuthSuccess = () => {
    try {
      localStorage.setItem('wallaplus_token', 'mock_token_123');
    } catch (e) {
      console.warn("Could not save token", e);
    }
    setIsAuthenticated(true);
    setCurrentView('home');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('wallaplus_token');
      // We keep onboarding status
    } catch (e) {
      console.warn("LocalStorage access failed", e);
    }
    api.logout();
    setIsAuthenticated(false);
    setCurrentView('home'); // Will redirect to auth due to logic below if we were strict, but here we render Auth component directly
  };

  const handleListingSelect = (listing: Listing) => {
    setSelectedListing(listing);
    setCurrentView('detail');
  };

  const handleBuy = async () => {
    if (!selectedListing) return;
    const success = await api.buyItem(selectedListing.id);
    if (success) {
      // Trigger Review Modal
      setPendingReviewTarget({
        id: selectedListing.sellerId,
        name: selectedListing.sellerName
      });
      setShowReviewModal(true);
    } else {
      alert("Error al procesar la compra. Inténtalo de nuevo.");
    }
  };

  const renderContent = () => {
    // Detail View Overlay
    if (currentView === 'detail' && selectedListing) {
      return (
        <div className="pb-24 animate-fade-in">
          <div className="relative h-96 bg-gray-200">
            <button 
              onClick={() => setCurrentView('home')}
              className="absolute top-4 left-4 z-10 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <img src={selectedListing.images[0]} className="w-full h-full object-cover" alt={selectedListing.title} />
          </div>
          <div className="p-6 max-w-3xl mx-auto -mt-8 relative bg-white rounded-t-3xl min-h-[50vh] shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 pr-4">
                 <h1 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{selectedListing.title}</h1>
                 <p className="text-3xl font-extrabold text-emerald-600">{selectedListing.price} €</p>
              </div>
              <button className="bg-gray-50 p-3 rounded-full text-xl hover:bg-red-50 hover:text-red-500 transition-colors">❤</button>
            </div>
            
            {/* Info Vendedor Resumen */}
            <div className="flex items-center gap-3 py-4 border-y border-gray-100 mb-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-xl px-2 -mx-2" onClick={() => setCurrentView('profile_view_seller')}>
              <img src={selectedListing.sellerAvatar} className="w-12 h-12 rounded-full border border-gray-200" alt="" />
              <div className="flex-1">
                <p className="font-bold text-gray-900">{selectedListing.sellerName}</p>
                <div className="flex text-yellow-400 text-sm items-center">
                  <span>★★★★★</span>
                  <span className="text-gray-400 ml-1 font-medium">(42 reseñas)</span>
                </div>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-600 leading-relaxed mb-6 text-lg">{selectedListing.description}</p>
            
            {/* Botón Prominente Perfil */}
            <button 
              onClick={() => setCurrentView('profile_view_seller')}
              className="w-full mb-8 py-3.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-bold hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all flex items-center justify-center gap-2 group shadow-sm"
            >
              <img src={selectedListing.sellerAvatar} className="w-6 h-6 rounded-full opacity-80 group-hover:opacity-100" alt="" />
              <span>Ver perfil completo de {selectedListing.sellerName}</span>
            </button>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-8 flex gap-3 items-center text-sm text-gray-600">
               <span className="text-2xl">🛡️</span>
               <p>Tu dinero se guarda seguro en TerrassaMarket hasta que confirmas que todo está bien.</p>
            </div>

            <div className="space-y-3 pb-safe">
              <button 
                onClick={handleBuy}
                className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>💳</span> Comprar ahora
              </button>
              <button 
                onClick={() => setCurrentView('chat')}
                className="w-full bg-white border-2 border-emerald-100 text-emerald-700 font-bold py-4 rounded-2xl hover:bg-emerald-50 transition-colors"
              >
                Chatear
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // External seller profile view
    if (currentView === 'profile_view_seller' && selectedListing) {
      return <Profile userId={selectedListing.sellerId} onBack={() => setCurrentView('detail')} />;
    }

    // Main Routes
    switch (currentView) {
      case 'home':
      case 'search':
        return <Home onSelectListing={handleListingSelect} />;
      case 'create':
        return <CreateListing onSuccess={() => setCurrentView('home')} />;
      case 'chat':
        return <Chat />;
      case 'profile':
        return <Profile onLogout={handleLogout} />; // Current user profile
      default:
        return <Home onSelectListing={handleListingSelect} />;
    }
  };

  // Main Logic Flow:
  // 1. Show Onboarding if not seen.
  // 2. Show Auth if seen but not authenticated.
  // 3. Show App if authenticated.

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        <Auth onSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navigation currentView={currentView} onNavigate={setCurrentView} />
      <main className="md:pt-0 animate-fade-in">
        {renderContent()}
      </main>
      
      {/* Review Modal Overlay */}
      {showReviewModal && pendingReviewTarget && (
        <LeaveReview 
          targetUserId={pendingReviewTarget.id}
          targetUserName={pendingReviewTarget.name}
          onSuccess={() => {
            setShowReviewModal(false);
            setPendingReviewTarget(null);
            setCurrentView('home'); // Go back home after review
          }}
          onCancel={() => {
            setShowReviewModal(false);
            setPendingReviewTarget(null);
            setCurrentView('home');
          }}
        />
      )}
    </div>
  );
}

export default App;