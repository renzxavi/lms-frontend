'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { exercisesAPI } from '@/lib/api';
import { Exercise } from '@/types';
import { BookOpen, ArrowLeft, Loader2, Award } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" strokeWidth={2.5} />
          <p className="text-gray-600 text-xl font-medium">Cargando ejercicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-red-600" strokeWidth={2} />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Todos los Ejercicios
          </h1>
          <p className="text-xl text-gray-600">
            Practica y mejora tus habilidades de programación
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${
              filter === 'all'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-red-50 border-2 border-red-200'
            }`}
          >
            Todos ({exercises.length})
          </button>
          <button
            onClick={() => setFilter('easy')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${
              filter === 'easy'
                ? 'bg-green-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-green-50 border-2 border-green-200'
            }`}
          >
            🟢 Fácil ({exercises.filter(e => e.difficulty === 'easy').length})
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${
              filter === 'medium'
                ? 'bg-yellow-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-yellow-50 border-2 border-yellow-200'
            }`}
          >
            🟡 Medio ({exercises.filter(e => e.difficulty === 'medium').length})
          </button>
          <button
            onClick={() => setFilter('hard')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${
              filter === 'hard'
                ? 'bg-red-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-red-50 border-2 border-red-200'
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-700 font-bold text-lg rounded-xl hover:bg-red-50 transition-all shadow-lg transform hover:scale-105 border-2 border-red-200"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            Volver al Dashboard
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
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border-2 border-red-100 hover:border-red-300 transition-all cursor-pointer transform hover:scale-105 h-full flex flex-col"
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
      <div className="flex items-center justify-between pt-4 border-t-2 border-red-100">
        <span className={`px-3 py-1 rounded-lg text-sm font-semibold border-2 ${config.color} flex items-center gap-1`}>
          <span>{config.icon}</span>
          <span>{config.label}</span>
        </span>
        <span className="flex items-center gap-1 text-red-600 font-bold text-lg">
          <Award className="w-4 h-4" strokeWidth={2.5} />
          {exercise.points} pts
        </span>
      </div>

      {/* Story preview if exists */}
      {exercise.story && (
        <div className="mt-4 pt-4 border-t border-red-100">
          <p className="text-sm text-red-600 italic line-clamp-2">
            📖 {exercise.story}
          </p>
        </div>
      )}
    </div>
  );
}