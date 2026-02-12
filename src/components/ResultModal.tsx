"use client";

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  message: string;
  points?: number;
  onClose: () => void;
}

export default function ResultModal({
  isOpen,
  isSuccess,
  message,
  points = 0,
  onClose
}: ResultModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-[3rem] shadow-2xl max-w-md w-full p-10 text-center animate-in zoom-in duration-300">
        {isSuccess ? (
          <>
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-green-200 animate-bounce">
              <CheckCircle className="w-14 h-14 text-white" strokeWidth={3} />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-3">
              ¡Excelente!
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {message}
            </p>
            {points > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-amber-600">
                  <Trophy className="w-6 h-6" />
                  <span className="text-2xl font-black">+{points} puntos</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-rose-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-red-200">
              <XCircle className="w-14 h-14 text-white" strokeWidth={3} />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-3">
              Sigue Intentando
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {message}
            </p>
          </>
        )}
        
        <button
          onClick={onClose}
          className={`w-full py-4 rounded-2xl font-black text-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
            isSuccess
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
              : "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700"
          }`}
        >
          {isSuccess ? 'Continuar' : 'Reintentar'}
        </button>
      </div>
    </div>
  );
}