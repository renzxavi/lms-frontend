'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function PaymentFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const status = searchParams.get('status');
    const paymentId = searchParams.get('payment_id');
    
    console.log('Payment Failed:', { status, paymentId });
  }, [searchParams]);

  const handleRetry = () => {
    setRetrying(true);
    // Redirigir al registro para intentar nuevamente
    setTimeout(() => {
      router.push('/register');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100/30 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Pago No Completado
          </h1>
          
          <p className="text-gray-600 mb-6">
            No se pudo procesar tu pago. Esto puede deberse a:
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <ul className="text-sm text-red-800 space-y-2">
              <li>• Cancelaste el proceso de pago</li>
              <li>• Fondos insuficientes</li>
              <li>• Error en los datos de la tarjeta</li>
              <li>• Problema de conexión con Mercado Pago</li>
            </ul>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Tu cuenta fue creada pero está <strong>inactiva</strong> hasta que completes el pago.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {retrying ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Redirigiendo...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Intentar Nuevamente
                </>
              )}
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al Inicio
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              ¿Necesitas ayuda?{' '}
              <a href="mailto:soporte@uycoding.com" className="text-red-600 hover:text-red-700 font-semibold">
                Contacta con soporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}