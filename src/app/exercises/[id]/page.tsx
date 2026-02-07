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

  useEffect(() => {
    loadExercise();
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
      // Obtener todos los ejercicios de la misma lección
      const allExercises = await exercisesAPI.getByLesson(ex.lesson_id);
      
      // Ordenar por el campo 'order'
      const sortedExercises = allExercises.sort((a, b) => a.order - b.order);
      
      // Encontrar el índice del ejercicio actual
      const currentIndex = sortedExercises.findIndex(e => e.id === ex.id);
      
      // Si es el primero (índice 0), no está bloqueado
      if (currentIndex === 0) return false;

      // Verificar si el ejercicio anterior está completado
      const previousExercise = sortedExercises[currentIndex - 1];
      
      // Obtener el progreso del usuario
      let progress;
      try {
        progress = await progressAPI.getAll();
      } catch (error) {
        console.error("Error al obtener progreso:", error);
        return false; // Si hay error, no bloquear
      }

      // Verificar que progress sea un array
      if (!Array.isArray(progress)) {
        console.warn("El progreso no es un array:", progress);
        return false; // Si no es array, no bloquear
      }

      // Buscar si el ejercicio anterior está completado
      const previousCompleted = progress.some(
        (p: any) => p.exercise_id === previousExercise.id && p.completed
      );

      // Retornar true si NO está completado (bloqueado)
      return !previousCompleted;
    } catch (error) {
      console.error("Error checking lock:", error);
      return false; // En caso de error, no bloquear
    }
  }

  async function handleCorrect(code: string, result: any) {
    if (!exercise) return;

    try {
      await progressAPI.submit(exercise.id, code, result);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error saving progress:", error);
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
    </div>
  );
}