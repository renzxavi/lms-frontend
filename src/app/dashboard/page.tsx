"use client";

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { exercisesAPI, lessonsAPI } from '@/lib/api';
import { Exercise, Lesson } from '@/types';
import Link from 'next/link';
import { BookOpen, CheckCircle2, TrendingUp, Award, Loader2, ChevronDown, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(new Set([1])); // Primera lección expandida

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [lessonsData, exercisesData] = await Promise.all([
        lessonsAPI.getAll(),
        exercisesAPI.getAll()
      ]);
      setLessons(lessonsData);
      setExercises(exercisesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLesson = (lessonId: number) => {
    setExpandedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  const getExercisesForLesson = (lessonId: number) => {
    return exercises.filter(ex => ex.lesson_id === lessonId);
  };

  const getLessonProgress = (lessonId: number) => {
    const lessonExercises = getExercisesForLesson(lessonId);
    const completed = lessonExercises.filter(ex => ex.user_progress?.completed).length;
    return {
      completed,
      total: lessonExercises.length,
      percentage: lessonExercises.length > 0 ? Math.round((completed / lessonExercises.length) * 100) : 0
    };
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
      <div className="max-w-6xl mx-auto">

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
                Ejercicios
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

        {/* Módulos/Lecciones */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-20 text-center">
              <Loader2 className="inline-block w-8 h-8 text-red-500 animate-spin mb-4" strokeWidth={2.5} />
              <p className="text-gray-600 font-medium">
                Cargando lecciones...
              </p>
            </div>
          ) : (
            lessons.map(lesson => {
              const progress = getLessonProgress(lesson.id);
              const isExpanded = expandedLessons.has(lesson.id);
              const lessonExercises = getExercisesForLesson(lesson.id);

              return (
                <div 
                  key={lesson.id}
                  className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden"
                >
                  {/* Lesson Header */}
                  <button
                    onClick={() => toggleLesson(lesson.id)}
                    className="w-full px-8 py-6 flex items-center justify-between hover:bg-red-50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                        style={{ backgroundColor: lesson.color }}
                      >
                        {lesson.icon}
                      </div>
                      
                      <div className="text-left">
                        <h2 className="text-2xl font-black text-gray-900">
                          {lesson.title}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          {lesson.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs font-bold text-gray-500">
                            {progress.completed}/{progress.total} completados
                          </span>
                          <div className="flex-1 max-w-[200px] bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-green-500 h-full transition-all duration-500"
                              style={{ width: `${progress.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-green-600">
                            {progress.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {progress.percentage === 100 && (
                        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-sm">
                          ✓ COMPLETADO
                        </div>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Exercises List */}
                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      <div className="divide-y divide-gray-100">
                        {lessonExercises.map((exercise, index) => {
                          const isDone = exercise.user_progress?.completed;

                          return (
                            <Link
                              key={exercise.id}
                              href={`/exercises/${exercise.id}`}
                              className={`flex items-center justify-between px-8 py-5 hover:bg-red-50 transition-all group ${
                                isDone ? 'bg-green-50/30' : ''
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                                  {index + 1}
                                </div>

                                <div
                                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                                    isDone
                                      ? 'bg-green-500 border-green-500 text-white'
                                      : 'border-red-200 text-red-300 group-hover:border-red-400'
                                  }`}
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
                                  ) : (
                                    <BookOpen className="w-5 h-5" strokeWidth={2} />
                                  )}
                                </div>

                                <div>
                                  <h3 className={`text-base font-bold ${
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
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}