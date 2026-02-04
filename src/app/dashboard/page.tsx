"use client";

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { exercisesAPI } from '@/lib/api';
import { Exercise } from '@/types';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const data = await exercisesAPI.getAll();
      setExercises(data);
    } catch (error) {
      console.error('Error loading exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const completedExercises = exercises.filter(ex => ex.user_progress?.completed);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-pulse text-gray-400 font-medium">Verificando sesión...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header simplificado */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            ¡Hola, {user.name}! 👋
          </h1>
          <p className="text-lg text-gray-500 mt-2">
            Continúa tu aventura de programación y completa los desafíos.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Disponibles</p>
            <p className="text-3xl font-black text-gray-800">{exercises.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
            <p className="text-sm text-green-500 font-bold uppercase tracking-widest mb-1">Completados</p>
            <p className="text-3xl font-black text-green-600">
              {completedExercises.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
            <p className="text-sm text-blue-500 font-bold uppercase tracking-widest mb-1">Tu Progreso</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-black text-blue-600">
                {exercises.length > 0 
                  ? Math.round((completedExercises.length / exercises.length) * 100) 
                  : 0}%
              </p>
              <div className="flex-1 bg-blue-50 h-2 mb-2 rounded-full overflow-hidden">
                 <div 
                   className="bg-blue-500 h-full transition-all duration-1000" 
                   style={{ width: `${exercises.length > 0 ? (completedExercises.length / exercises.length) * 100 : 0}%` }}
                 />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Ejercicios */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Ruta de Aprendizaje</h2>
          </div>
          
          {loading ? (
            <div className="p-20 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mb-4"></div>
              <p className="text-gray-500 font-medium">Cargando lecciones...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {exercises.map((exercise) => {
                const isDone = exercise.user_progress?.completed;

                return (
                  <Link
                    key={exercise.id}
                    href={`/exercises/${exercise.id}`}
                    className={`flex items-center justify-between px-8 py-6 hover:bg-gray-50 transition-all group ${
                      isDone ? 'bg-green-50/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      {/* Badge Circular de Estatus con Tick */}
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isDone 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-200 bg-white text-transparent group-hover:border-orange-400'
                      }`}>
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>

                      <div>
                        <h3 className={`text-lg font-bold transition-colors ${
                          isDone ? 'text-gray-400 line-through' : 'text-gray-900 group-hover:text-orange-600'
                        }`}>
                          {exercise.title}
                        </h3>
                        <div className="flex gap-3 mt-1">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {exercise.difficulty === 'easy' ? 'Fácil' : exercise.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                          </span>
                          <span className="text-xs text-gray-300">•</span>
                          <p className="text-sm text-gray-500 line-clamp-1">{exercise.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-gray-400 uppercase">Recompensa</p>
                        <p className="text-sm font-black text-gray-700">{exercise.points} Puntos</p>
                      </div>
                      <div className="text-gray-300 group-hover:text-orange-500 transition-transform group-hover:translate-x-1">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}