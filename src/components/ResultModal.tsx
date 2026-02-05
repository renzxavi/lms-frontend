import React from 'react';

interface ResultModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  message: string;
  onClose: () => void;
}

export default function ResultModal({ isOpen, isSuccess, message, onClose }: ResultModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className={`bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in-95 duration-300 border-t-8 transition-all ${
          isSuccess ? 'border-emerald-500' : 'border-red-500'
        }`}
      >
        <div 
          className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
            isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
          }`}
        >
          <span className="text-4xl">{isSuccess ? '🎉' : '❌'}</span>
        </div>

        <h2 
          className={`text-2xl font-bold mb-2 ${
            isSuccess ? 'text-emerald-700' : 'text-red-700'
          }`}
        >
          {isSuccess ? '¡Excelente!' : '¡Casi lo tienes!'}
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>

        <button 
          onClick={onClose}
          className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${
            isSuccess ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-800 hover:bg-slate-900'
          }`}
        >
          {isSuccess ? 'Continuar' : 'Intentar de nuevo'}
        </button>
      </div>
    </div>
  );
}