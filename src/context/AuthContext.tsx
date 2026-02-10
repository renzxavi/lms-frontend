'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthResponse } from '@/types';
import { authAPI } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (formData: any) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
  isStudent: boolean;
  paymentVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        const userData = await authAPI.getMe();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await authAPI.login(email, password);
      
      // Si es admin sin pago verificado, no guardar token
      if (response.payment_required) {
        throw new Error(response.message || 'Se requiere completar el pago');
      }

      // Si el login fue exitoso y hay token
      if (response.token) {
        localStorage.setItem('token', response.token);
        setToken(response.token);
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (formData: any): Promise<AuthResponse> => {
    try {
      const response = await authAPI.register(formData);
      
      // En el registro de admins, NO guardamos el token hasta que paguen
      // Solo retornamos la respuesta con el link de pago
      if (response.payment) {
        // No guardar token ni user hasta que se complete el pago
        return response;
      }

      // Si por alguna razón viene con token (ej: estudiantes creados por admin)
      if (response.token) {
        localStorage.setItem('token', response.token);
        setToken(response.token);
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      window.location.href = '/';
    }
  };

  // Función para refrescar los datos del usuario
  const refreshUser = async () => {
    try {
      if (token) {
        const userData = await authAPI.getMe();
        setUser(userData);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      // Si falla, hacer logout
      await logout();
    }
  };

  // Helpers computados
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';
  const paymentVerified = user?.payment_verified ?? false;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token,
        loading, 
        login, 
        register, 
        logout, 
        refreshUser,
        isAdmin,
        isStudent,
        paymentVerified
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};