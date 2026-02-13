"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { exercisesAPI } from "@/lib/api"; 
import { Exercise } from "@/types";
import { Loader2, ArrowLeft } from "lucide-react";
import ExerciseRenderer from "@/components/ExerciseRenderer";
import ResultModal from "@/components/ResultModal";

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    isSuccess: false,
    message: "",
    points: 0
  });

  useEffect(() => {
    if (params.id) loadExercise();
  }, [params.id]);

  const loadExercise = async () => {
    try {
      setLoading(true);
      const data = await exercisesAPI.getById(Number(params.id));
      setExercise(data);
    } catch (err: any) {
      console.error("Error cargando ejercicio:", err);
      setModalConfig({
        isOpen: true,
        isSuccess: false,
        message: "No se pudo cargar el ejercicio. Intenta de nuevo.",
        points: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCorrect = async (code: string, result: any) => {
    try {
      console.log("🔄 [Page] Enviando respuesta:");
      console.log("- Exercise ID:", params.id);
      console.log("- Code:", code);
      console.log("- Result:", result);

      // IMPORTANTE: Pasar el resultado al submit
      const response = await exercisesAPI.submit(Number(params.id), code, result);
      
      console.log("📥 [Page] Respuesta del backend:", response);

      setModalConfig({
        isOpen: true,
        isSuccess: response.correct,
        message: response.correct 
          ? `¡Excelente trabajo! Has ganado ${response.points_earned || exercise?.points || 0} puntos.` 
          : response.message || "Sigue intentando. Revisa tu código y vuelve a intentarlo.",
        points: response.points_earned || 0
      });

      if (response.correct && exercise) {
        setExercise((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            current_user_progress: {
              completed: true,
              points_earned: response.points_earned,
              attempts: (prev.current_user_progress?.attempts || 0) + 1
            }
          };
        });
      }
    } catch (err: any) {
      console.error("❌ [Page] Error en verificación:", err);
      setModalConfig({
        isOpen: true,
        isSuccess: false,
        message: err.message || "Hubo un error al procesar tu código. Intenta de nuevo.",
        points: 0
      });
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.isSuccess) {
      router.push('/lessons');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <Loader2 className="animate-spin text-indigo-600 w-12 h-12 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando ejercicio...</p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <p className="text-red-600 font-bold text-xl mb-4">Ejercicio no encontrado</p>
          <button 
            onClick={() => router.push('/lessons')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
          >
            Volver a las lcciones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 pt-6 mb-4">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={18} /> Volver
        </button>
      </div>

      <ExerciseRenderer exercise={exercise} onCorrect={handleCorrect} />

      <ResultModal 
        isOpen={modalConfig.isOpen}
        isSuccess={modalConfig.isSuccess}
        message={modalConfig.message}
        points={modalConfig.points}
        onClose={handleCloseModal}
      />
    </div>
  );
}
