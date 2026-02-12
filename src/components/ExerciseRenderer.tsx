"use client";

import { Exercise } from "@/types";
import BlocklyExercise from "./BlocklyExercise";
import ReadingExercise from "./ReadingExercise";
import VideoExercise from "./VideoExercise";

interface ExerciseRendererProps {
  exercise: Exercise;
  onCorrect: (code: string, result: any) => Promise<void>;
}

export default function ExerciseRenderer({
  exercise,
  onCorrect,
}: ExerciseRendererProps) {
  
  console.log("🔍 [ExerciseRenderer] Ejercicio recibido:", exercise);
  
  const getExerciseType = () => {
    // 1. PRIORIDAD: Ejercicios con Blockly (tienen toolbox)
    const hasToolbox = exercise.toolbox && (
        Array.isArray(exercise.toolbox) 
        ? exercise.toolbox.length > 0 
        : exercise.toolbox.toString().trim() !== ""
    );

    if (hasToolbox) {
      console.log("🔍 [ExerciseRenderer] Tipo detectado: blockly");
      return 'blockly';
    }

    // 2. Ejercicios con Video
    if (exercise.video_url || exercise.help_video_url) {
      console.log("🔍 [ExerciseRenderer] Tipo detectado: video");
      return 'video';
    }

    // 3. Ejercicios de Lectura (tienen contenido de texto)
    const content = exercise.content || exercise.instructions;
    if (content && content.trim() !== "") {
      console.log("🔍 [ExerciseRenderer] Tipo detectado: reading");
      return 'reading';
    }

    // Por defecto, asumimos Blockly
    console.log("🔍 [ExerciseRenderer] Tipo detectado: blockly (por defecto)");
    return 'blockly';
  };

  const type = getExerciseType();

  // Renderizamos el componente apropiado según el tipo
  if (type === 'video') {
    console.log("🔍 [ExerciseRenderer] Renderizando VideoExercise");
    return <VideoExercise exercise={exercise} onCorrect={onCorrect} />;
  }

  if (type === 'reading') {
    console.log("🔍 [ExerciseRenderer] Renderizando ReadingExercise");
    return <ReadingExercise exercise={exercise} onCorrect={onCorrect} />;
  }

  console.log("🔍 [ExerciseRenderer] Renderizando BlocklyExercise");
  return <BlocklyExercise exercise={exercise} onCorrect={onCorrect} />;
}