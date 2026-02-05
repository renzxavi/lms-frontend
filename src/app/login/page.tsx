'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Loader2 } from 'lucide-react';
import ResultModal from '@/components/ResultModal';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
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
      // Redirigimos directo si es exitoso, o puedes mostrar modal de éxito brevemente
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100/30 flex items-center justify-center py-12 px-4">
      <ResultModal 
        isOpen={modal.show}
        isSuccess={modal.success}
        message={modal.message}
        onClose={() => setModal({ ...modal, show: false })}
      />

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-200 rounded-full mb-4">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-red-700 font-medium text-sm">Bienvenido de nuevo</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Iniciar sesión</h1>
          <p className="text-gray-600">Accede a tu cuenta de uyCoding</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  className="w-full border border-gray-300 pl-11 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition text-gray-900"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  className="w-full border border-gray-300 pl-11 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition text-gray-900"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mx-auto h-5 w-5 text-white" /> : 'Iniciar sesión'}
            </button>

            <p className="text-center text-sm text-gray-600 mt-6">
              ¿No tienes cuenta?{' '}
              <a href="/register" className="text-red-600 font-semibold hover:text-red-700">Regístrate</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}