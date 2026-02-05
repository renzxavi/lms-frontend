'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, Phone, Building, Loader2 } from 'lucide-react';
import ResultModal from '@/components/ResultModal';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Estado para controlar el modal
  const [modal, setModal] = useState({
    show: false,
    success: false,
    message: ''
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    password: '',
    password_confirmation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación local de contraseñas
    if (form.password !== form.password_confirmation) {
      setModal({
        show: true,
        success: false,
        message: 'Las contraseñas no coinciden. Por favor, verifica e intenta de nuevo.'
      });
      return;
    }

    setLoading(true);
    try {
      await register(form);
      setModal({
        show: true,
        success: true,
        message: '¡Bienvenido a uyCoding! Tu cuenta ha sido creada exitosamente.'
      });
    } catch (err: any) {
      setModal({
        show: true,
        success: false,
        message: err.message || 'Ocurrió un error inesperado durante el registro.'
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModal({ ...modal, show: false });
    if (modal.success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100/30 flex items-center justify-center py-12 px-4">
      <ResultModal 
        isOpen={modal.show}
        isSuccess={modal.success}
        message={modal.message}
        onClose={closeModal}
      />

      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-200 rounded-full mb-4">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-red-700 font-medium text-sm">Únete a uyCoding</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Crea tu cuenta</h1>
          <p className="text-gray-600">Comienza tu viaje de aprendizaje hoy</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full border border-gray-300 pl-11 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition text-gray-900"
                  name="name"
                  placeholder="Ej: Juan Pérez"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full border border-gray-300 pl-11 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition text-gray-900"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    className="w-full border border-gray-300 pl-11 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition text-gray-900"
                    name="phone"
                    type="tel"
                    placeholder="+598 9..."
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Institución</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    className="w-full border border-gray-300 pl-11 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition text-gray-900"
                    name="institution"
                    placeholder="Universidad / Colegio"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    className="w-full border border-gray-300 pl-11 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition text-gray-900"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    className="w-full border border-gray-300 pl-11 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition text-gray-900"
                    name="password_confirmation"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 rounded-lg hover:shadow-xl transition-all disabled:opacity-50 transform hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creando cuenta...
                </span>
              ) : (
                'Registrarse ahora'
              )}
            </button>

            <p className="text-center text-sm text-gray-600 mt-6">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login" className="text-red-600 hover:text-red-700 font-semibold">
                Inicia sesión
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}