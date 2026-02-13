"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Trophy, 
  CheckCircle2, 
  BookOpen, 
  Lock, 
  Play, 
  ChevronRight, 
  Star,
  Zap,
  ChevronDown
} from 'lucide-react';

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

interface GroupedLesson {
  lesson: {
    id: number;
    title: string;
    description: string;
    icon: string;
    color: string;
    order: number;
  };
  exercises: Exercise[];
  completedCount: number;
  totalExercises: number;
  totalPoints: number;
  earnedPoints: number;
}

export default function LessonsPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
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

      const data: Exercise[] = await exercisesResponse.json();
      setExercises(data);
      setError(null);

    } catch (error: any) {
      console.error("❌ Error cargando datos:", error);
      setError(error.message || "Error al cargar datos");
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  // Agrupar ejercicios por lección
  const groupedLessons: GroupedLesson[] = React.useMemo(() => {
    const lessonsMap = new Map<number, GroupedLesson>();

    exercises.forEach(exercise => {
      if (!exercise.lesson) return;

      const lessonId = exercise.lesson.id;
      
      if (!lessonsMap.has(lessonId)) {
        lessonsMap.set(lessonId, {
          lesson: exercise.lesson,
          exercises: [],
          completedCount: 0,
          totalExercises: 0,
          totalPoints: 0,
          earnedPoints: 0
        });
      }

      const group = lessonsMap.get(lessonId)!;
      group.exercises.push(exercise);
      group.totalExercises++;
      group.totalPoints += exercise.points;
      
      if (exercise.current_user_progress?.completed) {
        group.completedCount++;
        group.earnedPoints += exercise.points;
      }
    });

    return Array.from(lessonsMap.values()).sort((a, b) => a.lesson.order - b.lesson.order);
  }, [exercises]);

  // Auto-expandir la lección en progreso (que tiene ejercicios sin completar)
  useEffect(() => {
    if (groupedLessons.length === 0) return;

    // Buscar la primera lección que no está completada al 100%
    const currentLesson = groupedLessons.find(
      group => group.completedCount < group.totalExercises
    );

    if (currentLesson) {
      setExpandedLesson(currentLesson.lesson.id);
    } else {
      // Si todas están completas, abrir la última
      setExpandedLesson(groupedLessons[groupedLessons.length - 1].lesson.id);
    }
  }, [groupedLessons]);

  const toggleLesson = (lessonId: number) => {
    // Si clickeas en la lección ya abierta, la cierra
    // Si clickeas en otra, cierra la anterior y abre la nueva
    setExpandedLesson(prev => prev === lessonId ? null : lessonId);
  };

  // Calcular estadísticas globales
  const totalPoints = exercises.reduce((sum, ex) => 
    sum + (ex.current_user_progress?.completed ? ex.points : 0), 0
  );
  const completedCount = exercises.filter(ex => ex.current_user_progress?.completed).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Cargando lecciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white rounded-b-[3rem] shadow-2xl mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border-2 border-white/30">
              <BookOpen className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-1">Tus Lecciones</h1>
              <p className="text-indigo-100 text-lg">Aprende organizadamente por módulos</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border-2 border-white/30">
              <div className="flex items-center gap-3">
                <Trophy className="text-yellow-300 w-8 h-8" strokeWidth={2.5} />
                <div>
                  <p className="text-xs uppercase font-black text-indigo-100 tracking-wider">Puntos</p>
                  <p className="text-2xl font-black">{totalPoints}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border-2 border-white/30">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-300 w-8 h-8" strokeWidth={2.5} />
                <div>
                  <p className="text-xs uppercase font-black text-indigo-100 tracking-wider">Completados</p>
                  <p className="text-2xl font-black">{completedCount}/{exercises.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border-2 border-white/30">
              <div className="flex items-center gap-3">
                <Zap className="text-orange-300 w-8 h-8" strokeWidth={2.5} />
                <div>
                  <p className="text-xs uppercase font-black text-indigo-100 tracking-wider">Módulos</p>
                  <p className="text-2xl font-black">{groupedLessons.length}</p>
                </div>
              </div>
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

        {/* Mensaje si no hay ejercicios */}
        {exercises.length === 0 && !error && (
          <div className="bg-white p-16 rounded-[3rem] text-center border-2 border-gray-200 shadow-xl">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-600 text-xl mb-6">No hay ejercicios disponibles</p>
            <button 
              onClick={fetchData}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Recargar
            </button>
          </div>
        )}

        {/* Acordeones de Lecciones */}
        {groupedLessons.length > 0 && (
          <div className="space-y-4">
            {groupedLessons.map((group) => {
              const isExpanded = expandedLesson === group.lesson.id;
              const progressPercent = (group.completedCount / group.totalExercises) * 100;

              return (
                <div 
                  key={group.lesson.id}
                  className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 overflow-hidden"
                >
                  {/* Encabezado del Acordeón */}
                  <button
                    onClick={() => toggleLesson(group.lesson.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                        style={{ backgroundColor: group.lesson.color }}
                      >
                        {group.lesson.icon}
                      </div>
                      <div className="text-left flex-1">
                        <h2 className="text-2xl font-black text-gray-800 mb-1">
                          {group.lesson.title}
                        </h2>
                        <p className="text-sm text-gray-500 mb-2">{group.lesson.description}</p>
                        
                        {/* Barra de Progreso */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-600 min-w-[4rem]">
                            {group.completedCount}/{group.totalExercises}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-500">Puntos</div>
                        <div className="text-xl font-black text-yellow-600">
                          {group.earnedPoints}/{group.totalPoints}
                        </div>
                      </div>
                      <ChevronDown 
                        className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Contenido del Acordeón */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'max-h-[2000px]' : 'max-h-0'
                    }`}
                  >
                    <div className="p-6 pt-0 space-y-3">
                      {group.exercises.map((exercise) => {
                        const isDone = exercise.current_user_progress?.completed;
                        const isLocked = exercise.is_locked;

                        if (isLocked) {
                          return (
                            <div 
                              key={exercise.id} 
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 opacity-60 cursor-not-allowed"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <Lock className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-500">{exercise.title}</h3>
                                  <p className="text-xs text-gray-400">🔒 Completa el anterior para desbloquear</p>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <Link 
                            key={exercise.id} 
                            href={`/exercises/${exercise.id}`} 
                            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all group hover:shadow-md active:scale-[0.98] ${
                              isDone 
                                ? 'bg-green-50 border-green-200 hover:border-green-300' 
                                : 'bg-white border-gray-200 hover:border-indigo-300'
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                                isDone 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white group-hover:scale-110'
                              }`}>
                                {isDone ? (
                                  <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
                                ) : (
                                  <Play className="w-6 h-6 fill-current" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className={`font-bold mb-1 ${
                                  isDone 
                                    ? 'text-green-700' 
                                    : 'text-gray-800 group-hover:text-indigo-600'
                                }`}>
                                  {exercise.title}
                                </h3>
                                <p className="text-xs text-gray-500">{exercise.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`px-3 py-1 rounded-lg font-bold text-xs ${
                                isDone 
                                  ? 'bg-green-200 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800 flex items-center gap-1'
                              }`}>
                                {isDone ? (
                                  '✓'
                                ) : (
                                  <>
                                    <Star className="w-3 h-3" fill="currentColor" />
                                    +{exercise.points}
                                  </>
                                )}
                              </div>
                              <ChevronRight className={`w-5 h-5 transition-all ${
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
        )}
      </div>
    </div>
  );
}