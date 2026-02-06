"use client";

import React, { useState, useEffect, useRef } from "react";
import { Exercise } from "@/types";
import { BookOpen, CheckCircle, Clock, Eye, Award, Bookmark, ChevronDown, ArrowDown } from "lucide-react";
import ResultModal from "./ResultModal";

interface ReadingExerciseProps {
  exercise: Exercise;
  onCorrect: (code: string, result: any) => Promise<void>;
}

export default function ReadingExercise({ exercise, onCorrect }: ReadingExerciseProps) {
  const [hasRead, setHasRead] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isContentShort, setIsContentShort] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);
  const countdownRef = useRef<any>(null);

  useEffect(() => {
    // Iniciar timer de lectura
    timerRef.current = setInterval(() => {
      setReadingTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const hasScroll = contentRef.current.scrollHeight > contentRef.current.clientHeight + 10;
      setIsContentShort(!hasScroll);
      
      if (!hasScroll) {
        // Contenido corto: countdown automático
        countdownRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(countdownRef.current);
              setHasRead(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // Contenido largo: mostrar hint de scroll
        setTimeout(() => setShowScrollHint(false), 5000);
      }
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const handleComplete = async () => {
    if (!hasRead) {
      setModalMessage("¡Aún no has terminado de leer! 📚\nDesplázate hasta el final del contenido para continuar.");
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    setIsSuccess(true);
    setModalMessage(`¡Excelente trabajo! 🎉\n\nHas completado la lectura y ganado ${exercise.points} puntos.`);
    setShowModal(true);
    
    await onCorrect("reading_completed", { 
      completed: true, 
      readingTime,
      scrollProgress: 100 
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    
    const scrolled = scrollTop + clientHeight;
    const percent = (scrolled / scrollHeight) * 100;
    
    setScrollProgress(Math.min(percent, 100));
    
    if (percent > 95) {
      setHasRead(true);
      setIsScrolledToBottom(true);
      setShowScrollHint(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <ResultModal
        isOpen={showModal}
        isSuccess={isSuccess}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />

      {/* Header Card */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 md:p-8 mb-6 shadow-2xl text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-sm font-bold text-orange-100 uppercase tracking-wider">Lectura Educativa</div>
                <h1 className="text-2xl md:text-3xl font-black">{exercise.title}</h1>
              </div>
            </div>
            <p className="text-lg text-orange-50 leading-relaxed">{exercise.description}</p>
          </div>
          {exercise.character && (
            <div className="text-5xl ml-4 hidden md:block">
              {{
                'cat': '🐱', 'dog': '🐶', 'lion': '🦁', 'elephant': '🐘', 
                'rabbit': '🐰', 'fox': '🦊', 'bear': '🐻', 'panda': '🐼',
                'owl': '🦉', 'turtle': '🐢', 'robot': '🤖'
              }[exercise.character] || '📚'}
            </div>
          )}
        </div>
        
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Puntos</span>
            </div>
            <p className="text-2xl font-black">{exercise.points}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Tiempo</span>
            </div>
            <p className="text-2xl font-black">{formatTime(readingTime)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Progreso</span>
            </div>
            <p className="text-2xl font-black">{Math.round(scrollProgress)}%</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Reading Area - 2 columns */}
        <div className="md:col-span-2 space-y-6">
          {/* Instructions */}
          {exercise.instructions && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-black text-blue-900 mb-2 text-lg">📋 Instrucciones</h3>
                  <p className="text-blue-800 leading-relaxed">{exercise.instructions}</p>
                </div>
              </div>
            </div>
          )}

          {/* Story */}
          {exercise.story && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-3">
                <span className="text-3xl">📖</span>
                <div>
                  <h3 className="font-black text-purple-900 mb-2 text-lg">Historia</h3>
                  <p className="text-purple-800 leading-relaxed italic">{exercise.story}</p>
                </div>
              </div>
            </div>
          )}

          {/* Reading Content */}
          <div className="bg-white border-2 border-orange-200 rounded-3xl shadow-2xl overflow-hidden">
            {/* Reading Header */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-orange-600" strokeWidth={2.5} />
                  <span className="font-bold text-orange-900">Contenido de Lectura</span>
                </div>
                {!isContentShort && !hasRead && showScrollHint && (
                  <button
                    onClick={scrollToBottom}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all transform hover:scale-105 text-sm font-bold animate-pulse"
                  >
                    <ArrowDown className="w-4 h-4" />
                    Ir al final
                  </button>
                )}
              </div>
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${hasRead ? 'bg-green-500' : 'bg-orange-500'}`}
                    style={{ width: `${scrollProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div
              ref={contentRef}
              onScroll={handleScroll}
              className="p-6 md:p-8 overflow-y-auto custom-scrollbar"
              style={{ maxHeight: "600px" }}
            >
              <div 
                className="prose prose-lg max-w-none 
                  prose-headings:text-gray-900 prose-headings:font-black
                  prose-p:text-gray-800 prose-p:leading-relaxed
                  prose-li:text-gray-800 
                  prose-strong:text-gray-900 prose-strong:font-bold
                  prose-a:text-orange-600 prose-a:font-semibold
                  prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50 prose-blockquote:rounded-lg prose-blockquote:p-4
                  prose-code:text-orange-600 prose-code:bg-orange-50 prose-code:px-2 prose-code:py-1 prose-code:rounded
                  prose-pre:bg-gray-900 prose-pre:text-gray-100
                  prose-ul:list-disc prose-ol:list-decimal
                  prose-img:rounded-xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: exercise.content || "" }} 
              />
              
              {/* Bottom Indicator */}
              {!isContentShort && !isScrolledToBottom && (
                <div className="mt-8 py-4 border-t-2 border-dashed border-orange-200 text-center">
                  <ChevronDown className="w-8 h-8 text-orange-400 mx-auto animate-bounce" />
                  <p className="text-sm text-orange-600 font-medium mt-2">
                    Sigue desplazándote para completar la lectura
                  </p>
                </div>
              )}
              
              {isScrolledToBottom && (
                <div className="mt-8 py-6 border-t-2 border-green-200 bg-green-50 rounded-xl text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" strokeWidth={2.5} />
                  <p className="text-lg text-green-700 font-bold">
                    ¡Has llegado al final! 🎉
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Short Content Timer */}
          {isContentShort && !hasRead && (
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-center gap-4">
                <Clock className="w-8 h-8 text-yellow-600 animate-pulse" strokeWidth={2.5} />
                <div className="text-center">
                  <p className="text-sm font-bold text-yellow-800 uppercase tracking-wide mb-1">
                    Lee el contenido con atención
                  </p>
                  <p className="text-3xl font-black text-yellow-900">
                    {timeLeft} segundos
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
            <h3 className="font-black text-gray-900 mb-4 text-lg flex items-center gap-2">
              <Eye className="w-5 h-5 text-orange-600" />
              Tu Progreso
            </h3>
            
            <div className="space-y-4">
              {/* Circular Progress */}
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - (isContentShort ? ((15 - timeLeft) / 15) : (scrollProgress / 100)))}`}
                      className={`${hasRead ? 'text-green-500' : 'text-orange-500'} transition-all duration-500`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className={`text-3xl font-black ${hasRead ? 'text-green-600' : 'text-orange-600'}`}>
                      {isContentShort ? Math.round(((15 - timeLeft) / 15) * 100) : Math.round(scrollProgress)}%
                    </span>
                    {hasRead && (
                      <CheckCircle className="w-6 h-6 text-green-500 mt-1" strokeWidth={2.5} />
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className={`p-4 rounded-xl text-center ${hasRead ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'}`}>
                <p className={`font-bold ${hasRead ? 'text-green-700' : 'text-yellow-700'}`}>
                  {hasRead ? '✅ Lectura Completada' : '📖 Continúa leyendo...'}
                </p>
                {!hasRead && !isContentShort && scrollProgress > 0 && (
                  <p className="text-sm text-yellow-600 mt-1">
                    Te falta el {Math.max(0, 100 - Math.round(scrollProgress))}%
                  </p>
                )}
              </div>

              {/* Reading Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <Clock className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                  <p className="text-xs text-orange-700 font-bold">Tiempo</p>
                  <p className="text-lg font-black text-orange-900">{formatTime(readingTime)}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-blue-700 font-bold">Puntos</p>
                  <p className="text-lg font-black text-blue-900">{exercise.points}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Help Card */}
          {exercise.help_text && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-black text-green-900 mb-2 text-lg">Consejo</h3>
                  <p className="text-green-800 leading-relaxed text-sm">{exercise.help_text}</p>
                </div>
              </div>
            </div>
          )}

          {/* Complete Button */}
          <button
            onClick={handleComplete}
            disabled={!hasRead}
            className={`w-full py-5 rounded-2xl font-black text-xl transition-all transform hover:scale-105 shadow-lg ${
              hasRead
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-green-500/50"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {hasRead ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6" strokeWidth={2.5} />
                COMPLETAR LECTURA
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <BookOpen className="w-6 h-6" />
                LEE EL CONTENIDO
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #FEF3C7;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #F97316, #EA580C);
          border-radius: 10px;
          border: 2px solid #FEF3C7;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #EA580C, #C2410C);
        }
      `}</style>
    </div>
  );
}