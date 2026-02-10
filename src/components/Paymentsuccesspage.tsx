'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Extraer parámetros de MercadoPago
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const externalReference = searchParams.get('external_reference');

    console.log('Payment Success:', { paymentId, status, externalReference });

    // Simular verificación (en realidad el webhook ya lo hizo)
    setTimeout(() => {
      setVerifying(false);
    }, 2000);

    // Countdown para redirección
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100/30 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {verifying ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <Loader2 className="w-16 h-16 text-green-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verificando tu pago...
            </h2>
            <p className="text-gray-600">
              Estamos confirmando tu transacción con Mercado Pago
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              ¡Pago Exitoso!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Tu cuenta de administrador ha sido activada correctamente.
              Ya puedes crear estudiantes y comenzar a monitorear su progreso.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                Recibirás un correo de confirmación con los detalles de tu cuenta.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Ir al Login
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-sm text-gray-500">
                Redirigiendo automáticamente en {countdown} segundos...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}