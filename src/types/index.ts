export interface User {
  id: number;
  name: string;
  email: string;
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface Exercise {
  id: number;
  title: string;
  description: string;
  instructions: string;
  toolbox: string | null;
  expected_result: string | null;
  difficulty: string;
  points: number;
  lesson_id: number;
  character: string;
  story: string;
  help_video_url: string | null;
  help_text: string | null;
  content?: string;     // NUEVO
  video_url?: string;   // NUEVO
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
  completion_percentage: number;
}
