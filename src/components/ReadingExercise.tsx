"use client";

import React, { useState, useEffect, useRef } from "react";
import { Exercise } from "@/types";
import { BookOpen, CheckCircle } from "lucide-react";
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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const hasScroll = contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setIsContentShort(!hasScroll);
      
      if (!hasScroll) {
        const countdown = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(countdown);
              setHasRead(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(countdown);
      }
    }
  }, []);

  const handleComplete = async () => {
    if (!hasRead) {
      setModalMessage("Lee todo el contenido antes de continuar.");
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    setIsSuccess(true);
    setModalMessage(`¡Excelente! Ganaste ${exercise.points} puntos.`);
    setShowModal(true);
    
    await onCorrect("reading_completed", { completed: true });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    
    const scrolled = scrollTop + clientHeight;
    const percent = (scrolled / scrollHeight) * 100;
    
    if (percent > 95) {
      setHasRead(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl">
      <ResultModal
        isOpen={showModal}
        isSuccess={isSuccess}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />

      <header className="mb-6">
        <h1 className="text-3xl font-black text-black">{exercise.title}</h1>
        <p className="text-gray-800 mt-2 font-medium">{exercise.description}</p>
      </header>

      {exercise.instructions && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
          <BookOpen className="inline w-5 h-5 text-blue-600 mr-2" />
          <span className="font-bold text-black">Instrucciones:</span> 
          <span className="text-black"> {exercise.instructions}</span>
        </div>
      )}

      {exercise.story && (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-6">
          <span className="text-2xl mr-2">🤖</span>
          <span className="font-bold text-black">Historia:</span> 
          <span className="text-black"> {exercise.story}</span>
        </div>
      )}

      <div
        ref={contentRef}
        onScroll={handleScroll}
        className="border-4 border-blue-100 rounded-3xl p-8 overflow-y-auto mb-6 bg-white"
        style={{ maxHeight: "600px" }}
      >
        <div 
          className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-black prose-li:text-black prose-strong:text-black"
          dangerouslySetInnerHTML={{ __html: exercise.content || "" }} 
        />
      </div>

      {isContentShort && !hasRead && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm font-medium text-black">
            ⏱️ Lee el contenido con atención... ({timeLeft} segundos restantes)
          </p>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 bg-gray-200 h-2 rounded-full">
          <div
            className={`h-full transition-all ${hasRead ? "bg-green-500" : "bg-blue-500"}`}
            style={{ width: hasRead ? "100%" : `${((15 - timeLeft) / 15) * 100}%` }}
          />
        </div>
        {hasRead && <CheckCircle className="w-6 h-6 text-green-500" />}
      </div>

      <button
        onClick={handleComplete}
        disabled={!hasRead}
        className={`w-full py-5 rounded-2xl font-black text-xl transition-all ${
          hasRead
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-300 text-black cursor-not-allowed"
        }`}
      >
        {hasRead ? "COMPLETAR LECTURA 🎉" : "LEE TODO EL CONTENIDO 📖"}
      </button>
    </div>
  );
}