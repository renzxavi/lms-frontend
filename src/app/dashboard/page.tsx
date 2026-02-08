"use client";

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { exercisesAPI, lessonsAPI } from '@/lib/api';
import { Exercise, Lesson } from '@/types';
import Link from 'next/link';
import { 
  BookOpen, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Loader2, 
  ChevronDown, 
  ChevronRight, 
  Code, 
  Video, 
  FileText,
  Target,
  Star,
  Zap,
  Lock,
  Play
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(new Set());

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
      
      const currentLessonId = findCurrentLesson(lessonsData, exercisesData);
      if (currentLessonId) {
        setExpandedLessons(new Set([currentLessonId]));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const findCurrentLesson = (lessonsData: Lesson[], exercisesData: Exercise[]) => {
    for (const lesson of lessonsData) {
      const lessonExercises = exercisesData.filter(ex => ex.lesson_id === lesson.id);
      const allCompleted = lessonExercises.every(ex => ex.user_progress?.completed);
      
      if (!allCompleted) {
        return lesson.id;
      }
    }
    
    return lessonsData[lessonsData.length - 1]?.id || null;
  };

  const toggleLesson = (lessonId: number) => {
    setExpandedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.clear();
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

  // 👇 Nueva función: Verificar si un ejercicio está bloqueado
  const isExerciseLocked = (exercise: Exercise, exerciseIndex: number, lessonExercises: Exercise[]) => {
    // El primer ejercicio nunca está bloqueado
    if (exerciseIndex === 0) return false;
    
    // Verificar si el ejercicio anterior está completado
    const previousExercise = lessonExercises[exerciseIndex - 1];
    return !previousExercise.user_progress?.completed;
  };

  const getExerciseIcon = (exercise: Exercise) => {
    if (exercise.content) {
      return <FileText className="w-5 h-5" strokeWidth={2.5} />;
    }
    if (exercise.video_url) {
      return <Video className="w-5 h-5" strokeWidth={2.5} />;
    }
    return <Code className="w-5 h-5" strokeWidth={2.5} />;
  };

  const getExerciseTypeLabel = (exercise: Exercise) => {
    if (exercise.content) return "Lectura";
    if (exercise.video_url) return "Video";
    return "Código";
  };

  const completedExercises = exercises.filter(ex => ex.user_progress?.completed);
  const totalPoints = user?.total_points || 0;
  const maxPossiblePoints = exercises.reduce((sum, ex) => sum + ex.points, 0);
  const progressPercentage = exercises.length > 0 
    ? Math.round((completedExercises.length / exercises.length) * 100) 
    : 0;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" strokeWidth={2.5} />
          <span className="text-lg font-bold text-gray-700">Verificando sesión...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Hero Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                ¡Hola, {user.name}! 👋
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Continúa tu aventura de programación y alcanza nuevas metas.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Ejercicios Totales */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-indigo-200 p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
                Total
              </p>
            </div>
            <p className="text-3xl md:text-4xl font-black text-gray-900">
              {exercises.length}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-1">ejercicios</p>
          </div>

          {/* Completados */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-green-200 p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-xs text-green-600 font-bold uppercase tracking-wider">
                Hechos
              </p>
            </div>
            <p className="text-3xl md:text-4xl font-black text-green-600">
              {completedExercises.length}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-1">completados</p>
          </div>

          {/* Progreso */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-purple-200 p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-xs text-purple-600 font-bold uppercase tracking-wider">
                Progreso
              </p>
            </div>
            <p className="text-3xl md:text-4xl font-black text-purple-600">
              {progressPercentage}%
            </p>
            <div className="mt-2 bg-purple-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-full transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Puntos */}
          <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-xs text-white/90 font-bold uppercase tracking-wider">
                Puntos
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl md:text-4xl font-black text-white">
                {totalPoints}
              </p>
              <p className="text-sm text-white/80 font-bold">
                / {maxPossiblePoints}
              </p>
            </div>
            <div className="mt-2 bg-white/20 h-2 rounded-full overflow-hidden">
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

        {/* Lecciones/Módulos */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-gray-900">
              📚 Tus Lecciones
            </h2>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200">
              <span className="text-sm font-bold text-gray-600">
                {lessons.length} módulos disponibles
              </span>
            </div>
          </div>

          {loading ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-gray-200 shadow-lg p-20 text-center">
              <Loader2 className="inline-block w-12 h-12 text-indigo-500 animate-spin mb-4" strokeWidth={2.5} />
              <p className="text-gray-600 font-bold text-lg">
                Cargando tus lecciones...
              </p>
            </div>
          ) : (
            lessons.map((lesson, lessonIndex) => {
              const progress = getLessonProgress(lesson.id);
              const isExpanded = expandedLessons.has(lesson.id);
              const lessonExercises = getExercisesForLesson(lesson.id);
              const isLocked = lessonIndex > 0 && getLessonProgress(lessons[lessonIndex - 1].id).percentage < 100;

              return (
                <div 
                  key={lesson.id}
                  className={`bg-white/90 backdrop-blur-sm rounded-3xl border-2 shadow-lg overflow-hidden transition-all ${
                    isLocked 
                      ? 'border-gray-300 opacity-60' 
                      : progress.percentage === 100
                        ? 'border-green-300 shadow-green-100'
                        : 'border-indigo-200 hover:shadow-xl'
                  }`}
                >
                  {/* Lesson Header */}
                  <button
                    onClick={() => !isLocked && toggleLesson(lesson.id)}
                    disabled={isLocked}
                    className={`w-full px-6 md:px-8 py-6 flex items-center justify-between transition-all ${
                      isLocked 
                        ? 'cursor-not-allowed' 
                        : 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                    }`}
                  >
                    <div className="flex items-center gap-4 md:gap-6 flex-1">
                      {/* Icon */}
                      <div 
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl md:text-4xl shadow-lg transition-transform ${
                          isLocked ? 'grayscale' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: isLocked ? '#d1d5db' : lesson.color }}
                      >
                        {isLocked ? '🔒' : lesson.icon}
                      </div>
                      
                      {/* Info */}
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className={`text-xl md:text-2xl font-black ${
                            isLocked ? 'text-gray-400' : 'text-gray-900'
                          }`}>
                            {lesson.title}
                          </h2>
                          {isLocked && (
                            <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold">
                              BLOQUEADO
                            </span>
                          )}
                          {progress.percentage === 100 && !isLocked && (
                            <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                              <Star className="w-3 h-3" strokeWidth={3} />
                              COMPLETADO
                            </span>
                          )}
                        </div>
                        <p className={`text-sm md:text-base mb-3 ${
                          isLocked ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {lesson.description}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
                            {progress.completed}/{progress.total} ejercicios
                          </span>
                          <div className="flex-1 max-w-[300px] bg-gray-200 h-3 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                progress.percentage === 100
                                  ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                              }`}
                              style={{ width: `${progress.percentage}%` }}
                            />
                          </div>
                          <span className={`text-xs font-black whitespace-nowrap ${
                            progress.percentage === 100 ? 'text-green-600' : 'text-indigo-600'
                          }`}>
                            {progress.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Toggle Icon */}
                    {!isLocked && (
                      <div className="ml-4">
                        {isExpanded ? (
                          <ChevronDown className="w-6 h-6 text-gray-400" strokeWidth={2.5} />
                        ) : (
                          <ChevronRight className="w-6 h-6 text-gray-400" strokeWidth={2.5} />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Exercises List */}
                  {isExpanded && !isLocked && (
                    <div className="border-t-2 border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                      <div className="divide-y divide-gray-100">
                        {lessonExercises.map((exercise, index) => {
                          const isDone = exercise.user_progress?.completed;
                          const exerciseLocked = isExerciseLocked(exercise, index, lessonExercises); // 👈 Verificar bloqueo

                          return exerciseLocked ? (
                            // 👇 Ejercicio BLOQUEADO (div, no Link)
                            <div
                              key={exercise.id}
                              className="flex items-center justify-between px-6 md:px-8 py-5 opacity-50 cursor-not-allowed bg-gray-50/50"
                            >
                              <div className="flex items-center gap-4 flex-1">
                                {/* Number Badge */}
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black bg-gray-200 text-gray-400">
                                  {index + 1}
                                </div>

                                {/* Locked Icon */}
                                <div className="w-12 h-12 rounded-xl border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                                  <Lock className="w-6 h-6 text-gray-400" strokeWidth={2.5} />
                                </div>

                                {/* Exercise Info */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-base md:text-lg font-bold text-gray-400">
                                      {exercise.title}
                                    </h3>
                                    <span className="bg-gray-200 text-gray-500 px-3 py-1 rounded-lg text-xs font-bold">
                                      BLOQUEADO
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-400 line-clamp-1">
                                    Completa el ejercicio anterior para desbloquear
                                  </p>
                                </div>
                              </div>

                              {/* Points */}
                              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 ml-4">
                                <Award className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
                                <p className="text-sm font-black text-gray-500">
                                  {exercise.points}
                                </p>
                              </div>
                            </div>
                          ) : (
                            // 👇 Ejercicio DISPONIBLE (Link normal)
                            <Link
                              key={exercise.id}
                              href={`/exercises/${exercise.id}`}
                              className={`flex items-center justify-between px-6 md:px-8 py-5 transition-all group relative overflow-hidden ${
                                isDone 
                                  ? 'bg-green-50/50 hover:bg-green-100/50' 
                                  : 'hover:bg-indigo-50/50'
                              }`}
                            >
                              {/* Accent Border */}
                              <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${
                                isDone 
                                  ? 'bg-green-500' 
                                  : 'bg-indigo-500 scale-y-0 group-hover:scale-y-100'
                              }`} />

                              <div className="flex items-center gap-4 flex-1">
                                {/* Number Badge */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                                  isDone
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-700'
                                }`}>
                                  {index + 1}
                                </div>

                                {/* Status Icon */}
                                <div
                                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                                    isDone
                                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 text-white shadow-lg'
                                      : 'border-indigo-200 text-indigo-400 group-hover:border-indigo-400 group-hover:bg-indigo-50'
                                  }`}
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
                                  ) : (
                                    getExerciseIcon(exercise)
                                  )}
                                </div>

                                {/* Exercise Info */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className={`text-base md:text-lg font-bold transition-all ${
                                      isDone
                                        ? 'text-gray-500 line-through'
                                        : 'text-gray-900 group-hover:text-indigo-700'
                                    }`}>
                                      {exercise.title}
                                    </h3>
                                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                                      isDone
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-indigo-100 text-indigo-700'
                                    }`}>
                                      {getExerciseTypeLabel(exercise)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 line-clamp-1">
                                    {exercise.description}
                                  </p>
                                </div>
                              </div>

                              {/* Points & Action */}
                              <div className="flex items-center gap-4 ml-4">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                                  isDone
                                    ? 'bg-green-100'
                                    : 'bg-amber-100 group-hover:bg-amber-200'
                                }`}>
                                  <Award className={`w-4 h-4 ${
                                    isDone ? 'text-green-600' : 'text-amber-600'
                                  }`} strokeWidth={2.5} />
                                  <p className={`text-sm font-black ${
                                    isDone ? 'text-green-700' : 'text-amber-700'
                                  }`}>
                                    {exercise.points}
                                  </p>
                                </div>

                                {!isDone && (
                                  <div className="bg-indigo-500 text-white w-10 h-10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110">
                                    <Play className="w-5 h-5" strokeWidth={2.5} fill="white" />
                                  </div>
                                )}
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