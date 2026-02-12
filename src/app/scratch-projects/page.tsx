'use client';

import React from 'react';
import ScratchEmbed from '@/components/Scratchembed';
import { Code2, Sparkles, Rocket } from 'lucide-react';

export default function ScratchProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 border border-orange-200 rounded-full mb-6">
            <Code2 className="w-4 h-4 text-orange-700" />
            <span className="text-orange-700 font-semibold text-sm">Proyectos Interactivos</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-4">
            Aprende con <span className="text-orange-600">Scratch</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explora proyectos interactivos creados con Scratch para aprender programación de forma visual
          </p>
        </div>

        {/* Grid de proyectos */}
        <div className="space-y-12">
          
          {/* Proyecto 1 - Grande */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">
                    Mi Primer Juego
                  </h2>
                  <p className="text-slate-600 font-medium">
                    Un juego simple para aprender los conceptos básicos de Scratch
                  </p>
                </div>
              </div>

              {/* Embed del proyecto */}
              <ScratchEmbed 
                projectId="1086541647" 
                height={450}
                autostart={false}
                showControls={true}
              />

              {/* Descripción */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">
                  Lo que aprenderás
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <span className="font-medium">Movimiento de sprites y controles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <span className="font-medium">Detección de colisiones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <span className="font-medium">Sistema de puntuación</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Grid 2 columnas para proyectos más pequeños */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Proyecto 2 */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-black text-slate-900 mb-4">
                  Animación Interactiva
                </h3>
                <ScratchEmbed 
                  projectId="1086541647"
                  height={300}
                  autostart={false}
                  showControls={true}
                />
                <p className="mt-4 text-sm text-slate-600 font-medium">
                  Aprende a crear animaciones con movimientos y efectos
                </p>
              </div>
            </div>

            {/* Proyecto 3 */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-black text-slate-900 mb-4">
                  Historia Interactiva
                </h3>
                <ScratchEmbed 
                  projectId="1086541647"
                  height={300}
                  autostart={false}
                  showControls={true}
                />
                <p className="mt-4 text-sm text-slate-600 font-medium">
                  Crea historias con decisiones y múltiples finales
                </p>
              </div>
            </div>
          </div>

          {/* Ejemplo sin controles */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Proyecto Embebido Simple
              </h2>
              <p className="text-slate-600 font-medium mb-6">
                Este proyecto se muestra sin controles adicionales
              </p>
              <ScratchEmbed 
                projectId="1086541647"
                height={400}
                autostart={false}
                showControls={false}
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 shadow-xl">
          <h2 className="text-3xl font-black text-white mb-4">
            ¿Listo para crear tus propios proyectos?
          </h2>
          <p className="text-orange-100 font-medium mb-8 text-lg">
            Aprende a programar de forma visual con Scratch
          </p>
          <a
            href="https://scratch.mit.edu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Explorar Scratch
            <Rocket className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}