'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { exercisesAPI } from '@/lib/api';
import { Exercise } from '@/types';
import BlocklyExercise from '@/components/BlocklyExercise';

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    loadExercise();
  }, [params.id]);

  const loadExercise = async () => {
    try {
      const data = await exercisesAPI.getById(params.id as string);
      setExercise(data);
    } catch (error) {
      console.error('Error loading exercise:', error);
      alert('No se pudo cargar el ejercicio');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCorrect = async (code: string, result: any) => {
    if (!exercise) return;
    
    try {
      const response = await exercisesAPI.submitAnswer(exercise.id, code, result);
      setResult(response);
      
      if (response.correct) {
        alert(`¡Correcto! +${response.points_earned} puntos`);
        // Opcional: recargar después de un tiempo
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        alert('Intenta de nuevo');
      }
    } catch (error: any) {
      alert(error.message || 'Error al enviar');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando ejercicio...</p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <p className="text-gray-600">Ejercicio no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {exercise.title}
              </h1>
              <p className="text-gray-600">{exercise.description}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <span className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                exercise.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {exercise.difficulty === 'easy' ? 'Fácil' :
                 exercise.difficulty === 'medium' ? 'Medio' : 'Difícil'}
              </span>
              <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium whitespace-nowrap">
                {exercise.points} pts
              </span>
            </div>
          </div>
        </div>

        {/* Blockly Workspace */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Espacio de trabajo con bloques
          </h2>
          <BlocklyExercise 
            exercise={exercise} 
            onCorrect={handleCorrect}
          />
        </div>

        {/* Back Button */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
          >
            ← Volver al Dashboard
          </button>
          <button
            onClick={() => router.push('/exercises')}
            className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all border-2 border-gray-200"
          >
            Ver todos los ejercicios
          </button>
        </div>

        {/* Result Message */}
        {result && (
          <div className={`mt-8 rounded-2xl shadow-xl border p-8 ${
            result.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <h3 className="text-xl font-bold mb-2">
              {result.correct ? '✅ ¡Correcto!' : '❌ Incorrecto'}
            </h3>
            <p className="text-gray-700">{result.message}</p>
            {result.points_earned > 0 && (
              <p className="mt-2 text-green-700 font-semibold">
                +{result.points_earned} puntos ganados
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}