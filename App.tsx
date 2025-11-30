import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Onboarding } from './components/Onboarding';
import { Home } from './views/Home';
import { CreateListing } from './views/CreateListing';
import { Chat } from './views/Chat';
import { Profile } from './views/Profile';
import { LeaveReview } from './views/LeaveReview';
import { Listing } from './types';
import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Auth hooks
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  // Convex hooks
  const storeUser = useMutation(api.users.store);

  // Sync user to Convex on login
  useEffect(() => {
    if (isSignedIn && user) {
      storeUser();
    }
  }, [isSignedIn, user, storeUser]);

  // Review Flow State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [pendingReviewTarget, setPendingReviewTarget] = useState<{ id: string, name: string } | null>(null);

  // Check local storage for onboarding
  useEffect(() => {
    const onboarded = localStorage.getItem('wallaplus_onboarded');
    if (onboarded) setShowOnboarding(false);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('wallaplus_onboarded', 'true');
    setShowOnboarding(false);
  };

  const handleListingSelect = (listing: Listing) => {
    setSelectedListing(listing);
    setCurrentView('detail');
  };

  // Placeholder for buy functionality
  const handleBuy = async () => {
    if (!selectedListing) return;
    alert("Compra iniciada (Simulación)");
    // Trigger Review Modal
    setPendingReviewTarget({
      id: selectedListing.sellerId,
      name: selectedListing.sellerName
    });
    setShowReviewModal(true);
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
        return <Profile onLogout={() => signOut()} />; // Current user profile
      default:
        return <Home onSelectListing={handleListingSelect} />;
    }
  };

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  // Clerk handles auth UI, but we can show a sign-in page if not signed in
  // However, usually we want to allow browsing without auth?
  // User requirement: "conectate con clerk para la auth".
  // Let's assume we require auth for now or use Clerk's SignedIn/SignedOut components.
  // For simplicity, let's enforce auth for the whole app for now, or at least for interactive parts.
  // But the previous app had an Auth component.
  // Let's use Clerk's <SignIn /> or <SignUp /> if not signed in.

  if (!isSignedIn) {
    // We can import SignIn from clerk
    // But let's just use the RedirectToSignIn or similar?
    // Or render a custom landing page with "Sign In" button.
    // Let's import SignIn from clerk-react
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8 text-emerald-600">TerrassaMarket</h1>
          {/* We can't use SignIn component directly without Router usually, but let's try rendering a simple button that redirects */}
          <button onClick={() => window.location.href = "https://hopeful-doe-56.clerk.accounts.dev/sign-in"} className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold">
            Iniciar Sesión
          </button>
        </div>
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