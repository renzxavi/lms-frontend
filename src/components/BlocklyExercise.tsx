"use client";

import React, { useEffect, useRef, useState } from "react";

import * as Blockly from "blockly/core";
import "blockly/blocks";

// 🇪🇸 Idioma español
import * as Es from "blockly/msg/es";

import { javascriptGenerator } from "blockly/javascript";
import { Exercise } from "@/types";

import ResultModal from "./ResultModal";
import BlocklyTutorial from "./BlocklyTutorial";

interface BlocklyExerciseProps {
  exercise: Exercise;
  onCorrect: (code: string, result: any) => Promise<void>;
}

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

  /* ───────────────────────────────
     INICIALIZAR BLOCKLY EN ESPAÑOL
  ─────────────────────────────── */
  useEffect(() => {
    if (!blocklyDiv.current) return;

    // 🔥 APLICAR ESPAÑOL ANTES DE INYECTAR
    // Crear objeto de mensajes desde las importaciones
    const esMessages: { [key: string]: string } = {};
    Object.keys(Es).forEach((key) => {
      if (typeof Es[key as keyof typeof Es] === 'string') {
        esMessages[key] = Es[key as keyof typeof Es] as string;
      }
    });
    Blockly.setLocale(esMessages);

    // Parche para imprimir en consola
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
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1,
      },
    });

    workspaceRef.current = workspace;

    return () => {
      workspace.dispose();
      workspaceRef.current = null;
    };
  }, [exercise]);

  /* ───────────────────────────────
     EJECUTAR CÓDIGO
  ─────────────────────────────── */
  const runCode = async () => {
    if (!workspaceRef.current) return;

    Blockly.hideChaff();
    setIsRunning(true);
    setOutput("Validando código...");

    try {
      const code = javascriptGenerator.workspaceToCode(
        workspaceRef.current
      );

      if (!code.trim()) {
        triggerPopup(false, "¡Conectá algunos bloques para comenzar!");
        setIsRunning(false);
        return;
      }

      const outputLines: string[] = [];
      const mockConsole = {
        log: (...args: any[]) =>
          outputLines.push(args.map(String).join(" ")),
      };

      const func = new Function("console", "alert", "window", code);
      func(mockConsole, mockConsole.log, {
        alert: mockConsole.log,
        console: mockConsole,
      });

      const finalOutput = outputLines.join("\n");
      setOutput(finalOutput || "¡Ejecución exitosa!");

      // Si no hay expected_result (ejercicios de solo video), no validar
      if (!exercise.expected_result) {
        triggerPopup(
          true,
          `¡Código ejecutado correctamente! Ganaste ${exercise.points} puntos.`
        );
        await onCorrect(code, {
          output: finalOutput,
          success: true,
        });
        return;
      }

      // Validar resultado esperado
      const isCorrect = finalOutput
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim()
        .includes(exercise.expected_result.toLowerCase().trim());

      if (isCorrect) {
        triggerPopup(
          true,
          `¡Excelente! Ganaste ${exercise.points} puntos.`
        );
        await onCorrect(code, {
          output: finalOutput,
          success: true,
        });
      } else {
        triggerPopup(
          false,
          "El resultado no es correcto. Revisá tus bloques."
        );
      }
    } catch (e: any) {
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

  /* ───────────────────────────────
     JSX
  ─────────────────────────────── */
  return (
    <div className="relative flex flex-col gap-8 max-w-6xl mx-auto p-6 bg-white rounded-3xl min-h-screen">

      {/* Tutorial SOLO por botón */}
      <BlocklyTutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

      <ResultModal
        isOpen={showModal}
        isSuccess={isSuccess}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />

      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-black">{exercise.title}</h1>

        <button
          onClick={() => setShowTutorial(true)}
          className="px-6 py-3 border-2 border-red-300 text-red-600 rounded-2xl font-black hover:bg-red-50 transition"
        >
          ❓ AYUDA RÁPIDA
        </button>
      </header>

      {/* Blockly */}
      <div
        ref={blocklyDiv}
        className="border-4 border-red-50 rounded-3xl bg-white shadow-inner"
        style={{ height: 600 }}
      />

      {/* Botón ejecutar */}
      <button
        onClick={runCode}
        disabled={isRunning}
        className="bg-red-600 text-white py-5 rounded-2xl font-black text-xl disabled:opacity-50"
      >
        {isRunning ? "PROCESANDO..." : "ENVIAR SOLUCIÓN 🚀"}
      </button>

      {/* Consola */}
      <pre className="bg-black text-green-400 p-4 rounded-xl min-h-[120px]">
        {output || "> Esperando ejecución..."}
      </pre>
    </div>
  );
}