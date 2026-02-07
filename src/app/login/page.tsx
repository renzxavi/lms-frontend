'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import ResultModal from '@/components/ResultModal';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState({ show: false, success: false, message: '' });

  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (err: any) {
      setModal({
        show: true,
        success: false,
        message: err.message || 'Credenciales incorrectas. Revisa tu correo y contraseña.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50/30 flex items-center justify-center py-12 px-4">
      <ResultModal 
        isOpen={modal.show}
        isSuccess={modal.success}
        message={modal.message}
        onClose={() => setModal({ ...modal, show: false })}
      />

      <div className="max-w-md w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="text-4xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              uyCoding
            </div>
          </Link>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-200 rounded-full mb-4">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-red-700 font-semibold text-sm">Bienvenido de nuevo</span>
          </div>
          
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Iniciar sesión
          </h1>
          <p className="text-gray-600">
            Continúa tu aventura de programación
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="tu@email.com"
                  className="w-full border-2 border-gray-200 pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-gray-900 placeholder:text-gray-400"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  className="w-full border-2 border-gray-200 pl-12 pr-12 py-3.5 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-gray-900 placeholder:text-gray-400"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar sesión'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  ¿Primera vez aquí?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <Link
              href="/register"
              className="block w-full text-center px-6 py-4 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all border-2 border-red-200 hover:border-red-300"
            >
              Crear cuenta nueva
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
  