// src/lib/api.ts

import { AuthResponse, User, Exercise, Lesson, Student, PaymentInfo, StudentFormData } from '@/types';

const SERVER_URL = 'http://localhost:8000';
const API_URL = `${SERVER_URL}/api`;

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
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
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) {
      const result = await res.json().catch(() => ({}));
      console.error('❌ Error de login:', result);
      throw new Error(result.message || 'Error de login');
    }
    
    const result = await res.json();
    console.log('✅ Login exitoso:', result);
    return result;
  },

  async register(data: any): Promise<AuthResponse> {
    console.log('🔵 Iniciando registro...');
    console.log('📦 URL:', `${API_URL}/register`);
    console.log('📦 Data:', data);

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify(data),
      });

      console.log('📡 Response status:', res.status);
      console.log('📡 Response ok:', res.ok);

      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        console.error('❌ Error response:', result);
        const msg = result.errors ? Object.values(result.errors).flat().join(' ') : result.message;
        throw new Error(msg || 'Error en el registro');
      }

      const result = await res.json();
      console.log('✅ Registro exitoso:', result);
      return result;

    } catch (error: any) {
      console.error('❌ Error completo:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Error de conexión con el servidor. Verifica que el backend esté corriendo.');
      }
      
      throw error;
    }
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

  async getByLesson(lessonId: number): Promise<Exercise[]> {
    const allExercises = await this.getAll();
    return allExercises.filter(ex => ex.lesson_id === lessonId);
  },

  async submitAnswer(exerciseId: number, code: string, result: any) {
    console.log('📤 Enviando al backend:', { 
      exercise_id: exerciseId, 
      code: code, 
      result: result 
    });

    const completed = result?.correct === true || 
                     result?.success === true || 
                     result?.completed === true || 
                     false;

    const res = await fetchWithAuth('/exercises/submit', {
      method: 'POST',
      body: JSON.stringify({ 
        exercise_id: exerciseId, 
        code: code, 
        result: result,
        completed: completed
      }),
    });

    if (!res.ok) {
      const responseData = await res.json().catch(() => ({}));
      console.error('❌ Error del servidor:', responseData);
      throw new Error(responseData.message || 'Error al enviar la respuesta');
    }

    const responseData = await res.json();
    console.log('📥 Respuesta del backend:', responseData);
    
    return responseData;
  }
};

export const lessonsAPI = {
  async getAll(): Promise<Lesson[]> {
    console.log('🔍 Obteniendo lecciones...');
    const res = await fetchWithAuth('/lessons');
    
    if (!res.ok) {
      console.error('❌ Error al obtener lecciones');
      throw new Error('No se pudieron cargar los módulos');
    }
    
    const data = await res.json();
    console.log('✅ Lecciones recibidas:', data);
    return data;
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

export const progressAPI = {
  async submit(exerciseId: number, code: string, result: any) {
    console.log('📤 [PROGRESS API] Iniciando submit...');
    console.log('📦 Exercise ID:', exerciseId);
    console.log('📦 Code:', code?.substring(0, 100) + '...');
    console.log('📦 Result:', result);

    const completed = result?.correct === true || 
                     result?.success === true || 
                     result?.completed === true || 
                     false;

    console.log('✅ Completed determinado:', completed);

    const payload = { 
      code, 
      result,
      completed
    };

    console.log('📦 Payload completo:', payload);
    console.log('🌐 URL:', `${API_URL}/progress/${exerciseId}`);

    try {
      const res = await fetchWithAuth(`/progress/${exerciseId}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      console.log('📡 Response status:', res.status);
      console.log('📡 Response ok:', res.ok);

      const responseText = await res.text();
      console.log('📄 Response text:', responseText);

      if (!res.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: responseText || 'Error desconocido' };
        }
        
        console.error('❌ Error del servidor:', errorData);
        throw new Error(errorData.message || `Error ${res.status}: ${responseText}`);
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        console.error('❌ No se pudo parsear la respuesta como JSON:', responseText);
        throw new Error('Respuesta inválida del servidor');
      }

      console.log('✅ Progreso guardado exitosamente:', responseData);
      return responseData;

    } catch (error) {
      console.error('❌ Error en submit:', error);
      throw error;
    }
  },

  async getByExercise(exerciseId: number) {
    const res = await fetchWithAuth(`/progress/${exerciseId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.progress || null;
  },

  async getAll() {
    const res = await fetchWithAuth('/progress');
    
    if (!res.ok) {
      console.error('Error al cargar progreso');
      return [];
    }
    
    const data = await res.json();
    
    if (data && Array.isArray(data.progress)) {
      return data.progress;
    }
    
    if (Array.isArray(data)) {
      return data;
    }
    
    console.warn('Formato inesperado de progreso:', data);
    return [];
  }
};

export const paymentAPI = {
  async verify(): Promise<PaymentInfo> {
    const res = await fetchWithAuth('/payment/verify');
    if (!res.ok) throw new Error('Error al verificar pago');
    return res.json();
  },

  async recreate(): Promise<{ preference_id: string; init_point: string }> {
    const res = await fetchWithAuth('/payment/recreate', { method: 'POST' });
    if (!res.ok) throw new Error('Error al recrear preferencia de pago');
    return res.json();
  }
};

export const studentsAPI = {
  async getAll(): Promise<Student[]> {
    const res = await fetchWithAuth('/students');
    if (!res.ok) throw new Error('Error al cargar estudiantes');
    const data = await res.json();
    return data.students;
  },

  async getById(id: number): Promise<Student> {
    const res = await fetchWithAuth(`/students/${id}`);
    if (!res.ok) throw new Error('Error al cargar estudiante');
    
    const student = await res.json();
    return student;
  },

  async create(studentData: StudentFormData): Promise<Student> {
    const res = await fetchWithAuth('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al crear estudiante');
    }
    const data = await res.json();
    return data.student;
  },

  async update(id: number, updates: Partial<StudentFormData>): Promise<Student> {
    const res = await fetchWithAuth(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Error al actualizar estudiante');
    const data = await res.json();
    return data.student;
  },

  async delete(id: number): Promise<void> {
    const res = await fetchWithAuth(`/students/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar estudiante');
  },

  async resetPassword(id: number, password: string): Promise<void> {
    const res = await fetchWithAuth(`/students/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    if (!res.ok) throw new Error('Error al resetear contraseña');
  }
};