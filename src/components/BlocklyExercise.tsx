"use client";

import React, { useEffect, useRef } from 'react';
import { Exercise } from "@/types";

// ✅ Definimos qué datos recibe este componente
interface BlocklyExerciseProps {
  exercise: Exercise;
  onCorrect: (code: string, result: any) => Promise<void>;
}

export default function BlocklyExercise({ exercise, onCorrect }: BlocklyExerciseProps) {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspace = useRef<any>(null);

  // NOTA: Aquí iría toda tu lógica de configuración de Blockly (toolbox, bloques, etc.)
  // Este es un ejemplo simplificado para que el archivo compile sin errores.
  
  const runCode = () => {
    // Ejemplo de cómo llamarías a onCorrect cuando el usuario termina
    const mockCode = "print('hola world')";
    const mockResult = "hola world";
    onCorrect(mockCode, mockResult);
  };

  return (
    <div className="flex flex-col gap-4">
      <div 
        ref={blocklyDiv} 
        id="blocklyDiv" 
        style={{ height: '480px', width: '100%' }}
        className="border rounded-lg bg-gray-50"
      >
        {/* Aquí se inyecta Blockly */}
      </div>
      <button 
        onClick={runCode}
        className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition"
      >
        Ejecutar y Validar
      </button>
    </div>
  );
}