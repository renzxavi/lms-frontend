"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { exercisesAPI, progressAPI } from "@/lib/api";
import { Exercise } from "@/types";
import ExerciseRenderer from "@/components/ExerciseRenderer";
import { Loader2, Lock } from "lucide-react";

export default function ExercisePage() {
  const params = useParams();
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    loadExercise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function loadExercise() {
    try {
      const data = await exercisesAPI.getById(Number(params.id));
      setExercise(data);

      // Verificar bloqueo solo para la lección 1
      if (data.lesson_id === 1) {
        const locked = await checkIfLocked(data);
        setIsLocked(locked);
      }
    } catch (error) {
      console.error("Error loading exercise:", error);
    } finally {
      setLoading(false);
    }
  }

  async function checkIfLocked(ex: Exercise): Promise<boolean> {
    try {
      const allExercises = await exercisesAPI.getByLesson(ex.lesson_id);
      // ✅ Tipos explícitos para los parámetros de sort
      const sortedExercises = allExercises.sort((a: Exercise, b: Exercise) => a.order - b.order);
      // ✅ Tipo explícito para el parámetro de findIndex
      const currentIndex = sortedExercises.findIndex((e: Exercise) => e.id === ex.id);
      
      if (currentIndex === 0) return false;

      const previousExercise = sortedExercises[currentIndex - 1];
      
      let progress: any[];
      try {
        progress = await progressAPI.getAll();
      } catch (error) {
        console.error("Error al obtener progreso:", error);
        return false;
      }

      if (!Array.isArray(progress)) {
        console.warn("El progreso no es un array:", progress);
        return false;
      }

      const previousCompleted = progress.some(
        (p: any) => p.exercise_id === previousExercise.id && p.completed
      );

      return !previousCompleted;
    } catch (error) {
      console.error("Error checking lock:", error);
      return false;
    }
  }


  async function handleCorrect(code: string, result: any) {
  if (!exercise) return;

  try {
    console.log('💾 Guardando progreso del ejercicio:', {
      exercise_id: exercise.id,
      code,
      result
    });
    
    // ✅ Asegurarse de que result tenga un indicador de éxito
    const finalResult = {
      ...result,
      completed: true, // Marcar como completado
      success: true
    };
    
    await progressAPI.submit(exercise.id, code, finalResult);
    setIsCompleted(true);
  } catch (error) {
    console.error("❌ Error saving progress:", error);
  }
}

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100/30 flex items-center justify-center">
        <div className="flex items-center gap-3 text-red-600 font-medium">
          <Loader2 className="w-6 h-6 animate-spin" />
          Cargando ejercicio...
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ejercicio no encontrado
          </h2>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ejercicio Bloqueado
            </h2>
            <p className="text-gray-600 mb-6">
              Debes completar el ejercicio anterior antes de acceder a este.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100/30 py-8">
      <ExerciseRenderer exercise={exercise} onCorrect={handleCorrect} />
      
      {isCompleted && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl animate-bounce">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-bold text-lg">¡Ejercicio completado!</p>
              <button
                onClick={() => router.push("/dashboard")}
                className="text-sm underline hover:no-underline mt-1"
              >
                Volver al dashboard →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}