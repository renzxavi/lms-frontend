"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { exercisesAPI, progressAPI } from "@/lib/api";
import { Exercise } from "@/types";
import ExerciseRenderer from "@/components/ExerciseRenderer"; // ← CAMBIO AQUÍ
import { Loader2 } from "lucide-react";

export default function ExercisePage() {
  const params = useParams();
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExercise();
  }, [params.id]);

  const loadExercise = async () => {
    try {
      const data = await exercisesAPI.getById(Number(params.id));
      setExercise(data);
    } catch (error) {
      console.error("Error loading exercise:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCorrect = async (code: string, result: any) => {
    if (!exercise) return;

    try {
      await progressAPI.submit(exercise.id, code, result);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

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
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold"
          >
            Volver al Dashboard
          </button>
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