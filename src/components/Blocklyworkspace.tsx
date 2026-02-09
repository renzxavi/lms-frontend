"use client";

import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import * as Es from "blockly/msg/es";
import { javascriptGenerator } from "blockly/javascript";
import { Exercise } from "@/types";
import { Play, Blocks, Terminal } from "lucide-react";

interface BlocklyWorkspaceProps {
  exercise: Exercise;
  onCorrect: (code: string, result: any) => Promise<void>;
  onPopup: (success: boolean, message: string) => void;
}

export default function BlocklyWorkspace({
  exercise,
  onCorrect,
  onPopup,
}: BlocklyWorkspaceProps) {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const isDisposedRef = useRef<boolean>(false); // 👈 Nuevo: flag manual

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [blockCount, setBlockCount] = useState(0);
  const scrollPositionRef = useRef<number>(0);

  // Lock scroll position
  useEffect(() => {
    const handleScroll = () => {
      scrollPositionRef.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!blocklyDiv.current) return;

    // Configure Spanish language
    const esMessages: { [key: string]: string } = {};
    Object.keys(Es).forEach((key) => {
      if (typeof Es[key as keyof typeof Es] === "string") {
        esMessages[key] = Es[key as keyof typeof Es] as string;
      }
    });
    Blockly.setLocale(esMessages);

    // Define custom print block
    // @ts-ignore
    javascriptGenerator.forBlock["text_print"] = function (block, generator) {
      const order = (generator as any).Order?.NONE ?? 0;
      const msg = generator.valueToCode(block, "TEXT", order) || "''";
      return `console.log(${msg});\n`;
    };

    // Clear previous workspace PROPERLY
    if (workspaceRef.current && !isDisposedRef.current) {
      try {
        workspaceRef.current.dispose();
        isDisposedRef.current = true;
      } catch (e) {
        console.warn('Error disposing workspace:', e);
      }
      workspaceRef.current = null;
    }
    
    if (blocklyDiv.current) {
      blocklyDiv.current.innerHTML = "";
    }

    // Small delay to ensure cleanup is complete
    const timeoutId = setTimeout(() => {
      if (!blocklyDiv.current) return;

      // Create Blockly workspace
      const workspace = Blockly.inject(blocklyDiv.current, {
        toolbox: {
          kind: "flyoutToolbox",
          contents: [
            { kind: "label", text: "🎯 LÓGICA" },
            { kind: "block", type: "controls_if" },
            { kind: "block", type: "logic_compare" },
            { kind: "block", type: "logic_operation" },
            { kind: "block", type: "logic_boolean" },
            { kind: "sep", gap: "32" },
            
            { kind: "label", text: "🔄 BUCLES" },
            { kind: "block", type: "controls_repeat_ext" },
            { kind: "block", type: "controls_whileUntil" },
            { kind: "block", type: "controls_for" },
            { kind: "sep", gap: "32" },
            
            { kind: "label", text: "🔢 MATEMÁTICAS" },
            { kind: "block", type: "math_number" },
            { kind: "block", type: "math_arithmetic" },
            { kind: "block", type: "math_modulo" },
            { kind: "block", type: "math_random_int" },
            { kind: "sep", gap: "32" },
            
            { kind: "label", text: "📝 TEXTO" },
            { kind: "block", type: "text" },
            { kind: "block", type: "text_print" },
            { kind: "block", type: "text_join" },
            { kind: "sep", gap: "32" },
            
            { kind: "label", text: "📋 LISTAS" },
            { kind: "block", type: "lists_create_with" },
            { kind: "block", type: "lists_length" },
            { kind: "block", type: "lists_getIndex" },
            { kind: "sep", gap: "32" },
            
            { kind: "label", text: "📦 VARIABLES" },
            { kind: "block", type: "variables_set" },
            { kind: "block", type: "variables_get" },
            { kind: "block", type: "math_change" },
          ],
        },
        renderer: "zelos",
        theme: Blockly.Themes.Classic,
        trashcan: true,
        scrollbars: true,
        zoom: { 
          controls: true, 
          wheel: false, 
          startScale: 1,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        },
        move: {
          scrollbars: {
            horizontal: true,
            vertical: true
          },
          drag: true,
          wheel: false
        },
        grid: {
          spacing: 20,
          length: 3,
          colour: '#e9ecef',
          snap: true
        },
      });

      // Create default variables
      workspace.createVariable('contador', null, 'contador');
      workspace.createVariable('resultado', null, 'resultado');
      workspace.createVariable('a');
      workspace.createVariable('b');

      workspaceRef.current = workspace;
      isDisposedRef.current = false; // 👈 Marcar como activo

      // Track block count
      const changeListener = () => {
        if (workspace && !isDisposedRef.current) {
          setBlockCount(workspace.getAllBlocks(false).length);
        }
      };
      workspace.addChangeListener(changeListener);

      // Prevent page scroll
      const preventScroll = (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.closest('.blocklyToolboxDiv, .blocklyFlyout, .injectionDiv')) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      const blocklyContainer = blocklyDiv.current;
      if (blocklyContainer) {
        blocklyContainer.addEventListener('wheel', preventScroll, { passive: false });
        blocklyContainer.addEventListener('touchmove', preventScroll, { passive: false });
        
        blocklyContainer.addEventListener('mousedown', (e) => {
          e.stopPropagation();
        });
        
        blocklyContainer.addEventListener('click', (e) => {
          e.stopPropagation();
          const savedScrollY = scrollPositionRef.current;
          requestAnimationFrame(() => {
            window.scrollTo({ top: savedScrollY, behavior: 'instant' });
          });
        });
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (workspaceRef.current && !isDisposedRef.current) {
        try {
          workspaceRef.current.dispose();
          isDisposedRef.current = true;
        } catch (e) {
          console.warn('Error disposing workspace on cleanup:', e);
        }
        workspaceRef.current = null;
      }
    };
  }, [exercise]);

  const runCode = async () => {
    if (!workspaceRef.current || isDisposedRef.current) {
      onPopup(false, "Error: El workspace no está disponible");
      return;
    }

    try {
      Blockly.hideChaff();
    } catch (e) {
      console.warn('Error hiding chaff:', e);
    }
    
    setIsRunning(true);
    setOutput("⏳ Validando código...");

    try {
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current);

      if (!code.trim()) {
        onPopup(false, "¡Conecta algunos bloques para comenzar!");
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
      setOutput(finalOutput || "¡Ejecución incompleta!");

      if (!exercise.expected_result) {
        onPopup(true, `¡Código ejecutado correctamente! Ganaste ${exercise.points} puntos.`);
        await onCorrect(code, { output: finalOutput, success: true });
        return;
      }

      const isCorrect = finalOutput
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim()
        .includes(exercise.expected_result.toLowerCase().trim());

      if (isCorrect) {
        onPopup(true, `¡Excelente! Ganaste ${exercise.points} puntos.`);
        await onCorrect(code, { output: finalOutput, success: true });
      } else {
        onPopup(false, "El resultado no es correcto. Revisa tus bloques.");
      }
    } catch (e: any) {
      setOutput(`❌ Error: ${e.message}`);
      onPopup(false, `Error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="blockly-container">
      <style jsx>{`
        .blockly-container {
          position: relative;
          isolation: isolate;
        }
        .blockly-container :global(.blocklyFlyout) {
          overflow-y: auto !important;
          overflow-x: hidden !important;
        }
        .blockly-container :global(.blocklyFlyoutBackground) {
          fill: #f8f9fa !important;
          fill-opacity: 0.95 !important;
        }
        .blockly-container :global(.blocklyFlyoutLabelText) {
          font-weight: 800 !important;
          font-size: 14px !important;
          fill: #495057 !important;
        }
        .blockly-workspace-wrapper {
          position: relative;
          overflow: hidden;
          touch-action: none;
        }
        .blockly-workspace-wrapper :global(.injectionDiv) {
          position: relative !important;
        }
      `}</style>
      
      <div className="bg-white border-2 border-purple-200 rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b-2 border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Blocks className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
              <span className="font-bold text-purple-900">Espacio de Trabajo Simple</span>
            </div>
            <div className="bg-purple-500 text-white px-4 py-2 rounded-xl font-bold text-sm">
              {blockCount} bloques
            </div>
          </div>
        </div>
        <div className="blockly-workspace-wrapper">
          <div
            ref={blocklyDiv}
            className="bg-gradient-to-br from-gray-50 to-white"
            style={{ height: 600 }}
          />
        </div>
      </div>

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
        </div>
      </div>
    </div>
  );
}