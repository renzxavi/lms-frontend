'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { exercisesAPI } from '@/lib/api';
import { Exercise } from '@/types';

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async () => {
    if (!exercise) return;
    
    setSubmitting(true);
    try {
      const response = await exercisesAPI.submitAnswer(exercise.id, code, {});
      setResult(response);
      alert(response.message || 'Respuesta enviada');
    } catch (error: any) {
      alert(error.message || 'Error al enviar');
    } finally {
      setSubmitting(false);
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
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {exercise.title}
              </h1>
              <p className="text-gray-600">{exercise.description}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                exercise.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {exercise.difficulty === 'easy' ? 'Fácil' :
                 exercise.difficulty === 'medium' ? 'Medio' : 'Difícil'}
              </span>
              <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium">
                {exercise.points} puntos
              </span>
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tu solución</h2>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            placeholder="// Escribe tu código aquí..."
          />
          
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSubmit}
              disabled={submitting || !code.trim()}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {submitting ? 'Enviando...' : 'Enviar solución'}
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
            >
              Volver
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className={`rounded-2xl shadow-xl border p-8 ${
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