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

  useEffect(() => {
    if (!blocklyDiv.current) return;

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
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
    });

    return () => {
      workspace.current?.dispose();
      workspace.current = null;
    };
  }, [exercise]);

  const runCode = async () => {
    if (!workspace.current) return;

    setIsRunning(true);
    setOutput('Ejecutando código...');

    try {
      const code = javascriptGenerator.workspaceToCode(workspace.current);

      if (!code || code.trim() === '') {
        setOutput('⚠️ No hay bloques conectados. Arrastra y conecta bloques para crear tu programa.');
        setIsRunning(false);
        return;
      }

      const outputLines: string[] = [];
      const mockConsole = {
        log: (...args: any[]) => {
          outputLines.push(args.map(String).join(' '));
        }
      };

      let result: any = {};
      let executionError = null;

      try {
        const sanitizedCode = code.replace(/window\.alert\(/g, 'console.log(');
        const func = new Function('console', 'result', sanitizedCode + '\nreturn result;');
        result = func(mockConsole, {});
      } catch (e: any) {
        executionError = e;
        console.error('Error ejecutando código de Blockly:', e);
      }

      let outputMessage = '';
      
      if (executionError) {
        outputMessage = `❌ Error al ejecutar el código:\n${executionError.message}\n\n`;
      } else {
        outputMessage = '✅ Código ejecutado correctamente!\n\n';
      }

      if (outputLines.length > 0) {
        outputMessage += '📝 Salida del programa:\n' + outputLines.join('\n') + '\n\n';
      }

      outputMessage += `💻 Código generado:\n${code}`;
      
      setOutput(outputMessage);

      if (executionError) {
        setIsRunning(false);
        return;
      }

      const submissionData = {
        exercise_id: exercise.id,
        code: code,
        result: {
          output: outputLines.join('\n'),
          blockCount: workspace.current.getAllBlocks(false).length,
          success: true
        }
      };

      await onCorrect(submissionData.code, submissionData.result);

    } catch (error: any) {
      console.error('Error general:', error);
      setOutput(`❌ Error inesperado:\n${error.message || 'Error desconocido'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearWorkspace = () => {
    workspace.current?.clear();
    setOutput('');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Personaje animado + Historia */}
      {exercise.character && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <AnimalCharacter character={exercise.character} animate={true} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-purple-900 mb-2">
                📖 {exercise.title}
              </h3>
              {exercise.story && (
                <p className="text-purple-700 text-lg leading-relaxed">
                  {exercise.story}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instrucciones del ejercicio */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 shadow-md">
        <h3 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <span>Tu misión:</span>
        </h3>
        <p className="text-yellow-800 text-lg">{exercise.description}</p>
      </div>

      {/* Blockly Workspace */}
      <div 
        ref={blocklyDiv} 
        id="blocklyDiv" 
        className="border-4 border-blue-300 rounded-xl bg-white overflow-hidden shadow-xl"
        style={{ height: '500px', width: '100%' }}
      />

      {/* Output Console */}
      <div className="border-4 border-green-300 rounded-xl bg-gray-900 p-4 min-h-[120px] shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-green-400 font-mono text-sm">●</span>
          <span className="text-gray-400 font-mono text-sm">Consola de salida</span>
        </div>
        <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
          {output || 'Presiona "Ejecutar" para ver el resultado...'}
        </pre>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button 
          onClick={runCode}
          disabled={isRunning}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105"
        >
          {isRunning ? '⏳ Ejecutando...' : '▶️ Ejecutar y Validar'}
        </button>
        <button 
          onClick={clearWorkspace}
          className="px-6 py-4 bg-red-100 text-red-700 rounded-xl font-bold text-lg hover:bg-red-200 transition-all shadow-md transform hover:scale-105"
        >
          🗑️ Limpiar
        </button>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 text-lg">💡 Consejos:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Arrastra bloques desde la barra lateral izquierda</li>
          <li>• Conecta los bloques como piezas de puzzle para formar tu programa</li>
          <li>• Usa el bloque "print" para mostrar mensajes</li>
          <li>• Presiona "Ejecutar y Validar" para probar tu solución</li>
        </ul>
      </div>
    </div>
  );
}