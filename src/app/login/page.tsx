'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Loader2, AlertCircle, CreditCard } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentPending, setPaymentPending] = useState<{
    needs_payment: boolean;
    preference_id: string;
    user_id: number;
  } | null>(null);
  
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setPaymentPending(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPaymentPending(null);
    
    try {
      const response = await login(form.email, form.password);
      
      // Si el login fue exitoso, redirigir según el rol
      if (response.user.role === 'admin') {
        router.push('/admin/students');
      } else {
        router.push('/dashboard');
      }
      
    } catch (err: any) {
      // Verificar si el error es por pago pendiente
      if (err.needs_payment && err.preference_id) {
        setPaymentPending({
          needs_payment: err.needs_payment,
          preference_id: err.preference_id,
          user_id: err.user_id
        });
        setError('Tu cuenta está pendiente de pago. Por favor completa el pago para acceder.');
      } else {
        setError(err.message || 'Credenciales incorrectas');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = () => {
    if (paymentPending?.preference_id) {
      // Redirigir a MercadoPago
      window.location.href = `https://www.mercadopago.com.uy/checkout/v1/redirect?pref_id=${paymentPending.preference_id}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100/30 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
          <p className="text-gray-600">Accede a tu cuenta de uyCoding</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className={`mb-6 p-4 border rounded-lg flex items-start gap-3 ${
              paymentPending 
                ? 'bg-amber-50 border-amber-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                paymentPending ? 'text-amber-500' : 'text-red-500'
              }`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  paymentPending ? 'text-amber-900' : 'text-red-700'
                }`}>
                  {error}
                </p>
                {paymentPending && (
                  <button
                    onClick={handlePayNow}
                    className="mt-3 w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Completar Pago Ahora
                  </button>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full border border-gray-300 pl-11 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition text-gray-900"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full border border-gray-300 pl-11 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition text-gray-900"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
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
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar sesión'
              )}
            </button>

            <p className="text-center text-sm text-gray-600 mt-6">
              ¿No tienes una cuenta?{' '}
              <a href="/register" className="text-red-600 hover:text-red-700 font-semibold">
                Regístrate aquí
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}