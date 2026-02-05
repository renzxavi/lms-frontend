import { AuthResponse, User, Exercise, Lesson } from '@/types';

const SERVER_URL = 'http://localhost:8000';
const API_URL = `${SERVER_URL}/api`;

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return response;
}

export const authAPI = {
  async getCsrfToken() {
    return await fetch(`${SERVER_URL}/sanctum/csrf-cookie`, { method: 'GET' });
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Error de login');
    return result;
  },

  async register(data: any): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      const msg = result.errors ? Object.values(result.errors).flat().join(' ') : result.message;
      throw new Error(msg || 'Error en el registro');
    }
    return result;
  },

  async getMe(): Promise<User | null> {
    const res = await fetchWithAuth('/me');
    if (!res.ok) return null;
    return res.json();
  },

  async logout(): Promise<void> {
    await fetchWithAuth('/logout', { method: 'POST' });
  }
};

export const exercisesAPI = {
  async getAll(): Promise<Exercise[]> {
    const res = await fetchWithAuth('/exercises');
    if (!res.ok) throw new Error('No se pudo cargar la lista');
    return res.json();
  },

  async getById(id: number | string): Promise<Exercise> {
    if (!id || id === 'undefined') {
      throw new Error('ID de ejercicio inválido');
    }
    
    const res = await fetchWithAuth(`/exercises/${id}`);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Ejercicio no encontrado');
    }
    
    return res.json();
  },

  async submitAnswer(exerciseId: number, code: string, result: any) {
    console.log('📤 Enviando al backend:', { 
      exercise_id: exerciseId, 
      code: code, 
      result: result 
    });

    const res = await fetchWithAuth('/exercises/submit', {
      method: 'POST',
      body: JSON.stringify({ 
        exercise_id: exerciseId, 
        code: code, 
        result: result 
      }),
    });

    const responseData = await res.json();
    
    console.log('📥 Respuesta del backend:', responseData);

    if (!res.ok) {
      console.error('❌ Error del servidor:', responseData);
      throw new Error(responseData.message || 'Error al enviar la respuesta');
    }
    
    return responseData;
  }
};

export const lessonsAPI = {
  async getAll(): Promise<Lesson[]> {
    const res = await fetchWithAuth('/lessons');
    if (!res.ok) throw new Error('No se pudieron cargar los módulos');
    return res.json();
  },

  async getById(id: number | string): Promise<Lesson> {
    if (!id || id === 'undefined') {
      throw new Error('ID de lección inválido');
    }
    
    const res = await fetchWithAuth(`/lessons/${id}`);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Lección no encontrada');
    }
    
    return res.json();
  }
};