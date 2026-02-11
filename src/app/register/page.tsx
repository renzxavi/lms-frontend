'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { Mail, Lock, User, Phone, Building, Loader2, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import ResultModal from '@/components/ResultModal';
import PaymentMethodModal from '@/components/PaymentMethodModal';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nombre
    if (!form.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (form.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar email
    if (!form.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    // Validar teléfono (OBLIGATORIO)
    if (!form.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (form.phone.trim().length < 8) {
      newErrors.phone = 'El teléfono debe tener al menos 8 dígitos';
    }

    // Validar institución (OBLIGATORIO)
    if (!form.institution.trim()) {
      newErrors.institution = 'La institución es obligatoria';
    } else if (form.institution.trim().length < 3) {
      newErrors.institution = 'La institución debe tener al menos 3 caracteres';
    }

    // Validar contraseña
    if (!form.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (form.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    // Validar confirmación de contraseña
    if (!form.password_confirmation) {
      newErrors.password_confirmation = 'Debes confirmar tu contraseña';
    } else if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validar formulario frontend primero
    if (!validateForm()) {
      setModal({
        show: true,
        success: false,
        message: 'Por favor, completa correctamente todos los campos obligatorios.'
      });
      return;
    }

    // 2. Validar email con el backend (verificar email duplicado)
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/validate-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: form.email }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setLoading(false);
        
        // Si el email ya existe
        if (response.status === 422 || result.exists) {
          setModal({
            show: true,
            success: false,
            message: result.message || 'Este correo electrónico ya está registrado. Por favor, usa otro o inicia sesión.'
          });
          return;
        }

        // Si el endpoint no existe (404), continuar de todos modos
        if (response.status === 404) {
          console.log('Endpoint /validate-email no existe, continuando...');
          setShowPaymentMethodModal(true);
          return;
        }

        // Otro tipo de error
        setModal({
          show: true,
          success: false,
          message: 'Error al validar el email. Por favor, intenta nuevamente.'
        });
        return;
      }

      // Email válido, continuar al modal de pagos
      setLoading(false);
      setShowPaymentMethodModal(true);

    } catch (err: any) {
      setLoading(false);
      console.error('Error en validación de email:', err);
      
      // Si hay error de red, mostrar mensaje
      setModal({
        show: true,
        success: false,
        message: 'Error de conexión al validar el email. Por favor, verifica tu conexión e intenta nuevamente.'
      });
    }
  };

  const handlePaymentMethodSelect = async (method: string) => {
    setShowPaymentMethodModal(false);
    await handleRegister(method);
  };

  const handleRegister = async (paymentMethod: string) => {
    setLoading(true);
    try {
      const response = await authAPI.register({
        ...form,
        payment_method: paymentMethod
      });

      // Verificar respuesta del backend y redirigir DIRECTAMENTE
      if (response.payment && response.payment.init_point && response.payment.init_point !== '#') {
        // Redirección directa sin modal de éxito
        window.location.href = response.payment.init_point;
      } else {
        // Modo desarrollo - redirigir al login directamente
        router.push('/login');
      }

    } catch (err: any) {
      console.error('Error en registro:', err);
      
      // SOLO mostrar modal en caso de ERROR
      setModal({
        show: true,
        success: false,
        message: err.message || 'Error al procesar el registro. Por favor intenta nuevamente.'
      });
      setLoading(false);
    }
    // NO setLoading(false) aquí porque la página se redirigirá
  };

  const closeModal = () => {
    setModal({ ...modal, show: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100/30 flex items-center justify-center py-12 px-4">
      <ResultModal 
        isOpen={modal.show}
        isSuccess={modal.success}
        message={modal.message}
        onClose={closeModal}
      />

      <PaymentMethodModal
        isOpen={showPaymentMethodModal}
        onClose={() => setShowPaymentMethodModal(false)}
        onSelectMethod={handlePaymentMethodSelect}
      />

      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-200 rounded-full mb-4">
            <CreditCard className="w-4 h-4 text-red-700" />
            <span className="text-red-700 font-medium text-sm">Registro de Administrador - $999 UYU</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Crea tu cuenta</h1>
          <p className="text-gray-600">Administra estudiantes y monitorea su progreso</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Beneficios de tu cuenta
            </h3>
            <ul className="text-sm text-blue-800 space-y-1 ml-7">
              <li>✓ Crear estudiantes ilimitados</li>
              <li>✓ Monitorear progreso en tiempo real</li>
              <li>✓ Panel de estadísticas detalladas</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre completo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  className={`w-full border pl-11 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  name="name" 
                  placeholder="Ej: Juan Pérez" 
                  value={form.name} 
                  onChange={handleChange}
                  disabled={loading}
                  required 
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  className={`w-full border pl-11 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  name="email" 
                  type="email" 
                  placeholder="correo@ejemplo.com" 
                  value={form.email} 
                  onChange={handleChange}
                  disabled={loading}
                  required 
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Teléfono e Institución */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    className={`w-full border pl-11 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    name="phone" 
                    type="tel" 
                    placeholder="+598 9..." 
                    value={form.phone} 
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Institución <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    className={`w-full border pl-11 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                      errors.institution ? 'border-red-500' : 'border-gray-300'
                    }`}
                    name="institution" 
                    placeholder="Universidad / Colegio" 
                    value={form.institution} 
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                {errors.institution && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.institution}
                  </p>
                )}
              </div>
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    className={`w-full border pl-11 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    name="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={form.password} 
                    onChange={handleChange} 
                    disabled={loading}
                    required 
                  />
                </div>
                {errors.password ? (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    className={`w-full border pl-11 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                      errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    name="password_confirmation" 
                    type="password" 
                    placeholder="••••••••" 
                    value={form.password_confirmation} 
                    onChange={handleChange} 
                    disabled={loading}
                    required 
                  />
                </div>
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password_confirmation}
                  </p>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> 
                  Procesando registro...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" /> 
                  Continuar al pago
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                type="button"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}