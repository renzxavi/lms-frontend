"use client";

import { Exercise } from "@/types";
import BlocklyExercise from "./BlocklyExercise";
import ReadingExercise from "./ReadingExercise";
import VideoExercise from "./VideoExercise";
import WordEditorExercise from "./WordEditorExercise";

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
    // 0. PRIORIDAD MÁXIMA: Si tiene exercise_type definido explícitamente, úsalo
    if (exercise.exercise_type) {
      console.log("🔍 [ExerciseRenderer] Tipo detectado desde DB:", exercise.exercise_type);
      return exercise.exercise_type;
    }

    // 1. Si NO tiene toolbox válido, NO puede ser Blockly
    const hasToolbox = exercise.toolbox && (
      Array.isArray(exercise.toolbox) 
        ? exercise.toolbox.length > 0 
        : (typeof exercise.toolbox === 'string' && exercise.toolbox.trim() !== "")
    );

    // 2. Ejercicios con Video (ANTES de Blockly)
    if (exercise.video_url || exercise.help_video_url) {
      // Si tiene video Y NO tiene toolbox, es definitivamente video
      if (!hasToolbox) {
        console.log("🔍 [ExerciseRenderer] Tipo detectado: video (sin toolbox)");
        return 'video';
      }
      // Si tiene video Y toolbox, verificar expected_result
      if (!exercise.expected_result || exercise.expected_result === null) {
        console.log("🔍 [ExerciseRenderer] Tipo detectado: video (sin expected_result)");
        return 'video';
      }
    }

    // 3. Ejercicios con Blockly (tienen toolbox Y expected_result)
    if (hasToolbox && exercise.expected_result) {
      console.log("🔍 [ExerciseRenderer] Tipo detectado: blockly");
      return 'blockly';
    }

    // 4. Ejercicios de Lectura (tienen contenido de texto pero no video ni toolbox)
    const content = exercise.content || exercise.instructions;
    if (content && content.trim() !== "" && !hasToolbox && !exercise.video_url) {
      console.log("🔍 [ExerciseRenderer] Tipo detectado: reading");
      return 'reading';
    }

    // 5. Si solo tiene video_url o help_video_url, es video
    if (exercise.video_url || exercise.help_video_url) {
      console.log("🔍 [ExerciseRenderer] Tipo detectado: video (fallback)");
      return 'video';
    }

    // Por defecto, reading si tiene contenido, sino blockly
    if (content && content.trim() !== "") {
      console.log("🔍 [ExerciseRenderer] Tipo detectado: reading (por defecto con contenido)");
      return 'reading';
    }
    
    console.log("🔍 [ExerciseRenderer] Tipo detectado: blockly (por defecto)");
    return 'blockly';
  };

  const type = getExerciseType();

  // Renderizamos el componente apropiado según el tipo
  if (type === 'word_editor') {
    console.log("🔍 [ExerciseRenderer] Renderizando WordEditorExercise");
    return <WordEditorExercise exercise={exercise} onCorrect={onCorrect} />;
  }

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