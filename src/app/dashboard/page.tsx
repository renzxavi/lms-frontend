'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { exercisesAPI } from '@/lib/api';
import { Exercise } from '@/types';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout } = useAuth();
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

  if (!user) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Hola, {user.name}! 👋
              </h1>
              <p className="text-gray-600">Continúa tu aprendizaje</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 px-6 py-3 rounded-lg">
                <p className="text-sm text-orange-700 font-medium">Puntos totales</p>
                <p className="text-2xl font-bold text-orange-600">{user.total_points}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ejercicios disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{exercises.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nivel actual</p>
                <p className="text-2xl font-bold text-gray-900">Principiante</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exercises List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ejercicios Disponibles</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando ejercicios...</p>
            </div>
          ) : exercises.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📝</span>
              <p className="text-gray-600">No hay ejercicios disponibles aún</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {exercises.map((exercise) => (
                <Link
                  key={exercise.id}
                  href={`/exercises/${exercise.id}`}
                  className="group border border-gray-200 rounded-lg p-6 hover:border-orange-300 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition">
                        {exercise.title}
                      </h3>
                      <p className="text-gray-600 mt-1 text-sm">
                        {exercise.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        exercise.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {exercise.difficulty === 'easy' ? 'Fácil' :
                         exercise.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                      </span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        {exercise.points} pts
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}