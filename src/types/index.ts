// ============================================
// TIPOS DE USUARIOS Y AUTENTICACIÓN
// ============================================

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
  payment_status?: string | null;
  payment_date?: string | null;
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
  address?: string;
  admin_id: number;
  payment_verified: boolean;
  payment_status?: string | null;
  payment_date?: string | null;
  total_points: number;
  created_at: string;
  updated_at: string;
  
  // Relaciones y estadísticas
  progress?: Progress[];
  completed_exercises?: number;
  progress_count?: number;
  admin?: User;
}

export interface AuthResponse {
  status: string;
  user: User;
  token?: string;
  message?: string;
  
  // Información de pago
  payment?: {
    preference_id: string;
    init_point: string;
  };
  needs_payment?: boolean;
  preference_id?: string;
  user_id?: number;
  payment_required?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation?: string;
  institution?: string;
  address?: string;
  role?: 'admin' | 'student';
}

// ============================================
// TIPOS DE EJERCICIOS Y LECCIONES
// ============================================

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
  toolbox: string | any[] | null;
  expected_result: string | any | null;
  workspace_xml?: string | null;
  initial_blocks?: string | null;
  difficulty: Difficulty;
  points: number;
  lesson_id: number;
  character: CharacterType | string;
  story: string;
  help_video_url: string | null;
  help_text: string | null;
  
  // Contenido alternativo (para ejercicios de lectura/video)
  content?: string | null;
  video_url?: string | null;
  
  // Estado del ejercicio
  is_locked?: boolean;
  
  // Progreso del usuario actual
  current_user_progress?: {
    completed: boolean;
    code?: string | null;
    result?: any;
    points_earned?: number;
    attempts?: number;
  };
  
  // Relaciones
  lesson?: Lesson;
  progress?: Progress[];
  
  // Metadatos
  created_at?: string;
  updated_at?: string;
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
  
  // Relaciones
  exercises?: Exercise[];
  exercises_count?: number;
}

// ============================================
// TIPOS DE PROGRESO Y ESTADÍSTICAS
// ============================================

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
  
  // Relaciones
  exercise?: Exercise;
  user?: User;
}

export interface UserStats {
  total_exercises: number;
  completed_exercises: number;
  total_points: number;
  total_attempts: number;
  completion_percentage?: number;
  average_attempts?: number;
  exercises_by_difficulty?: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface SubmitExerciseResponse {
  correct: boolean;
  message: string;
  points_earned: number;
  total_points?: number;
  attempts?: number;
  result?: any;
}

// ============================================
// TIPOS DE FILTROS Y BÚSQUEDA
// ============================================

export type DifficultyFilter = 'all' | Difficulty;
export type StatusFilter = 'all' | 'completed' | 'pending';
export type ExerciseTypeFilter = 'all' | 'code' | 'video' | 'reading';

export interface ExerciseFilters {
  difficulty?: DifficultyFilter;
  status?: StatusFilter;
  type?: ExerciseTypeFilter;
  lesson_id?: number;
  search?: string;
}

export interface StudentFilters {
  search?: string;
  payment_verified?: boolean | 'all';
  sort_by?: 'name' | 'email' | 'total_points' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

// ============================================
// TIPOS DE PAGOS
// ============================================

export interface PaymentInfo {
  payment_verified: boolean;
  payment_status: string | null;
  payment_date: string | null;
  preference_id?: string;
  init_point?: string;
}

export interface PaymentPreference {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
}

export interface PaymentWebhookData {
  action: string;
  data: {
    id: string;
  };
  type: string;
}

// ============================================
// TIPOS DE FORMULARIOS
// ============================================

export interface StudentFormData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation?: string;
  institution?: string;
  address?: string;
}

export interface ExerciseFormData {
  title: string;
  description: string;
  instructions: string;
  difficulty: Difficulty;
  points: number;
  lesson_id: number;
  order: number;
  character: CharacterType | string;
  story: string;
  toolbox?: string | any[] | null;
  expected_result?: string | any | null;
  help_video_url?: string | null;
  help_text?: string | null;
  content?: string | null;
  video_url?: string | null;
}

export interface LessonFormData {
  title: string;
  description: string;
  order: number;
  icon: string;
  color: string;
}

// ============================================
// TIPOS DE RESPUESTAS DE API
// ============================================

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// ============================================
// TIPOS DE BLOCKLY
// ============================================

export interface BlocklyWorkspace {
  clear: () => void;
  getAllBlocks: () => any[];
  dispose: () => void;
}

export interface BlocklyBlock {
  type: string;
  id: string;
  getFieldValue: (name: string) => any;
  getInput: (name: string) => any;
}

export interface ToolboxCategory {
  kind: 'category';
  name: string;
  colour?: string;
  contents: ToolboxBlock[];
}

export interface ToolboxBlock {
  kind: 'block';
  type: string;
  fields?: Record<string, any>;
  inputs?: Record<string, any>;
}

export type Toolbox = {
  kind: 'categoryToolbox';
  contents: ToolboxCategory[];
} | {
  kind: 'flyoutToolbox';
  contents: ToolboxBlock[];
};

// ============================================
// TIPOS DE UTILIDADES
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// ============================================
// TIPOS DE EXPORTACIÓN DE REPORTES
// ============================================

export interface StudentReport {
  student: Student;
  stats: UserStats;
  recent_progress: Progress[];
  exercises_by_lesson?: Record<number, {
    lesson_name: string;
    completed: number;
    total: number;
  }>;
}

export type ReportFormat = 'pdf' | 'excel' | 'csv';

export interface ExportOptions {
  format: ReportFormat;
  include_details?: boolean;
  date_range?: {
    from: string;
    to: string;
  };
}