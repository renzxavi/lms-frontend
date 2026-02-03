'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { exercisesAPI } from '@/lib/api';
import { Exercise } from '@/types';

export default function ExercisesListPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

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

  const filteredExercises = exercises.filter(ex => 
    filter === 'all' ? true : ex.difficulty === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Cargando ejercicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            📚 Todos los Ejercicios
          </h1>
          <p className="text-xl text-gray-600">
            Practica y mejora tus habilidades de programación
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            Todos ({exercises.length})
          </button>
          <button
            onClick={() => setFilter('easy')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === 'easy'
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            🟢 Fácil ({exercises.filter(e => e.difficulty === 'easy').length})
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === 'medium'
                ? 'bg-yellow-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            🟡 Medio ({exercises.filter(e => e.difficulty === 'medium').length})
          </button>
          <button
            onClick={() => setFilter('hard')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === 'hard'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            🔴 Difícil ({exercises.filter(e => e.difficulty === 'hard').length})
          </button>
        </div>

        {/* Exercises Grid */}
        {filteredExercises.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-xl">No hay ejercicios en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-4 bg-white text-gray-700 font-bold text-lg rounded-xl hover:bg-gray-50 transition-all shadow-lg transform hover:scale-105 border-2 border-gray-200"
          >
            ← Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const router = useRouter();

  const difficultyConfig = {
    easy: {
      color: 'bg-green-100 text-green-700 border-green-300',
      label: 'Fácil',
      icon: '🟢'
    },
    medium: {
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      label: 'Medio',
      icon: '🟡'
    },
    hard: {
      color: 'bg-red-100 text-red-700 border-red-300',
      label: 'Difícil',
      icon: '🔴'
    }
  };

  const config = difficultyConfig[exercise.difficulty];

  return (
    <div
      onClick={() => router.push(`/exercises/${exercise.id}`)}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border-2 border-gray-100 hover:border-orange-300 transition-all cursor-pointer transform hover:scale-105 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {exercise.title}
          </h3>
        </div>
        <div className="text-3xl ml-2">
          {exercise.character ? 
            ({'cat': '🐱', 'dog': '🐶', 'lion': '🦁', 'elephant': '🐘', 'rabbit': '🐰'}[exercise.character] || '🎯')
            : '🎯'
          }
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-6 flex-grow line-clamp-3">
        {exercise.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
        <span className={`px-3 py-1 rounded-lg text-sm font-semibold border-2 ${config.color} flex items-center gap-1`}>
          <span>{config.icon}</span>
          <span>{config.label}</span>
        </span>
        <span className="text-orange-600 font-bold text-lg">
          {exercise.points} pts
        </span>
      </div>

      {/* Story preview if exists */}
      {exercise.story && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-purple-600 italic line-clamp-2">
            📖 {exercise.story}
          </p>
        </div>
      )}
    </div>
  );
}