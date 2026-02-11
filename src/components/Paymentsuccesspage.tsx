'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, ArrowRight, XCircle } from 'lucide-react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(false);
  
  const userId = searchParams.get('external_reference');
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  useEffect(() => {
    console.log('🔍 Params recibidos:', { userId, paymentId, status });

    if (!userId) {
      console.error('❌ No se encontró external_reference');
      setVerifying(false);
      setError(true);
      return;
    }

    let interval: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 20; // 60 segundos máx

    const checkPayment = async () => {
      attempts++;
      console.log(`🔄 Verificando pago (${attempts}/${maxAttempts})...`);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payment/check-status?user_id=${userId}`
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        console.log('📦 Respuesta:', data);

        if (data.verified) {
          console.log('✅ Pago verificado!');
          setVerifying(false);
          clearInterval(interval);
        } else if (attempts >= maxAttempts) {
          console.warn('⏱️ Timeout alcanzado');
          setVerifying(false);
          setError(true);
          clearInterval(interval);
        }
      } catch (err) {
        console.error('❌ Error:', err);
        if (attempts >= maxAttempts) {
          setVerifying(false);
          setError(true);
          clearInterval(interval);
        }
      }
    };

    checkPayment();
    interval = setInterval(checkPayment, 3000);

    return () => clearInterval(interval);
  }, [userId, paymentId, status, searchParams]);

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full border border-red-200">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Hubo un problema</h1>
        <p className="text-gray-600 mb-6">
          No pudimos verificar tu pago. Contacta con soporte si ya realizaste el pago.
        </p>
        <button
          onClick={() => router.push('/register')}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
        >
          Volver al Registro
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full border border-gray-100">
      {verifying ? (
        <div className="flex flex-col items-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Validando transacción...
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Esperando confirmación de Mercado Pago
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left w-full text-xs font-mono">
            <div className="text-blue-800">
              User ID: {userId}<br/>
              Payment: {paymentId || 'Procesando...'}<br/>
              Status: {status || 'Pendiente...'}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">No cierres esta ventana</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            ¡Bienvenido a uyCoding!
          </h1>
          <p className="text-gray-600 mb-8">
            Tu cuenta ha sido activada. Ya puedes iniciar sesión y gestionar tus estudiantes.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            Ir al Login
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="flex items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-gray-600">Cargando...</span>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}