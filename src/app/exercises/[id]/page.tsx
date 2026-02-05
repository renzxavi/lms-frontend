'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { exercisesAPI } from '@/lib/api';
import { Exercise } from '@/types';
import BlocklyExercise from '@/components/BlocklyExercise';
import { ArrowLeft, List, CheckCircle, XCircle, Award, Loader2, Lightbulb, PlayCircle } from 'lucide-react';

export default function ExerciseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!id) return; 
    loadExercise(id);
  }, [id]);

  const loadExercise = async (exerciseId: string) => {
    try {
      setLoading(true);
      const data = await exercisesAPI.getById(exerciseId);
      setExercise(data);
    } catch (error) {
      console.error('Error loading exercise:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCorrect = async (code: string, executionResult: any) => {
    if (!exercise) return;
    try {
      const response = await exercisesAPI.submitAnswer(exercise.id, code, executionResult);
      setResult(response);
      if (response.correct) {
        setTimeout(() => router.push('/dashboard'), 3000);
      } 
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-10 h-10 animate-spin text-red-500" />
    </div>
  );

  if (!exercise) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header con Título y Puntos */}
        <div className="bg-white rounded-3xl shadow-sm border p-8 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase">{exercise.title}</h1>
            <p className="text-gray-500 font-medium">{exercise.description}</p>
          </div>
          <div className="flex gap-3">
            <span className="bg-red-100 text-red-600 px-4 py-2 rounded-2xl font-bold flex items-center gap-2">
              <Award size={18} /> {exercise.points} PTS
            </span>
          </div>
        </div>

        {/* Zona de Trabajo */}
        <div className="bg-white rounded-3xl shadow-xl border overflow-hidden mb-6">
          <div className="p-6 border-b bg-gray-50/50">
            <h2 className="font-bold text-gray-700 uppercase tracking-wider">Editor de Bloques</h2>
          </div>
          <BlocklyExercise exercise={exercise} onCorrect={handleCorrect} />
        </div>

        {/* SECCIÓN DE AYUDA (VIDEO Y PISTA) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Pista */}
          {exercise.help_text && (
            <div className="bg-amber-50 border-2 border-amber-100 rounded-3xl p-6 flex gap-4">
              <div className="bg-amber-200 p-3 rounded-2xl h-fit text-amber-700">
                <Lightbulb size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-black text-amber-800 uppercase mb-1">¿Necesitas una pista?</h4>
                <p className="text-amber-900 font-medium">{exercise.help_text}</p>
              </div>
            </div>
          )}

          {/* Video */}
          {exercise.help_video_url && (
            <div className="bg-white border-2 border-gray-100 rounded-3xl p-2 shadow-sm overflow-hidden">
              <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                <iframe
                  className="w-full h-full"
                  src={exercise.help_video_url}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* Resultado */}
        {result && (
          <div className={`p-8 rounded-3xl border-4 mb-8 animate-bounce ${result.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
             <h3 className="text-2xl font-black uppercase flex items-center gap-3">
               {result.correct ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
               {result.correct ? '¡Increíble, lo lograste!' : '¡Casi! Inténtalo de nuevo'}
             </h3>
             <p className="mt-2 font-bold text-gray-700">{result.message}</p>
          </div>
        )}

        {/* Navegación */}
        <div className="flex gap-4">
          <button onClick={() => router.push('/dashboard')} className="flex-1 bg-white p-4 rounded-2xl font-bold border-2 border-gray-100 hover:bg-gray-50 flex items-center justify-center gap-2">
            <ArrowLeft size={20} /> VOLVER
          </button>
        </div>
      </div>
    </div>
  );
}