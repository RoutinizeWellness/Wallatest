import React, { useState } from 'react';
import { Logo } from './Logo';

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: "TerrassaMarket",
    subtitle: "Tu barrio, tus reglas",
    desc: "El marketplace exclusivo para Terrassa donde la seguridad es lo primero. Compra y vende a vecinos reales.",
    // Image: Community/Local vibe (people chatting/happy)
    image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  },
  {
    title: "100% Terrassa",
    subtitle: "Sin envíos raros",
    desc: "Aquí solo operamos en: Centre, Ca n'Aurell, Sant Pere... Queda en persona, revisa el producto y paga tranquilo.",
    // Image: Map/Location/City vibe
    image: "https://images.unsplash.com/photo-1449824913929-2b633d715af7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Pacto de Confianza",
    subtitle: "Importante",
    desc: "Para entrar, debes aceptar nuestras reglas: NADA de pedir Bizum por adelantado y NADA de pedir datos personales por WhatsApp.",
    // Image: Handshake/Trust
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[200] flex flex-col">
      <div className="flex-1 overflow-y-auto w-full">
        <div className="flex flex-col items-center justify-center min-h-full p-8 text-center">
          <div className="mb-6">
             <Logo className="w-16 h-16 text-emerald-600 mx-auto" />
          </div>
          
          <div className="w-full max-w-[280px] aspect-square bg-gray-50 rounded-[32px] mb-8 overflow-hidden shadow-xl border-4 border-white mx-auto relative group">
             <img 
               key={step} 
               src={STEPS[step].image} 
               alt="Onboarding" 
               className="w-full h-full object-cover animate-fade-in transition-transform duration-700 group-hover:scale-105" 
             />
             {step === 2 && (
               <div className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="text-7xl drop-shadow-lg">🤝</span>
               </div>
             )}
          </div>

          <div className="space-y-3 max-w-sm mx-auto">
            <p className="text-emerald-600 font-bold tracking-wider text-xs uppercase">{STEPS[step].subtitle}</p>
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">{STEPS[step].title}</h2>
            <p className="text-gray-500 leading-relaxed text-sm">{STEPS[step].desc}</p>
          </div>
        </div>
      </div>

      <div className="p-6 pb-safe bg-white border-t border-gray-100/50 backdrop-blur-xl">
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-emerald-600' : 'w-2 bg-gray-200'}`} 
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className={`w-full font-bold text-lg py-3.5 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center
            ${step === STEPS.length - 1 
              ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700' 
              : 'bg-gray-900 text-white shadow-gray-200 hover:bg-gray-800'}`}
        >
          {step === STEPS.length - 1 ? 'Acepto y Continuar al Registro' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
};