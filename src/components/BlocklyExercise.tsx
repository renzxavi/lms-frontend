"use client";

import React, { useState } from "react";
import { Exercise } from "@/types";
import BlocklyTutorial from "./BlocklyTutorial";
import BlocklyWorkspace from "./Blocklyworkspace";
import { Code, Award, Video, BookOpen, Lightbulb, Sparkles, Flame, Target } from "lucide-react";

interface ExerciseViewProps {
  exercise: Exercise;
  onCorrect: (code: string, result: any) => Promise<void>;
}

type ExerciseType = 'blockly' | 'video' | 'content' | 'hybrid';

export default function ExerciseView({
  exercise,
  onCorrect,
}: ExerciseViewProps) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const getExerciseType = (): ExerciseType => {
    const hasBlockly = exercise.toolbox !== null && exercise.toolbox !== undefined;
    const hasVideo = !!exercise.video_url;
    const hasContent = !!exercise.content;
    
    if (hasBlockly && (hasVideo || hasContent)) return 'hybrid';
    if (hasBlockly) return 'blockly';
    if (hasVideo) return 'video';
    if (hasContent) return 'content';
    return 'blockly';
  };

  const exerciseType = getExerciseType();
  const needsBlockly = exerciseType === 'blockly' || exerciseType === 'hybrid';

  const triggerPopup = (success: boolean, message: string) => {
    if (success) {
      // Log de éxito con estilo
      console.log(
        '%c🎉 ¡EXCELENTE! 🎉',
        'background: #10b981; color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 10px;'
      );
      console.log(
        `%c${message}`,
        'color: #059669; font-size: 14px; font-weight: bold; padding: 5px;'
      );
      console.log(
        '%c✨ Sigue así, eres increíble ✨',
        'color: #10b981; font-style: italic;'
      );
    } else {
      // Log de error con estilo
      console.log(
        '%c❌ ¡CASI LO TIENES! ❌',
        'background: #ef4444; color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 10px;'
      );
      console.log(
        `%c${message}`,
        'color: #dc2626; font-size: 14px; font-weight: bold; padding: 5px;'
      );
      console.log(
        '%c💪 ¡Inténtalo de nuevo, tú puedes! 💪',
        'color: #ef4444; font-style: italic;'
      );
    }
    
    // Separador visual
    console.log('%c' + '═'.repeat(50), 'color: #d1d5db;');
  };

  const completeViewOnlyExercise = async () => {
    setIsRunning(true);
    try {
      await onCorrect('', { type: exerciseType, completed: true });
      triggerPopup(true, `¡Ganaste ${exercise.points} puntos! 🏆`);
    } catch (e: any) {
      triggerPopup(false, `Error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 select-none animate-in fade-in duration-700">
      <BlocklyTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />

      {/* --- HEADER CARD --- */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(220,38,38,0.1)] border border-red-50 overflow-hidden mb-8">
        {/* Barra superior de gradiente rojo */}
        <div className="h-3 bg-gradient-to-r from-red-600 via-rose-500 to-orange-500"></div>
        
        <div className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {exercise.character && (
              <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-orange-50 rounded-[2rem] flex items-center justify-center text-5xl shadow-inner border border-red-100 flex-shrink-0 animate-pulse">
                {{
                  'cat': '🐱', 'dog': '🐶', 'lion': '🦁', 'elephant': '🐘', 
                  'rabbit': '🐰', 'fox': '🦊', 'bear': '🐻', 'panda': '🐼',
                  'owl': '🦉', 'turtle': '🐢', 'robot': '🤖'
                }[exercise.character] || '🧩'}
              </div>
            )}
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full mb-4">
                <Flame className="w-4 h-4 text-red-600" />
                <span className="text-xs font-black text-red-700 uppercase tracking-widest">
                  {needsBlockly ? 'Misión de Código' : exerciseType === 'video' ? 'Misión de Video' : 'Misión de Lectura'}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">
                {exercise.title}
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                {exercise.description}
              </p>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-red-50">
            <div className="flex items-center gap-4 bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-2xl p-4 transition-transform hover:scale-105">
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
                <Award className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">Recompensa</span>
                <p className="text-2xl font-black text-red-900">{exercise.points} Puntos</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-4 transition-transform hover:scale-105">
              <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                <Target className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block">Dificultad</span>
                <p className="text-xl font-black text-orange-900">
                  {exercise.points < 50 ? 'Novato' : exercise.points < 100 ? 'Experto' : 'Maestro'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gradient-to-br from-rose-50 to-white border border-rose-100 rounded-2xl p-4 transition-transform hover:scale-105">
              <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                <Code className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">Modalidad</span>
                <p className="text-xl font-black text-rose-900">
                  {needsBlockly ? 'Lógica' : exerciseType === 'video' ? 'Visual' : 'Teórica'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* --- SIDEBAR --- */}
        <div className="space-y-6">
          {exercise.instructions && (
            <div className="bg-white border-2 border-red-100 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-600 rounded-lg text-white">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-red-900 uppercase text-xs tracking-widest">Objetivo</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">{exercise.instructions}</p>
              </div>
            </div>
          )}

          {exercise.story && (
            <div className="bg-red-900 rounded-[2rem] p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🏮</span>
                <h3 className="font-black text-red-200 uppercase text-xs tracking-widest">La Historia</h3>
              </div>
              <p className="text-red-50 leading-relaxed italic text-sm font-medium opacity-90">
                "{exercise.story}"
              </p>
            </div>
          )}

          {exercise.help_video_url && (
            <div className="bg-white border-2 border-red-600 rounded-[2rem] shadow-xl overflow-hidden group">
              <div className="bg-red-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Video className="w-4 h-4" />
                  <span className="font-black text-[10px] uppercase tracking-widest">Guía Rápida</span>
                </div>
              </div>
              <div className="relative aspect-video">
                <iframe
                  src={exercise.help_video_url}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {exercise.content && (
            <div className="bg-white border-2 border-gray-100 rounded-[2rem] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-black uppercase text-xs tracking-widest">Material</h3>
              </div>
              <div 
                className="prose prose-sm max-w-none prose-p:text-gray-600 prose-headings:text-red-900"
                dangerouslySetInnerHTML={{ __html: exercise.content }}
              />
            </div>
          )}

          {exercise.help_text && (
            <div className="bg-orange-50 border-2 border-orange-100 rounded-[2rem] p-6">
              <div className="flex items-center gap-3 mb-3 text-orange-600">
                <Lightbulb className="w-5 h-5 animate-bounce" />
                <h3 className="font-black uppercase text-xs tracking-widest text-orange-800">Pista Pro</h3>
              </div>
              <p className="text-orange-900/80 text-sm font-medium">{exercise.help_text}</p>
            </div>
          )}

          {needsBlockly && (
            <button
              onClick={() => setShowTutorial(true)}
              className="w-full py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-[1.5rem] font-black text-sm shadow-lg shadow-red-200 hover:shadow-red-300 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                MOSTRAR TUTORIAL
              </span>
            </button>
          )}
        </div>

        {/* --- MAIN WORKSPACE --- */}
        <div className="md:col-span-3">
          {needsBlockly ? (
            <div className="h-full min-h-[600px] bg-white rounded-[2.5rem] border-4 border-red-50 shadow-2xl overflow-hidden">
              <BlocklyWorkspace
                exercise={exercise}
                onCorrect={onCorrect}
                onPopup={triggerPopup}
              />
            </div>
          ) : (
            <div className="bg-white border-4 border-red-50 rounded-[3rem] p-16 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-50 rounded-full blur-3xl -z-10 opacity-50"></div>
              
              <div className="text-8xl mb-8 filter drop-shadow-lg">
                {exerciseType === 'video' ? '🎬' : '📖'}
              </div>
              
              <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                {exerciseType === 'video' ? '¡Misión de Video!' : '¡Misión de Lectura!'}
              </h3>
              
              <p className="text-gray-500 text-xl mb-12 max-w-md mx-auto leading-relaxed">
                Completa el material para desbloquear tu recompensa de <span className="text-red-600 font-black">{exercise.points} puntos</span>.
              </p>
              
              <button
                onClick={completeViewOnlyExercise}
                disabled={isRunning}
                className={`group relative px-12 py-6 rounded-[2rem] font-black text-2xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl ${
                  isRunning
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700 shadow-red-200"
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  {isRunning ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle className="w-7 h-7" />
                      <span>RECLAMAR PUNTOS</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Icono extra necesario
function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}