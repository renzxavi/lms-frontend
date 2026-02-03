'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { exercisesAPI } from '@/lib/api';
import { Lesson, Exercise } from '@/types';
import AnimalCharacter from '@/components/AnimalCharacter';

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLesson();
  }, [params.id]);

  const loadLesson = async () => {
    try {
      const data = await exercisesAPI.getLessons();
      const foundLesson = data.find((l: Lesson) => l.id === Number(params.id));
      setLesson(foundLesson || null);
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎮</div>
          <p className="text-gray-600 text-xl">Cargando aventura...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center">
        <p className="text-gray-600 text-xl">Módulo no encontrado</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-12 px-4"
      style={{
        background: `linear-gradient(to bottom right, ${lesson.color}20, ${lesson.color}10, #ffffff)`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header del módulo */}
        <div className="text-center mb-12">
          <div className="text-8xl mb-4">{lesson.icon}</div>
          <h1 className="text-5xl font-bold text-purple-900 mb-4">
            {lesson.title}
          </h1>
          <p className="text-xl text-purple-700">{lesson.description}</p>
        </div>

        {/* Lista de ejercicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {lesson.exercises?.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              number={index + 1}
              lessonColor={lesson.color}
            />
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/modules')}
            className="px-8 py-4 bg-white text-purple-700 font-bold text-lg rounded-xl hover:bg-purple-50 transition-all shadow-lg transform hover:scale-105"
          >
            ← Volver a Módulos
          </button>
        </div>
      </div>
    </div>
  );
}

function ExerciseCard({ exercise, number, lessonColor }: { 
  exercise: Exercise; 
  number: number;
  lessonColor?: string;
}) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700 border-green-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    hard: 'bg-red-100 text-red-700 border-red-300',
  };

  const difficultyLabels = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
  };

  return (
    <div
      onClick={() => router.push(`/exercises/${exercise.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer transform transition-all duration-300 hover:scale-105"
    >
      <div className="bg-white rounded-2xl p-6 shadow-xl border-4 border-purple-200 hover:border-purple-400 h-full flex flex-col">
        {/* Número y Personaje */}
        <div className="flex items-center justify-between mb-4">
          <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
            {number}
          </div>
          {exercise.character && (
            <div className="text-4xl">
              <AnimalCharacter character={exercise.character} animate={isHovered} />
            </div>
          )}
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {exercise.title}
        </h3>

        {/* Descripción */}
        <p className="text-gray-700 mb-4 flex-grow line-clamp-3">
          {exercise.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
          <span className={`px-3 py-1 rounded-lg text-sm font-medium border-2 ${difficultyColors[exercise.difficulty]}`}>
            {difficultyLabels[exercise.difficulty]}
          </span>
          <span className="text-orange-600 font-bold">
            {exercise.points} pts
          </span>
        </div>
      </div>
    </div>
  );
}