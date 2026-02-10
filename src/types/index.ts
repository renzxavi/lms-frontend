export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  institution?: string;
  address?: string;
  role: 'admin' | 'student';
  total_points: number;
  payment_verified?: boolean;
  payment_status?: string;
  payment_date?: string;
  admin_id?: number;
  created_at: string;
  updated_at: string;
  
  // Relaciones
  students?: Student[];
  admin?: User;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  role: 'student';
  phone?: string;
  institution?: string;
  admin_id: number;
  payment_verified: boolean; // ✅ Ya incluido
  total_points: number;
  created_at: string;
  updated_at: string;
  progress?: Progress[]; // ✅ NUEVO - Array de progreso
  completed_exercises?: number; // ✅ NUEVO - Contador de ejercicios completados
  progress_count?: number; // ✅ NUEVO - Total de registros de progreso
}

export interface AuthResponse {
  user: User;
  token?: string;
  message?: string;
  payment?: {
    preference_id: string;
    init_point: string;
  };
  payment_required?: boolean;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export type CharacterType = 
  | 'cat' 
  | 'dog' 
  | 'lion' 
  | 'elephant' 
  | 'rabbit' 
  | 'fox' 
  | 'bear' 
  | 'panda' 
  | 'owl' 
  | 'turtle' 
  | 'robot';

export interface Exercise {
  id: number;
  title: string;
  order: number;
  description: string;
  instructions: string;
  toolbox: string | null;
  expected_result: string | null;
  difficulty: Difficulty;
  points: number;
  lesson_id: number;
  character: CharacterType | string;
  story: string;
  help_video_url: string | null;
  help_text: string | null;
  content?: string;
  video_url?: string;
  user_progress?: {
    completed: boolean;
    code?: string;
    result?: any;
  };
}

export interface Progress {
  id: number;
  user_id: number;
  exercise_id: number;
  code: string | null;
  result: any | null;
  completed: boolean;
  points_earned: number;
  attempts: number;
  created_at: string;
  updated_at: string;
  exercise?: Exercise;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  order: number;
  icon: string;
  color: string;
  created_at: string;
  updated_at: string;
  exercises?: Exercise[];
}

export interface UserStats {
  total_exercises: number;
  completed_exercises: number;
  total_points: number;
  total_attempts: number;
  completion_percentage?: number;
}

export type DifficultyFilter = 'all' | Difficulty;
export type StatusFilter = 'all' | 'completed' | 'pending';
export type ExerciseTypeFilter = 'all' | 'code' | 'video' | 'reading';

// Nuevos tipos para pagos y administración
export interface PaymentInfo {
  payment_verified: boolean;
  payment_status: string | null;
  payment_date: string | null;
  preference_id?: string;
  init_point?: string;
}

export interface StudentFormData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  institution?: string;
}