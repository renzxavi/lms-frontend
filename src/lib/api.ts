// lib/api.ts - Improved error handling

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

class ApiClient {
  private async handleResponse(response: Response) {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorData: ApiError = { message: 'Error desconocido' };
      
      try {
        if (contentType?.includes('application/json')) {
          errorData = await response.json();
        } else {
          const text = await response.text();
          errorData = { message: text || 'Error del servidor' };
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }

      // Manejar error de pago pendiente (403)
      if (response.status === 403 && errorData.needs_payment) {
        const paymentError: any = new Error(errorData.message || 'Se requiere completar el pago');
        paymentError.needs_payment = errorData.needs_payment;
        paymentError.preference_id = errorData.preference_id;
        paymentError.user_id = errorData.user_id;
        paymentError.payment_status = errorData.payment_status;
        throw paymentError;
      }

      // Manejar errores de validación de Laravel (422)
      if (response.status === 422 && errorData.errors) {
        const errors = errorData.errors;
        
        // Si hay error de email duplicado
        if (errors.email) {
          throw new Error('Este correo electrónico ya está registrado. Por favor, usa otro o inicia sesión.');
        }
        
        // Otros errores de validación
        const errorMessages = Object.values(errors).flat().join('. ');
        throw new Error(errorMessages);
      }

      // Manejar error 401 (credenciales incorrectas)
      if (response.status === 401) {
        throw new Error(errorData.message || 'Credenciales incorrectas');
      }

      // Otros errores HTTP
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    // Respuesta exitosa
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    
    return { status: 'success' };
  }

  // ==================== AUTH ====================

  async register(data: {
    name: string;
    email: string;
    phone?: string;
    institution?: string;
    password: string;
    password_confirmation: string;
    payment_method?: string;
  }) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await this.handleResponse(response);
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async login(credentials: { email: string; password: string }) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      return await this.handleResponse(response);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(token: string) {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      return await this.handleResponse(response);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async me(token: string) {
    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      return await this.handleResponse(response);
    } catch (error: any) {
      console.error('Me error:', error);
      throw error;
    }
  }

  async validateEmail(email: string) {
    try {
      const response = await fetch(`${API_URL}/validate-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      return await this.handleResponse(response);
    } catch (error: any) {
      console.error('Validate email error:', error);
      throw error;
    }
  }

  // ==================== PAYMENTS ====================

  async recreatePayment(token: string) {
    try {
      const response = await fetch(`${API_URL}/payment/recreate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      return await this.handleResponse(response);
    } catch (error: any) {
      console.error('Recreate payment error:', error);
      throw error;
    }
  }

  async verifyPayment(token: string) {
    try {
      const response = await fetch(`${API_URL}/payment/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      return await this.handleResponse(response);
    } catch (error: any) {
      console.error('Verify payment error:', error);
      throw error;
    }
  }

  async checkPaymentStatus(userId: number, paymentId?: string) {
    try {
      const response = await fetch(`${API_URL}/payment/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, payment_id: paymentId }),
      });

      return await this.handleResponse(response);
    } catch (error: any) {
      console.error('Check payment status error:', error);
      throw error;
    }
  }
}

// ==================== STUDENTS API ====================

class StudentsApiClient {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  async getAll() {
    try {
      const response = await fetch(`${API_URL}/admin/students`, {
        headers: this.getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener estudiantes');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Get students error:', error);
      throw error;
    }
  }

  async getById(id: number) {
    try {
      const response = await fetch(`${API_URL}/admin/students/${id}`, {
        headers: this.getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener estudiante');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Get student error:', error);
      throw error;
    }
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    institution?: string;
  }) {
    try {
      const response = await fetch(`${API_URL}/admin/students`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear estudiante');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Create student error:', error);
      throw error;
    }
  }

  async update(id: number, data: Partial<{
    name: string;
    email: string;
    password?: string;
    phone?: string;
    institution?: string;
  }>) {
    try {
      const response = await fetch(`${API_URL}/admin/students/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeader(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar estudiante');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Update student error:', error);
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const response = await fetch(`${API_URL}/admin/students/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar estudiante');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Delete student error:', error);
      throw error;
    }
  }
}

// ==================== EXPORTS ====================

export const authAPI = new ApiClient();
export const studentsAPI = new StudentsApiClient();