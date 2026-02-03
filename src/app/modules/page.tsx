'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { exercisesAPI } from '@/lib/api';
import { Lesson } from '@/types';

export default function ModulesPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      const data = await exercisesAPI.getLessons();
      setLessons(data);
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎮</div>
          <p className="text-gray-600 text-xl">Cargando aventuras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-purple-900 mb-4">
            🌟 ¡Elige tu Aventura! 🌟
          </h1>
          <p className="text-xl text-purple-700">
            Aprende a programar con tus amigos animales
          </p>
        </div>

        {/* Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.map((lesson) => (
            <ModuleCard key={lesson.id} lesson={lesson} />
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-4 bg-white text-purple-700 font-bold text-lg rounded-xl hover:bg-purple-50 transition-all shadow-lg transform hover:scale-105"
          >
            ← Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    router.push(`/modules/${lesson.id}`);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer transform transition-all duration-300 hover:scale-105"
    >
      <div
        className="rounded-3xl p-8 shadow-2xl border-4 h-full flex flex-col"
        style={{
          backgroundColor: lesson.color || '#FFE5EC',
          borderColor: lesson.color || '#FF6B9D',
        }}
      >
        {/* Icono del módulo */}
        <div className="text-center mb-6">
          <div className="text-7xl mb-4 inline-block">
            {lesson.icon || '🎯'}
          </div>
        </div>

        {/* Título */}
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
          {lesson.title}
        </h2>

        {/* Descripción */}
        <p className="text-center text-gray-800 text-lg mb-6 flex-grow">
          {lesson.description}
        </p>

        {/* Ejercicios count */}
        <div className="bg-white/50 rounded-xl p-4 text-center">
          <p className="text-gray-900 font-bold text-lg">
            {lesson.exercises?.length || 0} ejercicios
          </p>
        </div>

        {/* Botón */}
        <button
          className={`mt-6 w-full py-4 rounded-xl font-bold text-xl transition-all shadow-lg ${
            isHovered
              ? 'bg-white text-purple-700 transform scale-105'
              : 'bg-purple-600 text-white'
          }`}
        >
          {isHovered ? '¡Vamos! 🚀' : 'Empezar'}
        </button>
      </div>
    </div>
  );
}