"use client";

import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import * as Es from "blockly/msg/es";
import { javascriptGenerator } from "blockly/javascript";
import { Exercise } from "@/types";
import ResultModal from "./ResultModal";
import BlocklyTutorial from "./BlocklyTutorial";

interface BlocklyExerciseProps {
  exercise: Exercise;
  onCorrect: (code: string, result: any) => Promise<void>;
}

// Determinar el tipo de ejercicio dinámicamente
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

  // Determinar el tipo de ejercicio dinámicamente
  const getExerciseType = (): ExerciseType => {
    const hasBlockly = exercise.toolbox !== null && exercise.toolbox !== undefined;
    const hasVideo = !!exercise.video_url;
    const hasContent = !!exercise.content;
    
    if (hasBlockly && (hasVideo || hasContent)) return 'hybrid';
    if (hasBlockly) return 'blockly';
    if (hasVideo) return 'video';
    if (hasContent) return 'content';
    return 'blockly'; // default
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

    // Parche imprimir en consola
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

    // Track block count changes
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

  // Para ejercicios de solo video/contenido
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Tutorial */}
        <BlocklyTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
        <ResultModal isOpen={showModal} isSuccess={isSuccess} message={modalMessage} onClose={() => setShowModal(false)} />

        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Title Section */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {exercise.character === "cat" && (
                  <div className="text-5xl animate-bounce">🐱</div>
                )}
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                  {exercise.title}
                </h1>
              </div>
              <p className="text-gray-700 text-lg font-medium leading-relaxed">
                {exercise.description}
              </p>
              
              {/* Stats Bar */}
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="bg-gradient-to-r from-purple-100 to-purple-50 px-4 py-2 rounded-full border border-purple-200">
                  <span className="text-purple-700 font-bold text-sm">
                    🎯 {exercise.points} puntos
                  </span>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-2 rounded-full border border-blue-200">
                  <span className="text-blue-700 font-bold text-sm">
                    🧩 {blockCount} bloques
                  </span>
                </div>
                {executionTime !== null && (
                  <div className="bg-gradient-to-r from-green-100 to-green-50 px-4 py-2 rounded-full border border-green-200">
                    <span className="text-green-700 font-bold text-sm">
                      ⚡ {executionTime.toFixed(0)}ms
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setShowTutorial(true)}
                className="group px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-black shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <span className="flex items-center gap-2">
                  ❓ AYUDA
                  <span className="group-hover:rotate-12 transition-transform">💡</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Instructions, Story, Video, Content */}
          <div className="lg:col-span-1 space-y-4">
            {/* Instructions */}
            {exercise.instructions && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-200 p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">📝</div>
                  <div>
                    <h3 className="text-xl font-black text-blue-700 mb-2">Instrucciones</h3>
                    <p className="text-gray-700 leading-relaxed">{exercise.instructions}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Story */}
            {exercise.story && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200 p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">📖</div>
                  <div>
                    <h3 className="text-xl font-black text-purple-700 mb-2">Historia</h3>
                    <p className="text-gray-700 leading-relaxed italic">{exercise.story}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Video Tutorial from help_video_url */}
            {exercise.help_video_url && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-red-200 overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4">
                  <h3 className="text-white font-black text-xl flex items-center gap-2">
                    🎬 Video Tutorial
                  </h3>
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

            {/* Main Video (video_url) - For video-only exercises */}
            {exercise.video_url && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-cyan-200 overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
                  <h3 className="text-white font-black text-xl flex items-center gap-2">
                    🎥 Video Principal
                  </h3>
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

            {/* Content HTML - For reading exercises */}
            {exercise.content && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-indigo-200 p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-3xl">📚</div>
                  <div>
                    <h3 className="text-xl font-black text-indigo-700">Contenido</h3>
                  </div>
                </div>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: exercise.content }}
                />
              </div>
            )}

            {/* Help Text */}
            {exercise.help_text && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-green-200 p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">💡</div>
                  <div>
                    <h3 className="text-xl font-black text-green-700 mb-2">Pista</h3>
                    <p className="text-gray-700 leading-relaxed">{exercise.help_text}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Blockly & Console OR Completion Button */}
          <div className="lg:col-span-2 space-y-4">
            {needsBlockly ? (
              <>
                {/* Blockly Workspace */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-purple-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                    <h3 className="text-white font-black text-xl flex items-center gap-2">
                      🧩 Espacio de Trabajo
                      <span className="ml-auto text-sm font-normal bg-white/20 px-3 py-1 rounded-full">
                        {blockCount} bloques
                      </span>
                    </h3>
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
                  className={`w-full py-6 rounded-2xl font-black text-2xl shadow-2xl transition-all duration-300 transform ${
                    isRunning
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 hover:scale-[1.02] hover:shadow-3xl active:scale-[0.98]"
                  }`}
                >
                  <span className="text-white drop-shadow-lg flex items-center justify-center gap-3">
                    {isRunning ? (
                      <>
                        <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        PROCESANDO...
                      </>
                    ) : (
                      <>
                        EJECUTAR CÓDIGO
                        <span className="text-4xl animate-pulse">🚀</span>
                      </>
                    )}
                  </span>
                </button>

                {/* Console Output */}
                <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-3 flex items-center gap-2 border-b border-gray-700">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-gray-400 font-mono text-sm ml-4">terminal</span>
                  </div>
                  <div className="p-6 font-mono text-sm min-h-[200px]">
                    <div className="text-cyan-400 mb-3 flex items-center gap-2">
                      <span className="animate-pulse">▶</span>
                      <span>Consola de salida</span>
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
                        Tiempo de ejecución: {executionTime.toFixed(2)}ms
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* Completion Button for Video/Content-only exercises */
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-blue-200 p-12 text-center">
                <div className="text-6xl mb-6">
                  {exerciseType === 'video' ? '🎬' : '📚'}
                </div>
                <h3 className="text-3xl font-black text-gray-800 mb-4">
                  {exerciseType === 'video' ? 'Mira el video completo' : 'Lee todo el contenido'}
                </h3>
                <p className="text-gray-600 text-lg mb-8">
                  Una vez que hayas terminado, haz clic en el botón para marcar como completado
                </p>
                <button
                  onClick={completeViewOnlyExercise}
                  disabled={isRunning}
                  className={`px-12 py-6 rounded-2xl font-black text-2xl shadow-2xl transition-all duration-300 transform ${
                    isRunning
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 hover:scale-[1.05] hover:shadow-3xl active:scale-[0.95] text-white"
                  }`}
                >
                  {isRunning ? 'PROCESANDO...' : '✅ MARCAR COMO COMPLETADO'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}