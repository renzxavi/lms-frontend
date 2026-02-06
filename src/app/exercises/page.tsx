'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { exercisesAPI, lessonsAPI } from '@/lib/api';
import { Exercise, Lesson } from '@/types';
import { BookOpen, ArrowLeft, Loader2, Award, CheckCircle2, Clock, Filter, Search, Grid3x3, List, Video, FileText, Code } from 'lucide-react';

export default function ExercisesListPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [lessonFilter, setLessonFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'code' | 'video' | 'reading'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [exercisesData, lessonsData] = await Promise.all([
        exercisesAPI.getAll(),
        lessonsAPI.getAll()
      ]);
      setExercises(exercisesData);
      setLessons(lessonsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getExerciseType = (exercise: Exercise): 'code' | 'video' | 'reading' => {
    if (exercise.content) return 'reading';
    if (exercise.video_url) return 'video';
    return 'code';
  };

  const filteredExercises = exercises.filter(ex => {
    // Filtro de dificultad
    if (filter !== 'all' && ex.difficulty !== filter) return false;
    
    // Filtro de lección
    if (lessonFilter !== 'all' && ex.lesson_id !== lessonFilter) return false;
    
    // Filtro de estado
    if (statusFilter === 'completed' && !ex.user_progress?.completed) return false;
    if (statusFilter === 'pending' && ex.user_progress?.completed) return false;
    
    // Filtro de tipo
    if (typeFilter !== 'all' && getExerciseType(ex) !== typeFilter) return false;
    
    // Búsqueda
    if (searchQuery && !ex.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !ex.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  const stats = {
    total: exercises.length,
    completed: exercises.filter(e => e.user_progress?.completed).length,
    pending: exercises.filter(e => !e.user_progress?.completed).length,
    totalPoints: exercises.reduce((sum, e) => sum + (e.user_progress?.completed ? e.points : 0), 0),
    maxPoints: exercises.reduce((sum, e) => sum + e.points, 0),
  };

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
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            Volver al Dashboard
          </button>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                Todos los Ejercicios
              </h1>
              <p className="text-lg text-gray-600">
                Explora y practica todos los desafíos disponibles
              </p>
            </div>
            <BookOpen className="w-16 h-16 text-red-500 hidden md:block" strokeWidth={2} />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border-2 border-red-200 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-red-500" strokeWidth={2.5} />
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Total</p>
              </div>
              <p className="text-2xl font-black text-gray-800">{stats.total}</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 border-2 border-green-200 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" strokeWidth={2.5} />
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Completados</p>
              </div>
              <p className="text-2xl font-black text-green-600">{stats.completed}</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 border-2 border-yellow-200 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-yellow-500" strokeWidth={2.5} />
                <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Pendientes</p>
              </div>
              <p className="text-2xl font-black text-yellow-600">{stats.pending}</p>
            </div>
            
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-red-100" strokeWidth={2.5} />
                <p className="text-xs font-bold text-red-100 uppercase tracking-wider">Puntos</p>
              </div>
              <p className="text-2xl font-black text-white">{stats.totalPoints}/{stats.maxPoints}</p>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar ejercicios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 transition-colors text-gray-700"
              />
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  showFilters
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span className="hidden md:inline font-semibold">Filtros</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t-2 border-gray-100 space-y-6">
              {/* Difficulty Filter */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Dificultad</p>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    active={filter === 'all'}
                    onClick={() => setFilter('all')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    Todas ({exercises.length})
                  </FilterButton>
                  <FilterButton
                    active={filter === 'easy'}
                    onClick={() => setFilter('easy')}
                    className="bg-green-100 hover:bg-green-200 text-green-700"
                  >
                    🟢 Fácil ({exercises.filter(e => e.difficulty === 'easy').length})
                  </FilterButton>
                  <FilterButton
                    active={filter === 'medium'}
                    onClick={() => setFilter('medium')}
                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                  >
                    🟡 Medio ({exercises.filter(e => e.difficulty === 'medium').length})
                  </FilterButton>
                  <FilterButton
                    active={filter === 'hard'}
                    onClick={() => setFilter('hard')}
                    className="bg-red-100 hover:bg-red-200 text-red-700"
                  >
                    🔴 Difícil ({exercises.filter(e => e.difficulty === 'hard').length})
                  </FilterButton>
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Tipo de Ejercicio</p>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    active={typeFilter === 'all'}
                    onClick={() => setTypeFilter('all')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    Todos
                  </FilterButton>
                  <FilterButton
                    active={typeFilter === 'code'}
                    onClick={() => setTypeFilter('code')}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                  >
                    <Code className="w-4 h-4" /> Código ({exercises.filter(e => getExerciseType(e) === 'code').length})
                  </FilterButton>
                  <FilterButton
                    active={typeFilter === 'video'}
                    onClick={() => setTypeFilter('video')}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-700"
                  >
                    <Video className="w-4 h-4" /> Videos ({exercises.filter(e => getExerciseType(e) === 'video').length})
                  </FilterButton>
                  <FilterButton
                    active={typeFilter === 'reading'}
                    onClick={() => setTypeFilter('reading')}
                    className="bg-orange-100 hover:bg-orange-200 text-orange-700"
                  >
                    <FileText className="w-4 h-4" /> Lectura ({exercises.filter(e => getExerciseType(e) === 'reading').length})
                  </FilterButton>
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Estado</p>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    active={statusFilter === 'all'}
                    onClick={() => setStatusFilter('all')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    Todos
                  </FilterButton>
                  <FilterButton
                    active={statusFilter === 'completed'}
                    onClick={() => setStatusFilter('completed')}
                    className="bg-green-100 hover:bg-green-200 text-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Completados
                  </FilterButton>
                  <FilterButton
                    active={statusFilter === 'pending'}
                    onClick={() => setStatusFilter('pending')}
                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                  >
                    <Clock className="w-4 h-4" /> Pendientes
                  </FilterButton>
                </div>
              </div>

              {/* Lesson Filter */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Lección</p>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    active={lessonFilter === 'all'}
                    onClick={() => setLessonFilter('all')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    Todas
                  </FilterButton>
                  {lessons.map(lesson => (
                    <FilterButton
                      key={lesson.id}
                      active={lessonFilter === lesson.id}
                      onClick={() => setLessonFilter(lesson.id)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      {lesson.icon} {lesson.title}
                    </FilterButton>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600 font-medium">
            Mostrando <span className="font-bold text-red-600">{filteredExercises.length}</span> ejercicio{filteredExercises.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Exercises Grid/List */}
        {filteredExercises.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-red-200">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-xl font-semibold mb-2">No se encontraron ejercicios</p>
            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                viewMode={viewMode}
                lesson={lessons.find(l => l.id === exercise.lesson_id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ 
  active, 
  onClick, 
  children, 
  className 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode; 
  className: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
        active
          ? 'ring-2 ring-red-500 ring-offset-2 shadow-md transform scale-105'
          : ''
      } ${className}`}
    >
      {children}
    </button>
  );
}

function ExerciseCard({ 
  exercise, 
  viewMode,
  lesson
}: { 
  exercise: Exercise; 
  viewMode: 'grid' | 'list';
  lesson?: Lesson;
}) {
  const router = useRouter();
  const isCompleted = exercise.user_progress?.completed;

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

  const characterEmojis: Record<string, string> = {
    'cat': '🐱',
    'dog': '🐶',
    'lion': '🦁',
    'elephant': '🐘',
    'rabbit': '🐰',
    'fox': '🦊',
    'bear': '🐻',
    'panda': '🐼',
    'owl': '🦉',
    'turtle': '🐢',
    'robot': '🤖'
  };

  const getExerciseType = () => {
    if (exercise.content) return { icon: <FileText className="w-4 h-4" />, label: 'Lectura', color: 'bg-orange-100 text-orange-700' };
    if (exercise.video_url) return { icon: <Video className="w-4 h-4" />, label: 'Video', color: 'bg-purple-100 text-purple-700' };
    return { icon: <Code className="w-4 h-4" />, label: 'Código', color: 'bg-blue-100 text-blue-700' };
  };

  const exerciseType = getExerciseType();

  if (viewMode === 'list') {
    return (
      <div
        onClick={() => router.push(`/exercises/${exercise.id}`)}
        className={`bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-xl border-2 transition-all cursor-pointer transform hover:scale-[1.02] ${
          isCompleted ? 'border-green-300 bg-green-50/30' : 'border-red-100 hover:border-red-300'
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="text-4xl flex-shrink-0">
            {exercise.character ? characterEmojis[exercise.character] || '🎯' : '🎯'}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                {exercise.title}
              </h3>
              {isCompleted && (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" strokeWidth={2.5} />
              )}
            </div>
            <p className="text-gray-600 text-sm md:text-base line-clamp-2 mb-2">
              {exercise.description}
            </p>
            {lesson && (
              <p className="text-xs text-gray-500 mb-2">
                {lesson.icon} {lesson.title}
              </p>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-col md:flex-row items-end md:items-center gap-2 flex-shrink-0">
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold border-2 ${config.color} flex items-center gap-1 whitespace-nowrap`}>
              <span>{config.icon}</span>
              <span className="hidden md:inline">{config.label}</span>
            </span>
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${exerciseType.color} flex items-center gap-1 whitespace-nowrap`}>
              {exerciseType.icon}
              <span className="hidden md:inline">{exerciseType.label}</span>
            </span>
            <span className="flex items-center gap-1 text-red-600 font-bold whitespace-nowrap">
              <Award className="w-4 h-4" strokeWidth={2.5} />
              {exercise.points} pts
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => router.push(`/exercises/${exercise.id}`)}
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border-2 transition-all cursor-pointer transform hover:scale-105 h-full flex flex-col ${
        isCompleted ? 'border-green-300 bg-green-50/30' : 'border-red-100 hover:border-red-300'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              {exercise.title}
            </h3>
            {isCompleted && (
              <CheckCircle2 className="w-5 h-5 text-green-500" strokeWidth={2.5} />
            )}
          </div>
          {lesson && (
            <p className="text-xs text-gray-500 font-medium mb-2">
              {lesson.icon} {lesson.title}
            </p>
          )}
        </div>
        <div className="text-3xl ml-2">
          {exercise.character ? characterEmojis[exercise.character] || '🎯' : '🎯'}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
        {exercise.description}
      </p>

      {/* Type Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold ${exerciseType.color}`}>
          {exerciseType.icon}
          {exerciseType.label}
        </span>
      </div>

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