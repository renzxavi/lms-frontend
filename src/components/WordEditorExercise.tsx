"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Exercise } from '@/types';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface WordEditorExerciseProps {
  exercise: Exercise;
  onCorrect: (code: string, result: any) => Promise<void>;
}

export default function WordEditorExercise({ exercise, onCorrect }: WordEditorExerciseProps) {
  const [editorContent, setEditorContent] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prellenar con el template si existe
    if (exercise.word_template && editorRef.current) {
      editorRef.current.innerHTML = exercise.word_template;
      setEditorContent(exercise.word_template);
    }
  }, [exercise.word_template]);

  const handleEditorInput = () => {
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML);
    }
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleEditorInput();
  };

  const handleSubmit = async () => {
    if (!editorContent.trim()) {
      alert('Debes escribir algo en el editor');
      return;
    }

    setIsChecking(true);

    try {
      const result = {
        html: editorContent,
        text: editorRef.current?.innerText || ''
      };

      await onCorrect(editorContent, result);
    } catch (error) {
      console.error('Error al enviar:', error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header con historia */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white mb-6 shadow-xl">
        <div className="flex items-start gap-6">
          <div className="text-7xl">{exercise.character === 'cat' ? '🐱' : exercise.character === 'dog' ? '🐕' : '📝'}</div>
          <div className="flex-1">
            <h1 className="text-3xl font-black mb-3">{exercise.title}</h1>
            {exercise.story && (
              <p className="text-purple-100 text-lg mb-4">{exercise.story}</p>
            )}
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold">{exercise.points} puntos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 text-lg mb-2">Instrucciones</h3>
            <p className="text-blue-800">{exercise.instructions}</p>
          </div>
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="bg-white border-2 border-gray-200 rounded-t-2xl p-4 flex flex-wrap gap-2">
        <button
          onClick={() => applyFormat('bold')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold transition-colors"
          title="Negrita"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => applyFormat('italic')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg italic transition-colors"
          title="Cursiva"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => applyFormat('underline')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg underline transition-colors"
          title="Subrayado"
        >
          U
        </button>
        
        <div className="w-px bg-gray-300 mx-2"></div>
        
        <button
          onClick={() => applyFormat('formatBlock', '<h1>')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-xl transition-colors"
          title="Título 1"
        >
          H1
        </button>
        <button
          onClick={() => applyFormat('formatBlock', '<h2>')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-lg transition-colors"
          title="Título 2"
        >
          H2
        </button>
        <button
          onClick={() => applyFormat('formatBlock', '<p>')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Párrafo normal"
        >
          P
        </button>
        
        <div className="w-px bg-gray-300 mx-2"></div>
        
        <button
          onClick={() => applyFormat('justifyLeft')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Alinear izquierda"
        >
          ⬅️
        </button>
        <button
          onClick={() => applyFormat('justifyCenter')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Centrar"
        >
          ↔️
        </button>
        <button
          onClick={() => applyFormat('justifyRight')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Alinear derecha"
        >
          ➡️
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleEditorInput}
        className="min-h-[400px] bg-white border-2 border-t-0 border-gray-200 rounded-b-2xl p-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
        style={{ fontSize: '16px', lineHeight: '1.6' }}
      />

      {/* Botón de verificar */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isChecking || !editorContent.trim()}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
        >
          {isChecking ? (
            <>
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              Verificando...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-6 h-6" />
              Verificar Formato
            </>
          )}
        </button>
      </div>

      {/* Ayuda */}
      {exercise.help_text && (
        <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
          <p className="text-yellow-900 font-medium">💡 {exercise.help_text}</p>
        </div>
      )}
    </div>
  );
}