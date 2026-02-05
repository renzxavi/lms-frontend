import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  helpText?: string;
}

export default function HelpModal({ isOpen, onClose, videoUrl, helpText }: HelpModalProps) {
  if (!isOpen) return null;

  // Extraer ID del video de YouTube
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // Si ya es una URL embed, retornarla
    if (url.includes('/embed/')) return url;
    
    // Extraer el ID del video de diferentes formatos de URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    return null;
  };

  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💡</span>
            <h2 className="text-2xl font-bold text-white">Centro de Ayuda</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Video de YouTube */}
          {embedUrl && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">🎥</span>
                Tutorial en Video
              </h3>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
                  src={embedUrl}
                  title="Video tutorial"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Texto de Ayuda */}
          {helpText && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">📝</span>
                Pistas y Consejos
              </h3>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
                <div 
                  className="prose prose-slate max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: helpText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                />
              </div>
            </div>
          )}

          {/* Tips adicionales */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
            <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
              <span className="text-xl">⚡</span>
              Tips Rápidos
            </h4>
            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Lee cuidadosamente las instrucciones antes de empezar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Prueba tu código paso a paso para encontrar errores</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>No te rindas, ¡aprender requiere práctica!</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            ¡Entendido, vamos a intentarlo!
          </button>
        </div>

      </div>
    </div>
  );
}