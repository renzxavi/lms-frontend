"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Exercise } from '@/types';
import { CheckCircle2, AlertCircle, Sparkles, Type, AlignLeft, AlignCenter, AlignRight, X, Info } from 'lucide-react';

interface WordEditorExerciseProps {
  exercise: Exercise;
  onCorrect: (code: string, result: any) => Promise<void>;
}

export default function WordEditorExercise({ exercise, onCorrect }: WordEditorExerciseProps) {
  const [editorContent, setEditorContent] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpMessage, setHelpMessage] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  // ✅ Función para mostrar modal de ayuda
  const showHelp = (message: string) => {
    setHelpMessage(message);
    setShowHelpModal(true);
  };

  const applyFormat = (command: string, value?: string) => {
    if (!editorRef.current) return;
    
    editorRef.current.focus();
    
    if (command === 'formatBlock') {
      try {
        document.execCommand(command, false, value);
      } catch (error) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const wrapper = document.createElement(value?.replace(/[<>]/g, '') || 'p');
          
          try {
            range.surroundContents(wrapper);
          } catch (e) {
            wrapper.appendChild(range.extractContents());
            range.insertNode(wrapper);
          }
        }
      }
    } else {
      document.execCommand(command, false, value);
    }
    
    handleEditorInput();
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const formats = new Set<string>();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    
    setActiveFormats(formats);
  };

  const applyHeading = (level: 1 | 2) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (!selectedText.trim()) {
      showHelp(`Selecciona el texto que quieres convertir en Título ${level}`);
      return;
    }

    const heading = document.createElement(`h${level}`);
    heading.textContent = selectedText;
    heading.className = level === 1 ? 'text-3xl font-bold my-4' : 'text-2xl font-semibold my-3';

    try {
      range.deleteContents();
      range.insertNode(heading);
      
      const newRange = document.createRange();
      newRange.setStartAfter(heading);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } catch (error) {
      console.error('Error al aplicar heading:', error);
      applyFormat('formatBlock', `h${level}`);
    }

    handleEditorInput();
  };

  const handleSubmit = async () => {
    if (!editorContent.trim()) {
      showHelp('Debes escribir algo en el editor');
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
      {/* ✅ MODAL DE AYUDA */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-2">¡Espera un momento!</h3>
                <p className="text-gray-700 leading-relaxed">{helpMessage}</p>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

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
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            activeFormats.has('bold') 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Negrita (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => applyFormat('italic')}
          className={`px-4 py-2 rounded-lg italic transition-all ${
            activeFormats.has('italic') 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Cursiva (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => applyFormat('underline')}
          className={`px-4 py-2 rounded-lg underline transition-all ${
            activeFormats.has('underline') 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Subrayado (Ctrl+U)"
        >
          U
        </button>
        
        <div className="w-px bg-gray-300 mx-2"></div>
        
        <button
          onClick={() => applyHeading(1)}
          className="px-4 py-2 bg-gray-100 hover:bg-purple-100 rounded-lg font-bold text-xl transition-all hover:text-purple-600"
          title="Título Grande (selecciona texto primero)"
        >
          H1
        </button>
        <button
          onClick={() => applyHeading(2)}
          className="px-4 py-2 bg-gray-100 hover:bg-purple-100 rounded-lg font-bold text-lg transition-all hover:text-purple-600"
          title="Título Mediano (selecciona texto primero)"
        >
          H2
        </button>
        <button
          onClick={() => applyFormat('formatBlock', 'p')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
          title="Párrafo normal"
        >
          <Type className="w-4 h-4" />
        </button>
        
        <div className="w-px bg-gray-300 mx-2"></div>
        
        <button
          onClick={() => applyFormat('justifyLeft')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
          title="Alinear izquierda"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => applyFormat('justifyCenter')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
          title="Centrar"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => applyFormat('justifyRight')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
          title="Alinear derecha"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleEditorInput}
        onMouseUp={updateActiveFormats}
        onKeyUp={updateActiveFormats}
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