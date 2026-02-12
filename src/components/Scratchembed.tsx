'use client';

import React, { useState } from 'react';
import { ExternalLink, Maximize2, Play, AlertCircle, Loader2 } from 'lucide-react';

interface ScratchEmbedProps {
  projectId: string;
  width?: number | string;
  height?: number | string;
  autostart?: boolean;
  showControls?: boolean;
  className?: string;
}

export default function ScratchEmbed({
  projectId,
  width = '100%',
  height = 400,
  autostart = false,
  showControls = true,
  className = ''
}: ScratchEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Construir URL del embed
  const embedUrl = `https://scratch.mit.edu/projects/${projectId}/embed?autostart=${autostart}`;
  const projectUrl = `https://scratch.mit.edu/projects/${projectId}`;

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const toggleFullscreen = () => {
    const element = document.getElementById(`scratch-embed-${projectId}`);
    if (!element) return;

    if (!document.fullscreenElement) {
      element.requestFullscreen().catch((err) => {
        console.error('Error al entrar en pantalla completa:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className={`scratch-embed-container ${className}`}>
      {/* Header con controles */}
      {showControls && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Proyecto Scratch</h3>
              <p className="text-xs text-orange-100">ID: {projectId}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Pantalla completa"
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </button>
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Ver en Scratch.mit.edu"
            >
              <ExternalLink className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      )}

      {/* Contenedor del iframe */}
      <div 
        id={`scratch-embed-${projectId}`}
        className="relative bg-slate-100 rounded-b-2xl overflow-hidden border border-slate-200"
        style={{ 
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height 
        }}
      >
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
              <p className="text-sm font-semibold text-orange-800">Cargando proyecto...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-lg font-bold text-red-900 mb-2">Error al cargar proyecto</h4>
              <p className="text-sm text-red-700 mb-4">
                No se pudo cargar el proyecto de Scratch
              </p>
              <a
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Ver en Scratch.mit.edu
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Iframe */}
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          allowFullScreen
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          className="border-0"
          title={`Scratch Project ${projectId}`}
        />
      </div>

      {/* Footer con info adicional */}
      {showControls && (
        <div className="bg-slate-50 border border-t-0 border-slate-200 rounded-b-lg px-4 py-3 mt-0">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="font-medium">Powered by Scratch</span>
            </div>
            <a
              href="https://scratch.mit.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 transition-colors"
            >
              Aprender más sobre Scratch
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}