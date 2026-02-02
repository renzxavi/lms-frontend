export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  institution?: string;
  address?: string;
  role: 'student' | 'teacher' | 'admin';
  total_points: number;
  created_at?: string;
  updated_at?: string;
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
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  lesson_id?: number;
  lesson?: Lesson;
  created_at?: string;
  updated_at?: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  order: number;
  exercises?: Exercise[];
}

export interface Progress {
  id: number;
  user_id: number;
  exercise_id: number;
  completed: boolean;
  points_earned: number;
  attempts: number;
  code?: string;
  result?: any;
  created_at?: string;
  updated_at?: string;
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  total_points: number;
  exercises_completed: number;
}