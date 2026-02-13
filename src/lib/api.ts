const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: string;
  needs_payment?: boolean;
  preference_id?: string;
  user_id?: number;
  payment_status?: string;
}

class BaseProtectedClient {
  protected getAuthHeader() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  protected async handleProtectedResponse(response: Response) {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?error=expired';
      }
      throw new Error('UNAUTHORIZED');
    }

    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json') 
      ? await response.json().catch(() => ({})) 
      : {};

    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }
    return data;
  }
}

class ApiClient {
  private async handleResponse(response: Response) {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorData: ApiError = { message: 'Error desconocido' };
      try {
        if (contentType?.includes('application/json')) {
          errorData = await response.json();
        }
      } catch (e) {}

      if (response.status === 403 && errorData.needs_payment) {
        const paymentError: any = new Error(errorData.message);
        paymentError.needs_payment = true;
        paymentError.preference_id = errorData.preference_id;
        paymentError.user_id = errorData.user_id;
        throw paymentError;
      }

      if (response.status === 401) throw new Error('UNAUTHORIZED');
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    return contentType?.includes('application/json') ? await response.json() : { status: 'success' };
  }

  async register(data: any) {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return this.handleResponse(res);
  }

  async logout(token: string) {
    const res = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json' 
      },
    });
    return this.handleResponse(res);
  }

  async me(token: string) {
    const res = await fetch(`${API_URL}/me`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json' 
      },
    });
    return this.handleResponse(res);
  }

  async validateEmail(email: string) {
    const res = await fetch(`${API_URL}/validate-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return this.handleResponse(res);
  }

  async recreatePayment(token: string) {
    const res = await fetch(`${API_URL}/payment/recreate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
    return this.handleResponse(res);
  }

  async verifyPayment(token: string) {
    const res = await fetch(`${API_URL}/payment/verify`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
    return this.handleResponse(res);
  }
}

class StudentsApiClient extends BaseProtectedClient {
  async getAll() {
    const res = await fetch(`${API_URL}/admin/students`, { headers: this.getAuthHeader() });
    return this.handleProtectedResponse(res);
  }

  async getById(id: number) {
    const res = await fetch(`${API_URL}/admin/students/${id}`, { headers: this.getAuthHeader() });
    return this.handleProtectedResponse(res);
  }

  async create(data: any) {
    const res = await fetch(`${API_URL}/admin/students`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(data),
    });
    return this.handleProtectedResponse(res);
  }

  async update(id: number, data: any) {
    const res = await fetch(`${API_URL}/admin/students/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeader(),
      body: JSON.stringify(data),
    });
    return this.handleProtectedResponse(res);
  }

  async delete(id: number) {
    const res = await fetch(`${API_URL}/admin/students/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });
    return this.handleProtectedResponse(res);
  }

  async resetPassword(id: number, password: string) {
    const res = await fetch(`${API_URL}/admin/students/${id}/reset-password`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify({ password }),
    });
    return this.handleProtectedResponse(res);
  }

  // ✅ NUEVO
  async updateGroup(id: number, groupId: number | null) {
    const res = await fetch(`${API_URL}/admin/students/${id}/update-group`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify({ group_id: groupId }),
    });
    return this.handleProtectedResponse(res);
  }
}

// ✅ NUEVO - Cliente API para grupos
class GroupsApiClient extends BaseProtectedClient {
  async getAll() {
    const res = await fetch(`${API_URL}/admin/groups`, { 
      headers: this.getAuthHeader() 
    });
    return this.handleProtectedResponse(res);
  }

  async getById(id: number) {
    const res = await fetch(`${API_URL}/admin/groups/${id}`, {
      headers: this.getAuthHeader()
    });
    return this.handleProtectedResponse(res);
  }

  async create(data: { name: string; description?: string; color?: string; icon?: string }) {
    const res = await fetch(`${API_URL}/admin/groups`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(data),
    });
    return this.handleProtectedResponse(res);
  }

  async update(id: number, data: Partial<any>) {
    const res = await fetch(`${API_URL}/admin/groups/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeader(),
      body: JSON.stringify(data),
    });
    return this.handleProtectedResponse(res);
  }

  async delete(id: number) {
    const res = await fetch(`${API_URL}/admin/groups/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });
    return this.handleProtectedResponse(res);
  }

  async assignStudent(groupId: number, studentId: number) {
    const res = await fetch(`${API_URL}/admin/groups/${groupId}/assign`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify({ student_id: studentId }),
    });
    return this.handleProtectedResponse(res);
  }

  async removeStudent(groupId: number, studentId: number) {
    const res = await fetch(`${API_URL}/admin/groups/${groupId}/remove`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify({ student_id: studentId }),
    });
    return this.handleProtectedResponse(res);
  }
}

class LessonsApiClient extends BaseProtectedClient {
  async getAll() {
    const res = await fetch(`${API_URL}/lessons`, { headers: this.getAuthHeader() });
    return this.handleProtectedResponse(res);
  }

  async getById(id: number) {
    const res = await fetch(`${API_URL}/lessons/${id}`, { headers: this.getAuthHeader() });
    return this.handleProtectedResponse(res);
  }
}

class ExercisesApiClient extends BaseProtectedClient {
  async getAll() {
    const res = await fetch(`${API_URL}/exercises`, { headers: this.getAuthHeader() });
    return this.handleProtectedResponse(res);
  }

  async getById(id: number) {
    const res = await fetch(`${API_URL}/exercises/${id}`, { headers: this.getAuthHeader() });
    return this.handleProtectedResponse(res);
  }

  async submit(exerciseId: number, code: string, result?: any) {
    console.log("🚀 [API] Enviando submit:");
    console.log("- Exercise ID:", exerciseId);
    console.log("- Code:", code);
    console.log("- Result:", result);

    const payload = { 
      exercise_id: exerciseId, 
      code,
      result: result || { output: '' }
    };

    console.log("📦 [API] Payload completo:", JSON.stringify(payload, null, 2));

    const res = await fetch(`${API_URL}/exercises/submit`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(payload),
    });

    console.log("📡 [API] Response status:", res.status);
    const data = await this.handleProtectedResponse(res);
    console.log("✅ [API] Response data:", data);

    return data;
  }
}

export const authAPI = new ApiClient();
export const studentsAPI = new StudentsApiClient();
export const groupsAPI = new GroupsApiClient(); // ✅ NUEVO
export const lessonsAPI = new LessonsApiClient();
export const exercisesAPI = new ExercisesApiClient(); 