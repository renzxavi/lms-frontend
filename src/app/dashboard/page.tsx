"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Lock, CheckCircle2, Play, ChevronRight, Trophy, ChevronDown, ChevronUp, Star,
  Rocket, Target, Brain, Code2, Sparkles, ArrowRight
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

  // Calcular estadísticas
  const totalPoints = lessons.reduce((total, lesson) => 
    total + lesson.exercises.reduce((sum, ex) => 
      sum + (ex.current_user_progress?.completed ? ex.points : 0), 0
    ), 0
  );

  const totalExercises = lessons.reduce((sum, lesson) => sum + lesson.exercises.length, 0);
  const completedExercises = lessons.reduce((sum, lesson) => 
    sum + lesson.exercises.filter(ex => ex.current_user_progress?.completed).length, 0
  );

  // Encontrar siguiente ejercicio
  const nextExercise = lessons
    .flatMap(lesson => lesson.exercises)
    .find(ex => !ex.current_user_progress?.completed && !ex.is_locked);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 pb-32 pt-12 px-6">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Saludo principal */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border-2 border-white/30">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-bold text-sm">¡Bienvenido de vuelta!</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              ¡HOLA, CODER! 👋
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              ¿Listo para seguir aprendiendo y ganando puntos hoy?
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border-2 border-white/30 hover:bg-white/30 transition-all">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-7 h-7 text-yellow-900" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs uppercase font-black text-white/80 tracking-widest">Puntos</p>
                  <p className="text-3xl font-black text-white">{totalPoints}</p>
                </div>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border-2 border-white/30 hover:bg-white/30 transition-all">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 bg-green-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="w-7 h-7 text-green-900" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs uppercase font-black text-white/80 tracking-widest">Completados</p>
                  <p className="text-3xl font-black text-white">{completedExercises}/{totalExercises}</p>
                </div>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full" style={{ width: `${(completedExercises / totalExercises) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
        {/* Siguiente ejercicio recomendado */}
        {nextExercise && (
          <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-8 mb-8 shadow-2xl border-4 border-white">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                  <Rocket className="w-4 h-4 text-white" />
                  <span className="text-white font-bold text-sm">¡Siguiente Desafío!</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-2">{nextExercise.title}</h2>
                <p className="text-white/90 text-lg mb-6">{nextExercise.description}</p>
                <div className="flex items-center gap-4">
                  <Link 
                    href={`/exercises/${nextExercise.id}`}
                    className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-2xl font-black shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    ¡Empezar Ahora!
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-white/30">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-300" fill="currentColor" />
                      <span className="text-white font-black text-lg">+{nextExercise.points} pts</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                  <Play className="w-16 h-16 text-white" fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sección: ¿Por qué aprender a programar? */}
        <div className="bg-white rounded-3xl p-10 mb-8 shadow-xl border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900">¿Por qué aprender a programar?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-black text-lg text-gray-900 mb-2">Crea tus propios juegos</h3>
              <p className="text-gray-600 font-medium">Diseña y construye videojuegos increíbles como los profesionales.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="font-black text-lg text-gray-900 mb-2">Desarrolla tu cerebro</h3>
              <p className="text-gray-600 font-medium">Mejora tu lógica, creatividad y habilidad para resolver problemas.</p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl">
              <div className="text-4xl mb-3">🌟</div>
              <h3 className="font-black text-lg text-gray-900 mb-2">Prepárate para el futuro</h3>
              <p className="text-gray-600 font-medium">La programación es el súper poder del siglo XXI.</p>
            </div>
          </div>
        </div>

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

        {/* Lecciones - Vista Compacta */}
        {lessons.length > 0 && (
          <div className="bg-white rounded-3xl p-10 shadow-xl border-2 border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Tus Lecciones</h2>
              </div>
              <Link href="/lessons" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2">
                Ver Todas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {lessons.slice(0, 4).map((lesson) => {
                const completedCount = lesson.exercises.filter(ex => ex.current_user_progress?.completed).length;
                const totalCount = lesson.exercises.length;
                const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                return (
                  <Link
                    key={lesson.id}
                    href="/lessons"
                    className="block p-6 rounded-2xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: lesson.color }}
                      >
                        {lesson.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-xl text-gray-900 mb-1">{lesson.title}</h3>
                        <p className="text-sm text-gray-600 font-medium">{completedCount}/{totalCount} completados</p>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%`, backgroundColor: lesson.color }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}