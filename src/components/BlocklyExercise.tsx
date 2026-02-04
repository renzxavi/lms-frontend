"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';
import { Exercise } from "@/types";
import AnimalCharacter from './AnimalCharacter';

interface BlocklyExerciseProps {
  exercise: Exercise;
  onCorrect: (code: string, result: any) => Promise<void>;
}

export default function BlocklyExercise({ exercise, onCorrect }: BlocklyExerciseProps) {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspace = useRef<Blockly.WorkspaceSvg | null>(null);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  // 1. Limpieza y creación robusta
  useEffect(() => {
    if (!blocklyDiv.current) return;

    // Limpieza absoluta para evitar duplicados en HMR o navegación rápida
    if (workspace.current) {
      workspace.current.dispose();
    }
    blocklyDiv.current.innerHTML = ''; 

    workspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox: {
        kind: 'flyoutToolbox',
        contents: [
          { kind: 'block', type: 'controls_if' },
          { kind: 'block', type: 'controls_repeat_ext' },
          { kind: 'block', type: 'math_number' },
          { kind: 'block', type: 'math_arithmetic' },
          { kind: 'block', type: 'text' },
          { kind: 'block', type: 'text_print' },
          { kind: 'block', type: 'variables_set' },
          { kind: 'block', type: 'variables_get' },
        ],
      },
      trashcan: true,
      scrollbars: true,
      zoom: { controls: true, wheel: true, startScale: 1.0 },
    });

    // IMPORTANTE: El return debe ser impecable para evitar el error de "unregistered tree"
    return () => {
      if (workspace.current) {
        workspace.current.dispose();
        workspace.current = null;
      }
    };
  }, [exercise]);

  const runCode = async () => {
    if (!workspace.current) return;

    // 2. Proteccion de Foco: Cerramos cualquier UI abierta de Blockly antes de seguir
    Blockly.hideChaff(); 

    setIsRunning(true);
    setOutput('Ejecutando código...');

    try {
      const code = javascriptGenerator.workspaceToCode(workspace.current);

      if (!code || code.trim() === '') {
        setOutput('⚠️ No hay bloques conectados.');
        setIsRunning(false);
        return;
      }

      const outputLines: string[] = [];
      const mockConsole = {
        log: (...args: any[]) => outputLines.push(args.map(String).join(' '))
      };

      const sanitizedCode = code.replace(/window\.alert\(/g, 'console.log(');
      const func = new Function('console', 'result', sanitizedCode + '\nreturn result;');
      func(mockConsole, {});

      const finalOutput = outputLines.join('\n');
      
      // Solo actualizamos estado si el componente sigue montado
      setOutput(finalOutput || 'Código ejecutado correctamente.');

      // Notificamos al padre (aquí es donde ocurre la navegación al dashboard)
      await onCorrect(code, {
        output: finalOutput,
        blockCount: workspace.current.getAllBlocks(false).length,
        success: true
      });

    } catch (error: any) {
      setOutput(`❌ Error: ${error.message}`);
    } finally {
      // Usamos un check para evitar actualizar estado en componente desmontado
      if (workspace.current) setIsRunning(false);
    }
  };

  const clearWorkspace = () => {
    if (workspace.current) {
      workspace.current.clear();
      setOutput('');
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto p-6 text-[#111827] bg-white animate-in fade-in duration-500">
      
      {/* Header Estilo TOP */}
      <header className="border-b border-gray-200 pb-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4 italic">
              {exercise.title}
            </h1>
            <div className="prose prose-slate max-w-none text-lg text-gray-600 leading-relaxed">
              {exercise.story}
            </div>
          </div>
          {exercise.character && (
            <div className="hidden md:block opacity-90 grayscale-[0.3] hover:grayscale-0 transition-all">
              <AnimalCharacter character={exercise.character} animate={false} />
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Panel lateral */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <section className="bg-slate-50 border border-slate-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              Instrucciones
            </h3>
            <p className="text-slate-700 leading-relaxed font-medium">
              {exercise.description}
            </p>
          </section>

          <section className="bg-[#1e293b] rounded-xl overflow-hidden shadow-lg flex-1 flex flex-col min-h-[200px]">
            <div className="bg-[#0f172a] px-4 py-2 border-b border-slate-700 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Consola</span>
            </div>
            <div className="p-5 font-mono text-sm text-emerald-400 overflow-auto flex-1">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {output ? `> ${output}` : '> Esperando ejecución...'}
              </pre>
            </div>
          </section>
        </div>

        {/* Editor Principal */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div 
            ref={blocklyDiv} 
            className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm ring-1 ring-black/[0.03]"
            style={{ height: '550px', width: '100%' }}
          />

          <div className="flex items-center gap-4">
            <button 
              onClick={runCode}
              disabled={isRunning}
              className="flex-1 bg-[#1e40af] text-white px-8 py-4 rounded-lg font-bold text-base hover:bg-[#1e3a8a] transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
            >
              {isRunning ? 'Validando...' : 'Confirmar Solución'}
            </button>
            <button 
              onClick={clearWorkspace}
              className="px-6 py-4 border border-slate-300 text-slate-600 rounded-lg font-bold text-base hover:bg-slate-50 transition-all"
            >
              Reiniciar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}