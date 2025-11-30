import React, { useState, useRef } from 'react';
import { api } from '../services/mockBackend';
import { ListingStatus, Category, Neighborhood } from '../types';

interface CreateListingProps {
  onSuccess: () => void;
}

export const CreateListing: React.FC<CreateListingProps> = ({ onSuccess }) => {
  const [image, setImage] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'details'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: Category.HOGAR, // Default
    neighborhood: Neighborhood.CENTRE, // Default
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImage(base64);
      setStep('details');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    await api.createListing({
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      currency: "EUR",
      category: formData.category,
      neighborhood: formData.neighborhood,
      images: [image],
      status: ListingStatus.ACTIVE
    });

    onSuccess();
  };

  if (step === 'upload') {
    return (
      <div className="flex flex-col h-full p-6 text-center justify-center max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-2">Vende en Terrassa</h2>
        <p className="text-gray-500 mb-8">Sube una foto y crea tu anuncio en menos de 2 minutos.</p>
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-emerald-300 bg-emerald-50 rounded-3xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-100 transition-colors"
        >
          <span className="text-5xl mb-4">📷</span>
          <span className="text-emerald-600 font-bold">Subir foto del producto</span>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto pb-24">
      <h2 className="text-2xl font-bold mb-6">Detalles del Anuncio</h2>
      
      <div className="mb-6 rounded-2xl overflow-hidden h-32 relative">
        <img src={image!} alt="Preview" className="w-full h-full object-cover" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título breve</label>
          <input 
            type="text" 
            required
            maxLength={50}
            placeholder="Ej: Cuna de madera blanca"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Precio (€)</label>
           <input 
              type="number" 
              required
              min="0"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-xl font-bold text-lg"
            />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría (Solo 3 disponibles)</label>
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value as Category})}
              className="w-full p-3 border border-gray-200 rounded-xl bg-white"
            >
              {Object.values(Category).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">¿En qué barrio estás?</label>
            <select 
              value={formData.neighborhood}
              onChange={e => setFormData({...formData, neighborhood: e.target.value as Neighborhood})}
              className="w-full p-3 border border-gray-200 rounded-xl bg-white"
            >
              {Object.values(Neighborhood).map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">Solo operamos en estos barrios de Terrassa.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea 
            rows={3}
            required
            placeholder="Describe el estado real del producto..."
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-xl resize-none"
          />
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800 flex gap-2">
          <span>⚠️</span>
          <p>Al publicar, prometes que no pedirás pagos adelantados y quedarás en persona.</p>
        </div>

        <button 
          type="submit"
          className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg mt-4 hover:bg-emerald-700"
        >
          Publicar en TerrassaMarket
        </button>
      </form>
    </div>
  );
};