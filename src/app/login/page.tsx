'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Loader2, AlertCircle, CreditCard, X, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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
    setShowErrorModal(false);
    setPaymentPending(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowErrorModal(false);
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
        setErrorMessage('Tu cuenta está pendiente de pago. Por favor completa el pago para acceder.');
      } else {
        // Mensaje más amigable para errores de credenciales
        const friendlyMessage = err.message === 'UNAUTHORIZED' || err.message === 'Unauthorized'
          ? '¡Ups! El correo o la contraseña no son correctos. Por favor, verifica tus datos e intenta nuevamente.'
          : err.message || 'No pudimos iniciar sesión. Por favor verifica tus credenciales.';
        
        setErrorMessage(friendlyMessage);
      }
      setShowErrorModal(true);
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

      {/* MODAL DE ERROR PROFESIONAL */}
      {showErrorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={() => setShowErrorModal(false)} 
          />
          
          {/* Modal */}
          <div className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl border-2 border-gray-100 animate-in zoom-in-95 duration-200">
            {/* Botón cerrar */}
            <button
              onClick={() => setShowErrorModal(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icono de error */}
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl ${
              paymentPending 
                ? 'bg-gradient-to-br from-amber-500 to-orange-500' 
                : 'bg-gradient-to-br from-red-500 to-rose-500'
            }`}>
              {paymentPending ? (
                <CreditCard className="w-10 h-10 text-white" strokeWidth={2.5} />
              ) : (
                <ShieldAlert className="w-10 h-10 text-white" strokeWidth={2.5} />
              )}
            </div>

            {/* Título */}
            <h2 className="text-2xl font-black text-gray-900 text-center mb-3">
              {paymentPending ? '⚠️ Pago Pendiente' : '🔐 Acceso Denegado'}
            </h2>

            {/* Mensaje */}
            <p className="text-gray-600 text-center mb-8 font-medium leading-relaxed">
              {errorMessage}
            </p>

            {/* Botones de acción */}
            <div className="space-y-3">
              {paymentPending ? (
                <>
                  <button
                    onClick={handlePayNow}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Completar Pago Ahora
                  </button>
                  <button
                    onClick={() => setShowErrorModal(false)}
                    className="w-full bg-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-200 transition-all"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all"
                >
                  Intentar Nuevamente
                </button>
              )}
            </div>

            {/* Ayuda adicional */}
            {!paymentPending && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-center text-gray-500 font-medium">
                  💡 <span className="font-bold">Consejo:</span> Revisa que tu correo y contraseña estén escritos correctamente
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}