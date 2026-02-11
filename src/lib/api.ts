// lib/api.ts - Improved error handling

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: string;
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

      // Manejar errores de validación de Laravel
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

      // Otros errores HTTP
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    // Respuesta exitosa
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    
    return { status: 'success' };
  }

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
}

export const authAPI = new ApiClient();