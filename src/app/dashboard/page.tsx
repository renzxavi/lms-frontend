"use client";

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { exercisesAPI } from '@/lib/api';
import { Exercise } from '@/types';
import Link from 'next/link';
import { BookOpen, CheckCircle2, TrendingUp, Award, Loader2 } from 'lucide-react';

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
  const totalPoints = user?.total_points || 0;
  const maxPossiblePoints = exercises.reduce((sum, ex) => sum + ex.points, 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100/30 flex items-center justify-center">
        <div className="flex items-center gap-3 text-red-600 font-medium">
          <Loader2 className="w-6 h-6 animate-spin" />
          Verificando sesión...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100/30 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            ¡Hola, {user.name}! 👋
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Continúa tu aventura de programación y completa los desafíos.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Disponibles */}
          <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-red-500" strokeWidth={2.5} />
              <p className="text-sm text-red-600 font-bold uppercase tracking-wider">
                Disponibles
              </p>
            </div>
            <p className="text-3xl font-black text-gray-800">
              {exercises.length}
            </p>
          </div>

          {/* Completados */}
          <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" strokeWidth={2.5} />
              <p className="text-sm text-green-600 font-bold uppercase tracking-wider">
                Completados
              </p>
            </div>
            <p className="text-3xl font-black text-green-600">
              {completedExercises.length}
            </p>
          </div>

          {/* Progreso */}
          <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-red-500" strokeWidth={2.5} />
              <p className="text-sm text-red-600 font-bold uppercase tracking-wider">
                Tu Progreso
              </p>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-black text-red-600">
                {exercises.length > 0
                  ? Math.round((completedExercises.length / exercises.length) * 100)
                  : 0}%
              </p>
              <div className="flex-1 bg-red-100 h-2 mb-2 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full transition-all duration-1000"
                  style={{
                    width: `${exercises.length > 0
                      ? (completedExercises.length / exercises.length) * 100
                      : 0}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Puntos */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-red-100" strokeWidth={2.5} />
              <p className="text-sm text-red-100 font-bold uppercase tracking-wider">
                Tus Puntos
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-white">
                {totalPoints}
              </p>
              <p className="text-sm text-red-100 font-medium">
                / {maxPossiblePoints}
              </p>
            </div>
            <div className="mt-2 bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-1000"
                style={{
                  width: `${maxPossiblePoints > 0
                    ? (totalPoints / maxPossiblePoints) * 100
                    : 0}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Ejercicios */}
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-wide">
              Ruta de Aprendizaje
            </h2>
          </div>

          {loading ? (
            <div className="p-20 text-center">
              <Loader2 className="inline-block w-8 h-8 text-red-500 animate-spin mb-4" strokeWidth={2.5} />
              <p className="text-gray-600 font-medium">
                Cargando lecciones...
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {exercises.map(exercise => {
                const isDone = exercise.user_progress?.completed;

                return (
                  <Link
                    key={exercise.id}
                    href={`/exercises/${exercise.id}`}
                    className={`flex items-center justify-between px-8 py-6 hover:bg-red-50 transition-all group ${
                      isDone ? 'bg-green-50/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-red-200 text-red-300 group-hover:border-red-400'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
                        ) : (
                          <BookOpen className="w-6 h-6" strokeWidth={2} />
                        )}
                      </div>

                      <div>
                        <h3 className={`text-lg font-bold ${
                          isDone
                            ? 'text-gray-400 line-through'
                            : 'text-gray-900 group-hover:text-red-700'
                        }`}>
                          {exercise.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {exercise.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-red-500" strokeWidth={2.5} />
                      <p className="text-sm font-black text-red-700">
                        {exercise.points} pts
                      </p>
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