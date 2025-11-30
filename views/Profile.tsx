import React, { useEffect, useState } from 'react';
import { api } from '../services/mockBackend';
import { Review, User } from '../types';

interface ProfileProps {
  userId?: string; // If undefined, show current user
  onBack?: () => void;
  onLogout?: () => void; // Added logout prop
}

export const Profile: React.FC<ProfileProps> = ({ userId, onBack, onLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // In a real app, passing undefined to getUser would fetch "me", passing an ID fetches that user
      const userData = await api.getUser(userId);
      // For reviews, we want reviews ABOUT this user (targetUserId)
      const reviewsData = await api.getReviews(userData.id);
      
      setUser(userData);
      setReviews(reviewsData);
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  if (loading || !user) {
    return <div className="p-8 text-center text-gray-500">Cargando perfil...</div>;
  }

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 pb-8 shadow-sm relative rounded-b-3xl">
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-6 left-4 text-gray-500 hover:bg-gray-100 p-2 rounded-full"
          >
            ← Volver
          </button>
        )}
        <div className="flex flex-col items-center mt-4">
          <div className="relative">
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-emerald-100 mb-4 object-cover" />
            <div className="absolute bottom-4 right-0 bg-emerald-600 text-white p-1.5 rounded-full border-2 border-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500 text-sm mb-4">{user.location} • Se unió en 2023</p>
          
          <div className="flex items-center gap-6 w-full justify-center border-t border-gray-100 pt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-400 font-bold text-xl">
                <span>{user.rating}</span>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              </div>
              <p className="text-xs text-gray-400">{user.reviewCount} reseñas</p>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <p className="font-bold text-xl text-gray-900">14</p>
              <p className="text-xs text-gray-400">Ventas</p>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <p className="font-bold text-xl text-gray-900">3</p>
              <p className="text-xs text-gray-400">En venta</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="max-w-xl mx-auto p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-4 px-2">Valoraciones recientes</h3>
        
        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-500 shadow-sm">
            <p>Este usuario aún no tiene valoraciones.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map(review => (
              <div key={review.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <img src={review.reviewerAvatar} alt="" className="w-8 h-8 rounded-full bg-gray-200" />
                    <span className="font-medium text-sm text-gray-900">{review.reviewerName}</span>
                  </div>
                  <div className="flex text-yellow-400 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? "fill-current" : "text-gray-200"}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{review.comment}"</p>
                <p className="text-gray-300 text-xs mt-2">Hace 2 días</p>
              </div>
            ))}
          </div>
        )}

        {/* Logout Button (Only for current user) */}
        {!userId && onLogout && (
          <div className="mt-8 px-2 mb-4">
            <button 
              onClick={onLogout}
              className="w-full bg-white border border-red-100 text-red-500 font-bold py-4 rounded-2xl shadow-sm hover:bg-red-50 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
            <p className="text-center text-gray-300 text-xs mt-4">TerrassaMarket v1.0.2 Beta</p>
          </div>
        )}
      </div>
    </div>
  );
};