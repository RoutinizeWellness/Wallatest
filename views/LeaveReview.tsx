import React, { useState } from 'react';
import { api } from '../services/mockBackend';

interface LeaveReviewProps {
  targetUserId: string;
  targetUserName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const LeaveReview: React.FC<LeaveReviewProps> = ({ targetUserId, targetUserName, onSuccess, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    await api.addReview({
      targetUserId,
      rating,
      comment
    });
    setSubmitting(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-fade-in-up">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            🎉
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Compra completada!</h2>
          <p className="text-gray-500">¿Cómo fue tu experiencia con <span className="font-bold text-gray-900">{targetUserName}</span>?</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <svg 
                className={`w-10 h-10 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`} 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Deja un comentario (opcional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="El producto llegó rápido y en perfecto estado..."
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-violet-500 outline-none"
            rows={3}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl text-gray-500 font-medium hover:bg-gray-50 transition-colors"
          >
            Más tarde
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all
              ${rating === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700 active:scale-95'}`}
          >
            {submitting ? 'Enviando...' : 'Enviar Valoración'}
          </button>
        </div>
      </div>
    </div>
  );
};