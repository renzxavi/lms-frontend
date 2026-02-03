"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';
import { Exercise } from "@/types";

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
      // Generar código JavaScript desde los bloques
      const code = javascriptGenerator.workspaceToCode(workspace.current);

      // Verificar que haya código generado
      if (!code || code.trim() === '') {
        setOutput('⚠️ No hay bloques conectados. Arrastra y conecta bloques para crear tu programa.');
        setIsRunning(false);
        return;
      }

      // Capturar el output de console.log
      const outputLines: string[] = [];
      const mockConsole = {
        log: (...args: any[]) => {
          outputLines.push(args.map(String).join(' '));
        }
      };

      // Ejecutar el código en un sandbox controlado
      let result: any = {};
      let executionError = null;

      try {
        // Reemplazar window.alert por console.log si existe
        const sanitizedCode = code.replace(/window\.alert\(/g, 'console.log(');
        
        // Crear función con contexto controlado
        const func = new Function('console', 'result', sanitizedCode + '\nreturn result;');
        result = func(mockConsole, {});
        
      } catch (e: any) {
        executionError = e;
        console.error('Error ejecutando código de Blockly:', e);
      }

      // Construir mensaje de salida
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

      // Si hubo error, no enviar al backend
      if (executionError) {
        setIsRunning(false);
        return;
      }

      // Preparar datos para enviar al backend - AQUÍ ESTÁ EL CAMBIO CRÍTICO
      const submissionData = {
        exercise_id: exercise.id, // ← ESTO FALTABA
        code: code,
        result: {
          output: outputLines.join('\n'),
          blockCount: workspace.current.getAllBlocks(false).length,
          success: true
        }
      };

      // Enviar al backend para validación
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
      {/* Instrucciones del ejercicio */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-bold text-purple-900 mb-2">📋 Objetivo:</h3>
        <p className="text-purple-800">{exercise.description}</p>
      </div>

      {/* Blockly Workspace */}
      <div 
        ref={blocklyDiv} 
        id="blocklyDiv" 
        className="border-2 border-gray-300 rounded-lg bg-white overflow-hidden shadow-md"
        style={{ height: '500px', width: '100%' }}
      />

      {/* Output Console */}
      <div className="border-2 border-gray-300 rounded-lg bg-gray-900 p-4 min-h-[120px] shadow-md">
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
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {isRunning ? '⏳ Ejecutando...' : '▶ Ejecutar y Validar'}
        </button>
        <button 
          onClick={clearWorkspace}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-all shadow-sm"
        >
          🗑️ Limpiar
        </button>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Consejos:</h4>
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