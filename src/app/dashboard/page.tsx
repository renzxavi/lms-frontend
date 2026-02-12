"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, CheckCircle2, Play, ChevronRight, Trophy, ChevronDown, ChevronUp, Star } from 'lucide-react';

interface Exercise {
  id: number;
  title: string;
  description: string;
  points: number;
  is_locked: boolean;
  lesson_id: number;
  lesson?: {
    id: number;
    title: string;
    description: string;
    icon: string;
    color: string;
    order: number;
  };
  current_user_progress?: {
    completed: boolean;
  };
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  exercises: Exercise[];
}

export default function DashboardPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openLessonId, setOpenLessonId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      console.log("📡 Cargando ejercicios...");

      const exercisesResponse = await fetch('http://localhost:8000/api/exercises', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!exercisesResponse.ok) {
        if (exercisesResponse.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        throw new Error(`Error ${exercisesResponse.status}`);
      }

      const exercises: Exercise[] = await exercisesResponse.json();
      console.log("✅ Ejercicios cargados:", exercises);

      // Agrupar ejercicios por lección
      const lessonsMap = new Map<number, Lesson>();

      exercises.forEach(exercise => {
        if (exercise.lesson) {
          const lessonId = exercise.lesson.id;
          
          if (!lessonsMap.has(lessonId)) {
            lessonsMap.set(lessonId, {
              id: exercise.lesson.id,
              title: exercise.lesson.title,
              description: exercise.lesson.description,
              icon: exercise.lesson.icon,
              color: exercise.lesson.color,
              order: exercise.lesson.order,
              exercises: []
            });
          }

          lessonsMap.get(lessonId)!.exercises.push(exercise);
        }
      });

      const lessonsArray = Array.from(lessonsMap.values()).sort((a, b) => a.order - b.order);
      
      console.log("✅ Lecciones agrupadas:", lessonsArray);

      setLessons(lessonsArray);
      setError(null);

      // Abrir automáticamente la primera lección con ejercicios incompletos
      const firstIncompleteLesson = lessonsArray.find(lesson => 
        lesson.exercises.some(ex => !ex.current_user_progress?.completed && !ex.is_locked)
      );
      
      if (firstIncompleteLesson) {
        setOpenLessonId(firstIncompleteLesson.id);
      } else if (lessonsArray.length > 0) {
        setOpenLessonId(lessonsArray[0].id);
      }

    } catch (error: any) {
      console.error("❌ Error cargando datos:", error);
      setError(error.message || "Error al cargar datos");
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleLesson = (lessonId: number) => {
    setOpenLessonId(openLessonId === lessonId ? null : lessonId);
  };

  // Calcular puntos totales
  const totalPoints = lessons.reduce((total, lesson) => 
    total + lesson.exercises.reduce((sum, ex) => 
      sum + (ex.current_user_progress?.completed ? ex.points : 0), 0
    ), 0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Cargando academia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20">
      {/* Header de Progreso */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white rounded-b-[3rem] shadow-2xl mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black mb-2">¡HOLA, CODER! 👋</h1>
            <p className="text-indigo-100 text-lg">Continúa tu camino al éxito</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border-2 border-white/30 flex items-center gap-4 shadow-xl">
            <Trophy className="text-yellow-300 w-10 h-10" strokeWidth={2.5} />
            <div>
              <p className="text-xs uppercase font-black text-indigo-100 tracking-widest">Puntos Totales</p>
              <p className="text-4xl font-black text-white">{totalPoints}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 p-6 rounded-3xl mb-6 shadow-lg">
            <p className="text-red-600 font-bold text-lg mb-2">⚠️ {error}</p>
            <button 
              onClick={fetchData}
              className="mt-2 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Mensaje si no hay lecciones */}
        {lessons.length === 0 && !error && (
          <div className="bg-white p-16 rounded-[3rem] text-center border-2 border-gray-200 shadow-xl">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-600 text-xl mb-6">No hay lecciones disponibles</p>
            <button 
              onClick={fetchData}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Recargar
            </button>
          </div>
        )}

        {/* Lecciones y Ejercicios - Modo Acordeón */}
        <div className="space-y-4">
          {lessons.map((lesson) => {
            const completedCount = lesson.exercises.filter(ex => ex.current_user_progress?.completed).length;
            const totalCount = lesson.exercises.length;
            const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
            const isOpen = openLessonId === lesson.id;

            return (
              <div 
                key={lesson.id} 
                className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 overflow-hidden transition-all duration-300"
              >
                {/* Header de la Lección - Clickeable */}
                <button
                  onClick={() => toggleLesson(lesson.id)}
                  className="w-full p-6 text-white relative overflow-hidden transition-all hover:brightness-110"
                  style={{ backgroundColor: lesson.color }}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{lesson.icon}</div>
                      <div className="text-left">
                        <h2 className="text-2xl font-black mb-1">{lesson.title}</h2>
                        <p className="text-white/90">{lesson.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-xl border-2 border-white/30">
                        <div className="text-center">
                          <div className="text-2xl font-black">{completedCount}/{totalCount}</div>
                          <div className="text-xs font-bold uppercase tracking-wider opacity-90">Completados</div>
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border-2 border-white/30">
                        {isOpen ? (
                          <ChevronUp className="w-6 h-6" strokeWidth={3} />
                        ) : (
                          <ChevronDown className="w-6 h-6" strokeWidth={3} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Barra de Progreso */}
                  <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </button>

                {/* Lista de Ejercicios - Colapsable */}
                <div 
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 space-y-3 bg-gray-50">
                    {lesson.exercises.map((exercise) => {
                      const isDone = exercise.current_user_progress?.completed;
                      const isLocked = exercise.is_locked;

                      if (isLocked) {
                        return (
                          <div 
                            key={exercise.id} 
                            className="flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-dashed border-gray-200 opacity-60 cursor-not-allowed"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center">
                                <Lock className="w-7 h-7 text-gray-400" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-500 text-lg">{exercise.title}</h3>
                                <p className="text-sm text-gray-400 font-medium">🔒 Completa el anterior para desbloquear</p>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <Link 
                          key={exercise.id} 
                          href={`/exercises/${exercise.id}`} 
                          className={`flex items-center justify-between p-5 rounded-2xl shadow-sm border-2 transition-all group hover:shadow-lg active:scale-[0.98] ${
                            isDone 
                              ? 'bg-green-50 border-green-200 hover:border-green-300' 
                              : 'bg-white border-gray-200 hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-inner transition-all ${
                              isDone 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white group-hover:scale-110'
                            }`}>
                              {isDone ? (
                                <CheckCircle2 className="w-8 h-8" strokeWidth={2.5} />
                              ) : (
                                <Play className="w-8 h-8 fill-current" />
                              )}
                            </div>
                            <div>
                              <h3 className={`font-bold text-lg ${
                                isDone 
                                  ? 'text-green-700' 
                                  : 'text-gray-800 group-hover:text-indigo-600'
                              }`}>
                                {exercise.title}
                              </h3>
                              <p className="text-sm text-gray-500">{exercise.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className={`px-4 py-2 rounded-xl font-black text-sm ${
                              isDone 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800 flex items-center gap-1'
                            }`}>
                              {isDone ? (
                                '✓ Completado'
                              ) : (
                                <>
                                  <Star className="w-4 h-4" fill="currentColor" />
                                  +{exercise.points} pts
                                </>
                              )}
                            </div>
                            <ChevronRight className={`transition-all ${
                              isDone 
                                ? 'text-green-400' 
                                : 'text-indigo-300 group-hover:text-indigo-500 group-hover:translate-x-1'
                            }`} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}