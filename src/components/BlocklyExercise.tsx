"use client";

import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import * as Es from "blockly/msg/es";
import { javascriptGenerator } from "blockly/javascript";
import { Exercise } from "@/types";
import ResultModal from "./ResultModal";
import BlocklyTutorial from "./BlocklyTutorial";
import { Code, Play, Zap, Award, Clock, Blocks, Terminal, Lightbulb, BookOpen, Video, Sparkles } from "lucide-react";

interface BlocklyExerciseProps {
  exercise: Exercise;
  onCorrect: (code: string, result: any) => Promise<void>;
}

type ExerciseType = 'blockly' | 'video' | 'content' | 'hybrid';

export default function BlocklyExercise({
  exercise,
  onCorrect,
}: BlocklyExerciseProps) {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);
  const [blockCount, setBlockCount] = useState(0);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

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

  useEffect(() => {
    if (!needsBlockly || !blocklyDiv.current) return;

    const esMessages: { [key: string]: string } = {};
    Object.keys(Es).forEach((key) => {
      if (typeof Es[key as keyof typeof Es] === "string") {
        esMessages[key] = Es[key as keyof typeof Es] as string;
      }
    });
    Blockly.setLocale(esMessages);

    // @ts-ignore
    javascriptGenerator.forBlock["text_print"] = function (block, generator) {
      const order = (generator as any).Order?.NONE ?? 0;
      const msg = generator.valueToCode(block, "TEXT", order) || "''";
      return `console.log(${msg});\n`;
    };

    blocklyDiv.current.innerHTML = "";

    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: {
        kind: "flyoutToolbox",
        contents: [
          { kind: "block", type: "controls_if" },
          { kind: "block", type: "controls_repeat_ext" },
          { kind: "block", type: "math_number" },
          { kind: "block", type: "math_arithmetic" },
          { kind: "block", type: "text" },
          { kind: "block", type: "text_print" },
          { kind: "block", type: "variables_set" },
          { kind: "block", type: "variables_get" },
        ],
      },
      trashcan: true,
      scrollbars: true,
      zoom: { controls: true, wheel: true, startScale: 1 },
    });

    workspaceRef.current = workspace;

    workspace.addChangeListener(() => {
      setBlockCount(workspace.getAllBlocks(false).length);
    });

    return () => {
      workspace.dispose();
      workspaceRef.current = null;
    };
  }, [exercise, needsBlockly]);

  const runCode = async () => {
    if (!workspaceRef.current) return;

    Blockly.hideChaff();
    setIsRunning(true);
    setOutput("⏳ Validando código...");
    
    const startTime = performance.now();

    try {
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current);

      if (!code.trim()) {
        triggerPopup(false, "¡Conecta algunos bloques para comenzar!");
        setIsRunning(false);
        return;
      }

      const outputLines: string[] = [];
      const mockConsole = {
        log: (...args: any[]) => outputLines.push(args.map(String).join(" ")),
      };

      const func = new Function("console", "alert", "window", code);
      func(mockConsole, mockConsole.log, { alert: mockConsole.log, console: mockConsole });

      const finalOutput = outputLines.join("\n");
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      setOutput(finalOutput || "✅ ¡Ejecución exitosa!");

      if (!exercise.expected_result) {
        triggerPopup(true, `¡Código ejecutado correctamente! Ganaste ${exercise.points} puntos.`);
        await onCorrect(code, { output: finalOutput, success: true });
        return;
      }

      const isCorrect = finalOutput
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim()
        .includes(exercise.expected_result.toLowerCase().trim());

      if (isCorrect) {
        triggerPopup(true, `¡Excelente! Ganaste ${exercise.points} puntos.`);
        await onCorrect(code, { output: finalOutput, success: true });
      } else {
        triggerPopup(false, "El resultado no es correcto. Revisa tus bloques.");
      }
    } catch (e: any) {
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      setOutput(`❌ Error: ${e.message}`);
      triggerPopup(false, `Error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const triggerPopup = (success: boolean, message: string) => {
    setIsSuccess(success);
    setModalMessage(message);
    setShowModal(true);
  };

  const completeViewOnlyExercise = async () => {
    setIsRunning(true);
    try {
      triggerPopup(true, `¡Excelente! Ganaste ${exercise.points} puntos.`);
      await onCorrect('', { type: exerciseType, completed: true });
    } catch (e: any) {
      triggerPopup(false, `Error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <BlocklyTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
      <ResultModal 
        isOpen={showModal} 
        isSuccess={isSuccess} 
        message={modalMessage} 
        onClose={() => setShowModal(false)} 
      />

      {/* Header Card */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 md:p-8 mb-6 shadow-2xl text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Code className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-sm font-bold text-purple-100 uppercase tracking-wider">
                  {needsBlockly ? 'Programación Visual' : exerciseType === 'video' ? 'Video Educativo' : 'Contenido Educativo'}
                </div>
                <h1 className="text-2xl md:text-3xl font-black">{exercise.title}</h1>
              </div>
            </div>
            <p className="text-lg text-purple-50 leading-relaxed">{exercise.description}</p>
          </div>
          {exercise.character && (
            <div className="text-5xl ml-4 hidden md:block">
              {{
                'cat': '🐱', 'dog': '🐶', 'lion': '🦁', 'elephant': '🐘', 
                'rabbit': '🐰', 'fox': '🦊', 'bear': '🐻', 'panda': '🐼',
                'owl': '🦉', 'turtle': '🐢', 'robot': '🤖'
              }[exercise.character] || '🧩'}
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
          {needsBlockly && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Blocks className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Bloques</span>
              </div>
              <p className="text-2xl font-black">{blockCount}</p>
            </div>
          )}
          {executionTime !== null && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Tiempo</span>
              </div>
              <p className="text-2xl font-black">{executionTime.toFixed(0)}ms</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Sidebar - 1 column */}
        <div className="space-y-6">
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

          {/* Video Tutorial */}
          {exercise.help_video_url && (
            <div className="bg-white border-2 border-red-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-b-2 border-red-200 p-4">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-red-600" strokeWidth={2.5} />
                  <span className="font-bold text-red-900">🎬 Video Tutorial</span>
                </div>
              </div>
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={exercise.help_video_url}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Video Tutorial"
                />
              </div>
            </div>
          )}

          {/* Main Video */}
          {exercise.video_url && (
            <div className="bg-white border-2 border-cyan-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b-2 border-cyan-200 p-4">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-cyan-600" strokeWidth={2.5} />
                  <span className="font-bold text-cyan-900">🎥 Video Principal</span>
                </div>
              </div>
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={exercise.video_url}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Video Principal"
                />
              </div>
            </div>
          )}

          {/* Content HTML */}
          {exercise.content && (
            <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">📚</span>
                <h3 className="font-black text-indigo-900 text-lg">Contenido</h3>
              </div>
              <div 
                className="prose prose-sm max-w-none 
                  prose-headings:text-gray-900 prose-headings:font-black
                  prose-p:text-gray-800 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: exercise.content }}
              />
            </div>
          )}

          {/* Help Text */}
          {exercise.help_text && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-black text-green-900 mb-2 text-lg">💡 Consejo</h3>
                  <p className="text-green-800 leading-relaxed">{exercise.help_text}</p>
                </div>
              </div>
            </div>
          )}

          {/* Help Button */}
          {needsBlockly && (
            <button
              onClick={() => setShowTutorial(true)}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-2xl font-black text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" strokeWidth={2.5} />
                AYUDA INTERACTIVA
              </span>
            </button>
          )}
        </div>

        {/* Main Area - 2 columns */}
        <div className="md:col-span-2 space-y-6">
          {needsBlockly ? (
            <>
              {/* Blockly Workspace */}
              <div className="bg-white border-2 border-purple-200 rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b-2 border-purple-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Blocks className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                      <span className="font-bold text-purple-900">Espacio de Trabajo</span>
                    </div>
                    <div className="bg-purple-500 text-white px-4 py-2 rounded-xl font-bold text-sm">
                      {blockCount} bloques
                    </div>
                  </div>
                </div>
                <div
                  ref={blocklyDiv}
                  className="bg-gradient-to-br from-gray-50 to-white"
                  style={{ height: 500 }}
                />
              </div>

              {/* Execute Button */}
              <button
                onClick={runCode}
                disabled={isRunning}
                className={`w-full py-5 rounded-2xl font-black text-xl transition-all transform hover:scale-105 shadow-lg ${
                  isRunning
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-500/50"
                }`}
              >
                {isRunning ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    EJECUTANDO...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Play className="w-6 h-6" strokeWidth={2.5} />
                    EJECUTAR CÓDIGO
                  </span>
                )}
              </button>

              {/* Console Output */}
              <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-b-2 border-gray-200 p-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-gray-600" strokeWidth={2.5} />
                    <span className="font-bold text-gray-900">Consola de Salida</span>
                  </div>
                </div>
                <div className="p-6 bg-gray-900 font-mono text-sm min-h-[200px]">
                  <div className="text-cyan-400 mb-3 flex items-center gap-2">
                    <span className="animate-pulse">▶</span>
                    <span>Resultado</span>
                  </div>
                  <pre className="text-green-400 whitespace-pre-wrap leading-relaxed">
                    {output || (
                      <span className="text-gray-500 italic">
                        Esperando ejecución...
                        <span className="animate-pulse ml-2">_</span>
                      </span>
                    )}
                  </pre>
                  {executionTime !== null && (
                    <div className="text-gray-500 text-xs mt-4 pt-4 border-t border-gray-800">
                      ⚡ Tiempo de ejecución: {executionTime.toFixed(2)}ms
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Completion for Video/Content-only exercises */
            <div className="bg-white border-2 border-blue-200 rounded-3xl p-12 text-center shadow-2xl">
              <div className="text-6xl mb-6 animate-bounce">
                {exerciseType === 'video' ? '🎬' : '📚'}
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">
                {exerciseType === 'video' ? 'Mira el video completo' : 'Lee todo el contenido'}
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                Una vez que hayas terminado, haz clic en el botón para marcar como completado
              </p>
              <button
                onClick={completeViewOnlyExercise}
                disabled={isRunning}
                className={`px-12 py-5 rounded-2xl font-black text-xl shadow-lg transition-all transform hover:scale-105 ${
                  isRunning
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-blue-500/50"
                }`}
              >
                {isRunning ? 'PROCESANDO...' : '✅ MARCAR COMO COMPLETADO'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}